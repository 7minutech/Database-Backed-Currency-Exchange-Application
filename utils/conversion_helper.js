import { db } from "../store/db.js"
import { fetchExchangeRate, addParamsToOptions } from '../api/convertApi.js';
import { rates_db } from "../store/lab3_rates_20250911.js"


export function conversionResp(from, to, amount, result, date, success){
    const today = new Date();
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

export function fetchRate(resp, params, success){
    const { to, from, amount, date } = params; 
    const today = new Date();
    let givenDate = new Date(date)

    db.get(`SELECT rate FROM rate where currency_id = ? AND date = ?`, [to, date], (err, row) => {
        if (err) {
            console.error(err.message);
            console.log("error selecting rate")
            resp.status(500).json(conversionResp(to, from, amount, undefined, date, false));
            return
        }
        if (!(success)){
            console.log("no success")
            resp.status(500).json(conversionResp(to, from, amount, undefined, date, false));
            return;
        }
        if (!row){
            if (givenDate > today) {
                resp.status(400).json(conversionResp(to, from, amount, undefined, date, false));
                return;
            }
            fetchExchangeRate(addParamsToOptions(params), insertRates, resp, params)
            return;
        }
        let result = row.rate * amount
        resp.json(conversionResp(to, from, amount, result, date, true))
    });
}

export function insertRates(err, data, resp, params){
    const { to, from, amount, date } = params; 
    if (err){
        console.error("error: fetching conversion from api")
        return
    }
    if (data.message) {
        fetchRate(resp, params, false)
        return
    }
    if (data.date != params.date) {
        fetchRate(resp, params, false)
        return
    }
    var rates = data.rates
    let symbol = to;
    let rate = data.rates[symbol];
    let queryDate = data.date;
    console.log(symbol, rate, queryDate)
    var insertRate = `INSERT INTO rate(currency_id, date, rate) VALUES(?, ?, ?)`;
    var statement = db.prepare(insertRate)
    for (let symbol in rates) {
        // console.log(`${symbol}: ${rates[symbol]}`)
        statement.run(symbol, queryDate, rates[symbol])
    }
    statement.finalize((err) => {
        if (err) {
            console.error(err.message);
            fetchRate(resp, params, false);
        }
        else {
            console.log(`Rows updated for: ${queryDate}`);
            fetchRate(resp, params, true)
        }
    });
}