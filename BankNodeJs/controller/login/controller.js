const Customer = require('../../view/Customer');
const JWTPayload = require('../../view/authentication');
const Joi = require('joi')
async function login(req,resp){
    const schema = Joi.object({
        userName : Joi.string().min(3).required(),
        password : Joi.string().min(3).required()
    })
    const {error,val} = schema.validate(req.body)
    if(error){
        resp.status(400).send(error.details[0].message);
        return;
    }
    const {userName,password}= req.body
    const record = await Customer.findCustomerInCollection(userName)

        if(record === false){
            resp.status(400).send("Not a Customers")
            return 
        }
    const currentCustomer =  Customer.reconstructCustomerObject(record)
   
  
    let passwordsuccess = await currentCustomer.comparePassword(password)
   
    if(passwordsuccess == false)
    {
        resp.status(404).send("Wrong Credentials")
        return;
    }
 
    const newPayload = new JWTPayload(currentCustomer)
    const newToken = newPayload.createToken();
    resp.cookie("myToken",newToken)
    console.log("Logged in  Successfully");
    resp.status(200).send(currentCustomer.role);
}
module.exports = {login};