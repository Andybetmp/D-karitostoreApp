const API_URL = 'http://localhost:8080/api/products';
const BAD_URL = 'http://test.com/img.jpg';
const GOOD_URL = 'https://placehold.co/600x400?text=Product';

async function fixBadData() {
    try {
        console.log("1. Fetching all products...");
        const res = await fetch(`${API_URL}?page=0&size=100`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

        const data = await res.json();
        const products = data.content || data; // Handle Page vs List response

        console.log(`   -> Found ${products.length} products.`);

        const badProduct = products.find(p => p.img === BAD_URL);

        if (badProduct) {
            console.log(`2. Found product with bad image: ID=${badProduct.id}, Title="${badProduct.title}"`);

            const updatePayload = {
                ...badProduct,
                img: GOOD_URL
            };

            const updateRes = await fetch(`${API_URL}/${badProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            if (updateRes.ok) {
                console.log("   -> SUCCESS: Product image updated to valid URL.");
            } else {
                console.error(`   -> FAILED: Could not update product. Status: ${updateRes.status}`);
            }

        } else {
            console.log("2. No products found with the specific bad URL. The error might come from somewhere else or data was already fixed.");

            // Optional: Check for other suspiciously short or invalid URLs?
            // For now, only targeting the precise reported one.
        }

    } catch (err) {
        console.error("Script failed:", err.message);
    }
}

fixBadData();
