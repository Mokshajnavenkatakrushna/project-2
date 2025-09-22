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
    price: 225.0,
    image: 'https://image.chukouplus.com/themes/simplebootx/Upload/W_715/upload/5f9bcbca39e8c.jpg?x-oss-process=image/format,webp,image/resize,m_pad,h_800,w_800,color_FFFFFF&1',
    description: 'It is widely used as a high-nitrogen fertilizer and, due to its explosive properties, as a component in mining and construction explosives.',
    category: 'Pesticide',
    compatibility: ['Tomatoes', 'Peppers', 'Fruits'],
    inStock: true,
    rating: 4.3
  },
  {
    id: '3',
    name: 'Potassium Plus',
    price: 287.5,
    image: 'https://www.fervalle.com/wp-content/uploads/2022/02/POTASIUM-PLUS.jpg',
    description: 'Premium potassium fertilizer for stronger plants and better disease resistance.',
    category: 'Fertilizer',
    compatibility: ['Potatoes', 'Beans', 'All Crops'],
    inStock: true,
    rating: 4.7
  },
  {
    id: '4',
    name: 'pH Balancer - Lime',
    price: 159.9,
    image: 'https://m.media-amazon.com/images/I/71OANzzLopL._UF1000,1000_QL80_.jpg',
    description: 'Agricultural lime for raising soil pH levels. Perfect for acidic soils.',
    category: 'Soil Amendment',
    compatibility: ['All Crops'],
    inStock: true,
    rating: 4.2
  },
  {
    id: '5',
    name: 'Organic Pesticide Spray',
    price: 320.0,
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS-X2k2YPi6ZN--o9Bw8YoF7li9j4Mnox38_vsfG_MieqIrC4mkP7TCZJzkW_vJUaZCKaPI-d1vYuW2lxmFMglY7p2SA13q3YNnTcGXynrdthl-U6fq8n9knw',
    description: 'Natural pesticide made from organic ingredients. Safe for crops and environment.',
    category: 'Pesticide',
    compatibility: ['Vegetables', 'Fruits', 'Herbs'],
    inStock: true,
    rating: 4.6
  },
  {
    id: '6',
    name: 'Fungicide Solution',
    price: 355.0,
    image: 'https://cdn.shopify.com/s/files/1/0722/2059/files/monceren-file-719.jpg?v=1737431000',
    description: 'Effective fungicide for preventing and treating plant diseases.',
    category: 'Pesticide',
    compatibility: ['All Crops'],
    inStock: false,
    rating: 4.4
  },
  {
    id: '7',
    name: 'Soil Moisture Retainer',
    price: 199.9,
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
    price: 249.9,
    image: 'https://5.imimg.com/data5/PK/WH/YO/SELLER-6404866/solid-waste-composting-500x500.jpeg',
    description: 'Speeds up composting process and improves organic matter decomposition.',
    category: 'Soil Amendment',
    compatibility: ['All Crops'],
    inStock: true,
    rating: 4.5
  },
  {
    id: '9',
    name: 'Insecticide Spray',
    price: 289.9,
    image: 'https://m.media-amazon.com/images/I/71vWG9rgGcL.jpg',
    description: 'Effective insecticide for controlling harmful pests and protecting crops.',
    category: 'Pesticide',
    compatibility: ['Vegetables', 'Fruits', 'Grains'],
    inStock: true,
    rating: 4.2
  },
  {
    id: '10',
    name: 'Herbicide Solution',
    price: 315.0,
    image: 'https://agribegri.com/productimage/3141070211754400111.webp',
    description: 'Selective herbicide for weed control without harming crops.',
    category: 'Pesticide',
    compatibility: ['Cereals', 'Corn', 'Soybeans'],
    inStock: true,
    rating: 4.0
  }
];