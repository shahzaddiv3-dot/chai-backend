import { config } from "dotenv";
import conectDB from "./db/index.js";
import { app } from "./app.js";

config({
    path: "./.env"
});

conectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`App is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MONGODB connection failed", error);
    });