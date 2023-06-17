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

    // let timeVisit
    // let browserAgent
    // let ipAddresses

    if (counts == null) {
        // in case the site requested has no counts yet, we create it in the database
        // const startCount = await Count.create({ name: `${site}`, count: 1 });
        // timeVisit = new Date();
        // browserAgent = req.get('user-agent');
        // ipAddresses = req.socket.remoteAddress;
        // console.log(ipAddresses);
        //console.log(timeVisited.toString());
        const startCount = await Count.create({
            name: `${site}`,
            count: 1,
            clientInfo: {
                // lastUserIP: ipAddresses,
                lastUserIP: req.socket.remoteAddress,
                // lastVisit: timeVisit.toString(),
                lastVisit: new Date().toString(),
                lastBrowserAgent: req.get('user-agent')
                // lastBrowserAgent: browserAgent
            }
        });
        res.send(`Visiters: ${startCount.count}`)
        // the response we send to the client using the api endpoint (/visit?site=something)
    }
    else {
        // in case the site requested already has counts we're adding the new counts and save them to the database 
        let timeVisit = new Date();
        counts.count += 1;
        counts.clientInfo.lastUserIP = req.socket.remoteAddress;
        counts.clientInfo.lastVisit = timeVisit.toString();
        counts.clientInfo.lastBrowserAgent = req.get('user-agent');
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

// console.log((req.get('user-agent'))
// new date 
/*
app.get('/',function(req, res) {

    const ipAddresses = req.header('x-forwarded-for');
    res.send(ipAddresses);

});
*/

