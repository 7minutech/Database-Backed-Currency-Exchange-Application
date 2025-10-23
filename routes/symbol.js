import express from 'express'
const router = express.Router();
import { db } from "../store/db.js"

router.get('/', (req, resp) => {
    db.all(`SELECT _id FROM currency`, (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        if (!rows){
            return resp.status(500).json({ error: "Coundn't fetch currency symbols"});
        }
        resp.json(rows)
    });
});

export default router;