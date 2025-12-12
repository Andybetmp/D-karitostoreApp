const API_URL = 'http://localhost:8080/api/orders/stats';

async function verifyStats() {
    try {
        console.log("1. Testing Today Stats...");
        const todayRes = await fetch(`${API_URL}/today`);
        if (!todayRes.ok) throw new Error(`Today Stats Failed: ${todayRes.status}`);
        const today = await todayRes.json();
        console.log("   -> Today Stats:", today);

        console.log("2. Testing Summary Stats...");
        const summaryRes = await fetch(`${API_URL}/summary`);
        if (!summaryRes.ok) throw new Error(`Summary Stats Failed: ${summaryRes.status}`);
        const summary = await summaryRes.json();
        console.log("   -> Summary Stats:", summary);

        console.log("3. Testing Top Products...");
        const topRes = await fetch(`${API_URL}/top-products`);
        if (!topRes.ok) throw new Error(`Top Products Failed: ${topRes.status}`);
        const top = await topRes.json();
        console.log("   -> Top Products:", top);

    } catch (err) {
        console.error("Verification Failed:", err.message);
    }
}

verifyStats();
