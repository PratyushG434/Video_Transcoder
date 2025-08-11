import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import connectDB from './db/db.js';
import initSQSworker from './utils/sqsWorker.js';
import Router from './routes/routes.js';



const app = express();
const port = 3000;



app.use(express.json())
app.use(cors()) 
app.use(bodyParser.json({extended : true}))
app.use(bodyParser.urlencoded({extended : true}))
app.use('/',Router);

initSQSworker();
connectDB();
app.listen(port, ()=>{  console.log(`Server listening on port ${port}`) })