import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Urea',
    price: 268,
    image: 'https://inputs.kalgudi.com/data/p_images/1564481433212.jpeg',
    description: 'At 46% this contains the highest percentage of Nitrogen and it promotes the growth of leaves and stem while optimising yield and quality',
    category: 'Fertilizer',
    compatibility: ['paddy', 'wheat', 'maize', 'and various vegetables'],
    inStock: true,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Ammonium nitrate',
    price: 22.50,
    image: 'https://images.pexels.com/photos/4132652/pexels-photo-4132652.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'It is widely used as a high-nitrogen fertilizer and, due to its explosive properties, as a component in mining and construction explosives.',
    category: 'Fertilizer',
    compatibility: ['Tomatoes', 'Peppers', 'Fruits'],
    inStock: true,
    rating: 4.3
  },
  {
    id: '3',
    name: 'Potassium Plus',
    price: 28.75,
    image: 'https://images.pexels.com/photos/4132653/pexels-photo-4132653.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Premium potassium fertilizer for stronger plants and better disease resistance.',
    category: 'Fertilizer',
    compatibility: ['Potatoes', 'Beans', 'All Crops'],
    inStock: true,
    rating: 4.7
  },
  {
    id: '4',
    name: 'pH Balancer - Lime',
    price: 15.99,
    image: 'https://images.pexels.com/photos/4132654/pexels-photo-4132654.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Agricultural lime for raising soil pH levels. Perfect for acidic soils.',
    category: 'Soil Amendment',
    compatibility: ['All Crops'],
    inStock: true,
    rating: 4.2
  },
  {
    id: '5',
    name: 'Organic Pesticide Spray',
    price: 32.00,
    image: 'https://images.pexels.com/photos/4132655/pexels-photo-4132655.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Natural pesticide made from organic ingredients. Safe for crops and environment.',
    category: 'Pesticide',
    compatibility: ['Vegetables', 'Fruits', 'Herbs'],
    inStock: true,
    rating: 4.6
  },
  {
    id: '6',
    name: 'Fungicide Solution',
    price: 35.50,
    image: 'https://images.pexels.com/photos/4132656/pexels-photo-4132656.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Effective fungicide for preventing and treating plant diseases.',
    category: 'Pesticide',
    compatibility: ['All Crops'],
    inStock: false,
    rating: 4.4
  },
  {
    id: '7',
    name: 'Soil Moisture Retainer',
    price: 19.99,
    image: 'https://images.pexels.com/photos/4132657/pexels-photo-4132657.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Hydrogel crystals that help retain soil moisture for longer periods.',
    category: 'Soil Amendment',
    compatibility: ['All Crops'],
    inStock: true,
    rating: 4.1
  },
  {
    id: '8',
    name: 'Compost Accelerator',
    price: 24.99,
    image: 'https://images.pexels.com/photos/4132658/pexels-photo-4132658.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Speeds up composting process and improves organic matter decomposition.',
    category: 'Soil Amendment',
    compatibility: ['All Crops'],
    inStock: true,
    rating: 4.5
  }
];