async function getData(shop) {
    const response = await fetch(`https://${shop}/apps/extensions/question-get`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data.data
}

window.addEventListener("DOMContentLoaded", async () => {
    const shop = Shopify.shop;

    console.log(shop, "<<<< shop")
    const container = document.getElementById("container");
    console.log('DOM fully loaded and parsed');

    try {
        const FAQ = await getData(shop);

        if (!Array.isArray(FAQ)) {
            console.error("FAQ is not a array" , FAQ)
            return
        }

        const html = FAQ
            .map(faq => `
                <div class="faq-item">
                    <h3>${faq.question}......</h3>
                    <p>${faq.answer}</p>
                </div>
            `)
            .join('');

        container.innerHTML = html
    } catch (error) {
        console.error('Failed to load FAQs:', error)
    }

})