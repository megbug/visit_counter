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

        const startCount = await Count.create({
            name: `${site}`,
            count: 1,
            clientInfo: {
                lastUserIP: req.socket.remoteAddress,
                lastVisit: new Date().toISOString(),
                lastBrowserAgent: req.get('user-agent')
            }
        });
        res.send(`Visiters: ${startCount.count}`)
        // the response we send to the client using the api endpoint (/visit?site=something)
    }
    else {
        // in case the site requested already has counts we're adding the new counts and save them to the database 
        counts.count += 1;
        counts.clientInfo = {
            lastUserIP: req.socket.remoteAddress,
            lastVisit: new Date().toISOString(),
            lastBrowserAgent: req.get('user-agent')
        };
        counts.save();

        res.send(`Visiters: ${counts.count}`)
    }
});

//http://localhost:5172/visited?site=
app.get(`/visited`, async (req, res) => {
    let counts = await Count.find({});
    res.send(counts);
});

app.get('/visited/:site', async (req, res) => {
    let { site } = req.params;
    let counts = await Count.findOne({ name: `${site}` });

    if (counts == null) {
        res.send("I wasn't visted before - maybe check for misspelling");
        return
    } else {
        // if site requested was visited before, show specific information for that site
        let counts = await Count.findOne({ name: `${site}` });
        res.send(counts)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});


