import {ReceiveMessageCommand, DeleteMessageCommand, SQSClient} from '@aws-sdk/client-sqs';
import { transcodeVideo } from './transcoder/transcodeVideo.js';

const client = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function init() {
    const command = new ReceiveMessageCommand({
        QueueUrl:'https://sqs.ap-south-1.amazonaws.com/718255339736/transcoder-temp-raw-video-queue',
        MaxNumberOfMessages:1,
        WaitTimeSeconds:20,

    });

    while(true)
    {
        const {Messages} = await client.send(command); 
        if(!Messages)
        {
            console.log('No messages found');
            continue;
        }
        try
        {
            for(const message of Messages)
            {
                const { MessageId,Body,ReceiptHandle} = message;
                console.log(`Message Received`,{MessageId,Body});

                if(!Body) continue;
                
                // Validate and Parse the event
                /** @type {{ Records: Array<{ s3: { bucket: { name: string }, object: { key: string } } }> }} */
                const event = JSON.parse(Body);
        

                //Ignore the test event
                if("Service" in event && "Event" in event)
                {
                    if(event.Event === "s3:TestEvent") continue;
                }
                
               
                for(const record of event.Records)
                {
                    const {
                        s3: {
                          bucket: { name },
                          object: { key },
                        },
                      } = record;

                    console.log(`Received video: ${key} from bucket: ${name}`);
                    // spin the docker container 
                    // ---------------transcoding part ----------------- //
                    try {
                        await transcodeVideo(key);
                      } catch (err) {
                        console.error(`Error transcoding video ${key}`, err);
                      }
                    // ---------------------------------------------------//   
                }
                
                // delete the messages

                // --> @prat yaha par temp bucket se video hata de agar succuessfully trnscode ho gyi ho toh 

                await client.send(
                    new DeleteMessageCommand({
                      QueueUrl: 'https://sqs.ap-south-1.amazonaws.com/718255339736/transcoder-temp-raw-video-queue',
                      ReceiptHandle: ReceiptHandle,
                    })
                  );
                  console.log(`Message deleted: ${MessageId}`);

            }
        }
        catch(err)
        {
            console.error(`Error processing message ${MessageId}:`, err);
        }
        
    }
}

init();