const uuid = require('uuid')
const Bank = require('./Bank');
const Accounts = require('./Accounts');
const Credentials = require('./credentials');
const bcrypt = require('bcrypt');
const DatabaseMongoose = require('../repository/DB');
const DB = new DatabaseMongoose()


class Customer{

 constructor(firstName,lastName,credential,role) {
     this.customerID = uuid.v4()
     this.firstName = firstName
     this.lastName = lastName
     this.role = role
     this.credential = credential
     this.isActive = true
     this.accounts = []
     this.transactions = []
     this.totalBalance = 0
 }
 
async getAllCustomers(){
    const allCustomers = await DB.getAllCustomers()
    return allCustomers
}

 async comparePassword(password)
 {
     let passwordMatch = await bcrypt.compare(password,this.credential.password);
     return passwordMatch;
 }



 async  findBankAccountInUser(bankAbbreviation){
    for (let index = 0; index < this.accounts.length; index++) {
        const eachbankAccount = this.accounts[index];
        if(eachbankAccount.bankAbbreviation === bankAbbreviation){
            return [true,eachbankAccount]
        }   
    }
    return [false,-1]
}


static async findCustomerInCollection(userName){
    const record = await DB.findUserInCollection(userName)
    return record
}
static async findAccountInCollection(userName){
    const record = await DB.findAccountInUser(userName)
    return record
}

async createNewBankAccount(bankAbbreviation){
     const newCustomerAccount = Accounts.createNewAccount(bankAbbreviation)
     const newCustomerAccountRecord = await DB.createAccount(newCustomerAccount)
     return [true,newCustomerAccountRecord]
} 

static async createAdmin(){
    const [credentialSuccess,newCredentialRecord] = await Credentials.createCredential('GR123','GR@2000')
  
    // if(credentialSuccess === false){
    //     return [false,null]
    // }

  
    const newCustomer = new Customer('George','Russell',newCredentialRecord,'admin')
    const newCustomerRecord = await DB.createCustomer(newCustomer)
    return [true,newCustomer]
}

async createNewCustomer(firstName,lastName,userName,password){
    const [credentialSuccess,newCredentialRecord] = await Credentials.createCredential(userName,password)
    if(credentialSuccess === false){
        return false
    }
    const newCustomer = new Customer(firstName,lastName,newCredentialRecord._id,'user')
    const newCustomerRecord = await DB.createCustomer(newCustomer)
    return true
}
 
async deposit(bankAbbreviation,depositMoney){
 
     const [findSuccess,accountObj] = await this.findBankAccountInUser(bankAbbreviation)

     if(!findSuccess){
        return [false,"No Bank Named "+ bankAbbreviation]
    }

     if(findSuccess && depositMoney > 0){
        const depositResult = await DB.deposit(accountObj._id,depositMoney)
     
        if(depositResult === false){
            return [false ,'Error Occured!']
        }
        return [true ,"Deposit Successfull"]
     }
     return [false,"Amount Should Be Greater than 0"]

 }
 
 async withdraw(bankAbbreviation,withdrawMoney){
    const [findSuccess,accountObj] = await  this.findBankAccountInUser(bankAbbreviation)
    if(!findSuccess){
       return [false,"No Bank Named "+ bankAbbreviation]
   }
 
     if(findSuccess && accountObj.balance >= withdrawMoney){
        const withDraw = await DB.withdraw(accountObj._id,-withdrawMoney)
        if(withDraw === false){
            return [false ,'Error Occured!']
        }
        return [true,"Withdraw Successful"]
     }
 
     return [false,"Low Balance In The Account!!!"]
 
 }
 
 transfer(debitBankAbbr,creditBankAbbr,amount,userName){
 
 let [BankCheck] = Bank.findBank(creditBankAbbr)
 if(!BankCheck){
     return 
 }
 
 let [message , CustomerIndex] = Customer.findUserName(userName)
 if(!message){
     return
 }
 
 let customer = Customer.allCustomers[CustomerIndex]
 let [status,accountIndex] = customer.findBankAccount(creditBankAbbr)
 
 let [withdrawCheck] = this.withdraw(debitBankAbbr,amount)
 if(!withdrawCheck)
 {
     return
 }
 this.updateTotalBalance()
 customer.accounts[accountIndex].updateBalance(amount)
 customer.updateTotalBalance()
 
 }

 transferByID(debitBankAbbr,creditBankAbbr,amount,userName){

    let [message , CustomerIndex] = Customer.findUserName(userName)
    if(!message){
        return [false,"Credit Customer doesn't Exist!!!"]
    }

    let [BankCheckCredit] = Bank.findBank(creditBankAbbr)
    if(!BankCheckCredit){
        return [false,"Credit Bank doesn't Exist!!!"]
    }

    let [BankCheckDebit] = Bank.findBank(debitBankAbbr)
    if(!BankCheckDebit){
        return [false,"Debit Bank doesn't Exist!!!"]
    }

    let customer = Customer.allCustomers[CustomerIndex]
    let [status,accountIndex] = customer.findBankAccount(creditBankAbbr)
    if(!status){
        return [false,"Credit Customer doesn't have account in Bank"]
    }
    
    let [WithdrawSuccess,text] = this.withdraw(debitBankAbbr,amount)
    if(!WithdrawSuccess)
    {
        return [false,text]
    }

    this.updateTotalBalance()
    customer.accounts[accountIndex].updateBalance(amount)
    customer.updateTotalBalance()
    return [WithdrawSuccess,text]
    }
 
    selfTransfer(debitBankAbbr,creditBankAbbr,amount){
    this.transfer(debitBankAbbr,creditBankAbbr,amount,this)
 }

 getCustomerBanks(){
    return null
 }

 static  reconstructCustomerObject(findCustomerResult){
    let newCustomer = new Customer(findCustomerResult.firstName,findCustomerResult.lastName,findCustomerResult.credential,findCustomerResult.role)
    newCustomer.accounts = findCustomerResult.accounts
    newCustomer.accountsInBank = findCustomerResult.accountsInBank
    newCustomer.role = findCustomerResult.role
    newCustomer.isActive = findCustomerResult.isActive
    newCustomer.totalBalance = findCustomerResult.totalBalance
    newCustomer.customerID = findCustomerResult.customerID
    
    return newCustomer
}
 
 }
 
 module.exports = Customer;