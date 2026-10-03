import dns from "dns";
import express from "express";
import { config } from "dotenv";
import conectDB from "./db/index.js";

config({
    path: "./.env"
});

const app = express();

conectDB()
    .then(() => {
        app.listen(process.env.PORT ||  8000, () => {
            console.log(`App is running on port ${process.env.PORT}`);
            
        });
    })
    .catch((error) => {
        console.log("MONGODB connection failed", error);
    });




/*
import express from "express";
const app = express();
(async ()=>{
try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
        console.log("error", error);
        throw error
    });
    app.listen(process.env.PORT,()=>{
        console.log(`App is runing on port ${process.env.PORT}`);
        
    })
 } catch (error) {
    console.log("ERROR", error);
    throw error
    
}
});
*/
