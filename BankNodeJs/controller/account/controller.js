const Customer = require('../../view/Customer')
const JWTPayload = require('../../view/authentication');
const Joi = require('joi');
const DatabaseMongoose = require('../../repository/DB');
const Transaction = require('../../view/Transaction');
const DB = new DatabaseMongoose()
async function createbankaccount(req,resp,admin){
    // const isValidUser =  JWTPayload.isValidUser(req,resp)
    // if(!isValidUser){
    //     return;
    // }
    
    // const schema = Joi.object({  
    //     userName  : Joi.string().min(3).alphanum().required(),
    //     bankAbbreviation  : Joi.string().min(3).required(),
    // })
    // const {error,value} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }
    
    
    const {userName,bankAbbreviation} = req.body
    const record = await Customer.findCustomerInCollection(userName)
    if(record === false){
        resp.status(400).send("Not a Customer")
        return 
    }
    const currentCustomer =  Customer.reconstructCustomerObject(record)
    const [findAccountResult,AccountRecord] = await currentCustomer.findBankAccountInUser(bankAbbreviation)
    if(findAccountResult){
        resp.status(400).send("Account Already Exists!")
        return 
    }
    const [success,accountRecord] = await currentCustomer.createNewBankAccount(bankAbbreviation)
    const addBankToList = await DB.addBankToList(record._id,'accounts',accountRecord._id)
    if(addBankToList === false){
        resp.status(400).send("Not a Customer")
        return 
    }
    const newtransaction = new Transaction('CUSTOMER_INDUCED/CREDIT',record._id,accountRecord.balance)
    const newtransactionRecord = await DB.createTransaction(newtransaction)
    const addTnxToList = await DB.addBankToList(record._id,'transactions',newtransactionRecord._id)
    if(addTnxToList === false){
        resp.status(400).send("Not a Customer")
        return 
    }
    resp.status(200).send("Account Created!")
    return 
    }


    module.exports = {createbankaccount};