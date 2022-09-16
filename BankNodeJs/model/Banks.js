const mongoose = require('mongoose');

const BankSchema = mongoose.Schema({
   bankID : {type: String},
   bankName : {type: String},
   bankAbbreviation : {type: String}
}, {
        timestamps: true 
    }
)

const  BankModel = new mongoose.model('Banks', BankSchema)
module.exports = BankModel