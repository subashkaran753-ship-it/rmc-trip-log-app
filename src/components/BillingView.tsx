import React, { useState } from "react";
import { Receipt, FileDown, Search, Filter } from "lucide-react";
import { TripRecord, Plant } from "../types";
import { downloadBillPDF } from "../lib/exportUtils";
import { cn } from "../lib/utils";

interface BillingViewProps {
  records: TripRecord[];
}

export default function BillingView({ records }: BillingViewProps) {
  const [selectedPlant, setSelectedPlant] = useState<Plant | "All">("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = records.filter((r) => {
    const matchesPlant = selectedPlant === "All" || r.plant === selectedPlant;
    const matchesSearch = 
      r.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.siteName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlant && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">Billing Center</h2>
        <p className="text-slate-500">Generate individual PDF bills for RMC trips</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search vehicle or site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
           <FilterButton active={selectedPlant === "All"} onClick={() => setSelectedPlant("All")} label="All" />
           <FilterButton active={selectedPlant === "Plant 1"} onClick={() => setSelectedPlant("Plant 1")} label="Plant 1" />
           <FilterButton active={selectedPlant === "Plant 2"} onClick={() => setSelectedPlant("Plant 2")} label="Plant 2" />
        </div>
      </div>

      {/* Bills List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div key={record.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                 <div className="bg-blue-50 text-blue-700 p-2 rounded-lg">
                    <Receipt className="w-5 h-5" />
                 </div>
                 <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</div>
                    <div className="text-lg font-bold text-slate-900">₹{record.totalAmount.toLocaleString()}</div>
                 </div>
              </div>

              <div className="space-y-1 mb-4">
                 <h3 className="font-bold text-slate-900 truncate">{record.siteName}</h3>
                 <div className="text-xs text-slate-500 flex justify-between">
                    <span>{record.date}</span>
                    <span className="font-bold text-blue-600">{record.plant}</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] mb-5 p-2 bg-slate-50 rounded-lg">
                 <div>
                    <div className="text-slate-400 font-bold uppercase tracking-tighter">Vehicle</div>
                    <div className="text-slate-800 font-bold">{record.vehicleNumber}</div>
                 </div>
                 <div>
                    <div className="text-slate-400 font-bold uppercase tracking-tighter">Trips</div>
                    <div className="text-slate-800 font-bold">{record.trips}</div>
                 </div>
              </div>

              <button
                onClick={() => downloadBillPDF(record)}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                <FileDown className="w-4 h-4" />
                Download Bill PDF
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400">
             No records matching the filter.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl text-xs font-bold transition-all transition-all border",
        active 
          ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100" 
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      )}
    >
      {label}
    </button>
  );
}
