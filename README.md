# OLATECH PROPERTIES AND ASSETS

A comprehensive e-commerce website for furniture, properties, and automotive products with an integrated admin panel for product management.

**Latest Update**: Supabase integration completed for real-time database synchronization.

## Features

### Customer Features
- **Multi-Category Shopping**: Browse furniture, properties, and automotive products
- **Interactive Slider**: Dynamic homepage with category showcases
- **Shopping Cart**: Add products to cart with local storage persistence
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Product Search**: Easy navigation and product discovery
- **Contact Integration**: Multiple contact channels and showroom locations

### Admin Features
- **Secure Admin Panel**: Password-protected admin interface (`/admin.html`)
- **Product Management**: Add, edit, and delete products across all categories
- **Image Upload**: Drag & drop image uploading with base64 encoding
- **Real-time Updates**: Automatic synchronization with category pages
- **Category Management**: Separate management for furniture, properties, and auto products

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Local Storage for client-side data persistence
- **Server**: Node.js HTTP server for development
- **Styling**: Modern CSS with Flexbox and Grid layouts
- **Icons**: Font Awesome for consistent iconography

## Getting Started

### Prerequisites
- Node.js installed on your system

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/olatech-properties-assets.git
   cd olatech-properties-assets
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   node dev-server.js
   ```

4. Open your browser and navigate to:
   - **Main Site**: `http://localhost:3000`
   - **Admin Panel**: `http://localhost:3000/admin.html`

### Admin Access
- **URL**: `/admin.html`
- **Password**: `admin123`

## Project Structure

```
├── index.html          # Homepage with slider and featured products
├── furniture.html      # Furniture category page
├── properties.html     # Properties category page
├── auto.html          # Automotive category page
├── contact.html       # Contact information page
├── admin.html         # Admin panel interface
├── script.js          # Main JavaScript functionality
├── admin.js           # Admin panel JavaScript
├── styles.css         # Main stylesheet
├── dev-server.js      # Development server
├── package.json       # Node.js dependencies
└── images/            # Image assets
```

## Admin Panel Features

### Dashboard
- Product statistics overview
- Quick access to management functions
- System status monitoring

### Add Products
- Category selection (Furniture, Properties, Auto)
- Product details form (name, price, description)
- Image upload with drag & drop support
- Real-time validation

### Manage Products
- View all products by category
- Edit existing products
- Delete products with confirmation
- Search and filter functionality

## Contact Information

- **Location**: NO 20, Reuben street, under powerline, tipper garage, odan otun, itele, ogun state
- **Phone**: 08036122868, 09012894174
- **Email**: olatechpropertiesassets@gmail.com

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for the icon library
- Unsplash for high-quality images
- VavaFurniture.com for showroom section inspiration