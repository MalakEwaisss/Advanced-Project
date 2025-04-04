// Sample user data (in a real app, this would come from an API)
let users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', password: 'password123' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'student', password: 'password123' },
    { id: '3', name: 'Acme Corp', email: 'acme@example.com', role: 'organization', password: 'password123' },
    { id: '4', name: 'Mike Johnson', email: 'mike@example.com', role: 'student', password: 'password123' },
    { id: '5', name: 'Tech University', email: 'tech@example.com', role: 'organization', password: 'password123' }
];

// DOM Elements
const usersTableBody = document.getElementById('usersTableBody');
const searchInput = document.getElementById('searchInput');
const roleFilter = document.getElementById('roleFilter');
const addUserBtn = document.getElementById('addUserBtn');
const userModal = document.getElementById('userModal');
const deleteModal = document.getElementById('deleteModal');
const userForm = document.getElementById('userForm');
const modalTitle = document.getElementById('modalTitle');
const closeBtns = document.querySelectorAll('.close-btn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// Variables to track state
let currentUserId = null;
let isEditMode = false;

// Initialize the page
function init() {
    renderUsers(users);
    setupEventListeners();
}

// Render users to the table
function renderUsers(usersToRender) {
    usersTableBody.innerHTML = '';
    
    usersToRender.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role}">${capitalizeFirstLetter(user.role)}</span></td>
            <td class="action-btns">
                <button class="btn btn-secondary edit-btn" data-id="${user.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger delete-btn" data-id="${user.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        usersTableBody.appendChild(row);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEditUser);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteUser);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', filterUsers);
    
    // Role filter
    roleFilter.addEventListener('change', filterUsers);
    
    // Add user button
    addUserBtn.addEventListener('click', () => {
        isEditMode = false;
        modalTitle.textContent = 'Add New User';
        userForm.reset();
        document.getElementById('userId').value = '';
        document.getElementById('password').required = true;
        userModal.style.display = 'block';
    });
    
    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            userModal.style.display = 'none';
            deleteModal.style.display = 'none';
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === userModal) {
            userModal.style.display = 'none';
        }
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
    
    // Form submission
    userForm.addEventListener('submit', handleFormSubmit);
    
    // Delete confirmation
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });
}

// Filter users based on search and role
function filterUsers() {
    const searchTerm = searchInput.value.toLowerCase();
    const role = roleFilter.value;
    
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm) ||
            user.id.toLowerCase().includes(searchTerm);
        
        const matchesRole = role === 'all' || user.role === role;
        
        return matchesSearch && matchesRole;
    });
    
    renderUsers(filteredUsers);
}

// Handle edit user
function handleEditUser(e) {
    isEditMode = true;
    modalTitle.textContent = 'Edit User';
    const userId = e.target.getAttribute('data-id');
    const user = users.find(u => u.id === userId);
    
    if (user) {
        document.getElementById('userId').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role;
        document.getElementById('password').required = false;
        
        userModal.style.display = 'block';
    }
}

// Handle delete user
function handleDeleteUser(e) {
    currentUserId = e.target.getAttribute('data-id');
    deleteModal.style.display = 'block';
}

// Confirm delete
function confirmDelete() {
    users = users.filter(user => user.id !== currentUserId);
    renderUsers(users);
    deleteModal.style.display = 'none';
    currentUserId = null;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    if (isEditMode) {
        // Update existing user
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                name,
                email,
                role,
                ...(password && { password }) // Only update password if provided
            };
        }
    } else {
        // Add new user
        const newUser = {
            id: generateId(),
            name,
            email,
            password,
            role
        };
        users.push(newUser);
    }
    
    renderUsers(users);
    userModal.style.display = 'none';
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to generate ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Initialize the application
init();