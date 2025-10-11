import { Accident } from "../models/accidents.models.js";
export const addAccident = async (req,res) =>{
    try{
        const { location,description,severity } = req.body;

        const newAccident = new Accident({
            user:req.user.id,
            location,
            description,
            severity
        });

        await newAccident.save();
        res.status(201).json({message:"Accident reported successfully",accident:newAccident});
    } catch(err){
        res.status(500).json({error:err.message});
    }
};

export const getAccidents = async (req,res) =>{
    try{
        const accidents = await Accident.find().populate("user","username email");
        res.json(accidents);
    } catch(err){
        res.status(500).json({error:err.message})
    }
};