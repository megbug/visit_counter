import express from 'express';
import mongoose from 'mongoose';

import 'dotenv/config.js'

const app = express();
const PORT = process.env.PORT || 3002;
//git commit but not pushed 1

app.use(express.json());
mongoose.connect(process.env.DB)

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`)
    next()
})

let count = 0;
app.get('/visit', (req, res) => {
    if (res.sendStatus(200)) {
        return count += 1;
    }
})
console.log(count);
app.get('/visited', (req, res) => {
    res.send(`${count}`)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

