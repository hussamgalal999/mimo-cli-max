import dns from 'dns';
import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

console.log('--- NETWORK DIAGNOSTICS ---');

// 1. Check Proxy Env Vars
console.log('HTTP_PROXY:', process.env.HTTP_PROXY || 'Not Set');
console.log('HTTPS_PROXY:', process.env.HTTPS_PROXY || 'Not Set');

// 2. Check Keys loaded (Sanity Check)
const keys = ['PERPLEXITY_API_KEY', 'GOOGLE_API_KEY', 'MISTRAL_API_KEY'];
keys.forEach(k => {
    const val = process.env[k];
    if (!val) console.log(`${k}: MISSING ❌`);
    else console.log(`${k}: Present (${val.length} chars) [First: ${val[0]}, Last: ${val[val.length - 1]}] ✅`);
});

// 3. DNS Lookup Test
console.log('\nTesting DNS (google.com)...');
dns.lookup('google.com', (err, address, family) => {
    if (err) {
        console.error('DNS Lookup FAILED ❌:', err.code);
        return;
    }
    console.log('DNS Lookup Success ✅:', address);

    // 4. HTTPS Connection Test
    console.log('\nTesting HTTPS Connection (www.google.com)...');
    const req = https.get('https://www.google.com', (res) => {
        console.log('HTTPS Connect Success ✅. Status:', res.statusCode);
        res.resume(); // consume response
    }).on('error', (e) => {
        console.error('HTTPS Connect FAILED ❌:', e.message);
    });
});
