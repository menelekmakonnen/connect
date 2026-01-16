// Test the BASE /exec URL without any path segments
// Test the BASE /exec URL with a valid API path
const baseUrl = 'https://script.google.com/macros/s/AKfycbyfTsG6zs5KaxdO5FL0_Yr_lSadFOPi6CYedwfLkNOzReyHvH_4TG37Ou0dB9YnRbl5/exec?path=/api/talents';

async function testBase() {
    console.log('Testing BASE URL (no /api path):', baseUrl);
    try {
        const res = await fetch(baseUrl, {
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        console.log('--- RESULT ---');
        console.log('STATUS:', res.status);
        console.log('REDIRECTED:', res.redirected);
        console.log('FINAL URL:', res.url);

        const text = await res.text();
        console.log('\n--- RESPONSE PREVIEW (first 300 chars) ---');
        console.log(text.substring(0, 300));

        // Check if it's JSON
        try {
            const json = JSON.parse(text);
            console.log('\n✅ Valid JSON Response');
            console.log('Data:', json);
        } catch {
            console.log('\n❌ Not JSON - likely HTML error page');
        }

    } catch (e) {
        console.error('ERROR:', e.message);
    }
}

testBase();
