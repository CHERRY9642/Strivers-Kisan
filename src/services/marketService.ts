
import axios from 'axios';

const API_KEY = '579b464db66ec23bdd0000011cf3d78fcf494f4164cdccb8704c30e8';
const CURRENT_PRICE_API_URL = 'https://api.data.gov.in/resource/3598678-0d79-46b4-9ed6-6f13308a1d24';
const HISTORICAL_PRICE_API_URL = 'https://api.data.gov.in/resource/3598678-0d79-46b4-9ed6-6f13308a1d24';

export interface MarketData {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

export const fetchMarketData = async (filters: any = {}): Promise<MarketData[]> => {
  try {
    const response = await axios.get(CURRENT_PRICE_API_URL, {
      params: {
        'api-key': API_KEY,
        format: 'json',
        limit: 1000,
        ...filters,
      },
    });
    return response.data.records;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

export const fetchHistoricalMarketData = async (filters: any = {}): Promise<MarketData[]> => {
  try {
    const response = await axios.get(HISTORICAL_PRICE_API_URL, {
      params: {
        'api-key': API_KEY,
        format: 'json',
        limit: 1000,
        ...filters,
      },
    });
    return response.data.records;
  } catch (error) {
    console.error('Error fetching historical market data:', error);
    throw error;
  }
};
