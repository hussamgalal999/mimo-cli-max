import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const key = process.env.PERPLEXITY_API_KEY;
console.log('Key loaded:', key ? `${key.substring(0, 10)}...[length=${key.length}]` : 'NO KEY');

if (!key) {
    console.error('❌ No API Key found in .env');
    process.exit(1);
}

const client = new OpenAI({
    apiKey: key,
    baseURL: 'https://api.perplexity.ai',
});

async function test() {
    try {
        console.log('🔄 Testing connection to Perplexity API...');
        console.log('Model: llama-3.1-sonar-large-128k-online');

        const response = await client.chat.completions.create({
            model: 'llama-3.1-sonar-large-128k-online',
            messages: [{ role: 'user', content: 'Say "Connection Successful" if you can hear me.' }],
        });

        console.log('✅ Success!');
        console.log('Response:', response.choices[0].message.content);
    } catch (error) {
        console.error('❌ Failed!');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

test();
