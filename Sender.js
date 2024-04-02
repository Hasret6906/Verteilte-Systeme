import {Kafka} from 'kafkajs'
const { Producer } = kafka; 
import {kafka,topicName} from './Gemeinsam.js';


import readlineSync from 'readline-sync';

const producer = kafka.producer();
const run = async ()=>{
    
    await producer.connect();

    const isbn= readlineSync.question('ISBN:');
    const autor= readlineSync.question('Autor:');
    const titel=readlineSync.question('Titel:');

    await producer.send({
        topic: topicName,
        messages:[
            {value: JSON.stringify({isbn, autor, titel})}
        ],
    });

    await producer.disconnect()
};

run().catch(console.error); 
