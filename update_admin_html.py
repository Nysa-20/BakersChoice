import re

with open('templates/admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a status dropdown to the table rows and WebSocket connection in JS
js_script = """
<script>
let token = localStorage.getItem('adminToken');
let ws = null;

if (token) {
    showDashboard();
}

async function login() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    const fd = new URLSearchParams();
    fd.append('username', u);
    fd.append('password', p);

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: fd
    });

    if (res.ok) {
        const data = await res.json();
        token = data.access_token;
        localStorage.setItem('adminToken', token);
        showDashboard();
    } else {
        document.getElementById('login-err').style.display = 'block';
    }
}

function logout() {
    token = null;
    localStorage.removeItem('adminToken');
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    if(ws) ws.close();
}

function showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadProducts();
    loadOrders();
    connectWebSocket();
}

function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}/ws/admin`);
    
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.type === "NEW_ORDER") {
            const o = data.order;
            const tbody = document.getElementById('order-list');
            const row = document.createElement('tr');
            row.id = `order-${o.id}`;
            row.style.backgroundColor = '#e8f5e9'; // Highlight new order
            row.innerHTML = buildOrderRow(o);
            tbody.insertBefore(row, tbody.firstChild);
            setTimeout(() => { row.style.backgroundColor = ''; }, 3000);
        } else if (data.type === "UPDATE_ORDER") {
            const o = data.order;
            const sel = document.getElementById(`status-${o.id}`);
            if (sel) sel.value = o.status;
        }
    };
}

function buildOrderRow(o) {
    const statuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    let sel = `<select id="status-${o.id}" onchange="updateOrderStatus(${o.id}, this.value)">`;
    statuses.forEach(s => {
        sel += `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`;
    });
    sel += `</select>`;
    
    return `
        <td>${o.id}</td>
        <td>${o.customer_name}</td>
        <td>${o.customer_phone || '-'}</td>
        <td>₹${o.total_amount.toFixed(2)}</td>
        <td>${sel}</td>
    `;
}

async function loadProducts() {
    const res = await fetch('/api/products/');
    const prods = await res.json();
    const tbody = document.getElementById('product-list');
    tbody.innerHTML = prods.map(p => `<tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>₹${p.price}</td>
        <td><button class="btn" onclick="deleteProduct(${p.id})">Delete</button></td>
    </tr>`).join('');
}

async function loadOrders() {
    const res = await fetch('/api/orders/');
    if(res.ok) {
        const orders = await res.json();
        const tbody = document.getElementById('order-list');
        tbody.innerHTML = orders.map(o => `<tr id="order-${o.id}">${buildOrderRow(o)}</tr>`).join('');
    }
}

async function updateOrderStatus(orderId, status) {
    const res = await fetch(`/api/orders/${orderId}/status?status=${status}`, {
        method: 'PATCH',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if(!res.ok) {
        alert('Failed to update order status');
    }
}

async function addProduct() {
    const payload = {
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        image_url: document.getElementById('p-img').value || null,
        category_id: parseInt(document.getElementById('p-category').value)
    };
    const res = await fetch('/api/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(payload)
    });
    if (res.ok) {
        alert("Product added!");
        loadProducts();
    } else {
        alert("Failed to add. Ensure you are admin.");
    }
}

async function deleteProduct(id) {
    if(!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch('/api/products/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
        loadProducts();
    } else {
        alert("Failed to delete. Ensure you are admin.");
    }
}
</script>
"""

content = re.sub(r'<script>.*?</script>', js_script, content, flags=re.DOTALL)

with open('templates/admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
