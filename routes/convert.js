import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"
import { conversionResp, fetchRate } from '../utils/conversion_helper.js';


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

    fetchRate(resp, req.query)
});

export default router;