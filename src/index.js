import express from 'express';
import path from 'path';
const { readFileSync} = require('fs');
const originalFetch = require('isomorphic-fetch');
const fetch = require('fetch-retry')(originalFetch);

import asyncScheduledTask from './cron';
import logger from './logger';

const CONSTANTS = JSON.parse(readFileSync('./constants.json'));
logger.debug('Constants loaded');

const DNSHOST = CONSTANTS.DNSHOST;
const DUCKTOKEN = CONSTANTS.DUCKTOKEN;
const PORT = CONSTANTS.PORT

const DNSUpdate = async (newIP="") => {
    try { const url = `${DNSHOST}&token=${DUCKTOKEN}&ip=${newIP}`; 
    console.log(url);
    //DUCK DNS will automatically detect your remote ip if you leave the field blank
    const DNSUpdateResponse = await fetch(url);
    if (DNSUpdateResponse.status === 200) {
        logger.debug('updated ip');
        console.log('success')
    }} catch (error) { 
        console.log(error);
        logger.debug(error);
    }
};
 
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
//TODO: test if this exposes client.js to download, is that a security risk?

asyncScheduledTask(DNSUpdate());

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'public', 'index.html'));
    logger.debug('home page was visited');
});

app.get('/update', async (request, response) => {
    logger.debug('/update route called');
    await DNSUpdate();
    response.redirect('/');
})

app.listen(PORT, (err) => {
    if (err) {
        logger.debug('server error', err);
    }
    logger.debug(`server is listening on ${PORT}`);
});