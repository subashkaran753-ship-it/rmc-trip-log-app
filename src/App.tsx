import React, { useState, useEffect } from "react";
import { Plus, List, BarChart3, Receipt, Truck } from "lucide-react";
import { TripRecord } from "./types";
import { cn } from "./lib/utils";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";
import SummaryView from "./components/SummaryView";
import BillingView from "./components/BillingView";
import { VENDOR_CODE } from "./constants";

type Tab = "entry" | "records" | "summary" | "billing";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("entry");
  const [records, setRecords] = useState<TripRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<TripRecord | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rmc_trip_logs");
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  const saveRecords = (newRecords: TripRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem("rmc_trip_logs", JSON.stringify(newRecords));
  };

  const handleAddTrip = (record: TripRecord) => {
    if (editingRecord) {
      const updated = records.map((r) => (r.id === editingRecord.id ? record : r));
      saveRecords(updated);
      setEditingRecord(null);
    } else {
      saveRecords([record, ...records]);
    }
    setActiveTab("records");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      saveRecords(records.filter((r) => r.id !== id));
    }
  };

  const handleEdit = (record: TripRecord) => {
    setEditingRecord(record);
    setActiveTab("entry");
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900 pb-24 md:pb-0 font-sans">
      {/* Top Navigation */}
      <nav className="bg-[#0f172a] text-white px-6 h-12 flex items-center justify-between border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="font-display font-black text-xl tracking-tighter">
            RMC <span className="text-blue-500">TRIP LOG</span>
          </span>
          <div className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px] text-white/70 tracking-widest hidden sm:block uppercase">
            {VENDOR_CODE}
          </div>
        </div>
        <div className="hidden md:flex gap-4">
           <NavButton active={activeTab === "entry"} onClick={() => setActiveTab("entry")} label="New Entry" />
           <NavButton active={activeTab === "records"} onClick={() => setActiveTab("records")} label="History" />
           <NavButton active={activeTab === "summary"} onClick={() => setActiveTab("summary")} label="Report" />
           <NavButton active={activeTab === "billing"} onClick={() => setActiveTab("billing")} label="Invoices" />
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="max-w-[1400px] mx-auto p-4 flex flex-col md:flex-row gap-4 h-[calc(100vh-48px)] overflow-hidden">
        {/* Sidebar for Entry (Desktop) or Tab Content (Mobile/Full) */}
        <div className={cn(
          "flex-none w-full md:w-[360px] flex flex-col transition-all duration-300",
          activeTab !== "entry" && "hidden md:flex opacity-50 pointer-events-none grayscale scale-95 origin-left"
        )}>
           <TripForm onSubmit={handleAddTrip} initialData={editingRecord} onCancel={() => { setEditingRecord(null); setActiveTab("records"); }} />
        </div>

        {/* View Areas */}
        <div className={cn(
          "flex-grow bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden",
          activeTab === "entry" ? "md:flex hidden" : "flex"
        )}>
          <div className="flex-grow overflow-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {activeTab === "records" && (
              <TripList records={records} onDelete={handleDelete} onEdit={handleEdit} />
            )}
            {activeTab === "summary" && (
              <SummaryView records={records} />
            )}
            {activeTab === "billing" && (
              <BillingView records={records} />
            )}
            {activeTab === "entry" && (
              <div className="md:hidden">
                 <TripForm onSubmit={handleAddTrip} initialData={editingRecord} onCancel={() => { setEditingRecord(null); setActiveTab("records"); }} />
              </div>
            )}
            {activeTab === "entry" && records.length > 0 && (
              <div className="hidden md:block">
                 <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick View</h2>
                 <TripList records={records.slice(0, 5)} onDelete={handleDelete} onEdit={handleEdit} hideHeader />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a] text-white px-2 py-2 flex justify-around items-center z-50 border-t border-white/10">
        <MobileNavButton active={activeTab === "entry"} onClick={() => setActiveTab("entry")} icon={<Plus />} label="Add" />
        <MobileNavButton active={activeTab === "records"} onClick={() => setActiveTab("records")} icon={<List />} label="History" />
        <MobileNavButton active={activeTab === "summary"} onClick={() => setActiveTab("summary")} icon={<BarChart3 />} label="Stats" />
        <MobileNavButton active={activeTab === "billing"} onClick={() => setActiveTab("billing")} icon={<Receipt />} label="Bills" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded transition-all",
        active ? "bg-blue-600 text-white" : "text-white/60 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

function MobileNavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-0.5", active ? "text-blue-400" : "text-white/40")}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

