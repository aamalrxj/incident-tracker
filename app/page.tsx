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

  useEffect(() => {
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((data) => setIncidents(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Incident Dashboard {session?.user?.email && `— ${session.user.email}`}
      </h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2 text-left">Severity</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident._id}>
              <td className="border p-2">{incident.title}</td>
              <td className="border p-2">{incident.severity}</td>
              <td className="border p-2">{incident.status}</td>
              <td className="border p-2">{incident.assignedTo || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}