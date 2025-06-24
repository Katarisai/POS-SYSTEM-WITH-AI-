require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// Serve static files (public and bills)
const billsDir = path.join(__dirname, 'bills');
if (!fs.existsSync(billsDir)) {
  fs.mkdirSync(billsDir);
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bills', express.static(billsDir));

// ===== MONGODB SETUP =====
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-pos';
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
})
  .then(async () => {
    console.log('✅ MongoDB connected successfully to:', mongoURI);
    // Seed products if none exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany([
        { name: "Frozen - Peas #100", price: 20.2, stock: 32, category: "Frozen", imageUrl: "https://images.unsplash.com/photo-1606851441820-0a1d1f87c9b8" },
        { name: "Snack - Chips #101", price: 17.69, stock: 66, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Vegetable - Tomato #102", price: 21.97, stock: 53, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Dairy - Milk #103", price: 29.4, stock: 13, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Frozen - Peas #104", price: 9.13, stock: 22, category: "Frozen", imageUrl: "https://images.unsplash.com/photo-1606851441820-0a1d1f87c9b8" },
        { name: "Bakery - Bread #105", price: 26.13, stock: 36, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Bakery - Cake #106", price: 6.74, stock: 24, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Snack - Chips #107", price: 26.64, stock: 55, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Fruit - Orange #108", price: 23.35, stock: 77, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Fruit - Banana #109", price: 26.83, stock: 56, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Vegetable - Onion #110", price: 19.67, stock: 67, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Dairy - Yogurt #111", price: 34.53, stock: 52, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Vegetable - Peas #112", price: 13.13, stock: 78, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Beverage - Juice #113", price: 31.84, stock: 13, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Frozen - Peas #114", price: 14.71, stock: 38, category: "Frozen", imageUrl: "https://images.unsplash.com/photo-1606851441820-0a1d1f87c9b8" },
        { name: "Vegetable - Onion #115", price: 22.09, stock: 46, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Fruit - Orange #116", price: 11.01, stock: 48, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Dairy - Milk #117", price: 39.4, stock: 86, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Grocery - Noodles #118", price: 20.61, stock: 32, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Grocery - Noodles #119", price: 16.97, stock: 86, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Fruit - Apple #120", price: 25.28, stock: 60, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Bakery - Bread #121", price: 29.15, stock: 66, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Snack - Chips #122", price: 24.14, stock: 16, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Grocery - Oil #123", price: 11.22, stock: 29, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Tomato #124", price: 18.6, stock: 55, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Bakery - Cake #125", price: 33.33, stock: 30, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Grocery - Oil #126", price: 9.37, stock: 20, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Fruit - Apple #127", price: 20.22, stock: 91, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Grocery - Rice #128", price: 5.55, stock: 88, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Grocery - Noodles #129", price: 20.43, stock: 67, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Onion #130", price: 11.0, stock: 85, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Dairy - Yogurt #131", price: 29.73, stock: 24, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Fruit - Banana #132", price: 38.71, stock: 64, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Fruit - Orange #133", price: 37.67, stock: 30, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Grocery - Oil #134", price: 16.24, stock: 18, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Grocery - Salt #135", price: 28.33, stock: 57, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Dairy - Milk #136", price: 4.41, stock: 14, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Snack - Cookies #137", price: 7.05, stock: 44, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Frozen - Peas #138", price: 23.24, stock: 17, category: "Frozen", imageUrl: "https://images.unsplash.com/photo-1606851441820-0a1d1f87c9b8" },
        { name: "Vegetable - Tomato #139", price: 10.55, stock: 78, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Grocery - Noodles #140", price: 15.45, stock: 42, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Bakery - Cake #141", price: 39.92, stock: 30, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Snack - Cookies #142", price: 18.28, stock: 68, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Dairy - Yogurt #143", price: 7.31, stock: 82, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Snack - Chips #144", price: 12.08, stock: 86, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Grocery - Salt #145", price: 6.13, stock: 20, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Fruit - Apple #146", price: 4.7, stock: 99, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Snack - Chips #147", price: 34.27, stock: 37, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Vegetable - Onion #148", price: 13.96, stock: 19, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Dairy - Milk #149", price: 14.48, stock: 71, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Vegetable - Onion #150", price: 11.49, stock: 16, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Beverage - Soda #151", price: 18.95, stock: 99, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Snack - Cookies #152", price: 36.93, stock: 50, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Snack - Cookies #153", price: 18.23, stock: 48, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Grocery - Salt #154", price: 13.91, stock: 99, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Fruit - Banana #155", price: 7.14, stock: 85, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Beverage - Juice #156", price: 36.83, stock: 13, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Snack - Chips #157", price: 28.34, stock: 11, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Vegetable - Peas #158", price: 22.88, stock: 63, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Grocery - Sugar #159", price: 28.95, stock: 15, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Bakery - Cake #160", price: 31.22, stock: 46, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Dairy - Yogurt #161", price: 22.67, stock: 62, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Grocery - Oil #162", price: 15.85, stock: 14, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Snack - Chips #163", price: 25.88, stock: 33, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Beverage - Soda #164", price: 19.29, stock: 17, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Vegetable - Peas #165", price: 15.34, stock: 54, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Snack - Cookies #166", price: 21.09, stock: 31, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Dairy - Milk #167", price: 38.65, stock: 58, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Dairy - Milk #168", price: 21.57, stock: 67, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Vegetable - Peas #169", price: 31.13, stock: 75, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Grocery - Oil #170", price: 16.81, stock: 16, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Peas #171", price: 35.65, stock: 89, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Bakery - Cake #172", price: 36.51, stock: 30, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Bakery - Cake #173", price: 15.66, stock: 93, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Fruit - Apple #174", price: 14.51, stock: 47, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Vegetable - Onion #175", price: 3.88, stock: 69, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Grocery - Rice #176", price: 8.21, stock: 45, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Grocery - Rice #177", price: 31.89, stock: 76, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Beverage - Juice #178", price: 37.96, stock: 12, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Grocery - Salt #179", price: 5.99, stock: 93, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Fruit - Apple #180", price: 20.45, stock: 46, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Grocery - Salt #181", price: 22.32, stock: 99, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Peas #182", price: 30.07, stock: 52, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Grocery - Sugar #183", price: 26.78, stock: 14, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Peas #184", price: 35.04, stock: 10, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Grocery - Noodles #185", price: 23.27, stock: 44, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Grocery - Noodles #186", price: 36.9, stock: 45, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Dairy - Yogurt #187", price: 30.18, stock: 62, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Grocery - Sugar #188", price: 39.59, stock: 61, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Fruit - Apple #189", price: 32.31, stock: 37, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Dairy - Yogurt #190", price: 7.73, stock: 21, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Snack - Chips #191", price: 39.08, stock: 39, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Grocery - Rice #192", price: 26.37, stock: 49, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Peas #193", price: 28.68, stock: 24, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Vegetable - Tomato #194", price: 30.36, stock: 57, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Grocery - Noodles #195", price: 24.01, stock: 99, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Grocery - Salt #196", price: 22.14, stock: 62, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Bakery - Bread #197", price: 33.38, stock: 22, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Dairy - Milk #198", price: 27.76, stock: 29, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Snack - Cookies #199", price: 25.62, stock: 22, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Bakery - Cake #200", price: 3.79, stock: 43, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Grocery - Sugar #201", price: 7.03, stock: 84, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Onion #202", price: 22.01, stock: 76, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Bakery - Cake #203", price: 4.11, stock: 44, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Dairy - Milk #204", price: 4.27, stock: 25, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Fruit - Banana #205", price: 34.52, stock: 87, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Grocery - Salt #206", price: 32.71, stock: 48, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Snack - Chips #207", price: 29.76, stock: 55, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Bakery - Bread #208", price: 6.28, stock: 68, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Bakery - Cake #209", price: 17.78, stock: 47, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Grocery - Rice #210", price: 21.88, stock: 77, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Onion #211", price: 17.55, stock: 20, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Fruit - Orange #212", price: 35.93, stock: 56, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Beverage - Soda #213", price: 34.34, stock: 75, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Grocery - Oil #214", price: 32.27, stock: 13, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Tomato #215", price: 19.67, stock: 14, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Snack - Chips #216", price: 34.04, stock: 94, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Vegetable - Tomato #217", price: 16.98, stock: 21, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Snack - Cookies #218", price: 15.93, stock: 97, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Fruit - Apple #219", price: 4.68, stock: 30, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Snack - Chips #220", price: 31.0, stock: 82, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Beverage - Juice #221", price: 33.22, stock: 68, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Beverage - Juice #222", price: 12.6, stock: 68, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Snack - Cookies #223", price: 15.17, stock: 66, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Dairy - Milk #224", price: 21.45, stock: 60, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Fruit - Orange #225", price: 18.06, stock: 52, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Beverage - Soda #226", price: 35.81, stock: 47, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Frozen - Peas #227", price: 33.18, stock: 31, category: "Frozen", imageUrl: "https://images.unsplash.com/photo-1606851441820-0a1d1f87c9b8" },
        { name: "Grocery - Rice #228", price: 8.66, stock: 76, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Bakery - Cake #229", price: 37.41, stock: 42, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Frozen - Peas #230", price: 39.16, stock: 53, category: "Frozen", imageUrl: "https://images.unsplash.com/photo-1606851441820-0a1d1f87c9b8" },
        { name: "Beverage - Soda #231", price: 34.49, stock: 20, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Beverage - Juice #232", price: 19.59, stock: 42, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Dairy - Yogurt #233", price: 29.13, stock: 48, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Vegetable - Peas #234", price: 35.39, stock: 61, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Snack - Cookies #235", price: 14.78, stock: 99, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Dairy - Yogurt #236", price: 39.38, stock: 35, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Dairy - Yogurt #237", price: 28.38, stock: 69, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Frozen - Peas #238", price: 31.74, stock: 29, category: "Frozen", imageUrl: "https://images.unsplash.com/photo-1606851441820-0a1d1f87c9b8" },
        { name: "Vegetable - Tomato #239", price: 24.18, stock: 62, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Frozen - Peas #240", price: 25.37, stock: 34, category: "Frozen", imageUrl: "https://images.unsplash.com/photo-1606851441820-0a1d1f87c9b8" },
        { name: "Vegetable - Onion #241", price: 37.68, stock: 93, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Grocery - Noodles #242", price: 19.74, stock: 83, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Dairy - Milk #243", price: 35.48, stock: 20, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Fruit - Apple #244", price: 34.43, stock: 34, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Fruit - Orange #245", price: 6.82, stock: 56, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Dairy - Yogurt #246", price: 24.28, stock: 74, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Grocery - Oil #247", price: 39.5, stock: 62, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Grocery - Rice #248", price: 12.11, stock: 92, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Snack - Cookies #249", price: 37.75, stock: 66, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Snack - Chips #250", price: 6.34, stock: 99, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Grocery - Oil #251", price: 31.67, stock: 73, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Onion #252", price: 21.85, stock: 61, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Grocery - Salt #253", price: 3.51, stock: 61, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Fruit - Banana #254", price: 14.75, stock: 36, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Dairy - Yogurt #255", price: 17.75, stock: 22, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Beverage - Soda #256", price: 35.76, stock: 77, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Fruit - Orange #257", price: 25.23, stock: 43, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Fruit - Apple #258", price: 3.89, stock: 64, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Snack - Cookies #259", price: 16.95, stock: 77, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Vegetable - Peas #260", price: 33.08, stock: 34, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Bakery - Cake #261", price: 22.09, stock: 78, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Grocery - Sugar #262", price: 12.01, stock: 86, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Beverage - Soda #263", price: 15.38, stock: 63, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Vegetable - Tomato #264", price: 35.12, stock: 58, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Dairy - Milk #265", price: 33.0, stock: 28, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Dairy - Milk #266", price: 19.89, stock: 27, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Vegetable - Tomato #267", price: 37.57, stock: 28, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Fruit - Apple #268", price: 15.44, stock: 70, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Fruit - Apple #269", price: 8.8, stock: 31, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Grocery - Salt #270", price: 15.53, stock: 96, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Grocery - Oil #271", price: 34.93, stock: 39, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Bakery - Cake #272", price: 11.73, stock: 88, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Frozen - Peas #273", price: 21.8, stock: 57, category: "Frozen", imageUrl: "https://images.unsplash.com/photo-1606851441820-0a1d1f87c9b8" },
        { name: "Grocery - Noodles #274", price: 10.48, stock: 21, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Onion #275", price: 25.58, stock: 84, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Bakery - Cake #276", price: 25.1, stock: 83, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Dairy - Yogurt #277", price: 28.68, stock: 36, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Dairy - Yogurt #278", price: 29.66, stock: 31, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Dairy - Milk #279", price: 22.95, stock: 66, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Dairy - Yogurt #280", price: 34.82, stock: 14, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Fruit - Apple #281", price: 24.63, stock: 74, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
        { name: "Vegetable - Tomato #282", price: 10.33, stock: 97, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Beverage - Soda #283", price: 24.64, stock: 72, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Grocery - Oil #284", price: 38.65, stock: 29, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Dairy - Yogurt #285", price: 10.53, stock: 86, category: "Dairy", imageUrl: "https://images.unsplash.com/photo-1602081113821-1481a2d1d673" },
        { name: "Vegetable - Tomato #286", price: 35.23, stock: 86, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Grocery - Oil #287", price: 7.39, stock: 64, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Vegetable - Tomato #288", price: 15.4, stock: 31, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Snack - Chips #289", price: 22.16, stock: 61, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Grocery - Sugar #290", price: 29.29, stock: 82, category: "Grocery", imageUrl: "https://images.unsplash.com/photo-1543165362-5a2c6f5e24b3" },
        { name: "Snack - Cookies #291", price: 8.51, stock: 28, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Bakery - Cake #292", price: 32.97, stock: 58, category: "Bakery", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
        { name: "Snack - Chips #293", price: 22.06, stock: 73, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Beverage - Soda #294", price: 13.97, stock: 14, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Beverage - Juice #295", price: 34.48, stock: 14, category: "Beverage", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd3d5129" },
        { name: "Frozen - Peas #296", price: 31.6, stock: 69, category: "Frozen", imageUrl: "https://images.unsplash.com/photo-1606851441820-0a1d1f87c9b8" },
        { name: "Snack - Chips #297", price: 22.64, stock: 61, category: "Snack", imageUrl: "https://images.unsplash.com/photo-1612984340028-5a90a6f8e3e3" },
        { name: "Vegetable - Peas #298", price: 22.16, stock: 38, category: "Vegetable", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
        { name: "Fruit - Apple #299", price: 19.93, stock: 89, category: "Fruit", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" }
      ]);
      console.log('Seeded 200 products with images');
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('MongoDB URI:', mongoURI);
    console.error('Please ensure MongoDB is running on localhost:27017 or check the MONGODB_URI in .env');
    process.exit(1);
  });

// ===== MODELS =====
const Product = mongoose.model('Product', {
  name: String,
  price: Number,
  stock: Number,
  category: String,
  imageUrl: String // Added imageUrl field
});

const Customer = mongoose.model('Customer', {
  phone: String,
  name: String,
  telegramChatId: String
});

const Order = mongoose.model('Order', {
  customerPhone: String,
  customerName: String,
  items: [{
    productId: String,
    name: String,
    quantity: Number,
    price: Number
  }],
  total: Number,
  tax: Number,
  discount: Number,
  grandTotal: Number,
  paymentType: String,
  promoCode: String,
  createdAt: { type: Date, default: Date.now }
});

// ===== TELEGRAM BOT SETUP =====
let bot;
try {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.ADMIN_CHAT_ID;
  if (!telegramBotToken) {
    console.error('❌ TELEGRAM_BOT_TOKEN is not set in .env file');
    process.exit(1);
  }
  if (!adminChatId) {
    console.error('❌ ADMIN_CHAT_ID is not set in .env file');
    process.exit(1);
  }
  bot = new TelegramBot(telegramBotToken, { polling: true });
  console.log('✅ Telegram bot initialized successfully');

  // Handle polling errors
  bot.on('polling_error', (error) => {
    console.error('❌ Telegram bot polling error:', error.message);
  });

  // Store users who have started a chat and are pending phone number input
  const pendingPhoneUsers = new Map();

  // Handle /start command to prompt for phone number
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`Received /start command from chat ID: ${chatId}`);
    bot.sendMessage(chatId, 'Welcome to Smart POS! Please provide your phone number (e.g., +919876543210) to receive order notifications.');
    pendingPhoneUsers.set(chatId, true);
  });

  // Handle phone number input
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (pendingPhoneUsers.has(chatId) && text !== '/start') {
      const phone = text.trim();
      // Basic phone number validation
      if (!phone.match(/^\+\d{10,15}$/)) {
        bot.sendMessage(chatId, 'Invalid phone number format. Please provide a valid phone number (e.g., +919876543210).');
        return;
      }

      try {
        await Customer.findOneAndUpdate(
          { phone },
          { telegramChatId: chatId },
          { upsert: true }
        );
        bot.sendMessage(chatId, `Your phone number ${phone} is linked for Smart POS order notifications.`);
        console.log(`Linked phone ${phone} to chat ID: ${chatId}`);
        pendingPhoneUsers.delete(chatId);
      } catch (error) {
        console.error('❌ Error linking phone number:', error.message);
        bot.sendMessage(chatId, 'Error linking your phone number. Please try again later.');
      }
    }
  });
} catch (error) {
  console.error('❌ Failed to initialize Telegram bot:', error.message);
  process.exit(1);
}

// ===== DATE FORMATTING FUNCTION =====
function formatDate(date) {
  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
  const optionsDay = { weekday: 'long' };
  const optionsDate = { month: 'long', day: 'numeric', year: 'numeric' };
  
  const time = date.toLocaleTimeString('en-US', optionsTime).replace(':', ':');
  const day = date.toLocaleDateString('en-US', optionsDay);
  const datePart = date.toLocaleDateString('en-US', optionsDate);
  
  return `${time} IST on ${day}, ${datePart}`;
}

// ===== FUNCTION TO GENERATE PDF BILL =====
function generateBillPDF(order, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('🧾 Smart POS - Bill', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${formatDate(new Date(order.createdAt))}`);
    doc.text(`Customer: ${order.customerName || 'N/A'}`);
    doc.text(`Phone: ${order.customerPhone || 'N/A'}`);
    doc.moveDown();

    doc.text('Items:', { underline: true });
    order.items.forEach(item => {
      doc.text(`${item.name} - ₹${item.price.toFixed(2)} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: ₹${order.total.toFixed(2)}`);
    doc.text(`Tax: ₹${order.tax.toFixed(2)}`);
    doc.text(`Discount: ₹${order.discount.toFixed(2)}`);
    doc.text(`Grand Total: ₹${order.grandTotal.toFixed(2)}`);
    doc.moveDown();

    doc.text(`Payment Type: ${order.paymentType}`);
    if (order.promoCode) doc.text(`Promo Code: ${order.promoCode}`);

    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

// ===== FUNCTION TO FORMAT BILL AS TEXT =====
function formatBillAsText(order) {
  const itemsList = order.items.map(item =>
    `${item.name} - ₹${item.price.toFixed(2)} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  return `
🧾 <b>Smart POS - Bill</b>

Order ID: ${order._id}
Date: ${formatDate(new Date(order.createdAt))}
Customer: ${order.customerName || 'N/A'}
Phone: ${order.customerPhone || 'N/A'}

<b>Items:</b>
${itemsList}

Subtotal: ₹${order.total.toFixed(2)}
Tax: ₹${order.tax.toFixed(2)}
Discount: ₹${order.discount.toFixed(2)}
<b>Grand Total: ₹${order.grandTotal.toFixed(2)}</b>

Payment Type: ${order.paymentType}
${order.promoCode ? `Promo Code: ${order.promoCode}` : ''}
`;
}

// ===== GENERATE ORDER CONFIRMATION MESSAGE (FALLBACK) =====
function generateOrderMessage(customerName, items) {
  const itemList = items.map(i => `${i.quantity} x ${i.name}`).join(', ');
  return `Dear ${customerName}, your order of ${itemList} is confirmed. Thank you for shopping with Smart POS!`;
}

// ===== GENERATE RECOMMENDATIONS =====
function getCategoryFromName(name) {
  const match = name.match(/^(\w+)/);
  return match ? match[1] : 'General';
}

async function generateRecommendations(items) {
  console.log('Generating recommendations for items:', items.map(i => i.name));
  try {
    const allProducts = await Product.find({});
    if (!allProducts.length) {
      console.warn('⚠ No products in database for recommendations');
      return [];
    }

    const orderedItemNames = items.map(item => item.name);
    let orderedCategories = [];
    items.forEach(item => {
      const product = allProducts.find(p => p.name === item.name);
      const category = product && product.category && product.category !== 'None' ? product.category : getCategoryFromName(item.name);
      if (category) orderedCategories.push(category);
    });

    let recommendations = await Product.find({
      name: { $nin: orderedItemNames },
      category: { $in: orderedCategories }
    }).limit(3).select('name');

    if (!recommendations.length) {
      const nameCategories = orderedCategories.map(cat => new RegExp(`^${cat}`, 'i'));
      recommendations = await Product.find({
        name: { $nin: orderedItemNames, $regex: nameCategories.join('|') }
      }).limit(3).select('name');
    }

    if (!recommendations.length) {
      recommendations = await Product.find({ name: { $nin: orderedItemNames } }).limit(3).select('name');
    }

    const recommendationNames = recommendations.map(p => p.name);
    console.log('Recommendations:', recommendationNames);
    return recommendationNames;
  } catch (error) {
    console.error('❌ Recommendation error:', error.message);
    const fallback = await Product.find({ name: { $nin: items.map(i => i.name) } })
      .limit(3)
      .select('name');
    const recommendationNames = fallback.map(p => p.name);
    console.log('Ultimate fallback recommendations:', recommendationNames);
    return recommendationNames;
  }
}

// ===== SEND TELEGRAM MESSAGES =====
async function sendTelegramMessages(phone, fileUrl, order) {
  console.log('Attempting to send Telegram messages to phone:', phone);
  const adminChatId = process.env.ADMIN_CHAT_ID;
  const orderUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/order/${order._id}`;
  const billText = formatBillAsText(order);
  let telegramResult = { success: true, message: 'Notifications sent successfully.' };

  try {
    if (!phone) {
      console.log('No phone number provided, skipping customer message send');
      telegramResult.customerSuccess = false;
      telegramResult.customerError = 'No phone number provided.';
    } else {
      const customer = await Customer.findOne({ phone });
      if (!customer || !customer.telegramChatId) {
        console.error('❌ No chat ID found for phone:', phone);
        telegramResult.customerSuccess = false;
        telegramResult.customerError = 'Please start a chat with @SmartPOSBot and provide your phone number to receive notifications.';
      } else {
        const chatId = customer.telegramChatId;
        const recommendations = await generateRecommendations(order.items);
        const recommendationText = recommendations.length ? `\n<b>We recommend:</b> ${recommendations.join(', ')}` : '\n<b>No recommendations available.</b>';

        // Send Checkout Notification
        await bot.sendMessage(chatId, '✅ Checkout Successful! Your order has been placed.', { parse_mode: 'HTML' });
        console.log('✅ Checkout notification sent to chat ID:', chatId);

        // Send Order Confirmation Notification
        const orderMessage = generateOrderMessage(order.customerName || 'Customer', order.items);
        await bot.sendMessage(chatId, orderMessage, { parse_mode: 'HTML' });
        console.log('✅ Order confirmation notification sent to chat ID:', chatId);

        // Send Bill Generation Notification
        const billMessage = `${billText}${recommendationText}\nBill PDF: ${fileUrl}\nView Order: ${orderUrl}`;
        await bot.sendMessage(chatId, billMessage, { parse_mode: 'HTML' });
        console.log('✅ Bill generation notification sent to chat ID:', chatId);

        telegramResult.customerSuccess = true;
      }
    }

    // Send Admin Notification
    try {
      const adminMessage = `
📦 <b>New Order Placed</b>
Order ID: ${order._id}
Customer: ${order.customerName || 'N/A'}
Phone: ${order.customerPhone || 'N/A'}
Grand Total: ₹${order.grandTotal.toFixed(2)}
View Order: ${orderUrl}
      `;
      await bot.sendMessage(adminChatId, adminMessage, { parse_mode: 'HTML' });
      console.log('✅ Admin notification sent to chat ID:', adminChatId);
      telegramResult.adminSuccess = true;
    } catch (adminError) {
      console.error('❌ Admin Telegram send error:', adminError.message);
      telegramResult.adminSuccess = false;
      telegramResult.adminError = 'Failed to send admin notification.';
    }

    return telegramResult;
  } catch (error) {
    console.error('❌ Telegram send error:', error.message);
    telegramResult.customerSuccess = false;
    telegramResult.customerError = 'Failed to send customer Telegram messages.';
    return telegramResult;
  }
}

// ===== API ROUTES =====
app.get('/api/products', async (req, res) => {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i');
    const products = await Product.find({ name: regex });
    res.json(products);
  } catch (error) {
    console.error('❌ Products fetch error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    if (!product.category || product.category === 'None') {
      product.category = getCategoryFromName(product.name);
    }
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Product add error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const recommendations = await generateRecommendations(order.items);
    res.json({ order, recommendations });
  } catch (error) {
    console.error('❌ Order fetch error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, taxRate, discount, paymentType, promoCode, customerName, customerPhone } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (customerPhone && customerName) {
      await Customer.findOneAndUpdate(
        { phone: customerPhone },
        { name: customerName },
        { upsert: true, new: true }
      );
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = total * (taxRate || 0.1);
    const finalDiscount = discount || 0;
    const grandTotal = total + tax - finalDiscount;

    const order = new Order({
      customerPhone,
      customerName,
      items,
      total,
      tax,
      discount: finalDiscount,
      grandTotal,
      paymentType,
      promoCode
    });

    await order.save();

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    const pdfFileName = `bill_${order._id}.pdf`;
    const pdfPath = path.join(billsDir, pdfFileName);
    const fileUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/bills/${pdfFileName}`;
    await generateBillPDF(order, pdfPath);

    const telegramResult = await sendTelegramMessages(customerPhone, fileUrl, order);

    res.json({
      message: telegramResult.customerSuccess ? 'Order placed and notifications sent to Telegram' : `Order placed, but Telegram notifications failed: ${telegramResult.customerError}`,
      order,
      billUrl: `/bills/${pdfFileName}`,
      orderUrl: `/order/${order._id}`,
      telegramResult
    });
  } catch (error) {
    console.error('❌ Order error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Orders fetch error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Order.aggregate([
      {
        $group: {
          _id: '$customerPhone',
          totalSpent: { $sum: '$grandTotal' },
          name: { $first: '$customerName' }
        }
      },
      {
        $project: {
          phone: '$_id',
          name: 1,
          totalSpent: 1,
          _id: 0
        }
      }
    ]);
    res.json(customers);
  } catch (error) {
    console.error('❌ Customers fetch error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/order/:id', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'order-confirmation.html');
  console.log(`Attempting to serve order-confirmation.html at: ${filePath}`);
  if (fs.existsSync(filePath)) {
    console.log(`Serving order-confirmation.html for order ID: ${req.params.id}`);
    res.sendFile(filePath);
  } else {
    console.error(`Order confirmation page not found at: ${filePath}`);
    res.status(404).send('Order confirmation page not found');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});