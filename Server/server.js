import express from 'express';
import mongoose from 'mongoose';
import { Count } from './model/Count.js';
import cors from 'cors';

import 'dotenv/config.js'

const app = express();
app.use(cors())
const PORT = process.env.PORT || 5172;

app.use(express.json());
mongoose.connect(process.env.DB)

/*
1st approach counting visits 
app.get('/visit', (req, res) => {
    if (res.sendStatus(200)) {
        return count += 1;
    }
})
*/

/*
level 2-3 : let count = 0; => how to get this into app.get 

app.get('/visit', async (req, res) => {
    // get count out of database 
    let counts = await Count.findOne({ name: 'firstCounter' })
    if (counts == null) {
        const startCount = await Count.create({ name: 'firstCounter', count: 1 });
        res.send(`Visiters: ${startCount.count}`)
    }
    else {
        counts.count += 1;
        counts.save()
        res.send(`Visiters: ${counts.count}`)
    }
})

app.get('/visited', async (req, res) => {
    let counts = await Count.findOne({ name: 'firstCounter' })
    console.log(counts);
    res.send(`${counts.count}`)
})
*/


/*
level 4
http://localhost:5172/visit?site=
*/
app.get('/visit', async (req, res) => {
    const { site } = req.query;
    if (!site) {
        res.status(401).send({ error: 'Use ?site query to speficy site you want to track' })
        return
    }
    let counts = await Count.findOne({ name: `${site}` })
    if (counts == null) {
        const startCount = await Count.create({ name: `${site}`, count: 1 });
        res.send(`Visiters: ${startCount.count}`)
    }
    else {
        counts.count += 1;
        counts.save()
        res.send(`Visiters: ${counts.count}`)
    }
});


app.get('/visited', async (req, res) => {
    let counts = await Count.find({})
    res.send(JSON.stringify(counts))
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});