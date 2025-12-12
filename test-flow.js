const API_URL = 'http://localhost:8080/api';

async function testFlow() {
    try {
        console.log("1. Creating Test Product...");
        const prodRes = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: "Test Node Product " + Date.now(),
                description: "Test Desc",
                price: 100,
                img: "http://test.com/img.jpg"
            })
        });

        if (!prodRes.ok) throw new Error(`Product Create Failed: ${prodRes.status}`);
        const product = await prodRes.json();
        console.log("   -> Created Product ID:", product.id);

        console.log("2. Creating Inventory...");
        const invRes = await fetch(`${API_URL}/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: product.id,
                stock: 50,
                reservedStock: 0
            })
        });

        if (!invRes.ok) throw new Error(`Inventory Create Failed: ${invRes.status}`);
        console.log("   -> Inventory Created Success");

        console.log("3. Verifying Stock...");
        const stockRes = await fetch(`${API_URL}/inventory/${product.id}/available?quantity=1`);
        const isAvailable = await stockRes.json();
        console.log("   -> Is Stock Available?", isAvailable);

        console.log("4. Simulating Deduct (Order)...");
        const deductRes = await fetch(`${API_URL}/inventory/${product.id}/deduct?quantity=1`, {
            method: 'POST'
        });

        if (!deductRes.ok) throw new Error(`Deduct Failed: ${deductRes.status}`);
        console.log("   -> Deduct Success");

    } catch (err) {
        console.error("Test Failed:", err.message);
    }
}

testFlow();
