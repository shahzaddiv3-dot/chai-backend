import dns from "node:dns";
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

dns.setServers(["8.8.8.8"]);

const connectDB = async () => {
    try {
        console.log("Mongo URI exists:", !!process.env.MONGODB_URI);

        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );

        console.log(
            `\nMONGODB connected !! DB hosted : ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("MONGODB CONNECTION error", error);
        process.exit(1);
    }
};

export default connectDB;