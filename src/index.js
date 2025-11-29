import dotenv from "dotenv"
dotenv.config();

import express from "express"
import cors from "cors";
import { connectionDatabase } from "./config/database.js";
import routes from './routes/routes.js'
const app=express();
app.use(cors());
app.use(express.json());

app.use('/api',routes);

const PORT = process.env.PORT || 8080;
const startServer=async()=>{
    await connectionDatabase();

    app.listen(PORT,()=>{
        console.log(`server running on port '${PORT}`);
    });
};

startServer();