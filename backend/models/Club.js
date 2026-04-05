import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  description: { type: String, required: true },
  coverImage: { type: String }, // store image URL or path
}, { timestamps: true });

export default mongoose.model("Club", clubSchema);