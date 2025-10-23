import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"
import { conversionResp } from '../utils/conversion_helper.js';


router.get('/', (req, resp) => {
    const { to, from, amount, date } = req.query; 
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    let result = undefined

    if (!(to) || !(from) || !(amount)){
        resp.json(conversionResp(to, from, amount, result, date, falses))
    }
    
    if (!(date)) {
        date = formattedDate
    }

    db.get(`SELECT rate FROM rate where currency_id = ? AND date = ?`, [to, date], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        if (!row){
            return resp.status(500).json({ error: "Coundn't fetch rate from db"});
        }
        result = row.rate * amount
        resp.json(conversionResp(to, from, amount, result, date, true))
    });
});

export default router;