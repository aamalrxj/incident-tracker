import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Incident from "@/models/Incident";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const updated = await Incident.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  await Incident.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}