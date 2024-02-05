const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const { police_check } = require("../../middlewares");

const categorySchema = Schema({
  name: {
    type: String,
    required: [true, "Name harus diisi!"],
    minlength: [4, "Minimal 4 karakter!"],
    maxlength: [25, "Maksimal 25 karakter!"],
  },
});

module.exports = model("Category", categorySchema);
