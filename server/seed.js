import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { Food } from "./models/Food.js";
import { Category } from "./models/Category.js";
import { Order } from "./models/Order.js";

dotenv.config();

const sampleCategories = [
  { slug: "all", name: "All Items", icon: "🍔", description: "Explore our complete menu of delicious offerings" },
  { slug: "pizza", name: "Artisanal Pizzas", icon: "🍕", description: "Wood-fired crusts, rich sauces, and premium toppings" },
  { slug: "burgers", name: "Gourmet Burgers", icon: "🍔", description: "Juicy patties, freshly baked buns, and signature sauces" },
  { slug: "indian", name: "Indian Flavors", icon: "🍛", description: "Aromatic curries, biryanis, and oven-fresh naans" },
  { slug: "asian", name: "Asian & Chinese", icon: "🍜", description: "Authentic noodles, dim sums, and fiery wok specials" },
  { slug: "desserts", name: "Desserts & Drinks", icon: "🍰", description: "Decadent sweets, shakes, coffees, and chilled beverages" },
  { slug: "healthy", name: "Healthy Bowls", icon: "🥗", description: "Nutritious salads, protein bowls, and fresh juices" },
];

const sampleFoods = [
  {
    name: "Truffle Mushroom Pizza",
    category: "pizza",
    price: 18.99,
    rating: 4.9,
    reviewsCount: 142,
    prepTime: "20-25 min",
    isPopular: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    description: "Wood-fired crispy thin crust topped with black truffle oil, wild mushrooms, creamy mozzarella, and fresh thyme.",
    ingredients: ["Truffle Oil", "Wild Mushrooms", "Mozzarella", "Garlic Butter", "Thyme", "Parmesan"],
  },
  {
    name: "Classic Pepperoni Supreme",
    category: "pizza",
    price: 16.49,
    rating: 4.8,
    reviewsCount: 230,
    prepTime: "15-20 min",
    isPopular: true,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    description: "Loaded with crispy cupped pepperoni, rich San Marzano tomato sauce, melted mozzarella, and fresh basil.",
    ingredients: ["Pepperoni", "San Marzano Tomatoes", "Mozzarella", "Oregano", "Chili Flakes"],
  },
  {
    name: "Smoky BBQ Bacon Burger",
    category: "burgers",
    price: 14.99,
    rating: 4.7,
    reviewsCount: 188,
    prepTime: "15-20 min",
    isPopular: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    description: "Angus beef patty topped with smoked cheddar, crispy bacon, caramelized onions, crisp lettuce, and signature BBQ glaze.",
    ingredients: ["Angus Beef Patty", "Smoked Cheddar", "Crispy Bacon", "Caramelized Onion", "BBQ Sauce", "Brioche Bun"],
  },
  {
    name: "Butter Chicken with Garlic Naan",
    category: "indian",
    price: 17.50,
    rating: 4.9,
    reviewsCount: 320,
    prepTime: "25-30 min",
    isPopular: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    description: "Tender chicken pieces cooked in a rich, velvety tomato and butter cream sauce, served with freshly baked butter garlic naan.",
    ingredients: ["Chicken", "Butter", "Tomato Sauce", "Garlic Naan", "Indian Spices", "Fresh Cream"],
  },
  {
    name: "Matcha Lava Cake & Ice Cream",
    category: "desserts",
    price: 8.99,
    rating: 4.8,
    reviewsCount: 95,
    prepTime: "10-15 min",
    isPopular: false,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    description: "Warm Japanese green tea matcha molten lava cake with a flowing white chocolate core, served with vanilla bean gelato.",
    ingredients: ["Matcha Powder", "White Chocolate", "Vanilla Gelato", "Butter", "Eggs"],
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/food-ordering-db";
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected for Seeding...");

    // Clear existing data
    await Category.deleteMany({});
    await Food.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    console.log("🧹 Cleared existing database collections.");

    // Seed Categories
    await Category.insertMany(sampleCategories);
    console.log(`✅ Seeded ${sampleCategories.length} Categories.`);

    // Seed Foods
    const seededFoods = await Food.insertMany(sampleFoods);
    console.log(`✅ Seeded ${seededFoods.length} Foods.`);

    // Seed Admin & Customer Users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "adminpassword123",
      role: "admin",
      phone: "+1 (555) 000-1111",
      address: "100 Admin HQ, Tech City",
    });

    const customer = await User.create({
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      password: "userpassword123",
      role: "customer",
      phone: "+1 (555) 234-5678",
      address: "742 Evergreen Terrace, Springfield",
      ordersCount: 1,
      totalSpent: 36.49,
    });

    console.log(`✅ Seeded Admin (${admin.email}) and Customer (${customer.email}).`);

    // Seed Sample Order
    await Order.create({
      user: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      items: [
        {
          food: seededFoods[0]._id,
          name: seededFoods[0].name,
          price: seededFoods[0].price,
          quantity: 1,
          image: seededFoods[0].image,
        },
      ],
      subtotal: 18.99,
      tax: 1.5,
      deliveryFee: 2.99,
      totalAmount: 23.48,
      status: "Preparing",
      deliveryAddress: customer.address,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
    });

    console.log("✅ Seeded Sample Order.");
    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
