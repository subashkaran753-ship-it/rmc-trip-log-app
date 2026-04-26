import React, { useMemo } from "react";
import { FileDown, Table, LayoutGrid, FileSpreadsheet } from "lucide-react";
import { TripRecord, PlantSummary, Plant } from "../types";
import { downloadSummaryPDF, downloadSummaryExcel } from "../lib/exportUtils";
import { cn } from "../lib/utils";

interface SummaryViewProps {
  records: TripRecord[];
}

export default function SummaryView({ records }: SummaryViewProps) {
  const summaries = useMemo(() => {
    const plants: Plant[] = ["Plant 1", "Plant 2"];
    return plants.map(plant => {
      const plantRecords = records.filter(r => r.plant === plant);
      return {
        plant,
        totalTrips: plantRecords.reduce((sum, r) => sum + r.trips, 0),
        totalAmount: plantRecords.reduce((sum, r) => sum + r.totalAmount, 0),
        entryCount: plantRecords.length,
        records: plantRecords
      } as PlantSummary;
    });
  }, [records]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">Trip Summaries</h2>
        <p className="text-slate-500">Plant-wise analytics and report generation</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {summaries.map((summary) => (
          <div key={summary.plant} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Summary Header */}
            <div className={cn(
               "p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100",
               summary.plant === "Plant 1" ? "bg-orange-50/50" : "bg-teal-50/50"
            )}>
              <div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 inline-block shadow-sm",
                  summary.plant === "Plant 1" ? "bg-orange-500 text-white" : "bg-teal-600 text-white"
                )}>
                  {summary.plant}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Operational Summary</h3>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => downloadSummaryExcel(summary)}
                  disabled={summary.entryCount === 0}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-green-100"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </button>
                <button
                  onClick={() => downloadSummaryPDF(summary)}
                  disabled={summary.entryCount === 0}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-100"
                >
                  <FileDown className="w-4 h-4" />
                  PDF Summary
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
               <SummaryStat label="Total Trips" value={summary.totalTrips.toString()} color="blue" />
               <SummaryStat label="Entry Count" value={summary.entryCount.toString()} color="slate" />
               <SummaryStat label="Total Billing" value={`₹${summary.totalAmount.toLocaleString()}`} color="green" />
            </div>

            {/* Records Listing */}
            {summary.records.length > 0 ? (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 text-slate-600">
                   <Table className="w-4 h-4" />
                   <span className="text-sm font-bold uppercase tracking-wider">Breakdown by Record</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle</th>
                        <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Site</th>
                        <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                        <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Trips</th>
                        <th className="py-3 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {summary.records.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-2 text-sm font-medium text-slate-600 whitespace-nowrap">{r.date}</td>
                          <td className="py-3 px-2 text-sm font-bold text-slate-900 whitespace-nowrap">{r.vehicleNumber}</td>
                          <td className="py-3 px-2 text-sm text-slate-600 truncate max-w-[120px]">{r.siteName}</td>
                          <td className="py-3 px-2 text-sm text-slate-600 truncate max-w-[120px]">{r.location}</td>
                          <td className="py-3 px-2 text-sm font-bold text-slate-900 text-right">{r.trips}</td>
                          <td className="py-3 px-2 text-sm font-bold text-slate-900 text-right">₹{r.totalAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 italic text-sm">
                No entries available for {summary.plant}.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryStat({ label, value, color }: { label: string; value: string; color: "blue" | "slate" | "green" }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50/50",
    slate: "text-slate-800 bg-slate-50/50",
    green: "text-emerald-600 bg-emerald-50/50"
  };

  return (
    <div className={cn("p-6 flex flex-col items-center justify-center text-center", colorMap[color])}>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</span>
      <span className="text-2xl font-black">{value}</span>
    </div>
  );
}
