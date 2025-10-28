import http from 'node:http';

// const API_KEY = "dOeYwAl4A1IG4D8lZ9uuBRNv4p0DPkMb"
const API_KEY = "XPfkMH03atKVlcNbKZiFLN4DEbh7NYC1"

export function addParamsToOptions(params){
    const { date } = params; 
    const baseParam = "base=USD"

    let convertOptions = {
        hostname: 'api.apilayer.com',
        path: '/exchangerates_data/',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            "apikey": API_KEY
        }
    };
    convertOptions.path += date + "?" + baseParam
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
            let json = JSON.parse(chunks.join(''));
            console.log('Record(s): ' + json.length);
            callback(null, json, resp, params);
        });

        req.on('error', (e) => { callback(true, null); });
    });
    req.end();

}
