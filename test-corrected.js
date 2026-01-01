// Test with the CORRECT format: path as query param
const baseUrl = 'https://script.google.com/macros/s/AKfycbyfTsG6zs5KaxdO5FL0_Yr_lSadFOPi6CYedwfLkNOzReyHvH_4TG37Ou0dB9YnRbl5/exec';

async function testCorrectFormat() {
    const testUrl = baseUrl + '?path=/api/talents&verified_only=false';
    console.log('Testing CORRECTED format:', testUrl);

    try {
        const res = await fetch(testUrl, {
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        console.log('\n--- RESULT ---');
        console.log('STATUS:', res.status);
        console.log('REDIRECTED:', res.redirected);
        console.log('FINAL URL:', res.url.substring(0, 100) + '...');

        const text = await res.text();

        try {
            const json = JSON.parse(text);
            console.log('\n✅ SUCCESS! Valid JSON Response');
            console.log('Response keys:', Object.keys(json));
            if (json.data) {
                console.log('Data keys:', Object.keys(json.data));
                console.log('Total items:', json.data.total || json.data.items?.length || 0);
            }
        } catch {
            console.log('\n❌ Failed - Not JSON');
            console.log('Response preview:', text.substring(0, 300));
        }

    } catch (e) {
        console.error('\n❌ ERROR:', e.message);
    }
}

testCorrectFormat();
