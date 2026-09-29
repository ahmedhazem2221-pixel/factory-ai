import { useState } from "react";

const machines = [
  {
    id: 1,
    name: "CNC Panel Saw",
    model: "SCM SI 400 Nova",
    location: "Factory A - Section 1",
    status: "operational",
    components: ["Main Saw Blade", "Scoring Blade", "Fence System", "Push Feed System", "Control Panel", "Air Filtration Unit", "Worktable"],
    repairHistory: [
      { date: "2024-11-10", issue: "Scoring blade worn out", action: "Replaced scoring blade, recalibrated alignment", technician: "Hassan M." },
      { date: "2024-08-22", issue: "Fence misalignment causing inaccurate cuts", action: "Realigned fence system, tightened locking bolts", technician: "Karim A." },
      { date: "2024-05-15", issue: "Control panel error code E-04", action: "Reset PLC controller, updated firmware", technician: "Hassan M." },
    ],
    maintenanceSchedule: "Every 500 operating hours or 3 months",
    specs: "Max panel size: 4200x2100mm, Blade speed: 4000 RPM, Motor power: 15kW",
  },
  {
    id: 2,
    name: "Edge Banding Machine",
    model: "Homag Ambition 1260",
    location: "Factory A - Section 2",
    status: "operational",
    components: ["Glue Pot", "Pre-milling Unit", "Feed Rollers", "End Trimming Unit", "Fine Trimming Unit", "Scraping Unit", "Buffing Unit", "Control Display"],
    repairHistory: [
      { date: "2024-12-01", issue: "Glue pot temperature fluctuation", action: "Replaced glue pot heating element and thermostat", technician: "Samy R." },
      { date: "2024-09-14", issue: "Fine trimming unit leaving rough edges", action: "Replaced trimming cutter blades", technician: "Karim A." },
      { date: "2024-06-30", issue: "Feed roller slipping", action: "Cleaned and replaced worn feed rollers", technician: "Samy R." },
    ],
    maintenanceSchedule: "Every 200 operating hours or monthly",
    specs: "Feed speed: 7-22 m/min, Panel thickness: 8-60mm, Edge thickness: 0.4-3mm",
  },
  {
    id: 3,
    name: "CNC Router",
    model: "Biesse Rover B 4.35",
    location: "Factory B - Section 1",
    status: "under maintenance",
    components: ["Spindle Motor", "ATC Tool Magazine", "Vacuum Table", "X/Y/Z Axis Motors", "Control Computer", "Dust Extraction Port", "Safety Guard"],
    activeFault: {
      description: "Spindle motor overheating — cooling vents blocked, thermal paste degraded. Machine halted to prevent further damage.",
      technician: "Hassan M.",
    },
    repairHistory: [
      { date: "2024-10-18", issue: "ATC tool changer misalignment", action: "Recalibrated tool magazine positions", technician: "Karim A." },
      { date: "2024-07-22", issue: "Vacuum table losing suction", action: "Replaced vacuum pump seals", technician: "Samy R." },
    ],
    maintenanceSchedule: "Every 300 operating hours or 2 months",
    specs: "Work area: 3050x1530mm, Spindle power: 11kW, Max speed: 24000 RPM",
  },
  {
    id: 4,
    name: "Hydraulic Press",
    model: "Italpresse HL 200",
    location: "Factory B - Section 2",
    status: "operational",
    components: ["Hydraulic Pump", "Press Platens", "Heating Elements", "Pressure Gauge", "Safety Valve", "Control Panel", "Frame Structure"],
    repairHistory: [
      { date: "2024-11-28", issue: "Hydraulic oil leak from main cylinder", action: "Replaced cylinder seals and refilled hydraulic oil", technician: "Samy R." },
      { date: "2024-08-05", issue: "Heating element not reaching target temperature", action: "Replaced two heating elements in upper platen", technician: "Hassan M." },
    ],
    maintenanceSchedule: "Every 6 months — hydraulic oil change and seal inspection",
    specs: "Press force: 200 tons, Platen size: 2600x1300mm, Max temperature: 200°C",
  },
  {
    id: 5,
    name: "Spray Painting Machine",
    model: "Cefla SmartCoater SC",
    location: "Factory C - Finishing Section",
    status: "operational",
    components: ["Paint Pump", "Spray Nozzles", "Conveyor Belt", "Drying Oven", "Air Compressor", "Paint Tank", "Control System"],
    repairHistory: [
      { date: "2024-12-20", issue: "Spray nozzles clogged causing uneven coating", action: "Deep cleaned all nozzles, replaced 3 blocked ones", technician: "Karim A." },
      { date: "2024-09-08", issue: "Conveyor belt speed inconsistency", action: "Replaced conveyor belt drive motor", technician: "Samy R." },
    ],
    maintenanceSchedule: "Weekly nozzle cleaning, monthly full inspection",
    specs: "Conveyor width: 1300mm, Drying temperature: up to 80°C, Output: 800 panels/hour",
  },
  {
    id: 6,
    name: "Upholstery Sewing Machine",
    model: "Durkopp Adler 867",
    location: "Factory D - Upholstery Section",
    status: "operational",
    components: ["Needle Assembly", "Feed Dog", "Bobbin System", "Presser Foot", "Thread Tension Unit", "Motor Drive", "Control Panel"],
    repairHistory: [
      { date: "2024-10-30", issue: "Thread breaking frequently during operation", action: "Replaced needle, adjusted thread tension settings", technician: "Layla K." },
      { date: "2024-07-14", issue: "Feed dog not advancing material evenly", action: "Cleaned and adjusted feed dog mechanism", technician: "Layla K." },
    ],
    maintenanceSchedule: "Weekly lubrication, monthly needle and bobbin inspection",
    specs: "Stitch length: 0-12mm, Max sewing speed: 2200 RPM, Material thickness: up to 25mm",
  },
];

function StatusBadge({ status }) {
  const styles = {
    operational: { backgroundColor: "#d1fae5", color: "#065f46", text: "Operational" },
    faulty: { backgroundColor: "#fef3c7", color: "#92400e", text: "Faulty" },
    "under maintenance": { backgroundColor: "#fee2e2", color: "#991b1b", text: "Under Maintenance" },
    offline: { backgroundColor: "#fee2e2", color: "#991b1b", text: "Offline" },
  };
  const s = styles[status] || styles.operational;
  return (
    <span style={{ backgroundColor: s.backgroundColor, color: s.color, padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
      {s.text}
    </span>
  );
}

function App() {
  const [machineList, setMachineList] = useState(machines);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMachineListOpen, setIsMachineListOpen] = useState(true);

  // Form states
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newStatus, setNewStatus] = useState("operational");
  const [newComponents, setNewComponents] = useState("");
  const [newFaultDescription, setNewFaultDescription] = useState("");
  const [newFaultTechnician, setNewFaultTechnician] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Edit Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editModel, setEditModel] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStatus, setEditStatus] = useState("operational");
  const [editComponents, setEditComponents] = useState("");
  const [editSpecs, setEditSpecs] = useState("");
  const [editMaintenanceSchedule, setEditMaintenanceSchedule] = useState("");
  const [editRepairHistory, setEditRepairHistory] = useState([]);
  const [editFaultDescription, setEditFaultDescription] = useState("");
  const [editFaultTechnician, setEditFaultTechnician] = useState("");
  const [editFormErrors, setEditFormErrors] = useState({});

  // Logging repair states
  const [isLoggingRepair, setIsLoggingRepair] = useState(false);
  const [repairDate, setRepairDate] = useState("");
  const [repairIssue, setRepairIssue] = useState("");
  const [repairAction, setRepairAction] = useState("");
  const [repairTechnician, setRepairTechnician] = useState("");
  const [repairFormErrors, setRepairFormErrors] = useState({});

  const filteredMachines = machineList.filter((m) => {
    const query = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(query) ||
      m.status.toLowerCase().includes(query)
    );
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!newName.trim()) errors.name = "Machine Name is required";
    if (!newModel.trim()) errors.model = "Model is required";
    if (!newLocation.trim()) errors.location = "Location is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const parsedComponents = newComponents
      ? newComponents.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    let activeFault = null;
    if (newStatus === "faulty") {
      activeFault = {
        description: newFaultDescription.trim(),
        technician: "",
      };
    } else if (newStatus === "under maintenance") {
      activeFault = {
        description: newFaultDescription.trim(),
        technician: newFaultTechnician.trim(),
      };
    }

    const newMachine = {
      id: Date.now(),
      name: newName.trim(),
      model: newModel.trim(),
      location: newLocation.trim(),
      status: newStatus,
      components: parsedComponents,
      activeFault,
      repairHistory: [],
      maintenanceSchedule: "Weekly inspection and calibration",
      specs: "N/A",
    };

    const updatedList = [...machineList, newMachine];
    setMachineList(updatedList);
    setSelectedMachine(newMachine);
    setIsAddingNew(false);
    
    setNewName("");
    setNewModel("");
    setNewLocation("");
    setNewStatus("operational");
    setNewComponents("");
    setNewFaultDescription("");
    setNewFaultTechnician("");
    setFormErrors({});
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!editName.trim()) errors.name = "Machine Name is required";
    if (!editModel.trim()) errors.model = "Model is required";
    if (!editLocation.trim()) errors.location = "Location is required";

    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    const parsedComponents = editComponents
      ? editComponents.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    let activeFault = null;
    if (editStatus === "faulty") {
      activeFault = {
        description: editFaultDescription.trim(),
        technician: "",
      };
    } else if (editStatus === "under maintenance") {
      activeFault = {
        description: editFaultDescription.trim(),
        technician: editFaultTechnician.trim(),
      };
    }

    const updatedMachine = {
      ...selectedMachine,
      name: editName.trim(),
      model: editModel.trim(),
      location: editLocation.trim(),
      status: editStatus,
      components: parsedComponents,
      specs: editSpecs.trim(),
      maintenanceSchedule: editMaintenanceSchedule.trim(),
      activeFault,
      repairHistory: editRepairHistory.filter(r => r.date.trim() || r.issue.trim() || r.action.trim() || r.technician.trim()),
    };

    const updatedList = machineList.map((m) =>
      m.id === selectedMachine.id ? updatedMachine : m
    );
    
    setMachineList(updatedList);
    setSelectedMachine(updatedMachine);
    setIsEditing(false);
    setEditFormErrors({});
  };

  const addRepairRow = () => {
    const today = new Date().toISOString().split("T")[0];
    setEditRepairHistory([
      ...editRepairHistory,
      { date: today, issue: "", action: "", technician: "" },
    ]);
  };

  const updateRepairRow = (index, field, value) => {
    const updated = [...editRepairHistory];
    updated[index] = { ...updated[index], [field]: value };
    setEditRepairHistory(updated);
  };

  const deleteRepairRow = (index) => {
    setEditRepairHistory(editRepairHistory.filter((_, i) => i !== index));
  };

  const handleLogRepairSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!repairDate.trim()) errors.date = "Date is required";
    if (!repairIssue.trim()) errors.issue = "Issue is required";
    if (!repairTechnician.trim()) errors.technician = "Technician name is required";

    if (Object.keys(errors).length > 0) {
      setRepairFormErrors(errors);
      return;
    }

    const newRepair = {
      date: repairDate.trim(),
      issue: repairIssue.trim(),
      action: repairAction.trim(),
      technician: repairTechnician.trim(),
    };

    const updatedRepairHistory = [newRepair, ...(selectedMachine.repairHistory || [])];

    const updatedMachine = {
      ...selectedMachine,
      repairHistory: updatedRepairHistory,
    };

    const updatedList = machineList.map((m) =>
      m.id === selectedMachine.id ? updatedMachine : m
    );

    setMachineList(updatedList);
    setSelectedMachine(updatedMachine);
    setIsLoggingRepair(false);
    
    setRepairDate("");
    setRepairIssue("");
    setRepairAction("");
    setRepairTechnician("");
    setRepairFormErrors({});
  };

  const handleMarkAsFixed = () => {
    if (!selectedMachine || !selectedMachine.activeFault) return;
    const today = new Date().toISOString().split("T")[0];
    const fixRepair = {
      date: today,
      issue: selectedMachine.activeFault.description,
      action: "Fault resolved and machine returned to operational status.",
      technician: selectedMachine.activeFault.technician,
    };
    const updatedMachine = {
      ...selectedMachine,
      status: "operational",
      activeFault: null,
      repairHistory: [fixRepair, ...(selectedMachine.repairHistory || [])],
    };
    const updatedList = machineList.map((m) =>
      m.id === selectedMachine.id ? updatedMachine : m
    );
    setMachineList(updatedList);
    setSelectedMachine(updatedMachine);
  };

  const askAI = async () => {
    if (!question || !selectedMachine) return;
    setLoading(true);
    setAnswer("");

    const machineContext = `
Machine Name: ${selectedMachine.name}
Model: ${selectedMachine.model}
Location: ${selectedMachine.location}
Status: ${selectedMachine.status}
Components: ${selectedMachine.components.join(", ")}
Specifications: ${selectedMachine.specs}
Maintenance Schedule: ${selectedMachine.maintenanceSchedule}
Repair History:
${selectedMachine.repairHistory.map(r => `- ${r.date}: ${r.issue} → ${r.action} (Technician: ${r.technician})`).join("\n")}
    `;

    try {
      const response = await fetch(
        "https://cors-anywhere.herokuapp.com/https://integrate.api.nvidia.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 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",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            model: "meta/llama-3.1-8b-instruct",
            messages: [
              {
                role: "system",
                content: `You are an expert factory maintenance engineer at Mobica, a large furniture manufacturing company in Egypt. You have access to the following machine data:\n\n${machineContext}\n\nAnswer questions about this machine clearly and professionally. If asked about repairs, reference the actual repair history. If asked how to fix something, give step-by-step technical guidance based on the machine's components.`,
              },
              { role: "user", content: question },
            ],
            max_tokens: 1000,
          }),
        }
      );

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setAnswer(data.choices[0].message.content);
      } else {
        setAnswer("Error: " + JSON.stringify(data));
      }
    } catch (err) {
      setAnswer("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f4f8", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      <div className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", backgroundColor: "#e94560", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white", fontSize: "16px", flexShrink: 0 }}>M</div>
          <span className="app-header-logo-text">FactoryAI</span>
          <span style={{ color: "#4a9eff", fontSize: "12px", backgroundColor: "rgba(74,158,255,0.15)", padding: "2px 8px", borderRadius: "20px", flexShrink: 0 }}>Pro</span>
        </div>
        <span className="app-header-subtitle">Machine Intelligence System</span>
      </div>

      <div className="main-layout-grid">

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ color: "#374151", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Factory Machines</h3>
              <button
                type="button"
                className="mobile-toggle-btn"
                onClick={() => setIsMachineListOpen(!isMachineListOpen)}
                aria-label="Toggle Machine List"
              >
                {isMachineListOpen ? "Hide ▲" : "Show ▼"}
              </button>
            </div>
            <button
              onClick={() => {
                setIsAddingNew(true);
                setIsEditing(false);
                setIsLoggingRepair(false);
                setSelectedMachine(null);
                setNewName("");
                setNewModel("");
                setNewLocation("");
                setNewStatus("operational");
                setNewComponents("");
                setNewFaultDescription("");
                setNewFaultTechnician("");
                setFormErrors({});
              }}
              style={{
                backgroundColor: isAddingNew ? "#1f2937" : "#e94560",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              + Add Machine
            </button>
          </div>
          
          <div className={`machine-list-panel ${isMachineListOpen ? "" : "collapsed"}`}>
            <div style={{ marginBottom: "16px", position: "relative" }}>
              <input
                type="text"
                placeholder="Search by name or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 36px",
                  borderRadius: "10px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  color: "#1f2937",
                  transition: "all 0.2s ease-in-out",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#e94560";
                  e.target.style.boxShadow = "0 0 0 3px rgba(233, 69, 96, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
                }}
              />
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "14px", pointerEvents: "none" }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    fontSize: "12px",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            {filteredMachines.length === 0 ? (
              <div style={{ padding: "24px 16px", textAlign: "center", color: "#6b7280", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px dashed #e5e7eb" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔍</div>
                <div style={{ fontWeight: "600", fontSize: "14px", color: "#374151" }}>No machines found</div>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Try searching for a different name or status.</div>
              </div>
            ) : (
              filteredMachines.map((m) => (
                <div
                  key={m.id}
                  onClick={() => { setSelectedMachine(m); setAnswer(""); setQuestion(""); setActiveTab("overview"); setIsAddingNew(false); setIsEditing(false); setIsLoggingRepair(false); }}
                  style={{ backgroundColor: selectedMachine?.id === m.id ? "#0a1628" : "white", borderRadius: "12px", padding: "16px", marginBottom: "10px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: selectedMachine?.id === m.id ? "2px solid #e94560" : "2px solid transparent", transition: "all 0.2s" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <span style={{ fontWeight: "600", fontSize: "14px", color: selectedMachine?.id === m.id ? "white" : "#1f2937" }}>{m.name}</span>
                  </div>
                  <div style={{ fontSize: "12px", color: selectedMachine?.id === m.id ? "#8892a4" : "#6b7280", marginBottom: "8px" }}>{m.model}</div>
                  <StatusBadge status={m.status} />
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          {isAddingNew ? (
            <div className="card-container">
              <h2 style={{ color: "#0a1628", fontSize: "20px", fontWeight: "600", marginBottom: "6px" }}>Add New Machine</h2>
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>Register a new machine in the factory monitoring system.</p>
              
              <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Machine Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Laser Cutter"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                    }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: formErrors.name ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />
                  {formErrors.name && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "2px" }}>{formErrors.name}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Model *</label>
                  <input
                    type="text"
                    placeholder="e.g. Trumpf TruLaser 3030"
                    value={newModel}
                    onChange={(e) => {
                      setNewModel(e.target.value);
                      if (formErrors.model) setFormErrors({ ...formErrors, model: null });
                    }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: formErrors.model ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />
                  {formErrors.model && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "2px" }}>{formErrors.model}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Location *</label>
                  <input
                    type="text"
                    placeholder="e.g. Factory E - Fabrication"
                    value={newLocation}
                    onChange={(e) => {
                      setNewLocation(e.target.value);
                      if (formErrors.location) setFormErrors({ ...formErrors, location: null });
                    }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: formErrors.location ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />
                  {formErrors.location && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "2px" }}>{formErrors.location}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                  >
                    <option value="operational">Operational</option>
                    <option value="faulty">Faulty</option>
                    <option value="under maintenance">Under Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                {(newStatus === "faulty" || newStatus === "under maintenance") && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Fault Description</label>
                    <textarea
                      placeholder="Describe the active fault/issue..."
                      value={newFaultDescription}
                      onChange={(e) => setNewFaultDescription(e.target.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "14px",
                        outline: "none",
                        minHeight: "70px",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                )}

                {newStatus === "under maintenance" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Assigned Technician</label>
                    <input
                      type="text"
                      placeholder="e.g. Hassan M."
                      value={newFaultTechnician}
                      onChange={(e) => setNewFaultTechnician(e.target.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Components (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Laser Source, Cutting Head, CNC Controller"
                    value={newComponents}
                    onChange={(e) => setNewComponents(e.target.value)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <span style={{ color: "#9ca3af", fontSize: "11px" }}>Enter components separated by commas.</span>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setFormErrors({});
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      textAlign: "center",
                      transition: "background-color 0.2s",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      backgroundColor: "#e94560",
                      color: "white",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      textAlign: "center",
                      transition: "background-color 0.2s",
                    }}
                  >
                    Add Machine
                  </button>
                </div>
              </form>
            </div>
          ) : isEditing ? (
            <div className="card-container">
              <h2 style={{ color: "#0a1628", fontSize: "20px", fontWeight: "600", marginBottom: "6px" }}>Edit Machine</h2>
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>Modify machine specifications, components, or repair logs.</p>
              
              <form onSubmit={handleEditFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Machine Name *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                      if (editFormErrors.name) setEditFormErrors({ ...editFormErrors, name: null });
                    }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: editFormErrors.name ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  {editFormErrors.name && <span style={{ color: "#ef4444", fontSize: "12px" }}>{editFormErrors.name}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Model *</label>
                  <input
                    type="text"
                    value={editModel}
                    onChange={(e) => {
                      setEditModel(e.target.value);
                      if (editFormErrors.model) setEditFormErrors({ ...editFormErrors, model: null });
                    }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: editFormErrors.model ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  {editFormErrors.model && <span style={{ color: "#ef4444", fontSize: "12px" }}>{editFormErrors.model}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Location *</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => {
                      setEditLocation(e.target.value);
                      if (editFormErrors.location) setEditFormErrors({ ...editFormErrors, location: null });
                    }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: editFormErrors.location ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  {editFormErrors.location && <span style={{ color: "#ef4444", fontSize: "12px" }}>{editFormErrors.location}</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="operational">Operational</option>
                    <option value="faulty">Faulty</option>
                    <option value="under maintenance">Under Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                {(editStatus === "faulty" || editStatus === "under maintenance") && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Fault Description</label>
                    <textarea
                      placeholder="Describe the active fault/issue..."
                      value={editFaultDescription}
                      onChange={(e) => setEditFaultDescription(e.target.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "14px",
                        outline: "none",
                        minHeight: "70px",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                )}

                {editStatus === "under maintenance" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Assigned Technician</label>
                    <input
                      type="text"
                      placeholder="e.g. Hassan M."
                      value={editFaultTechnician}
                      onChange={(e) => setEditFaultTechnician(e.target.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1.5px solid #e5e7eb",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Specifications</label>
                  <input
                    type="text"
                    value={editSpecs}
                    onChange={(e) => setEditSpecs(e.target.value)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Maintenance Schedule</label>
                  <input
                    type="text"
                    value={editMaintenanceSchedule}
                    onChange={(e) => setEditMaintenanceSchedule(e.target.value)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Components (comma separated)</label>
                  <input
                    type="text"
                    value={editComponents}
                    onChange={(e) => setEditComponents(e.target.value)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Repair History</label>
                    <button
                      type="button"
                      onClick={addRepairRow}
                      style={{
                        backgroundColor: "#f3f4f6",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      + Add Repair Record
                    </button>
                  </div>
                  
                  {editRepairHistory.map((rep, idx) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb", position: "relative" }}>
                      <button
                        type="button"
                        onClick={() => deleteRepairRow(idx)}
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "8px",
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        ✕ Remove
                      </button>
                      <div className="edit-repair-row-grid">
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#4b5563" }}>Date:</span>
                        <input
                          type="text"
                          value={rep.date}
                          onChange={(e) => updateRepairRow(idx, "date", e.target.value)}
                          placeholder="YYYY-MM-DD"
                          style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #d1d5db", borderRadius: "4px" }}
                        />
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#4b5563" }}>Issue:</span>
                        <input
                          type="text"
                          value={rep.issue}
                          onChange={(e) => updateRepairRow(idx, "issue", e.target.value)}
                          placeholder="Describe the issue"
                          style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #d1d5db", borderRadius: "4px" }}
                        />
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#4b5563" }}>Action:</span>
                        <input
                          type="text"
                          value={rep.action}
                          onChange={(e) => updateRepairRow(idx, "action", e.target.value)}
                          placeholder="Describe the action taken"
                          style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #d1d5db", borderRadius: "4px" }}
                        />
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#4b5563" }}>Technician:</span>
                        <input
                          type="text"
                          value={rep.technician}
                          onChange={(e) => updateRepairRow(idx, "technician", e.target.value)}
                          placeholder="Technician name"
                          style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #d1d5db", borderRadius: "4px" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditFormErrors({});
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      backgroundColor: "#e94560",
                      color: "white",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : !selectedMachine ? (
            <div className="card-container" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏭</div>
              <h2 style={{ color: "#0a1628", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Select a Machine</h2>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>Choose a machine from the left panel to view its details, repair history, and ask the AI assistant questions.</p>
            </div>
          ) : (
            <>
              <div className="card-container" style={{ padding: 0, overflow: "hidden" }}>
                <div className="machine-detail-header">
                  <div>
                    <h2 style={{ color: "white", fontSize: "18px", fontWeight: "600", margin: "0 0 4px 0" }}>{selectedMachine.name}</h2>
                    <div style={{ color: "#8892a4", fontSize: "13px" }}>{selectedMachine.model} — {selectedMachine.location}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button
                      onClick={() => {
                        setEditName(selectedMachine.name);
                        setEditModel(selectedMachine.model);
                        setEditLocation(selectedMachine.location);
                        setEditStatus(selectedMachine.status);
                        setEditComponents(selectedMachine.components.join(", "));
                        setEditSpecs(selectedMachine.specs || "");
                        setEditMaintenanceSchedule(selectedMachine.maintenanceSchedule || "");
                        setEditRepairHistory(selectedMachine.repairHistory ? selectedMachine.repairHistory.map(r => ({ ...r })) : []);
                        setEditFaultDescription(selectedMachine.activeFault?.description || "");
                        setEditFaultTechnician(selectedMachine.activeFault?.technician || "");
                        setEditFormErrors({});
                        setIsEditing(true);
                        setIsLoggingRepair(false);
                      }}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <StatusBadge status={selectedMachine.status} />
                  </div>
                </div>

                {selectedMachine.status === "faulty" && selectedMachine.activeFault && (
                  <div className="fault-banner" style={{
                    background: "linear-gradient(135deg, #78350f 0%, #b45309 100%)",
                    borderTop: "3px solid #f59e0b",
                  }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", flex: 1 }}>
                      <div style={{
                        fontSize: "22px",
                        lineHeight: 1,
                        filter: "drop-shadow(0 0 6px rgba(251,191,36,0.8))",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}>⚠️</div>
                      <div>
                        <div style={{ color: "#fef3c7", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                          🟡 Active Fault Reported — Awaiting Technician
                        </div>
                        <div style={{ color: "white", fontSize: "14px", fontWeight: "500", lineHeight: "1.6" }}>
                          {selectedMachine.activeFault.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMachine.status === "under maintenance" && selectedMachine.activeFault && (
                  <div className="fault-banner" style={{
                    background: "linear-gradient(135deg, #7c2d12 0%, #991b1b 100%)",
                    borderTop: "3px solid #ef4444",
                    animation: "pulseBorder 2s ease-in-out infinite",
                  }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", flex: 1 }}>
                      <div style={{
                        fontSize: "22px",
                        lineHeight: 1,
                        filter: "drop-shadow(0 0 6px rgba(248,113,113,0.8))",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}>⚠️</div>
                      <div>
                        <div style={{ color: "#fca5a5", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                          🔴 Active Fault — Machine Halted
                        </div>
                        <div style={{ color: "white", fontSize: "14px", fontWeight: "500", lineHeight: "1.6", marginBottom: selectedMachine.activeFault.technician ? "8px" : "0px" }}>
                          {selectedMachine.activeFault.description}
                        </div>
                        {selectedMachine.activeFault.technician && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ color: "#fca5a5", fontSize: "12px" }}>🔧 Assigned Technician:</span>
                            <span style={{ color: "#fed7aa", fontSize: "12px", fontWeight: "600" }}>{selectedMachine.activeFault.technician}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleMarkAsFixed}
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(16,185,129,0.4)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#059669";
                        e.target.style.boxShadow = "0 6px 16px rgba(16,185,129,0.55)";
                        e.target.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#10b981";
                        e.target.style.boxShadow = "0 4px 12px rgba(16,185,129,0.4)";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      ✅ Mark as Fixed
                    </button>
                  </div>
                )}

                <div className="tab-nav">
                  {["overview", "components", "repairs", "ask"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="tab-btn"
                      style={{ color: activeTab === tab ? "#e94560" : "#6b7280", borderBottom: activeTab === tab ? "2px solid #e94560" : "2px solid transparent" }}
                    >
                      {tab === "ask" ? "🤖 Ask AI" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="card-padding">

                  {activeTab === "overview" && (
                    <div>
                      <div className="overview-grid">
                        <div style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "16px" }}>
                          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>MAINTENANCE SCHEDULE</div>
                          <div style={{ fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>{selectedMachine.maintenanceSchedule}</div>
                        </div>
                        <div style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "16px" }}>
                          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>TOTAL REPAIRS ON RECORD</div>
                          <div style={{ fontSize: "24px", color: "#e94560", fontWeight: "700" }}>{selectedMachine.repairHistory.length}</div>
                        </div>
                      </div>
                      <div style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "16px" }}>
                        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>SPECIFICATIONS</div>
                        <div style={{ fontSize: "14px", color: "#1f2937", lineHeight: "1.7" }}>{selectedMachine.specs}</div>
                      </div>
                    </div>
                  )}

                  {activeTab === "components" && (
                    <div className="components-grid">
                      {selectedMachine.components.map((c, i) => (
                        <div key={i} style={{ backgroundColor: "#f9fafb", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "8px", height: "8px", backgroundColor: "#10b981", borderRadius: "50%", flexShrink: 0 }}></div>
                          <span style={{ fontSize: "14px", color: "#1f2937" }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "repairs" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ margin: 0, fontSize: "15px", color: "#0a1628", fontWeight: "600" }}>Repair Records</h3>
                        {!isLoggingRepair && (
                          <button
                            onClick={() => {
                              setIsLoggingRepair(true);
                              setRepairDate(new Date().toISOString().split("T")[0]);
                              setRepairIssue("");
                              setRepairAction("");
                              setRepairTechnician("");
                              setRepairFormErrors({});
                            }}
                            style={{
                              backgroundColor: "#e94560",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            + Log New Repair
                          </button>
                        )}
                      </div>

                      {isLoggingRepair && (
                        <div style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "16px", border: "1px solid #e5e7eb", marginBottom: "20px" }}>
                          <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "#374151" }}>Log New Repair</h4>
                          <form onSubmit={handleLogRepairSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div className="log-repair-inputs-grid">
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <label style={{ fontSize: "11px", fontWeight: "600", color: "#4b5563" }}>Date *</label>
                                <input
                                  type="text"
                                  placeholder="YYYY-MM-DD"
                                  value={repairDate}
                                  onChange={(e) => {
                                    setRepairDate(e.target.value);
                                    if (repairFormErrors.date) setRepairFormErrors({ ...repairFormErrors, date: null });
                                  }}
                                  style={{ padding: "8px 12px", fontSize: "13px", border: repairFormErrors.date ? "1px solid #ef4444" : "1px solid #d1d5db", borderRadius: "6px" }}
                                />
                                {repairFormErrors.date && <span style={{ color: "#ef4444", fontSize: "10px" }}>{repairFormErrors.date}</span>}
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <label style={{ fontSize: "11px", fontWeight: "600", color: "#4b5563" }}>Technician *</label>
                                <input
                                  type="text"
                                  placeholder="Technician name"
                                  value={repairTechnician}
                                  onChange={(e) => {
                                    setRepairTechnician(e.target.value);
                                    if (repairFormErrors.technician) setRepairFormErrors({ ...repairFormErrors, technician: null });
                                  }}
                                  style={{ padding: "8px 12px", fontSize: "13px", border: repairFormErrors.technician ? "1px solid #ef4444" : "1px solid #d1d5db", borderRadius: "6px" }}
                                />
                                {repairFormErrors.technician && <span style={{ color: "#ef4444", fontSize: "10px" }}>{repairFormErrors.technician}</span>}
                              </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <label style={{ fontSize: "11px", fontWeight: "600", color: "#4b5563" }}>Issue *</label>
                              <input
                                type="text"
                                placeholder="Describe the issue"
                                value={repairIssue}
                                onChange={(e) => {
                                  setRepairIssue(e.target.value);
                                  if (repairFormErrors.issue) setRepairFormErrors({ ...repairFormErrors, issue: null });
                                }}
                                style={{ padding: "8px 12px", fontSize: "13px", border: repairFormErrors.issue ? "1px solid #ef4444" : "1px solid #d1d5db", borderRadius: "6px" }}
                              />
                              {repairFormErrors.issue && <span style={{ color: "#ef4444", fontSize: "10px" }}>{repairFormErrors.issue}</span>}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <label style={{ fontSize: "11px", fontWeight: "600", color: "#4b5563" }}>Action Taken</label>
                              <input
                                type="text"
                                placeholder="Describe action taken"
                                value={repairAction}
                                onChange={(e) => setRepairAction(e.target.value)}
                                style={{ padding: "8px 12px", fontSize: "13px", border: "1px solid #d1d5db", borderRadius: "6px" }}
                              />
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "8px", justifyContent: "flex-end" }}>
                              <button
                                type="button"
                                onClick={() => setIsLoggingRepair(false)}
                                style={{
                                  backgroundColor: "#f3f4f6",
                                  color: "#374151",
                                  border: "none",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                style={{
                                  backgroundColor: "#e94560",
                                  color: "white",
                                  border: "none",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                Save Repair
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {selectedMachine.repairHistory.map((r, i) => (
                        <div key={i} style={{ borderLeft: "3px solid #e94560", paddingLeft: "16px", marginBottom: "20px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: "#0a1628" }}>{r.issue}</span>
                            <span style={{ fontSize: "12px", color: "#9ca3af" }}>{r.date}</span>
                          </div>
                          <div style={{ fontSize: "13px", color: "#4b5563", marginBottom: "4px" }}>Action: {r.action}</div>
                          <div style={{ fontSize: "12px", color: "#9ca3af" }}>Technician: {r.technician}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "ask" && (
                    <div>
                      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>Ask anything about this machine — its components, how to fix an issue, maintenance tips, or repair history.</p>
                      <div className="ai-input-container">
                        <input
                          type="text"
                          placeholder="e.g. How do I fix a glue pot issue? What repairs has this machine had?"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && askAI()}
                          style={{ flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none" }}
                        />
                        <button
                          onClick={askAI}
                          disabled={loading}
                          style={{ backgroundColor: loading ? "#9ca3af" : "#e94560", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" }}
                        >
                          {loading ? "..." : "Ask AI"}
                        </button>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                        {["What are its components?", "Show repair history", "How do I maintain it?", "What could cause it to stop working?"].map((q) => (
                          <button key={q} onClick={() => setQuestion(q)} style={{ backgroundColor: "#f3f4f6", border: "none", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", color: "#374151" }}>{q}</button>
                        ))}
                      </div>
                      {answer && (
                        <div style={{ backgroundColor: "#f9fafb", borderRadius: "10px", padding: "20px", border: "1px solid #e5e7eb", whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14px", color: "#1f2937" }}>
                          {answer}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;