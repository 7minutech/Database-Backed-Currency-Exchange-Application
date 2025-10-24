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

function add_result(resp) {
    let usd_value_str = (resp.query.amount).toLocaleString('en-US', {
        style: 'currency',
        currency: resp.query.to,
    });

    if (!(resp.success)){
        console.log(`error: converted currecny response: ${resp}`);
    }

    let result_value_str = (resp.result).toLocaleString('en-US', {
        style: 'currency',
        currency: resp.query.from,
    });
    let conversion_msg = `The equivalent of ${usd_value_str} in ${resp.query.from} for the date ${resp.date} is ${result_value_str}`
    show_conversion_result(conversion_msg)
   
}

function show_conversion_result(msg) {
    let $output = $(".output");
    let $p = $("<p></p>").text(msg);
    $output.append($p);
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
            add_result(response)
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
            add_result(response)
            $("#convert_button").prop('disabled', false); 

        },
        error: function(xhr, status, error){
            let selectedDate = date
            if (!(selectedDate)){
                selectedDate = today = new Date().toISOString().substring(0,10);   
            }
            alert(`error converting ${from} to ${to} on ${selectedDate}`)
            console.log(`error converting ${from} to ${to} on ${selectedDate}: ${error}`)
            $("#convert_button").prop('disabled', false); 
        }
    })
}

$(function() {
    fetch_symbols()
});
