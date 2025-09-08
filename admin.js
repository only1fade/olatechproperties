// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('adminProducts')) || [];
        this.checkAuth();
        this.init();
    }

    checkAuth() {
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

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.displayProducts();
        this.setupImageUpload();
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

    addProduct() {
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

        const product = {
            id: Date.now().toString(),
            name: name,
            price: price,
            category: category,
            condition: formData.get('productCondition') || 'new',
            description: formData.get('productDescription').trim(),
            image: previewImg.src,
            dateAdded: new Date().toISOString()
        };

        this.products.push(product);
        this.saveProducts();
        this.updateDashboard();
        this.displayProducts();
        
        // Reset form
        form.reset();
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('previewImg').src = '';
        
        this.showSuccess(`Product "${name}" has been added successfully!`);
        
        // Switch to manage products tab
        this.showTab('manage-products');
        
        // Force refresh of category pages by dispatching storage events
        this.triggerCategoryRefresh();
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Switch to add product tab
        this.showTab('add-product');

        // Populate form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productCondition').value = product.condition;
        document.getElementById('productDescription').value = product.description;
        
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
        
        // Update form submit handler
        form.removeEventListener('submit', this.addProductHandler);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProduct(productId);
        });
    }

    updateProduct(productId) {
        const form = document.getElementById('productForm');
        const formData = new FormData(form);
        const previewImg = document.getElementById('previewImg');
        
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex === -1) return;

        // Update product
        this.products[productIndex] = {
            ...this.products[productIndex],
            name: formData.get('productName').trim(),
            price: formData.get('productPrice').trim(),
            category: formData.get('productCategory'),
            condition: formData.get('productCondition') || 'new',
            description: formData.get('productDescription').trim(),
            image: previewImg.src,
            lastModified: new Date().toISOString()
        };

        this.saveProducts();
        this.updateDashboard();
        this.displayProducts();
        
        // Reset form
        form.reset();
        delete form.dataset.editId;
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('previewImg').src = '';
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Product';
        
        this.showSuccess(`Product has been updated successfully!`);
        this.showTab('manage-products');
        
        // Force refresh of category pages
        this.triggerCategoryRefresh();
    }

    deleteProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveProducts();
            this.updateDashboard();
            this.displayProducts();
            this.showSuccess('Product has been deleted successfully!');
            
            // Force refresh of category pages
            this.triggerCategoryRefresh();
        }
    }

    displayProducts(category = 'all') {
        const productsGrid = document.getElementById('productsGrid');
        let filteredProducts = this.products;

        if (category !== 'all') {
            filteredProducts = this.products.filter(p => p.category === category);
        }

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <p>No products found${category !== 'all' ? ` in ${category} category` : ''}.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="admin-product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                <div class="admin-product-info">
                    <h3>${product.name}</h3>
                    <div class="admin-product-price">${product.price}</div>
                    <span class="admin-product-category">${product.category}</span>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">
                        ${product.description ? product.description.substring(0, 100) + (product.description.length > 100 ? '...' : '') : 'No description'}
                    </p>
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

    updateDashboard() {
        const totalProducts = this.products.length;
        const furnitureCount = this.products.filter(p => p.category === 'furniture').length;
        const propertiesCount = this.products.filter(p => p.category === 'properties').length;
        const autoCount = this.products.filter(p => p.category === 'auto').length;

        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('furnitureCount').textContent = furnitureCount;
        document.getElementById('propertiesCount').textContent = propertiesCount;
        document.getElementById('autoCount').textContent = autoCount;
    }

    saveProducts() {
        localStorage.setItem('adminProducts', JSON.stringify(this.products));
        // Also update the products for the main website
        this.updateWebsiteProducts();
    }

    updateWebsiteProducts() {
        // Update products for each category page
        const furnitureProducts = this.products.filter(p => p.category === 'furniture');
        const propertyProducts = this.products.filter(p => p.category === 'properties');
        const autoProducts = this.products.filter(p => p.category === 'auto');

        localStorage.setItem('furnitureProducts', JSON.stringify(furnitureProducts));
        localStorage.setItem('propertyProducts', JSON.stringify(propertyProducts));
        localStorage.setItem('autoProducts', JSON.stringify(autoProducts));
    }

    triggerCategoryRefresh() {
        // Trigger storage events for all category types to refresh any open category pages
        setTimeout(() => {
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'furnitureProducts',
                newValue: localStorage.getItem('furnitureProducts')
            }));
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'propertyProducts', 
                newValue: localStorage.getItem('propertyProducts')
            }));
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'autoProducts',
                newValue: localStorage.getItem('autoProducts')
            }));
            
            // Also trigger a custom event
            window.dispatchEvent(new CustomEvent('productsUpdated', {
                detail: { 
                    furniture: JSON.parse(localStorage.getItem('furnitureProducts') || '[]').length,
                    properties: JSON.parse(localStorage.getItem('propertyProducts') || '[]').length,
                    auto: JSON.parse(localStorage.getItem('autoProducts') || '[]').length
                }
            }));
        }, 100);
    }

    showTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(tabName).classList.add('active');
        
        // Add active class to corresponding button
        event.target.classList.add('active');
    }

    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // Hide error message if visible
        document.getElementById('errorMessage').style.display = 'none';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Hide success message if visible
        document.getElementById('successMessage').style.display = 'none';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Export products as JSON
    exportProducts() {
        const dataStr = JSON.stringify(this.products, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'olatech_products.json';
        link.click();
    }

    // Import products from JSON
    importProducts(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedProducts = JSON.parse(e.target.result);
                if (Array.isArray(importedProducts)) {
                    this.products = importedProducts;
                    this.saveProducts();
                    this.updateDashboard();
                    this.displayProducts();
                    this.showSuccess('Products imported successfully!');
                } else {
                    this.showError('Invalid JSON format.');
                }
            } catch (error) {
                this.showError('Error reading file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}

// Global functions for tab switching and filtering
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function filterProducts() {
    const category = document.getElementById('filterCategory').value;
    adminPanel.displayProducts(category);
}

// Initialize admin panel when page loads
let adminPanel;
document.addEventListener('DOMContentLoaded', function() {
    adminPanel = new AdminPanel();
});