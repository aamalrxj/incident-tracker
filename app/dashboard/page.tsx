"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Incident = {
  _id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
};

const severityColors: Record<string, string> = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  Open: "bg-red-50 text-red-700 border-red-200",
  "In Progress": "bg-yellow-50 text-yellow-700 border-yellow-200",
  Resolved: "bg-green-50 text-green-700 border-green-200",
};

const chartColors: Record<string, string> = {
  Low: "#94a3b8",
  Medium: "#eab308",
  High: "#f97316",
  Critical: "#ef4444",
};

export default function Dashboard() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isAdmin = role === "admin";

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

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
    setShowForm(false);
    loadIncidents();
  }

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/incidents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) loadIncidents();
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/incidents/${id}`, { method: "DELETE" });
    if (res.ok) loadIncidents();
  }

  const filtered = incidents.filter((i) => {
    const statusMatch = statusFilter === "All" || i.status === statusFilter;
    const severityMatch = severityFilter === "All" || i.severity === severityFilter;
    const searchMatch = i.title.toLowerCase().includes(search.toLowerCase());
    return statusMatch && severityMatch && searchMatch;
  });

  const openCount = incidents.filter((i) => i.status === "Open").length;
  const criticalCount = incidents.filter((i) => i.severity === "Critical").length;

  const chartData = ["Low", "Medium", "High", "Critical"].map((sev) => ({
    name: sev,
    count: incidents.filter((i) => i.severity === sev).length,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">
              🛡
            </div>
            <h1 className="text-lg font-semibold text-slate-900">Incident Tracker</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">
              {session?.user?.email}{" "}
              <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {role}
              </span>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 hover:bg-slate-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Stats + chart */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Total Incidents</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{incidents.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Open</p>
            <p className="mt-1 text-2xl font-semibold text-red-600">{openCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Critical</p>
            <p className="mt-1 text-2xl font-semibold text-orange-600">{criticalCount}</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-xs font-medium text-slate-500">Incidents by Severity</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={chartColors[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
            >
              <option>All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
          >
            {showForm ? "Cancel" : "+ New Incident"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mb-6 space-y-3 rounded-xl border border-slate-200 bg-white p-5"
          >
            <input
              placeholder="Incident title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              rows={3}
              required
            />
            <div className="flex items-center gap-3">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Create Incident
              </button>
            </div>
          </form>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {filtered.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-400">No incidents match the current filters.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((incident) => (
                  <tr key={incident._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{incident.title}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${severityColors[incident.severity]}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <select
                          value={incident.status}
                          onChange={(e) => handleStatusChange(incident._id, e.target.value)}
                          className={`rounded-lg border px-2 py-1 text-xs font-medium ${statusColors[incident.status]}`}
                        >
                          <option>Open</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>
                      ) : (
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusColors[incident.status]}`}>
                          {incident.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(incident._id)}
                          className="text-xs text-slate-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}