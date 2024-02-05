const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const cartItemSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name harus diisi!"],
      minlength: [4, "Minimal 4 karakter!"],
    },
    qty: {
      type: Number,
      required: [true, "Kuantitas harus diisi!"],
      minlength: [1, "Minimal 1 karakter!"],
    },
    price: {
      type: Number,
      required: [true, "Price harus diisi!"],
      default: 0,
    },
    image_url: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

module.exports = model("CartItem", cartItemSchema);
