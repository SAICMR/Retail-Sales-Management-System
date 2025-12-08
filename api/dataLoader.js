import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadSalesData() {
  try {
    const dataPath = path.join(__dirname, '../backend/src/data/sales_data.json');

    if (!fs.existsSync(dataPath)) {
      // Fallback: generate sample data if not present
      return generateSampleData();
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error loading data (api/dataLoader):', error);
    return generateSampleData();
  }
}

function generateSampleData() {
  // Minimal sample generator copied from backend to ensure availability in serverless function
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const genders = ['Male', 'Female', 'Other'];
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home & Garden'];
  const brands = ['BrandA', 'BrandB', 'BrandC', 'BrandD', 'BrandE'];
  const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'UPI', 'Net Banking'];
  const orderStatuses = ['Delivered', 'Pending', 'Cancelled', 'Processing'];
  const deliveryTypes = ['Standard', 'Express', 'Same Day'];
  const tags = ['Premium', 'Sale', 'New', 'Popular', 'Limited'];

  const sampleData = [];
  for (let i = 1; i <= 50; i++) {
    const quantity = Math.floor(Math.random() * 10) + 1;
    const pricePerUnit = Math.floor(Math.random() * 1000) + 100;
    const discountPercentage = Math.floor(Math.random() * 30);
    const totalAmount = quantity * pricePerUnit;
    const finalAmount = totalAmount * (1 - discountPercentage / 100);
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));

    sampleData.push({
      id: i,
      customerId: `CUST${String(i).padStart(4, '0')}`,
      customerName: `Customer ${i}`,
      phoneNumber: `+1000000000${i}`,
      gender: genders[Math.floor(Math.random() * genders.length)],
      age: Math.floor(Math.random() * 50) + 18,
      customerRegion: regions[Math.floor(Math.random() * regions.length)],
      customerType: Math.random() > 0.5 ? 'Regular' : 'Premium',
      productId: `PROD${String(i).padStart(4, '0')}`,
      productName: `Product ${i}`,
      brand: brands[Math.floor(Math.random() * brands.length)],
      productCategory: categories[Math.floor(Math.random() * categories.length)],
      tags: [tags[Math.floor(Math.random() * tags.length)]],
      quantity: quantity,
      pricePerUnit: pricePerUnit,
      discountPercentage: discountPercentage,
      totalAmount: totalAmount,
      finalAmount: Math.round(finalAmount * 100) / 100,
      date: date.toISOString().split('T')[0],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      orderStatus: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      deliveryType: deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)],
      storeId: `STORE${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`,
      storeLocation: `Store ${i}`,
      salespersonId: `EMP${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
      employeeName: `Employee ${Math.floor(Math.random() * 20) + 1}`
    });
  }

  return sampleData;
}
