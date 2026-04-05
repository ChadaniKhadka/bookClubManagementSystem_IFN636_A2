import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
   author: { type: String, default: true },
  category: { type: String, default: "Other" },
  published_date: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String }, // store image URL or path
}, { timestamps: true });

export default mongoose.model("Book", bookSchema);