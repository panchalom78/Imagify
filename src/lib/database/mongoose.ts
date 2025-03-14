import mongoose, { Mongoose } from "mongoose";


interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null,
    };
}

export const connectToDatabase = async () => {
    const MONOGODB_URL = process.env.MONGODB_URL;
    console.log(MONOGODB_URL);
    
    if (cached.conn) {
        return cached.conn;
    }

    if (!MONOGODB_URL) {
        throw new Error("MONGODB_URL not found");
    }

    cached.promise =
        cached.promise ||
        mongoose.connect(MONOGODB_URL, {
            dbName: "imagify",
            bufferCommands: false,
        });

    cached.conn = await cached.promise;
    console.log("Connected to database");

    return cached.conn;
};
