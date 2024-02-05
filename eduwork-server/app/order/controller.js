const Order = require("./model");
const DeliveryAddress = require("../deliveryAddress/model");

const store = async (req, res, next) => {
  try {
    const { delivery_fee, delivery_address, cart } = req.body;

    const address = await DeliveryAddress.findById(delivery_address);

    const order = new Order({
      status: "waiting_payment",
      delivery_fee,
      delivery_address: {
        kelurahan: address.kelurahan,
        kecamatan: address.kecamatan,
        kabupaten: address.kabupaten,
        provinsi: address.provinsi,
        detail: address.detail,
      },
      user: req.user._id,
      cart: cart,
    });

    await order.save();

    res.status(201).json({ message: "Success Create Order", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};
const index = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).exec();

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Internal Server Error" });
    next(err);
  }
};

module.exports = { store, index };
