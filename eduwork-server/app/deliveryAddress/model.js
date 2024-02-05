const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const deliveryAddressSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name harus diisi!"],
      minlength: [4, "Minimal 4 karakter!"],
    },
    kelurahan: {
      type: String,
      required: [true, "Kelurahan harus diisi!"],
      maxlength: [1000, "Maksimal 1000 karakter!"],
    },
    kecamatan: {
      type: String,
      required: [true, "Kecamatan harus diisi!"],
      maxlength: [255, "Maksimal 255 karakter!"],
    },
    kabupaten: {
      type: String,
      required: [true, "Kabupaten harus diisi!"],
      maxlength: [255, "Maksimal 255 karakter!"],
    },
    provinsi: {
      type: String,
      required: [true, "Provinsi harus diisi!"],
      maxlength: [255, "Maksimal 255 karakter!"],
    },
    detail: {
      type: String,
      required: [true, "Detail harus diisi!"],
      maxlength: [1000, "Maksimal 1000 karakter!"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);
