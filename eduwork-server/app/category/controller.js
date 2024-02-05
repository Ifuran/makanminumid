const Category = require("./model");

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let category = await Category.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.json(category);
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const payload = req.body;
    let category = new Category(payload);
    await category.save();
    return res.json(category);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    let category = await Category.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(category);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category = await Category.findByIdAndDelete(id);

    return res.json(category);
  } catch (err) {
    next(err);
  }
};

module.exports = { index, store, update, destroy };
