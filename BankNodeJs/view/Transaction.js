

class Transaction{
    constructor(type,customer,amount){
        this.type = type
        this.customer = customer
        this.amount = amount
    }

    static createTransaction(type,customerID,amount){
        const newTransaction = new Transaction(type,customerID,amount)
        return newTransaction
    }
}

module.exports = Transaction