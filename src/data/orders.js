export const initialOrders = [
  {
    id: "ORD-9821",
    customerId: "user-1",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Springfield",
    date: "2026-07-22 14:15",
    items: [
      { id: "food-1", name: "Truffle Mushroom Pizza", price: 18.99, quantity: 1, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80" },
      { id: "food-9", name: "Belgian Chocolate Lava Cake", price: 8.99, quantity: 2, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80" }
    ],
    amount: 36.97,
    paymentMethod: "UPI",
    status: "Preparing"
  },
  {
    id: "ORD-9820",
    customerId: "user-2",
    customerName: "Alex Rivera",
    customerEmail: "alex.r@example.com",
    phone: "+1 (555) 876-5432",
    address: "104 West 57th Street, New York",
    date: "2026-07-22 13:40",
    items: [
      { id: "food-3", name: "Smoky BBQ Bacon Burger", price: 14.99, quantity: 2, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" },
      { id: "food-10", name: "Salted Caramel Shake", price: 6.99, quantity: 2, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80" }
    ],
    amount: 43.96,
    paymentMethod: "Credit/Debit Card",
    status: "Out for Delivery"
  },
  {
    id: "ORD-9819",
    customerId: "user-3",
    customerName: "David Chen",
    customerEmail: "david.c@example.com",
    phone: "+1 (555) 456-7890",
    address: "350 5th Ave, New York",
    date: "2026-07-22 12:10",
    items: [
      { id: "food-5", name: "Butter Chicken & Garlic Naan", price: 17.50, quantity: 2, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80" }
    ],
    amount: 35.00,
    paymentMethod: "Cash on Delivery",
    status: "Delivered"
  },
  {
    id: "ORD-9818",
    customerId: "user-4",
    customerName: "Emily Watson",
    customerEmail: "emily.w@example.com",
    phone: "+1 (555) 345-6789",
    address: "120 Market St, San Francisco",
    date: "2026-07-21 19:30",
    items: [
      { id: "food-11", name: "Grilled Chicken Protein Bowl", price: 14.49, quantity: 1, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" },
      { id: "food-18", name: "Berry Acai Energy Smoothie Bowl", price: 12.49, quantity: 1, image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80" }
    ],
    amount: 26.98,
    paymentMethod: "UPI",
    status: "Delivered"
  },
  {
    id: "ORD-9817",
    customerId: "user-5",
    customerName: "Michael Chang",
    customerEmail: "michael.c@example.com",
    phone: "+1 (555) 987-6543",
    address: "888 Broadway, New York",
    date: "2026-07-21 18:15",
    items: [
      { id: "food-8", name: "Steamed Chicken Dim Sums", price: 11.49, quantity: 3, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80" }
    ],
    amount: 34.47,
    paymentMethod: "Credit/Debit Card",
    status: "Cancelled"
  },
  {
    id: "ORD-9816",
    customerId: "user-6",
    customerName: "Jessica Alba",
    customerEmail: "jessica.a@example.com",
    phone: "+1 (555) 654-3210",
    address: "45 Sunset Blvd, Los Angeles",
    date: "2026-07-21 14:00",
    items: [
      { id: "food-4", name: "Double Smash Avocado Cheeseburger", price: 15.79, quantity: 1, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80" },
      { id: "food-14", name: "Crispy Korean Fried Chicken Burger", price: 14.99, quantity: 1, image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80" }
    ],
    amount: 30.78,
    paymentMethod: "UPI",
    status: "Delivered"
  },
  {
    id: "ORD-9815",
    customerId: "user-7",
    customerName: "Robert Downey",
    customerEmail: "robert.d@example.com",
    phone: "+1 (555) 789-0123",
    address: "100 Stark Tower, Malibu",
    date: "2026-07-20 20:45",
    items: [
      { id: "food-19", name: "Spicy Garlic Prawn Pizza", price: 19.99, quantity: 2, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80" },
      { id: "food-20", name: "Mango Passion Fruit Cooler", price: 5.99, quantity: 2, image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80" }
    ],
    amount: 51.96,
    paymentMethod: "Credit/Debit Card",
    status: "Delivered"
  },
  {
    id: "ORD-9814",
    customerId: "user-8",
    customerName: "Olivia Martinez",
    customerEmail: "olivia.m@example.com",
    phone: "+1 (555) 210-9876",
    address: "520 Michigan Ave, Chicago",
    date: "2026-07-20 17:20",
    items: [
      { id: "food-6", name: "Hyderabadi Dum Chicken Biryani", price: 16.99, quantity: 1, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80" },
      { id: "food-15", name: "Paneer Tikka Masala", price: 15.49, quantity: 1, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80" }
    ],
    amount: 32.48,
    paymentMethod: "Cash on Delivery",
    status: "Delivered"
  },
  {
    id: "ORD-9813",
    customerId: "user-1",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Springfield",
    date: "2026-07-19 13:10",
    items: [
      { id: "food-2", name: "Classic Pepperoni Supreme", price: 16.49, quantity: 1, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80" }
    ],
    amount: 16.49,
    paymentMethod: "UPI",
    status: "Delivered"
  },
  {
    id: "ORD-9812",
    customerId: "user-2",
    customerName: "Alex Rivera",
    customerEmail: "alex.r@example.com",
    phone: "+1 (555) 876-5432",
    address: "104 West 57th Street, New York",
    date: "2026-07-18 21:00",
    items: [
      { id: "food-16", name: "Pad Thai Seafood Noodles", price: 16.99, quantity: 2, image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80" },
      { id: "food-17", name: "New York Style Cheesecake", price: 7.99, quantity: 1, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80" }
    ],
    amount: 41.97,
    paymentMethod: "Credit/Debit Card",
    status: "Delivered"
  }
];
