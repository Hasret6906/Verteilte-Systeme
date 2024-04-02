import  {Kafka}  from 'kafkajs';

const kafka =new Kafka ({
    clientId: '193789734',
    brokers: ['zimolong.eu:9092'],
    sasl:{
        mechanism:"plain",
        username:"dhbw",
        password:"dhbw",
    }
})
const topicName='WWI22B4.SarikanHasret.Aufgabenblatt';
export {kafka, topicName};