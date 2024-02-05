const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

const userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "Name harus diisi!"],
      minlength: [4, "Minimal 4 karakter!"],
      maxlength: [25, "Maksimal 25 karakter!"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "Email harus diisi!"],
      maxlength: [255, "Maksimal 255 karakter!"],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi!"],
      maxlength: [255, "Maksimal 255 karakter!"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

// Validasi email
userSchema.path("email").validate(
  function (value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

// Cek email sudah terdaftar atau belum?
userSchema.path("email").validate(
  async function (value) {
    try {
      // 1. Lakukan pencarian ke collection user berdasarkan email
      const count = await this.model("User").count({ email: value });

      // 2. Kode mengindikasi jika user ada kembalikan "false" || jika tidak ada kembalikan "true"
      // jika "false" validasi gagal
      // jika "true" validasi berhasil
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar!`
);

// Hashing password
const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("User", userSchema);
