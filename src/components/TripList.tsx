import React from "react";
import { Edit2, Trash2, MapPin, Truck, Calendar, Receipt, List } from "lucide-react";
import { TripRecord } from "../types";
import { cn } from "../lib/utils";
import { downloadBillPDF } from "../lib/exportUtils";

interface TripListProps {
  records: TripRecord[];
  onDelete: (id: string) => void;
  onEdit: (record: TripRecord) => void;
  hideHeader?: boolean;
}

export default function TripList({ records, onDelete, onEdit, hideHeader }: TripListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <List className="text-slate-400 w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">No Records Found</h3>
        <p className="text-xs text-slate-500 mt-1">Start adding trip entries to populate this view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!hideHeader && (
        <div className="mb-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Operational History</h2>
          <div className="h-0.5 w-12 bg-blue-500 mt-1 rounded-full"></div>
        </div>
      )}

      <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
               <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
               <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicle / Plant</th>
               <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Site Name</th>
               <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</th>
               <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Trips</th>
               <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
               <th className="py-2.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="text-xs font-bold text-slate-600">{record.date}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-xs font-mono font-bold text-slate-900">{record.vehicleNumber}</div>
                  <div className="text-[9px] font-bold text-blue-500 uppercase">{record.plant}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-xs font-bold text-slate-800">{record.siteName}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-[10px] text-slate-600 font-medium">
                    {record.location}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="text-xs font-bold text-slate-900">{record.trips}</div>
                </td>
                <td className="py-3 px-4 text-right">
                   <div className="text-xs font-black text-slate-900">₹{record.totalAmount.toLocaleString()}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <ActionButton onClick={() => onEdit(record)} icon={<Edit2 className="w-3 h-3" />} tooltip="Edit" />
                    <ActionButton onClick={() => downloadBillPDF(record)} icon={<Receipt className="w-3 h-3" />} tooltip="Bill" color="blue" />
                    <ActionButton onClick={() => onDelete(record.id)} icon={<Trash2 className="w-3 h-3" />} tooltip="Delete" color="red" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({ onClick, icon, tooltip, color = "slate" }: { onClick: () => void; icon: React.ReactNode; tooltip: string; color?: "slate" | "blue" | "red" }) {
  const colors = {
    slate: "text-slate-400 hover:text-slate-800 hover:bg-slate-100",
    blue: "text-blue-400 hover:text-blue-700 hover:bg-blue-50",
    red: "text-red-400 hover:text-red-600 hover:bg-red-50"
  };

  return (
    <button
      onClick={onClick}
      className={cn("p-1.5 rounded transition-all", colors[color])}
      title={tooltip}
    >
      {icon}
    </button>
  );
}
