
const url = 'https://script.google.com/macros/s/AKfycbyfTsG6zs5KaxdO5FL0_Yr_lSadFOPi6CYedwfLkNOzReyHvH_4TG37Ou0dB9YnRbl5/exec/api/talents?verified_only=false';

async function test() {
    try {
        const res = await fetch(url, {
            redirect: 'follow',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        console.log('--- RESULT ---');
        console.log('STATUS:', res.status);
        console.log('REDIRECTED:', res.redirected);
        console.log('FINAL URL:', res.url);

        if (res.url.includes('accounts.google.com')) {
            console.log('DIAGNOSIS: LOGIN REQUIRED (Permission Issue)');
        } else if (res.url.includes('googleusercontent.com')) {
            console.log('DIAGNOSIS: SCRIPT EXECUTED (Script returned HTML)');
        } else {
            console.log('DIAGNOSIS: UNKNOWN');
        }

        const text = await res.text();
        if (text.includes('<!DOCTYPE html>')) {
            const titleMatch = text.match(/<title>(.*?)<\/title>/);
            console.log('PAGE TITLE:', titleMatch ? titleMatch[1] : 'No Title');
        }

    } catch (e) {
        console.error('ERROR:', e);
    }
}

test();
