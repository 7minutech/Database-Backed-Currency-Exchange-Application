import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"

router.get('/', (req, resp) => {
    db.all(`SELECT * FROM currency`, (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        if (!rows){
            return resp.status(500).json({ error: "Coundn't fetch currency symbols"});
        }
        var symbols = {}
        rows.forEach(row => {
            let symbol = row._id
            let desc = row.description     
            symbols[symbol] = desc
        });
        resp.json(symbols)
    });
});

export default router;