import re

with open('templates/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Account Nav Item
nav_account_html = """
    <button class="nav-item" onclick="showPage('account')" id="nav-account"><span class="nav-icon">👤</span><span class="nav-label">My Account</span></button>
    <button class="nav-item nav-bill-btn" onclick="showPage('bill')" id="nav-bill"><span class="nav-icon">🧾</span><span class="nav-label">Billing</span></button>
"""
content = re.sub(r'<button class="nav-item nav-bill-btn".*?</button>', nav_account_html, content, flags=re.DOTALL)

# Add Account Page
account_page_html = """
    <!-- ACCOUNT -->
    <div id="account" class="page">
        <div class="page-header">
            <button class="back-btn" onclick="showPage('home')">← Back to Home</button>
            <h1 class="page-title"><em>My</em> Account</h1>
            <p class="page-subtitle">Manage your profile and orders</p>
        </div>
        <div class="page-body">
            <div id="auth-unlogged">
                <h2 style="font-family:'Cormorant Garamond',serif; font-size:28px;">Login or Register</h2>
                <div style="display:flex; gap: 20px; margin-top:20px; max-width:800px;">
                    <div style="flex:1; background:var(--warm-white); padding:20px; border-radius:8px; border:1px solid rgba(28,15,10,0.1);">
                        <h3 style="margin-bottom:10px;">Login</h3>
                        <input type="text" id="login-user" placeholder="Username" class="form-input" style="width:100%; margin:10px 0;">
                        <input type="password" id="login-pass" placeholder="Password" class="form-input" style="width:100%; margin:10px 0;">
                        <button class="btn-primary" onclick="customerLogin()">Login</button>
                    </div>
                    <div style="flex:1; background:var(--warm-white); padding:20px; border-radius:8px; border:1px solid rgba(28,15,10,0.1);">
                        <h3 style="margin-bottom:10px;">Register</h3>
                        <input type="text" id="reg-user" placeholder="Username" class="form-input" style="width:100%; margin:5px 0;">
                        <input type="email" id="reg-email" placeholder="Email" class="form-input" style="width:100%; margin:5px 0;">
                        <input type="password" id="reg-pass" placeholder="Password" class="form-input" style="width:100%; margin:5px 0;">
                        <input type="text" id="reg-phone" placeholder="Phone" class="form-input" style="width:100%; margin:5px 0;">
                        <input type="text" id="reg-addr" placeholder="Address" class="form-input" style="width:100%; margin:5px 0;">
                        <button class="btn-primary" onclick="customerRegister()">Register</button>
                    </div>
                </div>
            </div>
            <div id="auth-logged" style="display:none; max-width:800px;">
                <div style="background:var(--warm-white); padding:30px; border-radius:8px; border:1px solid rgba(28,15,10,0.1);">
                    <h2 style="font-family:'Cormorant Garamond',serif; font-size:32px;">Welcome back, <span id="acc-name" style="color:var(--rust)"></span>!</h2>
                    <p style="font-size:18px; margin-top:10px;">Loyalty Points: <strong id="acc-points" style="color:var(--gold); font-size:24px;">0</strong> 🍯</p>
                    <button class="btn-primary btn-danger" style="width:auto; margin-top:20px;" onclick="customerLogout()">Logout</button>
                </div>
                <h3 style="font-family:'Cormorant Garamond',serif; font-size:28px; margin-top:40px; margin-bottom:15px;">My Recent Orders</h3>
                <div id="acc-orders"></div>
            </div>
        </div>
    </div>

    <!-- BILLING -->
"""
content = re.sub(r'<!-- BILLING -->', account_page_html, content)

# Update Javascript
js_additions = """
let customerToken = localStorage.getItem('customerToken');

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    document.getElementById('rDate').textContent = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
    if (customerToken) { loadCustomerProfile(); }
});

async function customerLogin() {
    const fd = new URLSearchParams();
    fd.append('username', document.getElementById('login-user').value);
    fd.append('password', document.getElementById('login-pass').value);
    try {
        const res = await fetch('/api/auth/login', { method:'POST', body:fd });
        if(res.ok) {
            const data = await res.json();
            customerToken = data.access_token;
            localStorage.setItem('customerToken', customerToken);
            loadCustomerProfile();
            showToast('Logged in successfully');
        } else { showToast('Login failed'); }
    } catch(e) { showToast('Login error'); }
}

async function customerRegister() {
    const payload = {
        username: document.getElementById('reg-user').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-pass').value,
        phone: document.getElementById('reg-phone').value,
        address: document.getElementById('reg-addr').value,
        role: 'customer'
    };
    try {
        const res = await fetch('/api/auth/register', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(payload)
        });
        if(res.ok) { showToast('Registration successful! Please login.'); }
        else { showToast('Registration failed'); }
    } catch(e) { showToast('Registration error'); }
}

async function loadCustomerProfile() {
    try {
        const res = await fetch('/api/auth/me', { headers:{'Authorization': 'Bearer ' + customerToken} });
        if(res.ok) {
            const user = await res.json();
            document.getElementById('auth-unlogged').style.display = 'none';
            document.getElementById('auth-logged').style.display = 'block';
            document.getElementById('acc-name').textContent = user.username;
            document.getElementById('acc-points').textContent = user.loyalty_points;
            if(user.phone) document.getElementById('custPhone').value = user.phone;
            document.getElementById('custName').value = user.username;
            refreshReceipt();
            
            // fetch orders
            const oRes = await fetch('/api/orders/my-orders', { headers:{'Authorization': 'Bearer ' + customerToken} });
            if(oRes.ok) {
                const orders = await oRes.json();
                if(orders.length === 0) {
                    document.getElementById('acc-orders').innerHTML = '<p style="color:rgba(28,15,10,0.5); font-style:italic;">No orders yet.</p>';
                } else {
                    document.getElementById('acc-orders').innerHTML = orders.map(o => 
                        `<div style="background:white; padding:15px; border:1px solid rgba(28,15,10,0.1); margin-bottom:10px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <div style="font-size:12px; color:rgba(28,15,10,0.5);">Order #${o.id}</div>
                                <div style="font-weight:500; font-size:16px;">₹${o.total_amount.toFixed(2)}</div>
                            </div>
                            <div style="background:var(--cream); padding:5px 10px; border-radius:15px; font-size:12px; font-weight:500; color:var(--rust); border:1px solid rgba(166,61,47,0.2);">
                                ${o.status}
                            </div>
                        </div>`
                    ).join('');
                }
            }
        } else { customerLogout(); }
    } catch(e) { customerLogout(); }
}

function customerLogout() {
    customerToken = null;
    localStorage.removeItem('customerToken');
    document.getElementById('auth-unlogged').style.display = 'block';
    document.getElementById('auth-logged').style.display = 'none';
    document.getElementById('custName').value = '';
    document.getElementById('custPhone').value = '';
    showToast('Logged out');
}
"""

content = re.sub(r'document\.addEventListener\("DOMContentLoaded", \(\) => {.*?}\);', js_additions, content, flags=re.DOTALL)

# Update generateAndSave Headers
headers_old = "headers: { 'Content-Type': 'application/json' },"
headers_new = """headers: { 
                'Content-Type': 'application/json',
                ...(customerToken && { 'Authorization': 'Bearer ' + customerToken })
            },"""
content = content.replace(headers_old, headers_new)

# Update generateAndSave Success to reload points
success_old = "billNo = Math.floor(Math.random()*8999)+1000;"
success_new = """billNo = Math.floor(Math.random()*8999)+1000;
            if (customerToken) { loadCustomerProfile(); }"""
content = content.replace(success_old, success_new)

with open('templates/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
