// js/app.js

// Auth logic
function getCurrentUser() {
    const username = localStorage.getItem('vp_current_user');
    if (username) {
        return DB.getUser(username);
    }
    return null;
}

function login(username) {
    const user = DB.getUser(username);
    if (user) {
        localStorage.setItem('vp_current_user', username);
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('vp_current_user');
    window.location.href = 'index.html';
}

// Require Auth
function requireAuth() {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
    }
}

// Redirect if already logged in
function requireGuest() {
    if (getCurrentUser()) {
        window.location.href = 'dashboard.html';
    }
}

// Render dynamic navbar
function renderNavbar() {
    const user = getCurrentUser();
    const navContainer = document.getElementById('navbar-container');

    if (!navContainer) return;

    let unreadCount = 0;
    if (user) {
        unreadCount = DB.getNotifications(user.username).filter(n => !n.read).length;
    }

    const unreadBadge = unreadCount > 0 ? `<span class="badge badge-pending">${unreadCount}</span>` : '';

    navContainer.innerHTML = `
        <nav class="navbar">
            <a href="index.html" class="logo">📦 VIT Parcel</a>
            <div class="nav-links">
                ${user ? `
                    <a href="dashboard.html">Dashboard</a>
                    <a href="browse-posts.html">Browse</a>
                    <a href="create-post.html">Post Pickup</a>
                    <a href="notifications.html">Notifs ${unreadBadge}</a>
                    <a href="profile.html">Profile</a>
                    <button class="btn btn-outline" onclick="logout()">Logout</button>
                ` : `
                    <a href="faq.html">FAQ</a>
                    <a href="about.html">About</a>
                    <a href="login.html" class="btn btn-outline">Log in</a>
                    <a href="register.html" class="btn btn-primary">Sign up</a>
                `}
            </div>
        </nav>
    `;
}

// Render footer
function renderFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer>
            <p>&copy; ${new Date().getFullYear()} VIT Parcel. Created for syllabus assignment.</p>
            <div style="margin-top: 10px;">
                <a href="about.html" style="margin: 0 10px;">About</a>
                <a href="contact.html" style="margin: 0 10px;">Contact</a>
                <a href="faq.html" style="margin: 0 10px;">FAQ</a>
            </div>
        </footer>
    `;
}

// Helper to format Date
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' on ' + date.toLocaleDateString();
}

// Helper to get relative time wrapper
function getRelativeTime(timestamp) {
    const now = Date.now();
    const diffInMs = now - timestamp;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return diffInDays + (diffInDays === 1 ? ' day ago' : ' days ago');
    if (diffInHours > 0) return diffInHours + (diffInHours === 1 ? ' hr ago' : ' hrs ago');
    if (diffInMins > 0) return diffInMins + (diffInMins === 1 ? ' min ago' : ' mins ago');
    return 'Just now';
}

// On document load
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
});


const VIT_BLOCKS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'
];

function populateBlockOptions(selectId, showAllOpt = false) {
    const select = document.getElementById(selectId);
    if (!select) return;

    let optionsHtml = showAllOpt ? '<option value="all">All Blocks</option>' : '<option value="">Select Block</option>';

    VIT_BLOCKS.forEach(b => {
        optionsHtml += `<option value="block-${b.toLowerCase()}">Block ${b}</option>`;
    });

    select.innerHTML = optionsHtml;
}
