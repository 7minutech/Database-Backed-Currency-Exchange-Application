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