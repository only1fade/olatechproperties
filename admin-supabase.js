// Admin Panel JavaScript with Supabase Integration
class AdminPanel {
    constructor() {
        this.supabase = window.supabaseClient;
        this.products = [];
        this.checkAuth();
        this.init();
    }

    async checkAuth() {
        // Simple authentication check
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
        if (!isAuthenticated) {
            const password = prompt('Enter admin password:');
            if (password === 'admin123') {
                sessionStorage.setItem('adminAuthenticated', 'true');
            } else {
                alert('Access denied. Incorrect password.');
                window.location.href = 'index.html';
                return;
            }
        }
    }

    async init() {
        console.log('Initializing admin panel...');
        
        // Initialize database connection
        if (!this.supabase) {
            console.error('Supabase client not initialized. Please check your configuration.');
            alert('Supabase connection failed! Check console for details.');
            this.showError('Database connection failed. Please check configuration.');
            return;
        }
        
        console.log('Supabase client initialized:', this.supabase);

        // Test Supabase connection
        try {
            console.log('Testing Supabase connection...');
            const { data, error } = await this.supabase.from('products').select('count', { count: 'exact', head: true });
            if (error) {
                console.error('Supabase connection test failed:', error);
                alert(`Supabase connection failed: ${error.message}. Please make sure you've created the products table in your Supabase dashboard.`);
                return;
            }
            console.log('Supabase connection successful! Product count:', data);
        } catch (testError) {
            console.error('Supabase connection test error:', testError);
            alert(`Database connection test failed: ${testError.message}`);
            return;
        }

        // Initialize database
        const dbReady = await window.supabaseService.initializeDatabase();
        if (!dbReady) {
            this.showError('Database not ready. Please create the products table.');
            return;
        }

        this.setupEventListeners();
        await this.loadProducts();
        this.updateDashboard();
        this.displayProducts();
        this.setupImageUpload();
        this.setupRealTimeUpdates();
        
        console.log('Admin panel initialization complete!');
    }

    setupEventListeners() {
        // Product form submission
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });

        // Price input formatting
        document.getElementById('productPrice').addEventListener('input', (e) => {
            this.formatPrice(e.target);
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.showTab(tabId);
            });
        });
    }

    setupImageUpload() {
        const imageUpload = document.querySelector('.image-upload');
        const imageInput = document.getElementById('imageInput');
        const imagePreview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');

        // Drag and drop functionality
        imageUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUpload.classList.add('dragover');
        });

        imageUpload.addEventListener('dragleave', () => {
            imageUpload.classList.remove('dragover');
        });

        imageUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUpload.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0]);
            }
        });

        // File input change
        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });
    }

    setupRealTimeUpdates() {
        // Subscribe to real-time product changes
        this.subscription = window.supabaseService.subscribeToProductChanges((payload) => {
            console.log('Real-time update:', payload);
            this.loadProducts();
            this.updateDashboard();
            this.displayProducts();
        });
    }

    handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showError('Image file size must be less than 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.getElementById('previewImg');
            const imagePreview = document.getElementById('imagePreview');
            
            previewImg.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    formatPrice(input) {
        let value = input.value.replace(/[^\d.]/g, '');
        
        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        // Limit to 2 decimal places
        if (parts.length === 2 && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].substring(0, 2);
        }
        
        // Add dollar sign
        if (value) {
            input.value = '$' + value;
        }
    }

    async loadProducts() {
        try {
            this.products = await window.supabaseService.getAllProducts();
            console.log('Loaded products from Supabase:', this.products.length);
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Failed to load products from database.');
        }
    }

    async addProduct() {
        const form = document.getElementById('productForm');
        const formData = new FormData(form);
        const previewImg = document.getElementById('previewImg');
        
        // Validate required fields
        const name = formData.get('productName').trim();
        const price = formData.get('productPrice').trim();
        const category = formData.get('productCategory');
        
        if (!name || !price || !category) {
            this.showError('Please fill in all required fields.');
            return;
        }

        if (!previewImg.src || previewImg.src === '') {
            this.showError('Please upload a product image.');
            return;
        }

        const productData = {
            name: name,
            price: price,
            category: category,
            description: formData.get('productDescription').trim() || '',
            image: previewImg.src
        };

        try {
            console.log('Adding product to Supabase:', productData);
            
            // Check if this is an edit operation
            const editId = form.dataset.editId;
            
            if (editId) {
                // Update existing product
                console.log('Updating product with ID:', editId);
                const result = await window.supabaseService.updateProduct(editId, productData);
                console.log('Product update result:', result);
                this.showSuccess(`Product "${name}" has been updated successfully!`);
                
                // Reset edit mode
                delete form.dataset.editId;
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
            } else {
                // Add new product
                console.log('Adding new product...');
                const result = await window.supabaseService.addProduct(productData);
                console.log('Product add result:', result);
                this.showSuccess(`Product "${name}" has been added successfully!`);
            }

            // Reload products and update display
            console.log('Reloading products...');
            await this.loadProducts();
            this.updateDashboard();
            this.displayProducts();
            
            // Reset form
            form.reset();
            document.getElementById('imagePreview').style.display = 'none';
            document.getElementById('previewImg').src = '';
            
            // Switch to manage products tab
            this.showTab('manage-products');
            
        } catch (error) {
            console.error('Error saving product:', error);
            this.showError('Failed to save product. Please try again.');
        }
    }

    async editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Switch to add product tab
        this.showTab('add-product');

        // Populate form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description || '';
        
        // Set image preview
        const previewImg = document.getElementById('previewImg');
        const imagePreview = document.getElementById('imagePreview');
        previewImg.src = product.image;
        imagePreview.style.display = 'block';

        // Change form to edit mode
        const form = document.getElementById('productForm');
        form.dataset.editId = productId;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
    }

    async deleteProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            try {
                await window.supabaseService.deleteProduct(productId);
                this.showSuccess('Product deleted successfully!');
                
                // Reload products and update display
                await this.loadProducts();
                this.updateDashboard();
                this.displayProducts();
                
            } catch (error) {
                console.error('Error deleting product:', error);
                this.showError('Failed to delete product. Please try again.');
            }
        }
    }

    updateDashboard() {
        const totalProducts = this.products.length;
        const furnitureCount = this.products.filter(p => p.category === 'furniture').length;
        const propertyCount = this.products.filter(p => p.category === 'properties').length;
        const autoCount = this.products.filter(p => p.category === 'auto').length;

        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('furnitureCount').textContent = furnitureCount;
        document.getElementById('propertyCount').textContent = propertyCount;
        document.getElementById('autoCount').textContent = autoCount;
    }

    displayProducts() {
        const productsContainer = document.getElementById('productsContainer');
        
        if (this.products.length === 0) {
            productsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>No products found</h3>
                    <p>Start by adding your first product using the "Add Product" tab.</p>
                </div>
            `;
            return;
        }

        productsContainer.innerHTML = this.products.map(product => `
            <div class="admin-product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.svg'">
                <div class="admin-product-info">
                    <h3>${product.name}</h3>
                    <div class="admin-product-price">${product.price}</div>
                    <div class="admin-product-category">${product.category}</div>
                    <p>${product.description || 'No description available'}</p>
                    <div class="admin-actions">
                        <button class="btn-edit" onclick="adminPanel.editProduct('${product.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="adminPanel.deleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Cleanup when leaving the page
    destroy() {
        if (this.subscription) {
            window.supabaseService.unsubscribe(this.subscription);
        }
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.adminPanel) {
        window.adminPanel.destroy();
    }
});