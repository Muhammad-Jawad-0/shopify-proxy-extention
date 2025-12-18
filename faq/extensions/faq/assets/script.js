async function getProduct(shop) {
    const response = await fetch(`https://${shop}/apps/FAQ/question-get`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data.data
}

window.addEventListener('DOMContentLoaded', async () => {
    const shop = Shopify.shop;
    const CONTAINER = document.getElementById('CONTAINER');
    console.log('DOM fully loaded and parsed');
    try {
        const FAQ = await getProduct(shop);

        if (!Array.isArray(FAQ)) {
            console.error('FAQ is not an array', FAQ);
            return;
        }

        const html = FAQ
            .map(faq => `
                <div class="faq-item">
                    <h3>${faq.question}......</h3>
                    <p>${faq.answer}</p>
                </div>
            `)
            .join('');

        CONTAINER.innerHTML = html;
    } catch (error) {
        console.error('Failed to load FAQs:', error);
    }
})