import {Queue} from 'bullmq'
import REDIS from './redis.js'

export const emailqueue = new Queue('email-queue',{
    connection:REDIS
})

export default emailqueue