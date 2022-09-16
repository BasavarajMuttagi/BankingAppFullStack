const uuid = require('uuid');
const DatabaseMongoose = require('../repository/DB');
const DB = new DatabaseMongoose()
class Bank{

 constructor(bankName,bankAbbreviation) {
     this.bankID = uuid.v4()
     this.bankName = bankName
     this.bankAbbreviation = bankAbbreviation
 }
 
 static async createNewBank(bankName,bankAbbreviation){
    const newBank = new Bank(bankName,bankAbbreviation)
    const newBankRecord = await DB.createBank(newBank)
    if(newBankRecord === false){
        return [false,null]
    }
    return [true,newBankRecord]
 }
 
 
 static async findBank(bankAbbreviation){
    const record = await DB.findBank(bankAbbreviation)
    return record
}

static async getAllBanks(){
    const record = await DB.getAllBanks()
    return record
}

}
 
 module.exports = Bank;