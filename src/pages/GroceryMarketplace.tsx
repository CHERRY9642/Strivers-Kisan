import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ShoppingCart,
  Plus,
  Search,
  MapPin,
  Star,
  Clock,
  User,
  Phone,
  Package,
  Truck,
  Filter,
  Grid,
  List,
  Heart,
  MessageCircle,
  XCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  seller: string;
  location: string;
  rating: number;
  image: string;
  description: string;
  category: string;
  freshness: string;
  postedAt: Date;
  isOrganic: boolean;
}

interface CartItem extends Product {
  cartQuantity: number;
}

const GroceryMarketplace = () => {
  const { translateSync } = useLanguage();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedProductForFeedback, setSelectedProductForFeedback] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userFeedback, setUserFeedback] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    unit: 'kg',
    quantity: '',
    description: '',
    category: 'vegetables',
    isOrganic: false
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Fresh Tomatoes',
      price: 45,
      unit: 'kg',
      quantity: 50,
      seller: 'Ramesh Kumar',
      location: 'Bangalore, Karnataka',
      rating: 4.5,
      image: '🍅',
      description: 'Farm fresh red tomatoes, perfect for cooking and salads. Harvested yesterday.',
      category: 'vegetables',
      freshness: 'Very Fresh',
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isOrganic: true
    },
    {
      id: '2',
      name: 'Organic Onions',
      price: 32,
      unit: 'kg',
      quantity: 30,
      seller: 'Sunita Devi',
      location: 'Mysore, Karnataka',
      rating: 4.8,
      image: '🧅',
      description: 'Certified organic onions with no pesticides. Great for daily cooking.',
      category: 'vegetables',
      freshness: 'Fresh',
      postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isOrganic: true
    },
    {
      id: '3',
      name: 'Basmati Rice',
      price: 85,
      unit: 'kg',
      quantity: 100,
      seller: 'Krishnan Farms',
      location: 'Hassan, Karnataka',
      rating: 4.7,
      image: '🌾',
      description: 'Premium quality basmati rice with authentic aroma and taste.',
      category: 'grains',
      freshness: 'Excellent',
      postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      isOrganic: false
    },
    {
      id: '4',
      name: 'Fresh Mangoes',
      price: 120,
      unit: 'kg',
      quantity: 25,
      seller: 'Mango Valley Farm',
      location: 'Belgaum, Karnataka',
      rating: 4.9,
      image: '🥭',
      description: 'Sweet Alphonso mangoes directly from our orchard. Limited stock available.',
      category: 'fruits',
      freshness: 'Very Fresh',
      postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isOrganic: true
    },
    {
      id: '5',
      name: 'Fresh Spinach',
      price: 25,
      unit: 'kg',
      quantity: 15,
      seller: 'Green Leaf Farm',
      location: 'Mandya, Karnataka',
      rating: 4.3,
      image: '🥬',
      description: 'Tender and nutritious spinach leaves, perfect for healthy meals.',
      category: 'vegetables',
      freshness: 'Very Fresh',
      postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isOrganic: true
    },
    {
      id: '6',
      name: 'Wheat Flour',
      price: 42,
      unit: 'kg',
      quantity: 80,
      seller: 'Heritage Mills',
      location: 'Tumkur, Karnataka',
      rating: 4.6,
      image: '🌾',
      description: 'Stone ground whole wheat flour, rich in fiber and nutrients.',
      category: 'grains',
      freshness: 'Fresh',
      postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isOrganic: false
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    // In a real app, this would submit to a backend
    console.log('Adding new product:', newProduct);
    const productToAdd: Product = {
      id: String(products.length + 1), // Simple ID generation
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      unit: newProduct.unit,
      quantity: parseInt(newProduct.quantity),
      seller: 'Your Farm', // Placeholder
      location: 'Your Location', // Placeholder
      rating: 4.0, // Default rating
      image: '📦', // Default emoji image
      description: newProduct.description,
      category: newProduct.category,
      freshness: 'Fresh', // Default freshness
      postedAt: new Date(),
      isOrganic: newProduct.isOrganic,
    };
    setProducts(prevProducts => [...prevProducts, productToAdd]);
    setShowAddProduct(false);
    setNewProduct({
      name: '',
      price: '',
      unit: 'kg',
      quantity: '',
      description: '',
      category: 'vegetables',
      isOrganic: false
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
        return [...prevItems, { ...product, cartQuantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, cartQuantity: newQuantity } : item
      );
    });
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const isFavorited = prev.includes(productId);
      if (isFavorited) {
        toast({
          title: "Removed from favorites",
          description: "Product removed from your favorites list.",
        });
        return prev.filter(id => id !== productId);
      } else {
        toast({
          title: "Added to favorites",
          description: "Product added to your favorites list.",
        });
        return [...prev, productId];
      }
    });
  };

  const openFeedbackModal = (product: Product) => {
    setSelectedProductForFeedback(product);
    setUserRating(0);
    setUserFeedback('');
    setShowFeedback(true);
  };

  const submitFeedback = () => {
    if (!selectedProductForFeedback || userRating === 0) return;
    
    toast({
      title: "Feedback submitted",
      description: `Thank you for rating ${selectedProductForFeedback.name}!`,
    });
    
    setShowFeedback(false);
    setSelectedProductForFeedback(null);
    setUserRating(0);
    setUserFeedback('');
  };

  const AnimatedStar = ({ index, filled, onHover, onClick }: {
    index: number;
    filled: boolean;
    onHover: (index: number) => void;
    onClick: (index: number) => void;
  }) => (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => onHover(index)}
      onClick={() => onClick(index)}
      className="cursor-pointer"
    >
      <Star
        className={`h-6 w-6 transition-colors ${
          filled ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
        }`}
      />
    </motion.div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-hero text-primary font-indian mb-2">
            🛒 {translateSync('Grocery Marketplace')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {translateSync('Buy and sell fresh groceries directly from farmers')}
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={translateSync("Search products, sellers...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowAddProduct(true)}
              className="bg-accent hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {translateSync('Sell Product')}
            </Button>
            
            <Dialog open={showCart} onOpenChange={setShowCart}>
              <DialogTrigger asChild>
                <Button variant="outline" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground">
                      {cartItems.reduce((total, item) => total + item.cartQuantity, 0)}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{translateSync('Your Cart')}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-center text-muted-foreground">{translateSync('Your cart is empty.')}</p>
                  ) : (
                    <div className="space-y-3">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{item.image}</span>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">₹{item.price}/{item.unit}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)}>-</Button>
                            <span>{item.cartQuantity}</span>
                            <Button size="sm" variant="outline" onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)}>+</Button>
                            <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <DialogFooter className="flex flex-col sm:flex-col sm:space-x-0 sm:space-y-2">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>{translateSync('Total:')}</span>
                      <span>₹{cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0).toFixed(2)}</span>
                    </div>
                    <Button className="w-full">
                      {translateSync('Proceed to Payment')}
                    </Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Button>
          ))}
        </motion.div>

        {/* Products Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className={`hover:shadow-glow transition-all ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}>
                  {viewMode === 'grid' ? (
                    <>
                      <CardHeader className="text-center pb-2">
                        <div className="text-6xl mb-2">{product.image}</div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex justify-center space-x-2">
                          {product.isOrganic && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Organic
                            </Badge>
                          )}
                          <Badge variant="outline">{product.freshness}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            ₹{product.price}
                            <span className="text-sm text-muted-foreground">/{product.unit}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {product.quantity} {product.unit} available
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground text-center">
                          {product.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{product.seller}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{product.location}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(product.postedAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button className="flex-1" size="sm" onClick={() => addToCart(product)}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Buy Now
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openFeedbackModal(product)}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <motion.div
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button 
                              variant={favorites.includes(product.id) ? "default" : "outline"} 
                              size="sm"
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <motion.div
                                animate={{ 
                                  scale: favorites.includes(product.id) ? [1, 1.3, 1] : 1,
                                  rotate: favorites.includes(product.id) ? [0, 15, -15, 0] : 0 
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <Heart 
                                  className={`h-4 w-4 ${
                                    favorites.includes(product.id) 
                                      ? 'text-red-500 fill-red-500' 
                                      : ''
                                  }`} 
                                />
                              </motion.div>
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    // List View
                    <div className="flex w-full">
                      <div className="w-20 h-20 flex items-center justify-center text-4xl">
                        {product.image}
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{product.seller}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{product.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span>{product.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">
                              ₹{product.price}/{product.unit}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {product.quantity} {product.unit} available
                            </div>
                            <div className="flex space-x-2 mt-2">
                              <Button size="sm" onClick={() => addToCart(product)}>
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Buy
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openFeedbackModal(product)}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                              <motion.div whileTap={{ scale: 0.9 }}>
                                <Button 
                                  variant={favorites.includes(product.id) ? "default" : "outline"} 
                                  size="sm"
                                  onClick={() => toggleFavorite(product.id)}
                                >
                                  <motion.div
                                    animate={{ 
                                      scale: favorites.includes(product.id) ? [1, 1.3, 1] : 1,
                                      rotate: favorites.includes(product.id) ? [0, 15, -15, 0] : 0 
                                    }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Heart 
                                      className={`h-4 w-4 ${
                                        favorites.includes(product.id) 
                                          ? 'text-red-500 fill-red-500' 
                                          : ''
                                      }`} 
                                    />
                                  </motion.div>
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Feedback Modal */}
        <AnimatePresence>
          {showFeedback && selectedProductForFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowFeedback(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Rate & Review</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedProductForFeedback.name} by {selectedProductForFeedback.seller}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Rating</label>
                      <div 
                        className="flex space-x-1"
                        onMouseLeave={() => setHoveredStar(0)}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <AnimatedStar
                            key={star}
                            index={star}
                            filled={star <= (hoveredStar || userRating)}
                            onHover={setHoveredStar}
                            onClick={setUserRating}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Your Feedback (Optional)</label>
                      <Textarea
                        value={userFeedback}
                        onChange={(e) => setUserFeedback(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button 
                        onClick={submitFeedback} 
                        className="flex-1"
                        disabled={userRating === 0}
                      >
                        Submit Review
                      </Button>
                      <Button variant="outline" onClick={() => setShowFeedback(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Product Modal */}
        <AnimatePresence>
          {showAddProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddProduct(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Product Name</label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="e.g., Fresh Tomatoes"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Price</label>
                        <Input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          placeholder="45"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Unit</label>
                        <select
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="kg">kg</option>
                          <option value="gram">gram</option>
                          <option value="piece">piece</option>
                          <option value="dozen">dozen</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Quantity Available</label>
                      <Input
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="vegetables">Vegetables</option>
                        <option value="fruits">Fruits</option>
                        <option value="grains">Grains</option>
                        <option value="dairy">Dairy</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Describe your product..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="organic"
                        checked={newProduct.isOrganic}
                        onChange={(e) => setNewProduct({...newProduct, isOrganic: e.target.checked})}
                      />
                      <label htmlFor="organic" className="text-sm">This is an organic product</label>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button onClick={handleAddProduct} className="flex-1">
                        <Package className="h-4 w-4 mr-2" />
                        List Product
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or browse different categories
            </p>
            <Button onClick={() => setShowAddProduct(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Be the first to sell
            </Button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default GroceryMarketplace;