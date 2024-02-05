const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const tagSchema = Schema({
  name: {
    type: String,
    required: [true, "Name harus diisi!"],
    minlength: [4, "Minimal 4 karakter!"],
    maxlength: [25, "Maksimal 25 karakter!"],
  },
});

module.exports = model("Tag", tagSchema);
