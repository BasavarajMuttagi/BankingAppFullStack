const uuid = require('uuid')


class Accounts{
    static accountNumber = 2000;
    constructor(bankAbbreviation) {
        this.bankAbbreviation = bankAbbreviation
        this.accountNumber = uuid.v4()
        this.balance = 1000
    }
    
    
    static createNewAccount(bankAbbreviation){
        let newAccount = new Accounts(bankAbbreviation);
        return newAccount
    }
    
}

module.exports = Accounts;