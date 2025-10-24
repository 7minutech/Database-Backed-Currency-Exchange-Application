import http from 'node:http';
import { Buffer } from 'node:buffer';
const API_KEY = "dOeYwAl4A1IG4D8lZ9uuBRNv4p0DPkMb"

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
*/

const convertOptions = {
    hostname: 'api.apilayer.com',
    path: '/exchangerates_data/convert?',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        "apikey": API_KEY
    }
};

function addParamsToOptions(options, params){
    let queryParams = `to=${params.to}&from=${params.from}&amount=${params.amount}&date=${params.date}`
    let options = convertOptions
    options.path += queryParams
    return convertOptions
}

function fetchExchangeRate(options, callback){
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
            callback(null, json);
        });

        req.on('error', (e) => { callback(true, null); });

        req.end();
    })
}
