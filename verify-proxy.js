
async function verify() {
    console.log('Fetching from Local Proxy...');
    try {
        const res = await fetch('http://localhost:3000/api/proxy/talents');
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Success! Received Mock Data:');
        console.log('Total Items:', data.data?.total || data.total);
        console.log('First Item:', data.data?.items?.[0]?.display_name || data.data?.[0]?.display_name);
    } catch (e) {
        console.error('Proxy Verification Failed:', e);
    }
}
verify();
