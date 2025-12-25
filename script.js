async function placeOrder() {
    if (cart.length === 0) {
        showNotification('कृपया पहले कुछ उत्पाद कार्ट में डालें!', 'error');
        return;
    }

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();

    if (!name || !phone || !address) {
        showNotification('कृपया सभी विवरण भरें!', 'error');
        return;
    }

    if (phone.length < 10) {
        showNotification('कृपया सही फोन नंबर डालें!', 'error');
        return;
    }

    // Create order object
    const order = {
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            unit: item.unit,
            quantity: item.quantity,
            total: item.price * item.quantity
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    try {
        // Send to backend
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        const result = await response.json();

        if (result.success) {
            showNotification('✅ ऑर्डर सफलतापूर्वक दिया गया!', 'success');

            const orderMessage = `
                धन्यवाद ${name}!
                
                📦 ऑर्डर ID: ${result.order.orderId}
                💰 कुल राशि: ₹${order.totalAmount}
                📞 हम जल्द ही आपसे संपर्क करेंगे!
            `;

            alert(orderMessage);

            // Clear form and cart
            cart = [];
            localStorage.setItem('dairy_cart', JSON.stringify(cart));

            document.getElementById('customerName').value = '';
            document.getElementById('customerPhone').value = '';
            document.getElementById('customerAddress').value = '';

            // Update display
            loadProducts();
            updateCartDisplay();

            // Send WhatsApp notification
            sendOrderNotification(result.order);
        }
    } catch (error) {
        console.error('Backend error:', error);
        // Fallback to localStorage
        fallbackSaveOrder(order, name, phone, address);
    }
}

// Fallback function if backend fails
function fallbackSaveOrder(order, name, phone, address) {
    const orderId = 'DD' + Date.now();
    const fullOrder = {
        ...order,
        orderId: orderId,
        status: 'नया ऑर्डर',
        date: new Date().toLocaleString('hi-IN')
    };

    orders.push(fullOrder);
    localStorage.setItem('dairy_orders', JSON.stringify(orders));

    showNotification('✅ ऑर्डर local storage में save हो गया!', 'success');

    const orderMessage = `
        धन्यवाद ${name}!
        
        📦 ऑर्डर ID: ${orderId}
        💰 कुल राशि: ₹${order.totalAmount}
        📞 हम जल्द ही आपसे संपर्क करेंगे!
    `;

    alert(orderMessage);

    // Clear form and cart
    cart = [];
    localStorage.setItem('dairy_cart', JSON.stringify(cart));

    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';

    loadProducts();
    updateCartDisplay();
}