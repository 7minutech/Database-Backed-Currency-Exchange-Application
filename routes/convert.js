import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"
import { conversionResp } from '../utils/conversion_helper.js';


router.get('/', (req, resp) => {
    const { to, from, amount, date } = req.query; 
    const today = new Date().toISOString().substring(0,10);
    let result = undefined
    let selectedDate = today

    if (date) {
        selectedDate = date
    }
    if (!(to) || !(from) || !(amount)){
        resp.json(conversionResp(to, from, amount, result, selectedDate, false))
    }

    db.get(`SELECT rate FROM rate where currency_id = ? AND date = ?`, [to, date], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        if (!row){
            return resp.status(500).json(conversionResp(to, from, amount, undefined, selectedDate, false));
        }
        result = row.rate * amount
        resp.json(conversionResp(to, from, amount, result, selectedDate, true))
    });
});

export default router;