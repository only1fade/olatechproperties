document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing...');
    
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart badge
    function updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = cart.length;
        }
    }
    
    // Add to cart function
    function addToCart(product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        showCartNotification();
    }
    
    // Remove from cart function
    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        if (document.querySelector('.cart-modal')) {
            displayCart();
        }
    }
    
    // Make removeFromCart globally accessible
    window.removeFromCart = removeFromCart;
    
    // Show cart notification
    function showCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = 'Item added to cart!';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
    
    // Display cart modal
    function displayCart() {
        const modal = document.querySelector('.cart-modal') || createCartModal();
        const cartItems = modal.querySelector('.cart-items');
        const total = modal.querySelector('.cart-total');
        
        cartItems.innerHTML = '';
        let totalPrice = 0;
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                </div>
                <button class="remove-btn" data-index="${index}">×</button>
            `;
            cartItems.appendChild(cartItem);
            
            // Extract price number for total calculation
            const price = parseFloat(item.price.replace(/[$,]/g, ''));
            totalPrice += price;
        });
        
        total.textContent = `Total: $${totalPrice.toFixed(2)}`;
        modal.style.display = 'block';
    }
    
    // Create cart modal
    function createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h3>Shopping Cart</h3>
                    <span class="close-cart">&times;</span>
                </div>
                <div class="cart-items"></div>
                <div class="cart-footer">
                    <div class="cart-total">Total: $0.00</div>
                    <button class="checkout-btn">Checkout</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listeners for cart modal
        modal.querySelector('.close-cart').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.querySelector('.checkout-btn').addEventListener('click', () => {
            showCheckoutModal();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        return modal;
    }
    
    // Show checkout modal
    function showCheckoutModal() {
        const modal = document.querySelector('.checkout-modal') || createCheckoutModal();
        modal.style.display = 'block';
    }
    
    // Create checkout modal
    function createCheckoutModal() {
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        modal.innerHTML = `
            <div class="checkout-modal-content">
                <div class="checkout-header">
                    <h3>Checkout</h3>
                    <span class="close-checkout">&times;</span>
                </div>
                <div class="checkout-body">
                    <h4>Payment Instructions</h4>
                    <p>Please transfer the total amount to:</p>
                    <div class="bank-details">
                        <p><strong>Bank:</strong> Your Bank Name</p>
                        <p><strong>Account Number:</strong> 1234567890</p>
                        <p><strong>Account Name:</strong> OLATECH PROPERTIES AND ASSETS</p>
                    </div>
                    <p>After payment, please contact us at 08036122868 with your transaction reference.</p>
                    <div class="checkout-items">
                        <h5>Order Summary:</h5>
                        <div class="checkout-items-list"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listeners for checkout modal
        modal.querySelector('.close-checkout').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        return modal;
    }
    
    // Initialize cart functionality
    function initCart() {
        updateCartBadge();
        
        // Cart icon click
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', displayCart);
        }
        
        // Add to cart buttons (will be added to products)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productCard = e.target.closest('.product-card, .auto-card, .property-card');
                if (productCard) {
                    const product = {
                        name: productCard.querySelector('h3').textContent,
                        price: productCard.querySelector('.price').textContent,
                        image: productCard.querySelector('img').src,
                        category: productCard.dataset.category || 'general'
                    };
                    addToCart(product);
                }
            }
            
            // Remove from cart buttons
            if (e.target.classList.contains('remove-btn')) {
                const index = parseInt(e.target.dataset.index);
                removeFromCart(index);
            }
        });
    }
    
    // Initialize cart
    initCart();

    // Slider Data
    const sliderData = [
        {
            category: 'furniture',
            image: 'images/furniture-slide.jpeg',
            title: 'Elegant Furniture Collection',
            description: 'Discover our premium furniture collection for your home and office.'
        },
        {
            category: 'properties',
            image: 'images/property-slide.jpeg',
            title: 'Premium Properties',
            description: 'Find your dream home with our exclusive property listings.'
        },
        {
            category: 'properties',
            image: 'images/land-slide.jpeg',
            title: 'Land & Investment Opportunities',
            description: 'Discover prime land opportunities for development and investment.'
        },
        {
            category: 'auto',
            image: 'images/auto-slide.jpeg',
            title: 'Quality Automotive',
            description: 'Explore our selection of quality vehicles and automotive products.'
        }
    ];

    // Featured Products Data - Keep original static products for homepage
    const featuredProducts = [];

    // Initialize Slider
    initSlider();

    // Initialize Featured Products
    initFeaturedProducts();

    // Load category-specific products
    loadCategoryProducts();

    // Listen for storage changes to auto-refresh category products
    window.addEventListener('storage', function(e) {
        if (e.key === 'furnitureProducts' || e.key === 'propertyProducts' || e.key === 'autoProducts') {
            console.log('Storage updated, refreshing category products...');
            loadCategoryProducts();
        }
    });

    // Listen for custom products updated event
    window.addEventListener('productsUpdated', function(e) {
        console.log('Products updated event received:', e.detail);
        loadCategoryProducts();
    });

    // Listen for focus events to refresh products when returning to the page
    window.addEventListener('focus', function() {
        loadCategoryProducts();
    });

    // Function to initialize slider with parallax effects
    function initSlider() {
        const slider = document.querySelector('.slider');
        const sliderContainer = document.querySelector('.slider-container');
        
        // Only initialize slider if elements exist (homepage)
        if (!slider || !sliderContainer) {
            return;
        }
        
        let currentSlide = 0;

        // Create slides with parallax effects
        sliderData.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            slideElement.style.backgroundImage = `url(${slide.image})`;
            
            const slideContent = document.createElement('div');
            slideContent.className = 'slide-content';
            
            slideContent.innerHTML = `
                <h2>${slide.title}</h2>
                <p>${slide.description}</p>
                <a href="${slide.category}.html" class="btn">Explore ${slide.category}</a>
            `;
            
            slideElement.appendChild(slideContent);
            slider.appendChild(slideElement);
        });

        // Create slide indicators
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slider-indicators';
        sliderData.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
                resetAutoSlide();
            });
            indicatorsContainer.appendChild(indicator);
        });
        sliderContainer.appendChild(indicatorsContainer);

        // Enhanced slide transitions with animation reset
        function updateSlider() {
            const slides = document.querySelectorAll('.slide');
            const indicators = document.querySelectorAll('.indicator');
            
            // Reset animations for all slides first
            slides.forEach((slide, index) => {
                const slideContent = slide.querySelector('.slide-content');
                const h2 = slide.querySelector('h2');
                const p = slide.querySelector('p');
                const btn = slide.querySelector('.btn');
                
                if (slideContent) {
                    slideContent.style.animation = 'none';
                }
                if (h2) {
                    h2.style.animation = 'none';
                }
                if (p) {
                    p.style.animation = 'none';
                }
                if (btn) {
                    btn.style.animation = 'none';
                }
            });
            
            // Update slider position with easing
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
            
            // Trigger animations for the current slide after a brief delay
            setTimeout(() => {
                const currentSlideElement = slides[currentSlide];
                if (currentSlideElement) {
                    const slideContent = currentSlideElement.querySelector('.slide-content');
                    const h2 = currentSlideElement.querySelector('h2');
                    const p = currentSlideElement.querySelector('p');
                    const btn = currentSlideElement.querySelector('.btn');
                    
                    if (slideContent) {
                        slideContent.style.animation = 'slideContentFadeIn 1.2s ease 0.1s both';
                    }
                    if (h2) {
                        h2.style.animation = 'dropDownFromTop 1.0s ease 0.2s both';
                    }
                    if (p) {
                        p.style.animation = 'dropDownFromTop 1.0s ease 0.4s both';
                    }
                    if (btn) {
                        btn.style.animation = 'dropDownFromTop 1.0s ease 0.6s both';
                    }
                }
            }, 50);
        }

        // Smooth slide transitions
        function nextSlide() {
            currentSlide = (currentSlide + 1) % sliderData.length;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + sliderData.length) % sliderData.length;
            updateSlider();
        }

        // Enhanced controls
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });

            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        // Auto slide with longer intervals
        let slideInterval = setInterval(nextSlide, 7000);

        function resetAutoSlide() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 7000);
        }

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (slider) {
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoSlide();
            }
        }

        // Initialize animations
        updateSlider();
        
        // Pause auto-slide on hover
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 7000);
            });
        }
    }

    // Function to initialize featured products
    function initFeaturedProducts() {
        const productContainer = document.querySelector('.product-grid');
        
        if (!productContainer) {
            return;
        }
        
        // Display featured products
        displayFeaturedProducts();
    }

    // Function to display featured products
    function displayFeaturedProducts() {
        const productContainer = document.querySelector('.product-grid');
        if (!productContainer) return;

        // Keep existing HTML content - original featured products
        // Admin products appear only in their respective category pages
    }

    // Function to load category-specific products from Supabase
    async function loadCategoryProducts() {
        const currentPage = window.location.pathname.split('/').pop();
        let category = '';
        let containerSelector = '';
        
        switch(currentPage) {
            case 'furniture.html':
                category = 'furniture';
                containerSelector = '.furniture-grid';
                break;
            case 'properties.html':
                category = 'properties';
                containerSelector = '.property-grid';
                break;
            case 'auto.html':
                category = 'auto';
                containerSelector = '.auto-grid';
                break;
            default:
                return; // Not a category page
        }
        
        const container = document.querySelector(containerSelector);
        
        if (!container) {
            console.log('Container not found:', containerSelector);
            return;
        }
        
        console.log('Loading products for category:', category);
        
        try {
            // Check if Supabase is available
            if (!window.supabaseService) {
                console.log('Supabase not available, falling back to localStorage');
                loadCategoryProductsFromLocalStorage();
                return;
            }
            
            // Load products from Supabase
            const categoryProducts = await window.supabaseService.getProductsByCategory(category);
            console.log('Loaded products from Supabase:', categoryProducts.length);
            
            // Clear existing content
            container.innerHTML = '';
            
            if (categoryProducts.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                        <h3>No products available yet</h3>
                        <p>Check back later for new ${category} products.</p>
                        <button onclick="loadCategoryProducts()" class="btn" style="margin-top: 20px;">Refresh Products</button>
                    </div>
                `;
                return;
            }
            
            // Display products
            categoryProducts.forEach(product => {
                const productCard = createProductCard(product, category);
                container.appendChild(productCard);
            });
            
        } catch (error) {
            console.error('Error loading products from Supabase:', error);
            // Fallback to localStorage
            loadCategoryProductsFromLocalStorage();
        }
    }

    // Fallback function to load from localStorage
    function loadCategoryProductsFromLocalStorage() {
        const currentPage = window.location.pathname.split('/').pop();
        let categoryProducts = [];
        let containerSelector = '';
        
        switch(currentPage) {
            case 'furniture.html':
                categoryProducts = JSON.parse(localStorage.getItem('furnitureProducts')) || [];
                containerSelector = '.furniture-grid';
                break;
            case 'properties.html':
                categoryProducts = JSON.parse(localStorage.getItem('propertyProducts')) || [];
                containerSelector = '.property-grid';
                break;
            case 'auto.html':
                categoryProducts = JSON.parse(localStorage.getItem('autoProducts')) || [];
                containerSelector = '.auto-grid';
                break;
            default:
                return;
        }
        
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (categoryProducts.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>No products available yet</h3>
                    <p>Check back later or visit the <a href="admin.html">admin panel</a> to add products.</p>
                    <button onclick="loadCategoryProducts()" class="btn" style="margin-top: 20px;">Refresh Products</button>
                </div>
            `;
            return;
        }
        
        categoryProducts.forEach(product => {
            const productCard = createProductCard(product, product.category);
            container.appendChild(productCard);
        });
    }

    // Helper function to create product cards
    function createProductCard(product, category) {
        const productCard = document.createElement('div');
        
        // Use appropriate card class based on category
        let cardClass = 'product-card';
        if (category === 'properties') cardClass = 'property-card';
        if (category === 'auto') cardClass = 'auto-card';
        
        productCard.className = cardClass;
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                ${product.condition ? `<span class="condition-tag">${product.condition}</span>` : ''}
                ${product.description ? `<p class="description">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>` : ''}
                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
        
        return productCard;
    }

    // Make loadCategoryProducts globally accessible
    window.loadCategoryProducts = loadCategoryProducts;

});
