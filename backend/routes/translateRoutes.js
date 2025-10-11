import express from "express";
import { SarvamAIClient} from "sarvamai";

const router = express.Router();

const client = new SarvamAIClient({
    apiSubscriptionKey : process.env.SARVAM_API_KEY

});

router.post("/",async(req,res)=>{
    const { text, targetLanguage } = req.body;

    if(!text || !targetLanguage){
        return res.status(400).json({error: "text and targetLanguage are required"});
        }
        try{
            const response = await client.text.translate({
                input:text,
                source_language_code:"auto",
                target_language_code: targetLanguage
                
            });
            console.log("Sarvam Response (raw):", JSON.stringify(response, null, 2));

            res.json({ translatedText: response.translated_text || "No translation found" });
        } catch(error){
            console.error("Translation failed:",error);
            res.status(500).json({error : "Translation failed"});

        }
    });

export default router;