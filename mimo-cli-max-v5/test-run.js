// Quick test to see if the app starts
import('./bin/mimo.js').catch(err => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
});
