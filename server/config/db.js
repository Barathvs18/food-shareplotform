import mongoose from "mongoose";

// connection 
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("data base is connected successfully")
    } catch(error) {
        console.log(`Error message ${error}`)

    }
    
};
// 
 
// export 
export default connectDB;