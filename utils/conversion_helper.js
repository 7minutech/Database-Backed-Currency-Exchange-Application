import { db } from "../store/db.js"

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
            return resp.status(500).json(conversionResp(to, from, amount, undefined, date, false));
        }
        let result = row.rate * amount
        resp.json(conversionResp(to, from, amount, result, date, true))
    });
}