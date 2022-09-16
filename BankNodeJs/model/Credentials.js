const mongoose = require('mongoose');

const CredentialSchema = mongoose.Schema({
    credentialId : {type: String},
    userName : {type: String,unique :true},
    password : {type: String}
    }, {
        timestamps: true 
    }
)

const  CredentialModel = new mongoose.model('Credentials', CredentialSchema)
module.exports = CredentialModel