import { GoogleGenerativeAI } from '@google/generative-ai';
const key = 'AIzaSyDa4psL87_SYLcvUcQWPjgSjUS56bwDXIg';

console.log('Starting Gemini Test...');
console.log('Key:', key.substring(0, 10) + '...');

try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    console.log('Model initialized. Sending prompt...');
    const result = await model.generateContent("Hello Gemini!");
    const response = await result.response;
    console.log('Response:', response.text());
} catch (e) {
    console.error('FATAL ERROR:', e);
}
