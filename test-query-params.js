// Test Apps Script with QUERY PARAMS instead of path segments
const baseUrl = 'https://script.google.com/macros/s/AKfycbyfTsG6zs5KaxdO5FL0_Yr_lSadFOPi6CYedwfLkNOzReyHvH_4TG37Ou0dB9YnRbl5/exec';

async function testQueryParams() {
    // Try passing the path as a query parameter
    const testUrl = baseUrl + '?path=/api/talents&verified_only=false';
    console.log('Testing with query params:', testUrl);

    try {
        const res = await fetch(testUrl, {
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        console.log('STATUS:', res.status);
        console.log('REDIRECTED:', res.redirected);

        const text = await res.text();
        console.log('\nRESPONSE:');
        console.log(text.substring(0, 500));

        try {
            const json = JSON.parse(text);
            console.log('\n✅ Valid JSON!');
            console.log('Keys:', Object.keys(json));
        } catch {
            console.log('\n❌ Not JSON');
        }

    } catch (e) {
        console.error('ERROR:', e.message);
    }
}

testQueryParams();
