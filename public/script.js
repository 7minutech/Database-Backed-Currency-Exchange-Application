
const API_KEY = "dOeYwAl4A1IG4D8lZ9uuBRNv4p0DPkMb"

function add_target_currencies(symbols) {
    let $select = $("#target_currency");
    for (const [key, value] of Object.entries(symbols)){
        let $option = $(`<option></option>`).text(`${key} (${value})`);
        if (key == "GBP") {
            $option.attr("selected", true);
        }
        $option.attr("value", key);
        $select.append($option);
    }
}

function add_result(amount, result, to, date) {
    let usd_value_string = (amount).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    let result_value_string = (result).toLocaleString('en-US', {
        style: 'currency',
        currency: to,
    });
    let $output = $(".output");
    let $p = $("<p></p>").text(`The equivalent of ${usd_value_string} in ${to} for the date ${date} is ${result_value_string}`);
    $output.append($p);
    $("#convert_button").prop('disabled', false);
   
}

$(function() {
    $("#convert_button").on("click", function(e) {
        $("#convert_button").prop('disabled', true);
        e.preventDefault();
        let usd = Number($("#usd_value").val());
        if (isNaN(usd) || usd == "") {
            alert("Value in USD must be a number")
            return
        }
        let params = {
            "amount": usd,
            "from": "USD",
            "to": $("#target_currency").val(),
            "date": $("#date_value").val()
        }
        fetch_conversion(params)   
    });
});

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
            add_result(amount, response["result"], to, date)
        }
    })
}

function fetch_symbols(){
    $.ajax({
        url: "http://localhost:8080/symbol",
        method: "GET",
        dataType: "json",
        success: function(resp){
            add_target_currencies(resp)
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    })
}

/*
{
    "success": true,
    "query": {
        "from": "USD",
        "to": "GBP",
        "amount": 7
    },
    "info": {
        "timestamp": 1761251115,
        "rate": 0.750635
    },
    "date": "2025-10-23",
    "result": 5.254445
}

*/

function fetch_conversion({amount, from, to, date}){
    let params = `to=${to}&from=${from}&amount=${amount}`
    if (date) {
        params += `&date=${date}`
    }
    $.ajax ({
        url: "http://localhost:8080/convert?" + params,
        method: "GET",
        dataType: "json",
        success: function(response) {
            add_result(amount, response["result"], to, date)
        },
        error: function(xhr, status, error){
            console.log(error)
        }
    })
}

$(function() {
    fetch_symbols()
});
