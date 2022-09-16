const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
type : {type: String},
customer: {type: mongoose.SchemaTypes.ObjectId,ref:"Customers"},
amount : {type: Number}
}, {
    timestamps: true 
}
)

const  TransactionModel = new mongoose.model('Transactions', TransactionSchema)
module.exports = TransactionModel
