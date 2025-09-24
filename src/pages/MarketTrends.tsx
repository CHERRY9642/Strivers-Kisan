import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  TrendingDown, 
  Search,
  MapPin,
  Clock,
  Heart,
  HeartOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Import commodity images
import tomatoImg from '@/assets/commodities/tomato.jpg';
import beansImg from '@/assets/commodities/beans.jpg';
import riceImg from '@/assets/commodities/rice.jpg';
import onionImg from '@/assets/commodities/onion.jpg';
import wheatImg from '@/assets/commodities/wheat.jpg';
import potatoImg from '@/assets/commodities/potato.jpg';

interface Commodity {
  id: string;
  name: string;
  image: string;
  category: string;
}

interface Mandi {
  id: string;
  name: string;
  district: string;
  state: string;
  distance: number;
  currentPrice: { min: number; max: number };
  unit: string;
  date: string;
  isFollowing: boolean;
}

interface PriceHistory {
  date: string;
  minPrice: number;
  maxPrice: number;
}

const MarketTrends = () => {
  const { translateSync } = useLanguage();
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMandi, setSelectedMandi] = useState<string>('');
  const [expandedMandi, setExpandedMandi] = useState<string>('');
  const [followedMandis, setFollowedMandis] = useState<Set<string>>(new Set());

  const commodities: Commodity[] = [
    { id: 'tomato', name: 'Tomato', image: tomatoImg, category: 'Vegetables' },
    { id: 'beans', name: 'Beans', image: beansImg, category: 'Vegetables' },
    { id: 'rice', name: 'Rice', image: riceImg, category: 'Cereals' },
    { id: 'onion', name: 'Onion', image: onionImg, category: 'Vegetables' },
    { id: 'wheat', name: 'Wheat', image: wheatImg, category: 'Cereals' },
    { id: 'potato', name: 'Potato', image: potatoImg, category: 'Vegetables' },
  ];

  const mandis: Record<string, Mandi[]> = {
    tomato: [
      { id: '1', name: 'Bangalore APMC', district: 'Bangalore', state: 'Karnataka', distance: 15, currentPrice: { min: 45, max: 52 }, unit: '10 kg', date: '2024-01-20', isFollowing: false },
      { id: '2', name: 'Mysore Market', district: 'Mysore', state: 'Karnataka', distance: 41, currentPrice: { min: 38, max: 48 }, unit: '10 kg', date: '2024-01-20', isFollowing: false },
      { id: '3', name: 'Hassan APMC', district: 'Hassan', state: 'Karnataka', distance: 67, currentPrice: { min: 42, max: 50 }, unit: '10 kg', date: '2024-01-20', isFollowing: false },
    ],
    rice: [
      { id: '4', name: 'Mandya APMC', district: 'Mandya', state: 'Karnataka', distance: 22, currentPrice: { min: 2800, max: 3200 }, unit: 'Quintal', date: '2024-01-20', isFollowing: false },
      { id: '5', name: 'Tumkur Market', district: 'Tumkur', state: 'Karnataka', distance: 35, currentPrice: { min: 2750, max: 3150 }, unit: 'Quintal', date: '2024-01-20', isFollowing: false },
    ],
    onion: [
      { id: '6', name: 'Belgaum APMC', district: 'Belgaum', state: 'Karnataka', distance: 125, currentPrice: { min: 32, max: 38 }, unit: '10 kg', date: '2024-01-20', isFollowing: false },
      { id: '7', name: 'Hubli Market', district: 'Hubli', state: 'Karnataka', distance: 98, currentPrice: { min: 30, max: 36 }, unit: '10 kg', date: '2024-01-20', isFollowing: false },
    ],
  };

  const priceHistory: Record<string, PriceHistory[]> = {
    '1': [
      { date: 'Jan 15', minPrice: 40, maxPrice: 45 },
      { date: 'Jan 16', minPrice: 42, maxPrice: 48 },
      { date: 'Jan 17', minPrice: 43, maxPrice: 49 },
      { date: 'Jan 18', minPrice: 44, maxPrice: 50 },
      { date: 'Jan 19', minPrice: 45, maxPrice: 51 },
      { date: 'Jan 20', minPrice: 45, maxPrice: 52 },
    ],
    '2': [
      { date: 'Jan 15', minPrice: 35, maxPrice: 42 },
      { date: 'Jan 16', minPrice: 36, maxPrice: 43 },
      { date: 'Jan 17', minPrice: 37, maxPrice: 45 },
      { date: 'Jan 18', minPrice: 37, maxPrice: 46 },
      { date: 'Jan 19', minPrice: 38, maxPrice: 47 },
      { date: 'Jan 20', minPrice: 38, maxPrice: 48 },
    ],
  };

  const filteredMandis = selectedCommodity 
    ? (mandis[selectedCommodity] || []).filter(mandi => 
        mandi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mandi.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mandi.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const toggleFollow = (mandiId: string) => {
    const newFollowed = new Set(followedMandis);
    if (newFollowed.has(mandiId)) {
      newFollowed.delete(mandiId);
    } else {
      newFollowed.add(mandiId);
    }
    setFollowedMandis(newFollowed);
  };

  const toggleExpandMandi = (mandiId: string) => {
    setExpandedMandi(expandedMandi === mandiId ? '' : mandiId);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 px-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            📊 Market Trends
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Get real-time commodity prices from nearby mandis and make informed selling decisions
          </p>
        </motion.div>

        <div className="px-2 md:px-4 pb-6 space-y-4 md:space-y-6">
          {/* Commodity Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Select Commodity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="flex gap-2 md:gap-3 pb-2">
                    {commodities.map((commodity) => (
                      <motion.div
                        key={commodity.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-shrink-0 cursor-pointer p-2 md:p-3 rounded-lg border-2 transition-all duration-300 ${
                          selectedCommodity === commodity.id
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-border hover:border-accent hover:bg-accent/5'
                        }`}
                        onClick={() => setSelectedCommodity(commodity.id)}
                      >
                        <div className="text-center w-16 md:w-20">
                          <img
                            src={commodity.image}
                            alt={commodity.name}
                            className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-full mx-auto mb-1 md:mb-2 border-2 border-background shadow-sm"
                          />
                          <p className="text-xs font-medium truncate">{commodity.name}</p>
                          <p className="text-xs text-muted-foreground truncate hidden md:block">{commodity.category}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search Bar */}
          {selectedCommodity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by Mandi / District / State"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Mandis List */}
          {selectedCommodity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {filteredMandis.length > 0 ? (
                filteredMandis.map((mandi, index) => (
                  <motion.div
                    key={mandi.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-base">{mandi.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{mandi.district}, {mandi.state}</span>
                                  </div>
                                  <span>{mandi.distance} km</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFollow(mandi.id)}
                                className="h-8 px-2"
                              >
                                {followedMandis.has(mandi.id) ? (
                                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                ) : (
                                  <HeartOff className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div>
                                  <div className="text-lg font-bold text-primary flex items-center gap-2">
                                    ₹{mandi.currentPrice.min} – ₹{mandi.currentPrice.max}
                                    {/* Price trend indicator */}
                                    <div className="flex items-center gap-1">
                                      {Math.random() > 0.5 ? (
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    per {mandi.unit}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{mandi.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{mandi.distance} km away</span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleExpandMandi(mandi.id)}
                                className="ml-2"
                              >
                                {expandedMandi === mandi.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Price History */}
                        <AnimatePresence>
                          {expandedMandi === mandi.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t border-border"
                            >
                              <h4 className="font-medium mb-3 text-sm">Price Trends</h4>
                              
                              {/* Detailed Price History List */}
                              <div className="space-y-2 mb-4">
                                {priceHistory[mandi.id] && priceHistory[mandi.id].slice(-3).map((entry, index, array) => {
                                  const prevEntry = index > 0 ? array[index - 1] : null;
                                  const currentAvg = (entry.minPrice + entry.maxPrice) / 2;
                                  const prevAvg = prevEntry ? (prevEntry.minPrice + prevEntry.maxPrice) / 2 : currentAvg;
                                  const isIncrease = currentAvg > prevAvg;
                                  const isDecrease = currentAvg < prevAvg;
                                  
                                  return (
                                    <motion.div
                                      key={entry.date}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="text-sm font-medium">{entry.date}</div>
                                        <div className="text-xs text-muted-foreground">{mandi.unit}</div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="text-sm font-semibold">
                                          ₹{entry.minPrice} - ₹{entry.maxPrice}
                                        </div>
                                        {index > 0 && (
                                          <div className="flex items-center">
                                            {isIncrease && (
                                              <TrendingUp className="h-3 w-3 text-green-500" />
                                            )}
                                            {isDecrease && (
                                              <TrendingDown className="h-3 w-3 text-red-500" />
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </div>

                              {/* Price Trend Graph */}
                              <div className="h-48 w-full mb-4">
                                {priceHistory[mandi.id] && (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={priceHistory[mandi.id]}>
                                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                      <XAxis 
                                        dataKey="date" 
                                        fontSize={10}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                      />
                                      <YAxis 
                                        fontSize={10}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                      />
                                      <Tooltip
                                        contentStyle={{
                                          backgroundColor: 'hsl(var(--background))',
                                          border: '1px solid hsl(var(--border))',
                                          borderRadius: '6px',
                                          fontSize: '12px'
                                        }}
                                      />
                                      <Line 
                                        type="monotone" 
                                        dataKey="maxPrice" 
                                        stroke="hsl(var(--chart-1))" 
                                        strokeWidth={2}
                                        name="Max Price"
                                        dot={{ r: 3, fill: "hsl(var(--chart-1))" }}
                                      />
                                      <Line 
                                        type="monotone" 
                                        dataKey="minPrice" 
                                        stroke="hsl(var(--chart-2))" 
                                        strokeWidth={2}
                                        name="Min Price"
                                        dot={{ r: 3, fill: "hsl(var(--chart-2))" }}
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                )}
                              </div>
                              
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <div className="flex gap-4">
                                  <div className="flex items-center gap-1">
                                    <div className="w-3 h-0.5 bg-chart-1"></div>
                                    <span>Maximum Price</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-3 h-0.5 bg-chart-2"></div>
                                    <span>Minimum Price</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs h-6 px-2 hover:bg-accent/50">
                                  Show More History
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : selectedCommodity ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No mandis found for the selected commodity</p>
                  </CardContent>
                </Card>
              ) : null}
            </motion.div>
          )}

          {!selectedCommodity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-4xl mb-4">🌾</div>
                  <h3 className="text-lg font-semibold mb-2">Select a Commodity</h3>
                  <p className="text-muted-foreground">
                    Choose a commodity above to see nearby mandi prices and trends
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MarketTrends;