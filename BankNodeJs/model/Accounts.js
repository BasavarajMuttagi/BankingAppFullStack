const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
    bankAbbreviation : {type: String},
    accountNumber : {type: String},
    balance : {type: Number}
    }, {
        timestamps: true 
    }
)

const  AccountModel = new mongoose.model('Accounts', AccountSchema)
module.exports = AccountModel
