import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GOOGLE_API_KEY;
// Clean key - remove whitespace/comments if any
const cleanKey = key?.trim().split('\n')[0].replace(/['"]/g, '');

console.log('Testing Gemini Key:', cleanKey ? `${cleanKey.substring(0, 10)}...` : 'NO KEY');

const genAI = new GoogleGenerativeAI(cleanKey || '');

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = "Say 'Gemini Connected Successfully!'";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('✅ Success:', text);
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

run();
