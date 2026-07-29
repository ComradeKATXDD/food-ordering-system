import { Order } from "../models/Order.js";
import { User } from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, subtotal, tax, deliveryFee, deliveryAddress, customerName, customerEmail, customerPhone, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = new Order({
      user: req.user ? req.user._id : null,
      customerName: customerName || (req.user ? req.user.name : "Guest"),
      customerEmail: customerEmail || (req.user ? req.user.email : "guest@example.com"),
      customerPhone: customerPhone || (req.user ? req.user.phone : ""),
      items,
      totalAmount,
      subtotal,
      tax,
      deliveryFee: deliveryFee || 0,
      deliveryAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    const createdOrder = await order.save();

    // Increment user ordersCount & totalSpent if logged in
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { ordersCount: 1, totalSpent: totalAmount },
      });
    }

    res.status(201).json({
      ...createdOrder.toObject(),
      id: createdOrder._id.toString(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { customerEmail: req.user.email.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    const mappedOrders = orders.map((ord) => ({
      ...ord.toObject(),
      id: ord._id.toString(),
      amount: ord.totalAmount,
      date: ord.createdAt,
    }));
    res.json(mappedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    const mappedOrders = orders.map((ord) => ({
      ...ord.toObject(),
      id: ord._id.toString(),
    }));
    res.json(mappedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json({
        ...updatedOrder.toObject(),
        id: updatedOrder._id.toString(),
      });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
