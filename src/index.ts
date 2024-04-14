import express,{Request,Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

mongoose
.connect(process.env.MONGODB_CONNECTION_STRING as string)
.then(()=>console.log("Connected to mongodb! "));

const app=express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request,res: Response)=>{
    res.send({message: "Health OK!"})
})

// endpoint
app.use("/api/my/user",myUserRoute);

// callback function with port number whch denotes server start
app.listen(7000, ()=>{
console.log("Server has started on localhost:7000");
});