import http from 'node:http';
import { Buffer } from 'node:buffer';
const API_KEY = "dOeYwAl4A1IG4D8lZ9uuBRNv4p0DPkMb"
// const API_KEY = "XPfkMH03atKVlcNbKZiFLN4DEbh7NYC1"


/*
function fetch_api_conversion({amount, from, to, date}) {
    let params = `to=${to}&from=${from}&amount=${amount}`
    if (date) {
        params += `&date=${date}`
    }
    $.ajax ({
        url: "https://api.apilayer.com/exchangerates_data/convert?" + params,
        method: "GET",
        dataType: "json",
        headers: {
            "apikey": API_KEY
        },
        success: function(response) {
            add_result(response)
        }
    })
}

{
{
  "success": true,
  "timestamp": 1719408000,
  "base": "EUR",
  "date": "2024-06-26",
  "rates": {
    "USD": 1.0712,
    "GBP": 0.8473,
    "JPY": 171.55
  }
}
*/



export function addParamsToOptions(params){
    const { to, from, amount, date } = params; 
    let queryParams = `to=${to}&from=${from}&amount=${amount}&date=${date}`

    let convertOptions = {
        hostname: 'api.apilayer.com',
        path: '/exchangerates_data/convert?',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "apikey": API_KEY
        }
    };

    convertOptions.path += queryParams
    return convertOptions
}

export function fetchExchangeRate(options, callback, resp, params){
    const req = http.request(options, (res) => {
        let chunks = [];
        console.log(`Status: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            chunks.push(chunk);
        });
        res.on('end', () => {
            let json = JSON.parse(chunks.join());
            console.log('Record(s): ' + json.length);
            callback(null, json, resp, params);
        });

        req.on('error', (e) => { callback(true, null); });
    });
    req.end();

}
