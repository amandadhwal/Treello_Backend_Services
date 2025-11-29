import mongoose from "mongoose";

export const connectionDatabase=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected");
        
    } catch (error) {
        console.error("mongo db connection error",error);
        process.exit(1);
    }
}