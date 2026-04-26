import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { TripRecord, Plant } from "../types";
import { PLANT_PO_NUMBERS, PURPOSE_OPTIONS, FIXED_VEHICLE_NUMBER } from "../constants";
import { cn } from "../lib/utils";

interface TripFormProps {
  onSubmit: (record: TripRecord) => void;
  initialData?: TripRecord | null;
  onCancel?: () => void;
}

export default function TripForm({ onSubmit, initialData, onCancel }: TripFormProps) {
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    plant: "Plant 1" as Plant,
    siteName: "",
    location: "",
    purpose: "Mould Collection",
    customPurpose: "",
    trips: 1,
    amountPerTrip: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        plant: initialData.plant,
        siteName: initialData.siteName,
        location: initialData.location || "",
        purpose: initialData.purpose,
        customPurpose: initialData.customPurpose || "",
        trips: initialData.trips,
        amountPerTrip: initialData.amountPerTrip,
      });
    }
  }, [initialData]);

  const totalAmount = formData.trips * formData.amountPerTrip;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: TripRecord = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      vehicleNumber: FIXED_VEHICLE_NUMBER,
      poNumber: PLANT_PO_NUMBERS[formData.plant],
      totalAmount,
    };
    onSubmit(record);
    
    // Reset if not editing
    if (!initialData) {
      setFormData(prev => ({
        ...prev,
        siteName: "",
        location: "",
        trips: 1,
        amountPerTrip: 0,
      }));
    }
  };

  const inputClasses = "w-full px-3 py-1.5 border border-slate-200 rounded text-sm bg-[#f8fafc] focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";
  const labelClasses = "block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider";

  return (
    <div className="bg-white rounded-lg border border-slate-200 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
           <span className="text-xs font-black uppercase text-slate-400 tracking-tighter">DATA ENTRY</span>
           <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[9px] font-bold text-blue-600 uppercase">Live</span>
        </div>
        {initialData && (
          <button onClick={onCancel} className="text-[10px] font-bold text-red-500 hover:underline uppercase">Cancel Edit</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClasses}>Entry Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Select Plant</label>
            <select
              required
              value={formData.plant}
              onChange={(e) => setFormData({ ...formData, plant: e.target.value as Plant })}
              className={inputClasses}
            >
              <option value="Plant 1">Plant 1</option>
              <option value="Plant 2">Plant 2</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 border border-blue-100 rounded-lg bg-blue-50/50 flex flex-col">
            <span className={labelClasses}>PO Number</span>
            <span className="text-sm font-mono font-bold text-blue-900 tracking-tighter">{PLANT_PO_NUMBERS[formData.plant]}</span>
          </div>
          <div className="p-2 border border-slate-100 rounded-lg bg-slate-50 flex flex-col">
            <span className={labelClasses}>Vehicle</span>
            <span className="text-sm font-mono font-bold text-slate-600 tracking-tighter">{FIXED_VEHICLE_NUMBER}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClasses}>Site Name</label>
            <input
              type="text"
              placeholder="e.g. Prestige Tech Park"
              required
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Location</label>
            <input
              type="text"
              placeholder="e.g. Block B, Kadubeesanahalli"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
           <label className={labelClasses}>Purpose of Trip</label>
           <select
             required
             value={formData.purpose}
             onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
             className={inputClasses}
           >
             {PURPOSE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
           </select>
        </div>

        {formData.purpose === "Custom" && (
          <div>
            <label className={labelClasses}>Custom Purpose Description</label>
            <input
              type="text"
              required
              placeholder="Describe purpose..."
              value={formData.customPurpose}
              onChange={(e) => setFormData({ ...formData, customPurpose: e.target.value })}
              className={inputClasses}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
          <div>
            <label className={labelClasses}>No. of Trips</label>
            <input
              type="number"
              min="1"
              required
              value={formData.trips}
              onChange={(e) => setFormData({ ...formData, trips: parseInt(e.target.value) || 0 })}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Amt per Trip (₹)</label>
            <input
              type="number"
              min="0"
              required
              value={formData.amountPerTrip}
              onChange={(e) => setFormData({ ...formData, amountPerTrip: parseFloat(e.target.value) || 0 })}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="bg-[#f8fafc] border border-slate-200 border-dashed rounded-lg p-3 flex justify-between items-center text-sm">
           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Billable</span>
           <span className="text-lg font-black text-blue-600">₹ {totalAmount.toLocaleString()}</span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm shadow-md shadow-blue-100 transition-all uppercase tracking-widest mt-2"
        >
          {initialData ? "Update Record" : "Save Trip Record"}
        </button>
      </form>
    </div>
  );
}
