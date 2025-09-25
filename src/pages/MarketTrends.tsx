import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchMarketData, MarketData } from '@/services/marketService';
import { useLocation } from '@/contexts/LocationContext';

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
  currentPrice: { min: number; max: number };
  unit: string;
  date: string;
  commodity: string;
}

interface PriceHistory {
  date: string;
  minPrice: number;
  maxPrice: number;
}

const MarketTrends = () => {
  const { translateSync } = useLanguage();
  const { location } = useLocation();
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMandi, setExpandedMandi] = useState<string>('');
  const [marketData, setMarketData] = useState<Mandi[]>([]);
  const [historicalData, setHistoricalData] = useState<Record<string, PriceHistory[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarketData = async () => {
      if (!location.state || !location.city || !selectedCommodity) {
        setMarketData([]);
        setHistoricalData({});
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const filters = {
          'filters[state]': location.state,
          'filters[district]': location.city,
          'filters[commodity]': selectedCommodity,
        };

        const data = await fetchMarketData(filters);

        const transformedData = data.map(item => ({
          ...item,
          min_price: (parseFloat(item.min_price) / 100).toFixed(2),
          max_price: (parseFloat(item.max_price) / 100).toFixed(2),
          modal_price: (parseFloat(item.modal_price) / 100).toFixed(2),
        }));

        const groupedByMarket = transformedData.reduce((acc, item) => {
          const key = item.market;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {} as Record<string, MarketData[]>);

        const latestMarketData = Object.values(groupedByMarket).map(group => {
          const latestRecord = group.sort((a, b) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime())[0];
          return {
            id: `${latestRecord.market}-${latestRecord.commodity}`,
            name: latestRecord.market,
            district: latestRecord.district,
            state: latestRecord.state,
            currentPrice: {
              min: parseFloat(latestRecord.min_price),
              max: parseFloat(latestRecord.max_price),
            },
            unit: 'Kg',
            date: new Date(latestRecord.arrival_date).toLocaleDateString(),
            commodity: latestRecord.commodity
          };
        });

        setMarketData(latestMarketData);

        const historicalData = Object.keys(groupedByMarket).reduce((acc, key) => {
          const marketHistory = groupedByMarket[key];
          const mandiId = `${marketHistory[0].market}-${marketHistory[0].commodity}`;
          acc[mandiId] = marketHistory.map(d => ({
            date: new Date(d.arrival_date).toLocaleDateString(),
            minPrice: parseFloat(d.min_price),
            maxPrice: parseFloat(d.max_price),
          })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          return acc;
        }, {} as Record<string, PriceHistory[]>);

        setHistoricalData(historicalData);

      } catch (err) {
        setError('Failed to fetch market data. Please try again later.');
        console.error('Market data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
  }, [location, selectedCommodity]);

  const handleExpandMandi = (mandiId: string) => {
    setExpandedMandi(prev => (prev === mandiId ? '' : mandiId));
  };

  const commodities: Commodity[] = [
    { id: 'tomato', name: 'Tomato', image: tomatoImg, category: 'Vegetables' },
    { id: 'beans', name: 'Beans', image: beansImg, category: 'Vegetables' },
    { id: 'rice', name: 'Rice', image: riceImg, category: 'Cereals' },
    { id: 'onion', name: 'Onion', image: onionImg, category: 'Vegetables' },
    { id: 'wheat', name: 'Wheat', image: wheatImg, category: 'Cereals' },
    { id: 'potato', name: 'Potato', image: potatoImg, category: 'Vegetables' },
  ];

  const filteredMandis = marketData.filter(
    (mandi) =>
      (mandi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mandi.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mandi.state.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
        <div className="text-center py-6 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            📊 Market Trends
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Get real-time commodity prices from nearby mandis and make informed selling decisions
          </p>
        </div>

        <div className="px-2 md:px-4 pb-6 space-y-4 md:space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select Commodity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="flex gap-2 md:gap-3 pb-2">
                  {commodities.map((commodity) => (
                    <div
                      key={commodity.id}
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
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {selectedCommodity && (
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
          )}

          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Loading market data...</p>
            </div>
          )}
          {error && (
            <Card className="bg-destructive/10 border-destructive/50">
              <CardContent className="text-center py-8">
                <p className="text-destructive font-semibold">{error}</p>
              </CardContent>
            </Card>
          )}
          {!loading && !error && selectedCommodity && (
            <div className="space-y-3">
              {filteredMandis.length > 0 ? (
                filteredMandis.map((mandi, index) => (
                  <Card key={mandi.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
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
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="text-lg font-bold text-primary flex items-center gap-2">
                                  ₹{mandi.currentPrice.min} – ₹{mandi.currentPrice.max}
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
                              </div>
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExpandMandi(mandi.id)}
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

                      {expandedMandi === mandi.id && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <h4 className="font-medium mb-3 text-sm">Price Trends</h4>
                          
                          <div className="h-48 w-full mb-4">
                            {historicalData[mandi.id] && (
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historicalData[mandi.id]}>
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
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : selectedCommodity ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No mandis found for the selected commodity in your location.</p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}

          {!selectedCommodity && !loading && !error && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-4xl mb-4">🌾</div>
                <h3 className="text-lg font-semibold mb-2">Select a Commodity</h3>
                <p className="text-muted-foreground">
                  Choose a commodity above to see nearby mandi prices and trends
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MarketTrends;
