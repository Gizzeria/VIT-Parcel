// js/db.js

// Initialize data if not existing
function initDB() {
    if (!localStorage.getItem('vp_akshit_demo')) {
        localStorage.clear();
        localStorage.setItem('vp_akshit_demo', 'true');
    }
    if (!localStorage.getItem('vp_users')) {
        const dummyUsers = [
            { username: '24BCE2498', name: 'Akshit Gupta', block: 'block-a', phone: '9999999999' },
            { username: 'test_user2', name: 'Jane Smith', block: 'block-b', phone: '8888888888' }
        ];
        localStorage.setItem('vp_users', JSON.stringify(dummyUsers));
    }
    if (!localStorage.getItem('vp_posts')) {
        const dummyPosts = [
            { id: 1, authorId: '24BCE2498', authorName: 'Akshit Gupta', block: 'block-a', pickupTime: '18:30', notes: 'Going to Mens Hostel Main Gate', status: 'pending', timestamp: Date.now() },
            { id: 2, authorId: 'test_user2', authorName: 'Jane Smith', block: 'block-b', pickupTime: '14:00', notes: 'Picking up from Food Court gate', status: 'pending', timestamp: Date.now() - 3600000 }
        ];
        localStorage.setItem('vp_posts', JSON.stringify(dummyPosts));
    }
    if (!localStorage.getItem('vp_requests')) {
        localStorage.setItem('vp_requests', JSON.stringify([]));
    }
    if (!localStorage.getItem('vp_notifications')) {
        localStorage.setItem('vp_notifications', JSON.stringify([]));
    }
}

// Low-level helper functions for localStorage
function getTable(name) {
    try {
        return JSON.parse(localStorage.getItem('vp_' + name) || '[]');
    } catch (e) {
        return [];
    }
}

function setTable(name, data) {
    localStorage.setItem('vp_' + name, JSON.stringify(data));
}

// Entity specific helpers
const DB = {
    getUsers: () => getTable('users'),
    getUser: (username) => getTable('users').find(u => u.username === username),
    saveUser: (user) => {
        const users = getTable('users');
        users.push(user);
        setTable('users', users);
    },

    getPosts: () => getTable('posts'),
    getPost: (id) => getTable('posts').find(p => p.id == id),
    savePost: (post) => {
        const posts = getTable('posts');
        if (!post.id) post.id = Date.now() + Math.floor(Math.random() * 1000);
        posts.push(post);
        setTable('posts', posts);
    },
    updatePost: (updatedPost) => {
        let posts = getTable('posts');
        posts = posts.map(p => p.id == updatedPost.id ? updatedPost : p);
        setTable('posts', posts);
    },

    getRequests: () => getTable('requests'),
    getRequestsByUser: (username) => getTable('requests').filter(r => r.requesterId === username),
    getRequestsByPost: (postId) => getTable('requests').filter(r => r.postId == postId),
    saveRequest: (request) => {
        const requests = getTable('requests');
        if (!request.id) request.id = Date.now();
        requests.push(request);
        setTable('requests', requests);
    },
    updateRequest: (updatedReq) => {
        let requests = getTable('requests');
        requests = requests.map(r => r.id == updatedReq.id ? updatedReq : r);
        setTable('requests', requests);
    },

    getNotifications: (username) => getTable('notifications').filter(n => n.targetUser === username),
    addNotification: (targetUser, message, type = 'info', link = '#') => {
        const notifs = getTable('notifications');
        notifs.push({
            id: Date.now(),
            targetUser,
            message,
            type,
            link,
            read: false,
            timestamp: Date.now()
        });
        setTable('notifications', notifs);
    },
    markNotificationsRead: (username) => {
        let notifs = getTable('notifications');
        notifs = notifs.map(n => {
            if (n.targetUser === username) n.read = true;
            return n;
        });
        setTable('notifications', notifs);
    }
};

// Initialize on script load
initDB();
