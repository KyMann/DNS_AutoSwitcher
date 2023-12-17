import cron from 'node-cron';

import logger from '../logger';

const frequency = '0 0 * * *'; //runs daily at 0:0 - midnight

const asyncScheduledTask = async () => cron.schedule(frequency, async (service) => {
    logger.log('auto running');
    await service;
});

export default asyncScheduledTask;