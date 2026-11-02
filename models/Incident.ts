import mongoose, { Schema, models } from "mongoose";

const IncidentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], required: true },
  status: { type: String, enum: ["Open", "In Progress", "Resolved"], default: "Open" },
  assignedTo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default models.Incident || mongoose.model("Incident", IncidentSchema);