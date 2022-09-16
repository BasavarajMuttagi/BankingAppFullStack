const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    customerID:{type: String},
    firstName:{type: String}, 
    lastName:{type: String},
    role: {type: String},
    credential: {type: mongoose.SchemaTypes.ObjectId,ref:"Credentials"},
    isActive: {type: Boolean},
    accounts: {type: [mongoose.SchemaTypes.ObjectId],ref:"Accounts"},
    transactions: {type: [mongoose.SchemaTypes.ObjectId],ref:"Transactions"},
    totalBalance: {type: String}
    }, {
        timestamps: true 
    }
)

const  CustomerModel = new mongoose.model('Customers', CustomerSchema)
module.exports = CustomerModel