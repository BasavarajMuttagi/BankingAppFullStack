const mongoose = require('mongoose');

const PhotoSchema = mongoose.Schema({ 
    img: { 
       data: Buffer, 
       contentType: String 
    }
 },
{
    timestamps: true 
}
)

const  PhotoModel = new mongoose.model('Photos', PhotoSchema)
module.exports = PhotoModel

