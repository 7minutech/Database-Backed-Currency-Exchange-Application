import { db } from "../store/db.js"
import { fetchExchangeRate, addParamsToOptions } from '../api/convertApi.js';
import { rates_db } from "../store/lab3_rates_20250911.js"


export function conversionResp(from, to, amount, rate, date, success){
    const today = new Date();
    let result = amount * rate
    return {
        success: success,
        query: {
            from: from,
            to: to,
            amount: amount
        },
        date: date,
        result: result
    }
}

export function fetchRate(resp, params){
    const { to, from, amount, date } = params; 

    db.get(`SELECT rate FROM rate where currency_id = ? AND date = ?`, [to, date], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        if (!row){
            fetchExchangeRate(addParamsToOptions(params), insertRate, resp, params)
            return
            // resp.status(500).json(conversionResp(to, from, amount, undefined, date, false));
        }
        let result = row.rate * amount
        resp.json(conversionResp(to, from, amount, result, date, true))
    });
}

export function insertRate(err, data, resp, params){
    const { to, from, amount, date } = params; 

    if (err){
        console.error("error: fetching conversion from api")
        return
    }
    if (data.message) {
        console.error(data)
        resp.status(500).json(conversionResp(to, from, amount, undefined, date, false))
        return
    }
    let symbol = to
    let rate = data.rates.to
    let queryDate = data.date
    db.run(`INSERT INTO rate(currency_id, date, rate) VALUES(?, ?, ?)`, [symbol, rate, queryDate], (err) => {
        if (err) {
            console.error(err.message);
        } 
        else {
            console.log("Rows updated:");
            fetchRate(resp, params)
        }
    });
}