import dotenv from 'dotenv';
import express from 'express';
import urlRoute from './routes/urlRoute';

dotenv.config();

const app = express();
const port = 3000;


app.use('/',urlRoute);

app.listen(port, ()=>{

    console.log(`Server listening on port ${port}`);
});