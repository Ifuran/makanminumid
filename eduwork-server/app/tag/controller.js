const Tag = require("./model");

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let dataTag = await Tag.find().skip(parseInt(skip)).limit(parseInt(limit));
    return res.json(dataTag);
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const payload = req.body;
    let dataTag = new Tag(payload);
    await dataTag.save();
    console.log(dataTag);
    return res.json(dataTag);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      console.log(err);
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
    let dataTag = await Tag.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(dataTag);
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
    let dataTag = await Tag.findByIdAndDelete(id);

    return res.json(dataTag);
  } catch (err) {
    next(err);
  }
};

module.exports = { index, store, update, destroy };
