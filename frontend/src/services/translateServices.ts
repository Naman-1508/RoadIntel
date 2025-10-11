export const translateText = async (
    text : string,
    targetLanguage : string
) : Promise<string> => {
    try{
        const res = await fetch("http://localhost:3000/api/translate",{
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify({text,targetLanguage}),
        });

        const data : { translatedText?: string} = await res.json();
        return data.translatedText || text;
    } catch(error){
        console.error("Translation Failed",error);
        return text;
    }
};