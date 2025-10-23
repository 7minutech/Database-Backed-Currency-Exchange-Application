import express from 'express';
import cors from 'cors';
import symbolRouter from "./routes/symbol.js";

const app = express();
app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.set('view engine', 'ejs');

app.use('/symbol', symbolRouter);

export { app }; 
