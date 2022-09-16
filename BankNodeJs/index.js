const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const cors = require('cors')
const cookieParser = require('cookie-parser')
const multer = require("multer");
app.use(cors())
app.use(bodyParser.json({limit:'50mb'}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true,limit:'50mb'}))
const {createbankaccount} = require("./controller/account/controller")
const {createbank,getallBanks} = require("./controller/bank/controller")
const {CreateCustomer,getallcustomers,deposit,withdraw,transfer,selftransfer,getallcustomerbanks, getUser, getXLSX, pushImage} = require("./controller/customer/controller")
const {login} = require("./controller/login/controller")
const {logout} = require("./controller/logout/controller")
const Customer = require('./view/Customer')




let admin = null
let message = null

async function  createadmin(){
      [success,admin ]= await Customer.createAdmin()   
}

app.post("/api/login",async (req,resp)=>login(req,resp))

app.post("/api/createbank",async(req,resp)=>createbank(req,resp,admin))

app.post("/api/CreateCustomer",async (req,resp)=>CreateCustomer(req,resp,admin))

app.get("/api/getallbanks",async(req,resp)=>getallBanks(req,resp,admin))

app.get("/api/getallcustomers",async(req,resp)=>getallcustomers(req,resp,admin))

app.post("/api/createbankaccount",async(req,resp)=>createbankaccount(req,resp,admin))

app.post("/api/deposit",async(req,resp)=>deposit(req,resp))

app.post("/api/withdraw",async(req,resp)=>withdraw(req,resp))

app.post("/api/transfer",async(req,resp)=>transfer(req,resp))

app.post("/api/selftransfer",async(req,resp)=>selftransfer(req,resp))

app.post("/api/logout",async(req,resp)=>logout(req,resp))

app.post("/api/getallcustomerbanks",async(req,resp)=>getallcustomerbanks(req,resp))

app.post("/api/passbook",async(req,resp)=>getUser(req,resp))

app.post("/api/getxlsx",async(req,resp)=>getXLSX(req,resp))

app.post("/api/profile",async(req,resp)=>pushImage(req,resp))

app.listen(8080,()=>{
    console.log("app is started at port 8080")
    createadmin()
})
