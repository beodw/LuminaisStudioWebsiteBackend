const mongoose = require("mongoose");

const formAnswerSchema = new mongoose.Schema({
  formAnswers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  email: {
    type: String,
    required: true,
  },
  package: {
    type: String,
    required: false,
  },
  payment: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("FormAnswer", formAnswerSchema);
