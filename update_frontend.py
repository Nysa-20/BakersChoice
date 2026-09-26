import re

with open('templates/index_old.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Cakes body
content = re.sub(
    r'(<div id="cake" class="page">.*?<div class="page-header">.*?</div>).*?(</div>\s*<!-- COOKIES & MUFFINS -->)',
    r'\1\n        <div class="page-body" id="category-1-container">\n            <div style="text-align:center; padding: 40px; color:rgba(28,15,10,0.5);">Loading signature cakes...</div>\n        </div>\n    \2',
    content,
    flags=re.DOTALL
)

# Replace Cookies & Muffins body
content = re.sub(
    r'(<div id="cookmuf" class="page">.*?<div class="page-header">.*?</div>).*?(</div>\s*<!-- BREADS & OTHERS -->)',
    r'\1\n        <div class="page-body" id="category-2-container">\n            <div style="text-align:center; padding: 40px; color:rgba(28,15,10,0.5);">Loading cookies & muffins...</div>\n        </div>\n    \2',
    content,
    flags=re.DOTALL
)

# Replace Breads body
content = re.sub(
    r'(<div id="breads" class="page">.*?<div class="page-header">.*?</div>).*?(</div>\s*<!-- BILLING -->)',
    r'\1\n        <div class="page-body" id="category-3-container">\n            <div style="text-align:center; padding: 40px; color:rgba(28,15,10,0.5);">Loading breads...</div>\n        </div>\n    \2',
    content,
    flags=re.DOTALL
)

# Replace Javascript
js_script = """
<script>
let productsData = [];
let prices = {};
let names = {};

let billNo = Math.floor(Math.random()*8999)+1000;

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    document.getElementById('rDate').textContent = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
});

async function fetchProducts() {
    try {
        const res = await fetch('/api/products/');
        productsData = await res.json();
        
        productsData.forEach(p => {
            prices[p.id] = p.price;
            names[p.id] = p.name;
        });

        renderCategory(1, 'category-1-container', 'Signature Cakes');
        renderCategory(2, 'category-2-container', 'Cookies & Muffins');
        renderCategory(3, 'category-3-container', 'Breads & Others');
    } catch (e) {
        console.error("Failed to fetch products", e);
    }
}

function renderCategory(categoryId, containerId, sectionLabel) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
    const items = productsData.filter(p => p.category_id === categoryId);
    
    let html = `<div class="section-label">${sectionLabel}</div>`;
    html += '<div class="product-grid">';
    items.forEach(p => {
        html += `
        <div class="product-card">
            <div class="product-img-wrap"><img class="product-img" src="${p.image_url || '/static/images/placeholder.jpg'}" alt="${p.name}" onerror="this.parentElement.style.height='4px'"></div>
            <div class="product-info">
                <div>
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">₹${p.price}</div>
                </div>
                <div class="qty-control">
                    <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
                    <input class="qty-input" type="number" id="prod-${p.id}" value="0" min="0" onchange="liveUpdate()">
                    <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
                </div>
            </div>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const navId = 'nav-' + id;
    const nav = document.getElementById(navId);
    if (nav) nav.classList.add('active');
    window.scrollTo(0,0);
    if (id === 'bill') refreshReceipt();
}

function changeQty(id, delta) {
    const el = document.getElementById(`prod-${id}`);
    if (!el) return;
    el.value = Math.max(0, (parseInt(el.value)||0) + delta);
    liveUpdate();
}

function liveUpdate() {
    if (document.getElementById('bill').classList.contains('active')) refreshReceipt();
}

function refreshReceipt() {
    const name = document.getElementById('custName').value || '—';
    const phone = document.getElementById('custPhone').value || '—';
    document.getElementById('rName').textContent = name;
    document.getElementById('rPhone').textContent = phone;
    document.getElementById('rBillNo').textContent = 'Bill #' + billNo;

    let subtotal = 0, items = [];
    Object.keys(prices).forEach(id => {
        const el = document.getElementById(`prod-${id}`);
        if (!el) return;
        const qty = parseInt(el.value)||0;
        if (qty > 0) { const cost = qty*prices[id]; subtotal+=cost; items.push({id,qty,cost}); }
    });

    const receiptEl = document.getElementById('rItems');
    const summaryEl = document.getElementById('orderSummary');

    if (items.length === 0) {
        receiptEl.innerHTML = '<div class="receipt-empty">Your order will appear here</div>';
        summaryEl.innerHTML = '<div style="color:rgba(28,15,10,0.28);font-size:13px;font-style:italic;padding:18px 0;text-align:center;">No items added yet — browse the menu to add items.</div>';
    } else {
        receiptEl.innerHTML = items.map(i=>`<div class="receipt-line"><span>${names[i.id]} ×${i.qty}</span><span>₹${i.cost.toFixed(2)}</span></div>`).join('');
        summaryEl.innerHTML = items.map(i=>`<div class="order-item-row"><span class="order-item-name">${names[i.id]}</span><span style="color:rgba(28,15,10,0.35);font-size:12px;">×${i.qty}</span><span class="order-item-price">₹${i.cost.toFixed(2)}</span></div>`).join('');
    }

    const tax = subtotal*0.18, total = subtotal+tax;
    document.getElementById('rSubtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('rTax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('rTotal').textContent = `₹${total.toFixed(2)}`;
}

function clearAll() {
    Object.keys(prices).forEach(id => { const el = document.getElementById(`prod-${id}`); if(el) el.value=0; });
    billNo = Math.floor(Math.random()*8999)+1000;
    document.getElementById('custName').value = '';
    document.getElementById('custPhone').value = '';
    refreshReceipt();
    showToast('Order cleared');
}

async function generateAndSave() {
    const name = document.getElementById('custName').value || 'Customer';
    const phone = document.getElementById('custPhone').value || '—';
    let items = [];

    Object.keys(prices).forEach(id => {
        const el = document.getElementById(`prod-${id}`);
        if (!el) return;
        const qty = parseInt(el.value)||0;
        if (qty > 0) {
            items.push({
                product_id: parseInt(id),
                quantity: qty,
                price_at_time_of_order: prices[id]
            });
        }
    });

    if (items.length === 0) { showToast('Please add items to generate a bill'); return; }

    const payload = {
        customer_name: name,
        customer_phone: phone,
        status: "Completed",
        items: items
    };

    try {
        const res = await fetch('/api/orders/', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            const data = await res.json();
            showToast('✓ Order placed successfully (ID: ' + data.id + ')');
            billNo = Math.floor(Math.random()*8999)+1000;
            setTimeout(() => {
                clearAll();
            }, 1000);
        } else {
            showToast('Error placing order');
        }
    } catch(e) {
        showToast('Server error placing order');
    }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 3200);
}
</script>
"""

content = re.sub(r'<script>.*?</script>', js_script, content, flags=re.DOTALL)

with open('templates/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
