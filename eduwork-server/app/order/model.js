const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const Invoice = require("../invoice/model");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = Schema(
  {
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    delivery_address: {
      provinsi: { type: String, required: [true, "Provinsi harus diisi!"] },
      kabupaten: { type: String, required: [true, "Kabupaten harus diisi!"] },
      kecamatan: { type: String, required: [true, "Kecamatan harus diisi!"] },
      kelurahan: { type: String, required: [true, "Kelurahan harus diisi!"] },
      detail: { type: String },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cart: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, default: 0 },
        image_url: String,
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.post("save", async function () {
  const cartData = this.cart;

  let sub_total = cartData.reduce(
    (total, item) => (total += item.price * item.qty),
    0
  );

  let invoice = new Invoice({
    user: this.user,
    order: this._id,
    sub_total: sub_total,
    delivery_fee: parseInt(this.delivery_fee),
    total: parseInt(sub_total + this.delivery_fee),
    delivery_address: this.delivery_address,
  });

  await invoice.save();
});

module.exports = model("OrderItem", orderSchema);
