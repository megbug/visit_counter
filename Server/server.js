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

// app.get are endpoints of the api 

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

    let counts = await Count.findOne({ name: `${site}` });
    //console.log(counts); //logs Obj with : _id, name of site, counted number in case site was used before; else logs: null

    if (counts == null) {
        // in case the site requested has no counts yet, we create it in the database
        const startCount = await Count.create({ name: `${site}`, count: 1 });
        res.send(`Visiters: ${startCount.count}`)
        // the response we send to the client using the api endpoint (/visit?site=something)
    }
    else {
        // in case the site requested already has counts we're adding the new counts and save them to the database 
        counts.count += 1;
        counts.save()
        res.send(`Visiters: ${counts.count}`)
    }
});

app.get('/visited', async (req, res) => {
    let counts = await Count.find({})
    //console.log(counts) // logs the array containing the obj from each requested site 
    res.send(JSON.stringify(counts))
    // the response we send to the client using the api endpoint (/visited) showing the array stingified
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});