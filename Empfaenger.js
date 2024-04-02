import {Kafka} from 'kafkajs'
const{Consumer}=Kafka;
import { kafka, topicName } from './Gemeinsam.js';



const consumer= kafka.consumer({groupId:'test-group'});
const run=async()=>{
    await consumer.connect();
    await consumer.subscribe({topic:topicName,fromBeginning:true});
    await consumer.run({
        eachMessage:async({topic, partition, message})=>{
            const{isbn, autor, titel}=JSON.parse(message.value.toString());
            console.log(`Received message: isbn=${isbn}, autor=${autor}, titel=${titel}`);

        }
    })
};
run().catch(console.error);