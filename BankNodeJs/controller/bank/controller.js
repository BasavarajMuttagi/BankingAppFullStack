const Bank = require('../../view/Bank')
const Joi = require('joi')
const JWTPayload = require('../../view/authentication');
async function createbank(req,resp,admin){
    // const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    // if(!isValidAdmin){
    //     return
    // }
    // const schema = Joi.object({
    //     bankName : Joi.string().min(3).required(),
    //     bankAbbreviation  : Joi.string().min(3).required()
    // })
    // const {error,val} = schema.validate(req.body)
    // if(error){
    //     resp.status(400).send(error.details[0].message);
    //     return;
    // }

   

    const {bankName,bankAbbreviation} = req.body;
    const [success,newBank] = await Bank.createNewBank(bankName,bankAbbreviation)
    if(!success){
        resp.status(400).send("Bank Already Exists!!!")
        return
    }
  
    resp.status(200).send("Bank Created Successfully")
    return
}

async function getallBanks(req,resp,admin){

    // const isValidAdmin =  JWTPayload.isValidAdmin(req,resp)
    // if(!isValidAdmin){
    //     return;
    // }
    
    const allBanks = await Bank.getAllBanks()
    if(allBanks === false){
        resp.status(400).send("No Banks")
        return
    }
    resp.status(200).send(allBanks)
    return
}

module.exports = {createbank,getallBanks};