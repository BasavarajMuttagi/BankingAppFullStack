const bcrypt = require('bcrypt');
const DatabaseMongoose = require('../repository/DB');
const uuid = require('uuid');
const DB = new DatabaseMongoose()
class Credentials{
    constructor(userName,password) {
        this.credentialId = uuid.v4()
        this.userName = userName
        this.password = password
    }
    async getHashPassword(){
        return bcrypt.hash(this.password,10);
    }


    static async createCredential(userName,password){
         const findCustomerResult = await DB.findUserInCollection(userName)

         if(findCustomerResult !== false){
                return [false,null]
         }

         const  newcredential = new Credentials(userName,password)
         newcredential.password = await newcredential.getHashPassword()
         const  newcredentialRecord = await DB.createCredential(newcredential)

         if(newcredentialRecord === false){
            return [false,null]
         }

         return [true,newcredentialRecord]
     }
}

module.exports = Credentials;