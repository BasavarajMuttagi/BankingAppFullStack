const Customer = require('../../view/Customer')
const JWTPayload = require('../../view/authentication');
const Joi = require('joi');
const DatabaseMongoose = require('../../repository/DB');
const Transaction = require('../../view/Transaction');
const DB = new DatabaseMongoose()
const multer = require("multer");


async function pushImage(req,resp){
    const {image} = req.body
    console.log(image);
    resp.status(200).send("successful")
}

async function CreateCustomer(req,resp,admin){
    // const schema = Joi.object({  
    //     firstName : Joi.string().min(3).required(),
    //     lastName  : Joi.string().min(3).required(),
    //     userName  : Joi.string().min(3).alphanum().required(),
    //     password  : Joi.string().min(3).required()
    // })
    // const {error,value} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }
    // const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    // if(!isValidAdmin){
    //     return;
    // }

    const {firstName,lastName,userName,password} = req.body
    const newCustomer = await admin.createNewCustomer(firstName,lastName,userName,password)
    if(newCustomer === false){
        resp.status(400).send("Customer Exists")
        return
    }



    resp.status(200).send("Customer Created!!!")
    return 
}

async function getallcustomers(req,resp,admin){
    // const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    // if(!isValidAdmin){
    //     return;
    // }
    
    const allCustomers = await admin.getAllCustomers()
 
    if(allCustomers === false){
        resp.status(400).send("No Customers")
        return
    }
    resp.status(200).send(allCustomers)
    return
}

async function deposit(req,resp){
    // const isValidUser =  JWTPayload.isValidUser(req,resp)
    // if(!isValidUser){
    //     return;
    // }
        
        // const schema = Joi.object({  
        //     userName  : Joi.string().min(3).required(),
        //     bankAbbreviation  : Joi.string().min(3).required(),
        //     amount  : Joi.string().min(1).required()
        // })
        // const {error,value} = schema.validate(req.body)
        // if(error){
        //     resp.status(400).send(error.details[0].message);
        //     return;
        // }

       
        const {userName,bankAbbreviation,amount} = req.body
        const record = await Customer.findCustomerInCollection(userName)
        if(record === false){
            resp.status(400).send("Not a Customer")
            return 
        }
        const currentCustomer =  Customer.reconstructCustomerObject(record)

        const [DepositSuccess,message] = await currentCustomer.deposit(bankAbbreviation,amount)
        if(!DepositSuccess){
            resp.status(400).send(message)
            return 
        }

        const newtransaction = new Transaction('CUSTOMER_INDUCED/CREDIT',record._id,amount)
        const newtransactionRecord = await DB.createTransaction(newtransaction)
        const addTnxToList = await DB.addBankToList(record._id,'transactions',newtransactionRecord._id)
        
        const totalBalance = await DB.calculateTotalBalance(userName)
        if(totalBalance == false){
            resp.status(400).send("deposit Failed , User Not Found!")
            return
        }
        const updatBalance = await DB.updateCustomerProperty(record._id,'totalBalance',totalBalance)
        if(updatBalance == false){
            resp.status(400).send("deposit Failed , Internal Error While Updation!")
            return
        }
        resp.status(200).send(message)
        return
}

async function withdraw(req,resp){
    // const isValidUser =  JWTPayload.isValidUser(req,resp)
    // if(!isValidUser){
    //     return;
    // }

        // const schema = Joi.object({  
        //     userName  : Joi.string().min(3).required(),
        //     bankAbbreviation  : Joi.string().min(3).required(),
        //     amount  : Joi.string().min(1).required()
        // })
        // const {error,value} = schema.validate(req.body)
        // if(error){
        //     resp.status(400).send(error.details[0].message);
        //     return;
        // }
       
        const {userName,bankAbbreviation,amount} = req.body
        const record = await Customer.findCustomerInCollection(userName)
        if(record === false){
            resp.status(400).send("Not a Customer")
            return 
        }
        const currentCustomer =  Customer.reconstructCustomerObject(record)

        const [WithDrawSuccess,message] = await currentCustomer.withdraw(bankAbbreviation,amount)
        if(!WithDrawSuccess){
            resp.status(400).send(message)
            return 
        }

        const newtransaction = new Transaction('CUSTOMER_INDUCED/DEBIT',record._id,-amount)
        const newtransactionRecord = await DB.createTransaction(newtransaction)
        const addTnxToList = await DB.addBankToList(record._id,'transactions',newtransactionRecord._id)
        
        const totalBalance = await DB.calculateTotalBalance(userName)
        if(totalBalance == false){
            resp.status(400).send("Withdraw Failed , User Not Found!")
            return
        }
        const updatBalance = await DB.updateCustomerProperty(record._id,'totalBalance',totalBalance)
        if(updatBalance == false){
            resp.status(400).send("Withdraw Failed , Internal Error While Updation!")
            return
        }
        resp.status(200).send(message)
        return
            
}

async function transfer(req,resp){
    // const isValidUser =  JWTPayload.isValidUser(req,resp)
    // if(!isValidUser){
    //     return;
    // }

    // const schema = Joi.object({  
    //     usernameOfSender  : Joi.string().min(3).required(),
    //     usernameOfReceiver  : Joi.string().min(3).required(),
    //     bankAbbreviationSender  : Joi.string().min(3).required(),
    //     bankAbbreviationReceiver  : Joi.string().min(3).required(),
    //     amount  : Joi.string().min(1).required()
    // })
    // const {error,value} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }

    const {usernameOfSender,usernameOfReceiver,bankAbbreviationSender,bankAbbreviationReceiver,amount} = req.body
 
    const currentSenderRecord = await Customer.findCustomerInCollection(usernameOfSender)
    if(currentSenderRecord === false){
        resp.status(400).send("Sender is Not a Customer")
        return 
    }

    const currentReceiverRecord = await Customer.findCustomerInCollection(usernameOfReceiver)
    if(currentReceiverRecord === false){
        resp.status(400).send("Receiver is Not a Customer")
        return 
    }

    const senderObject =  Customer.reconstructCustomerObject(currentSenderRecord)
    const [senderBankAccountSuccess,accountObjectSender] = await senderObject.findBankAccountInUser(bankAbbreviationSender)
    if(senderBankAccountSuccess === false){
        resp.status(400).send("Sender Bank Doesn't Exists!")
        return 
    }
    const receiverObject =   Customer.reconstructCustomerObject(currentReceiverRecord)
    const [receiverBankAccountSuccess,accountObjectReceiver] = await receiverObject.findBankAccountInUser(bankAbbreviationReceiver)
    if(receiverBankAccountSuccess === false){
        resp.status(400).send("Receiver Bank Doesn't Exists!")
        return 
    }

    const [WithDrawSuccess,message] = await senderObject.withdraw(bankAbbreviationSender,amount)
        if(!WithDrawSuccess){
            resp.status(400).send(message)
            return 
        }
        
        const totalBalanceOfSender = await DB.calculateTotalBalance(usernameOfSender)
        if(totalBalanceOfSender === false){
            resp.status(400).send("Withdraw Failed , User Not Found!")
            return
        }

        const updatBalanceSender = await DB.updateCustomerProperty(currentSenderRecord._id,'totalBalance',totalBalanceOfSender)
        if(updatBalanceSender == false){
            resp.status(400).send("Withdraw Failed , Internal Error While Updation!")
            return
        }

       
        const [DepositSuccess,messages] = await receiverObject.deposit(bankAbbreviationReceiver,amount)
        if(!DepositSuccess){
            resp.status(400).send(messages)
            return 
        }
        
        const totalBalanceOfReceiver = await DB.calculateTotalBalance(usernameOfReceiver)
        if(totalBalanceOfReceiver == false){
            resp.status(400).send("deposit Failed , User Not Found!")
            return
        }
        const updatBalanceReceiver = await DB.updateCustomerProperty(currentSenderRecord._id,'totalBalance',totalBalanceOfSender)
        if(updatBalanceReceiver == false){
            resp.status(400).send("deposit Failed , Internal Error While Updation!")
            return
        }
    
        
        const newtransactionSender = new Transaction('Transfered To',currentReceiverRecord._id,-amount)
        const newtransactionSenderRecord = await DB.createTransaction(newtransactionSender)
        const addTnxToListSender = await DB.addBankToList(currentSenderRecord._id,'transactions',newtransactionSenderRecord._id)

        const newtransactionReceiver = new Transaction('Received From',currentSenderRecord._id,amount)
        const newtransactionReceiverRecord = await DB.createTransaction(newtransactionReceiver)
        const addTnxToListReceiver = await DB.addBankToList(currentReceiverRecord._id,'transactions',newtransactionReceiverRecord._id)

        resp.status(200).send("transfer SuccessFul!")
        return

}

function selftransfer(req,resp){
    let {userName,bankAbbreviationSender,bankAbbreviationReceiver,amount} = req.body
    const schema = Joi.object({  
        userName  : Joi.string().min(3).required(),
        bankAbbreviationSender  : Joi.string().min(3).required(),
        bankAbbreviationReceiver  : Joi.string().min(3).required(),
        amount  : Joi.string().min(1).required()
    })
    const {error,value} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }
    const isValidUser =  JWTPayload.isValidUser(req,resp)
    if(!isValidUser){
        return;
    }
    let [userNameSuccess,indexOfCustomer] = Customer.findUserName(userName)
    if(!userNameSuccess){
        resp.status(400).send("Not a Customer")
        return 
    }
    let [status,accountIndex] = Customer.allCustomers[indexOfCustomer].findBankAccount(bankAbbreviationSender)
    if(!status){
        return [false,"Customer doesn't have account in Bank"]
    }

 let [transferSuccess,text] = Customer.allCustomers[indexOfCustomer].transferByID(bankAbbreviationSender,bankAbbreviationReceiver,amount,userName)
    if(!transferSuccess){
        resp.status(400).send(text)
        return
    }
    resp.status(200).send(text)
}

async function getallcustomerbanks(req,resp,admin){

    // const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    // if(!isValidAdmin){
    //     return;
    // }

    // const schema = Joi.object({  
    //     userName  : Joi.string().min(3).required()
    // })

    // const {error,value} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }
    const {userName} = req.body
    const record = await Customer.findCustomerInCollection(userName)
        if(record === false){
            resp.status(400).send("Not a Customer")
            return 
        }
    const currentCustomer =  Customer.reconstructCustomerObject(record)
    const allBanks = currentCustomer.accounts
    resp.status(200).send(allBanks)
    return
}

async function getUser(req,resp,admin){
    // const isValidUser =  JWTPayload.isValidUser(req,resp)
    // if(!isValidUser){
    //     return;
    // }

    // const schema = Joi.object({  
    //     userName  : Joi.string().min(3).required()
    // })
    // const {error,value} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }

    const {userName} = req.body
   
    const record = await DB.getUser(userName)
        if(record === false){
            resp.status(400).send("Not a Customer")
            return 
        }

    resp.status(200).send(record)
    return
}

async function getXLSX(req,resp,admin){
    // const isValidUser =  JWTPayload.isValidUser(req,resp)
    // if(!isValidUser){
    //     return;
    // }

    // const schema = Joi.object({  
    //     userName  : Joi.string().min(3).required()
    // })
    // const {error,value} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }
    const {userName} = req.body
   console.log(userName);
    const record = await DB.getUser(userName)
        if(record === false){
            resp.status(400).send("Not a Customer")
            return 
    }

    class recontructJson{
        constructor(type,firstName,amount,date,time){
                this.type = type
                this.firstname = firstName
                this.amount = amount
                this.date = date
                this.time = time
    }
}
     
let allTnx = []
        
record.transactions.forEach(eachTransaction => {
    let date = new Date(Date.parse(eachTransaction.createdAt)).toLocaleDateString()
    let time = new Date(Date.parse(eachTransaction.createdAt)).toLocaleTimeString() 
    const newObj = new recontructJson(eachTransaction.type,eachTransaction.customer.firstName,eachTransaction.amount,date,time)
    allTnx.push(newObj) 
});

console.log(allTnx);
    resp.status(200).send(allTnx)
    return
}


module.exports =  {CreateCustomer,getallcustomers,deposit,withdraw,transfer,selftransfer,getallcustomerbanks,getUser,getXLSX,pushImage};