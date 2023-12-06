import express from 'express';
import path from 'path';

const fetch = require('fetch-retry');

import logger from './logger';

const PORT = 7878;
const DNSHOST = "https://www.duckdns.org/update?domains=piecraft";
const DUCKTOKEN = "";

const DNSUpdate = async (newIP="") => {
    const url = `${DNSHOST}&token=${DUCKTOKEN}&ip=${newIP}`; 
    //DUCK DNS will automatically detect your remote ip if you leave the field blank
    const DNSUpdateResponse = await fetch(
        url, {
            method: 'GET',
            retryOn: [502]
        }
    );
    if (DNSUpdateResponse.status === 200) {
        logger.debug('updated ip');
    } else { 
        throw new Error(`Recieved response status ${DNSUpdateResponse.status} trying to resolve ${url}`);
    }
};


const app = express();
app.use(express.static(path.join(__dirname, 'public')));
//TODO: test if this exposes client.js to download, is that a security risk?

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'public', 'index.html'));
    logger.debug('home page was visited');
});

app.get('/update', async (request, response) => {
    await DNSUpdate();
    //TODO: add dynamic server status
    logger.debug('update successful');
})

app.listen(PORT, (err) => {
    if (err) {
        logger.debug('server error', err);
    }
    logger.debug(`server is listening on ${PORT}`);
});