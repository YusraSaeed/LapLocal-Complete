import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        // await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME
    });
        console.log(`Successfully Connected to MongoDB Database`);
        
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
        
    }

}

export default connectDB
