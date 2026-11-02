"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Incident = {
  _id: string;
  title: string;
  severity: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  function loadIncidents() {
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((data) => setIncidents(data));
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, severity }),
    });
    setTitle("");
    setDescription("");
    setSeverity("Low");
    loadIncidents();
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/incidents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadIncidents();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/incidents/${id}`, { method: "DELETE" });
    loadIncidents();
  }

  const filtered = incidents.filter((i) => {
    const statusMatch = statusFilter === "All" || i.status === statusFilter;
    const severityMatch = severityFilter === "All" || i.severity === severityFilter;
    return statusMatch && severityMatch;
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Incident Dashboard {session?.user?.email && `— ${session.user.email}`}
      </h1>

      <form onSubmit={handleCreate} className="mb-6 space-y-2 border p-4 rounded max-w-md">
        <h2 className="font-semibold">New Incident</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Add Incident
        </button>
      </form>

      <div className="mb-4 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2 text-left">Severity</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((incident) => (
            <tr key={incident._id}>
              <td className="border p-2">{incident.title}</td>
              <td className="border p-2">{incident.severity}</td>
              <td className="border p-2">
                <select
                  value={incident.status}
                  onChange={(e) => handleStatusChange(incident._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(incident._id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}