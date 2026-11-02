import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function seed() {
  const { connectDB } = await import("../lib/mongodb");
  const { default: Incident } = await import("../models/Incident");

  await connectDB();

  const incidents = [
    {
      title: "Multiple failed SSH login attempts from external IP",
      description: "Detected 12 failed SSH authentication attempts against the Ubuntu endpoint from a single external IP within 3 minutes. Pattern consistent with brute-force activity.",
      severity: "High",
      status: "Resolved",
      assignedTo: "alice",
    },
    {
      title: "Kerberoasting attempt detected on domain controller",
      description: "RC4-encrypted service ticket request observed for a service account with an SPN. Indicates possible credential extraction attempt.",
      severity: "Critical",
      status: "Resolved",
      assignedTo: "bob",
    },
    {
      title: "Suspicious PowerShell execution with encoded command",
      description: "PowerShell launched with -EncodedCommand flag on workstation WIN10-CLIENT. Behavior consistent with obfuscated payload execution.",
      severity: "High",
      status: "In Progress",
      assignedTo: "alice",
    },
    {
      title: "Phishing email reported by end user",
      description: "User reported a suspicious email impersonating IT support requesting password reset via an external link. Link domain does not match legitimate company domain.",
      severity: "Medium",
      status: "In Progress",
      assignedTo: "carol",
    },
    {
      title: "New local administrator account created unexpectedly",
      description: "A new local admin account was created on a workstation outside of the standard provisioning process. Investigating whether this was authorized.",
      severity: "Critical",
      status: "Open",
      assignedTo: "bob",
    },
    {
      title: "File integrity alert on monitored configuration directory",
      description: "Unauthorized modification detected in a monitored directory. File was modified outside of a scheduled maintenance window.",
      severity: "Medium",
      status: "Resolved",
      assignedTo: "alice",
    },
    {
      title: "Unusual outbound traffic volume from internal host",
      description: "Host generated significantly higher than baseline outbound traffic over a 10-minute window. Destination IP not previously seen on this network.",
      severity: "Medium",
      status: "Open",
      assignedTo: "",
    },
    {
      title: "Password spray activity detected across multiple accounts",
      description: "Authentication attempts using a common weak password observed against several domain accounts in a short time window. Two accounts had matching credentials.",
      severity: "High",
      status: "Resolved",
      assignedTo: "carol",
    },
    {
      title: "Antivirus definition update failure on endpoint",
      description: "Endpoint protection agent has failed to update virus definitions for 5 consecutive days. Endpoint currently running outdated signatures.",
      severity: "Low",
      status: "Open",
      assignedTo: "",
    },
    {
      title: "Guest account re-enabled on domain controller",
      description: "The built-in Guest account, normally disabled by policy, was re-enabled. No associated change ticket found.",
      severity: "Medium",
      status: "In Progress",
      assignedTo: "bob",
    },
  ];

  await Incident.insertMany(incidents);
  console.log(`Seeded ${incidents.length} incidents`);
  process.exit();
}

seed();