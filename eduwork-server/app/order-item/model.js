const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
  name: {
    type: String,
    required: [true, "Name harus diisi!"],
    minlength: [4, "Minimal 4 karakter!"],
  },
  price: {
    type: Number,
    required: [true, "Price harus diisi!"],
  },
  qty: {
    type: Number,
    required: [true, "Kuantitas harus diisi!"],
    minlength: [1, "Minimal 1 karakter!"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

module.exports = model("OrderItem", orderItemSchema);
