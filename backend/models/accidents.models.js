import mongoose, { mongo } from "mongoose";

const accidentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    location:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    severity:{
        type:String,
        enum:["low","medium","high"],default:"low"
    }
}, {timestamps:true});

export const Accident = mongoose.model("Accident",accidentSchema);