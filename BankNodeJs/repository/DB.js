const  Mongoose  = require("mongoose");
const AccountModel = require("../model/Accounts");
const BankModel = require("../model/Banks");
const CredentialModel = require("../model/Credentials");
const CustomerModel = require("../model/Customers");
const TransactionModel = require("../model/Transactions");

class DatabaseMongoose {
    constructor() {
        this._connect()
    }
    _connect() {
        Mongoose.connect("mongodb://127.0.0.1:27017/BankingApp")
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error(err)
            })
    }


    
    async createBank(bankObject){
        try {

            const newRecord = await BankModel.create(bankObject)
            return newRecord

        } catch (err) {
            return false
        }
    }

    async createCustomer(customerObject){
        try {
          
            const newRecord = await CustomerModel.create(customerObject)
            
            return newRecord
        } catch (err) {
            return false
        }
    }

    async createCredential(credentialObject){
        try {
            const newRecord = await CredentialModel.create(credentialObject)
            return newRecord
        }
        catch (err) {
            return false
        }
    }
    async createAccount(accountObject){
        try {
            const newRecord = await AccountModel.create(accountObject)
            return newRecord
        }
        catch (err) {
            return false
        }
    }

    async createTransaction(tnxObject){
        try {
            const newRecord = await TransactionModel.create(tnxObject)
            return newRecord
        }
        catch (err) {
            return false
        }
    }

    async getUser(userName){
        try {
            const currentUserName = await CredentialModel.findOne({userName : userName})
     
            if(currentUserName === null){
                return false
            }
            const currentUserID = currentUserName._id
           
            const record = await CustomerModel.findOne({credential:currentUserID})
            .populate('credential')
            .populate('accounts')
            .populate('transactions')
            .populate({
                path : 'transactions',
                model :'Transactions',
                populate:{
                    path : 'customer',
                    model :'Customers',
                }
            })

        
             return record
            
        } catch (error) {
            return false
        }
    }

    async getAllBanks(){
        try {
            const newRecord = await BankModel.find({})
            return newRecord
        }
        catch (err) {
            return false
        }
    }

    async getAllCustomers(){
        try {
            const newRecord = await CustomerModel.find({role :'user'})
            .populate('credential')
            .populate('accounts')

            return newRecord
        }
        catch (err) {
            return false
        }
    }
    
    async deposit(accountObjID,depositMoney){
        try {
            
            const newRecord = await AccountModel.updateOne(
                {
                    _id:accountObjID
                },
                {
                    $inc :{balance :depositMoney}
                }
                )
         
            return newRecord
        }
        catch (err) {
            return false
        }
    }

    async withdraw(accountObjID,withDrawMoney){
        try {
            const newRecord = await AccountModel.updateOne(
                {
                    _id:accountObjID
                },
                {
                    $inc :{balance :  withDrawMoney}
                }
                )
            return newRecord
        }
        catch (err) {
            return false
        }
    }


    async findUserInCollection(userName){
        try {
            const currentUserName = await CredentialModel.findOne({userName : userName})
          
            if(currentUserName === null){
                return false
            }
            const currentUserID = currentUserName._id
           
            const record = await CustomerModel.findOne({credential:currentUserID})
            .populate('credential')
            .populate('accounts')
            .populate('transactions')

    
            
             return record
            
        } catch (error) {
            return false
        }
   
    }

    async calculateTotalBalance(userName){
        try{
        const record = await this.findUserInCollection(userName)
           if(record === false){
      
            return false
           }
        let temporaryTotalBalance = 0
        for (let index = 0; index < record.accounts.length; index++) {
            const eachbankAccount = record.accounts[index]
            temporaryTotalBalance = temporaryTotalBalance + eachbankAccount.balance
        }
        console.log(temporaryTotalBalance);
            return temporaryTotalBalance
        }
        catch(err){
            return false
        }
    }

    async updateCustomerProperty(userObjectID,property,value){
        try {
            const newRecord = await CustomerModel.updateOne(
                {
                    _id:userObjectID
                },
                {
                    $set :{[property] : value}
                }
                )
            return newRecord
        }
        catch (err) {
            return false
        }
    }
    async addBankToList(userObjectID,property,value){
        try {
            const newRecord = await CustomerModel.updateOne(
                {
                    _id:userObjectID
                },
                {
                    $push :{[property] : [value]}
                }
                )
            return newRecord
        }
        catch (err) {
            return false
        }
    }

    async findBank(bankAbbreviation){
        try{
            const bankRecord = await BankModel.findOne({bankAbbreviation:bankAbbreviation})
            if(bankRecord === null){
                return false
            }
            return bankRecord
        }
        catch(err){
            return false
        }
    }

}

module.exports=DatabaseMongoose