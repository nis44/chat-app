import mongoose from 'mongoose'
import { Schema } from 'mongoose'


const messageSchema = new Schema({
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requied: true
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requied: true
    }
    
}, {timestamps: true})

export const Message = mongoose.model("Message", messageSchema);