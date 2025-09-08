// Supabase Database Service
class SupabaseService {
    constructor() {
        this.supabase = window.supabaseClient;
    }

    // Create products table if it doesn't exist
    async initializeDatabase() {
        try {
            // Check if products table exists by trying to select from it
            const { data, error } = await this.supabase
                .from('products')
                .select('id')
                .limit(1);
            
            if (error && error.code === 'PGRST116') {
                console.log('Products table does not exist. Please create it in Supabase dashboard.');
                return false;
            }
            
            console.log('Database connection successful');
            return true;
        } catch (error) {
            console.error('Database initialization error:', error);
            return false;
        }
    }

    // Add a new product
    async addProduct(productData) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .insert([{
                    name: productData.name,
                    price: productData.price,
                    description: productData.description,
                    category: productData.category,
                    image: productData.image,
                    created_at: new Date().toISOString()
                }])
                .select();

            if (error) {
                console.error('Error adding product:', error);
                throw error;
            }

            console.log('Product added successfully:', data);
            return data[0];
        } catch (error) {
            console.error('Add product error:', error);
            throw error;
        }
    }

    // Get all products
    async getAllProducts() {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching products:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Get products error:', error);
            return [];
        }
    }

    // Get products by category
    async getProductsByCategory(category) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('category', category)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching products by category:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Get category products error:', error);
            return [];
        }
    }

    // Update a product
    async updateProduct(productId, updateData) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .update(updateData)
                .eq('id', productId)
                .select();

            if (error) {
                console.error('Error updating product:', error);
                throw error;
            }

            console.log('Product updated successfully:', data);
            return data[0];
        } catch (error) {
            console.error('Update product error:', error);
            throw error;
        }
    }

    // Delete a product
    async deleteProduct(productId) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .delete()
                .eq('id', productId)
                .select();

            if (error) {
                console.error('Error deleting product:', error);
                throw error;
            }

            console.log('Product deleted successfully:', data);
            return data[0];
        } catch (error) {
            console.error('Delete product error:', error);
            throw error;
        }
    }

    // Real-time subscription for product changes
    subscribeToProductChanges(callback) {
        const subscription = this.supabase
            .channel('products-changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'products' }, 
                callback
            )
            .subscribe();

        return subscription;
    }

    // Unsubscribe from real-time changes
    unsubscribe(subscription) {
        this.supabase.removeChannel(subscription);
    }
}

// Create global instance
window.supabaseService = new SupabaseService();