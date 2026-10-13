"use client";

import React, { useEffect, useRef, useState } from "react";

// TypeScript Interfaces mapping your exact document data arrays
export interface DowryItem {
  id: string;
  description: string;
  quantity: number;
  estimatedValue: number;
}

interface AnnexureBProps {
  initialJahez?: DowryItem[];
  initialBari?: DowryItem[];
  onTotalsChange?: (grandTotal: number) => void;
  /** Expose full Jahez / Bari arrays upward for draft / print binding. */
  onItemsChange?: (jahez: DowryItem[], bari: DowryItem[]) => void;
}

export default function FamilyAnnexureBLoop({
  initialJahez = [],
  initialBari = [],
  onTotalsChange,
  onItemsChange,
}: AnnexureBProps) {
  // Initialize separate tracking arrays based on Section 8.4 of the plan
  const [jahezItems, setJahezItems] = useState<DowryItem[]>(
    initialJahez.length
      ? initialJahez
      : [
          {
            id: "1",
            description: "Complete Bridal Bedroom Wooden Furniture Set",
            quantity: 1,
            estimatedValue: 250000,
          },
          {
            id: "2",
            description: "Refrigerator & Kitchen Electronics Package",
            quantity: 1,
            estimatedValue: 120000,
          },
          {
            id: "3",
            description: "Gold Ornaments (Net Weight: 3 Tolas, 22-Karat)",
            quantity: 1,
            estimatedValue: 720000,
          },
        ],
  );

  const [bariItems, setBariItems] = useState<DowryItem[]>(
    initialBari.length
      ? initialBari
      : [
          {
            id: "b1",
            description: "Bari Gold Ornaments Given by Groom Family",
            quantity: 1,
            estimatedValue: 240000,
          },
          {
            id: "b2",
            description: "Bridal Apparel, Silk & Banarsi Dresses Assembly",
            quantity: 7,
            estimatedValue: 85000,
          },
        ],
  );

  // Computed Subtotal calculations running natively
  const subtotalJahez = jahezItems.reduce(
    (sum, item) => sum + item.estimatedValue * item.quantity,
    0,
  );
  const subtotalBari = bariItems.reduce(
    (sum, item) => sum + item.estimatedValue * item.quantity,
    0,
  );
  const grandTotalCombined = subtotalJahez + subtotalBari;

  // Keep latest callbacks in refs so the sync effect only re-runs on data changes
  // (avoids infinite loops if parents pass inline handlers).
  const onTotalsChangeRef = useRef(onTotalsChange);
  const onItemsChangeRef = useRef(onItemsChange);
  useEffect(() => {
    onTotalsChangeRef.current = onTotalsChange;
    onItemsChangeRef.current = onItemsChange;
  }, [onTotalsChange, onItemsChange]);

  useEffect(() => {
    onTotalsChangeRef.current?.(grandTotalCombined);
    onItemsChangeRef.current?.(jahezItems, bariItems);
  }, [grandTotalCombined, jahezItems, bariItems]);

  // Handler to modify specific item inputs on the fly
  const handleItemChange = (
    arrayType: "jahez" | "bari",
    id: string,
    field: keyof DowryItem,
    value: string | number,
  ) => {
    const updateLoop = (prev: DowryItem[]) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item));

    if (arrayType === "jahez") {
      setJahezItems(updateLoop);
    } else {
      setBariItems(updateLoop);
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-xl p-6 shadow-xl space-y-6">
      <div className="border-b border-slate-900 pb-3">
        <h2 className="text-base font-serif text-white font-medium">
          Annexure-B: Itemized Inventory Log
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Live subtotal math calculator for Dowry (Jahez) and Bridal Gifts (Bari).
        </p>
      </div>

      {/* 1. JAHEZ LIST COMPONENT MATRIX */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
          I. Dowry Articles (Jahez)
        </h3>
        <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
          <div className="grid grid-cols-12 bg-slate-900/60 p-2.5 font-medium text-slate-400 border-b border-slate-900">
            <div className="col-span-6">Item Specification Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-4 text-right">Estimated Value (PKR)</div>
          </div>
          <div className="divide-y divide-slate-900 bg-slate-950">
            {jahezItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 p-2 gap-2 items-center">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange("jahez", item.id, "description", e.target.value)
                  }
                  className="col-span-6 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      "jahez",
                      item.id,
                      "quantity",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="col-span-2 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-center text-xs"
                />
                <input
                  type="number"
                  value={item.estimatedValue}
                  onChange={(e) =>
                    handleItemChange(
                      "jahez",
                      item.id,
                      "estimatedValue",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="col-span-4 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-right text-xs"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 bg-slate-900/40 p-3 font-semibold text-slate-300 border-t border-slate-900 font-mono text-[11px]">
            <div className="col-span-8 uppercase text-slate-400 tracking-wider">
              Subtotal Jahez Value:
            </div>
            <div className="col-span-4 text-right text-white">
              PKR {subtotalJahez.toLocaleString()}/-
            </div>
          </div>
        </div>
      </div>

      {/* 2. BARI LIST COMPONENT MATRIX */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
          II. Bridal Gifts (Bari Apparel)
        </h3>
        <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
          <div className="divide-y divide-slate-900 bg-slate-950">
            {bariItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 p-2 gap-2 items-center">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange("bari", item.id, "description", e.target.value)
                  }
                  className="col-span-6 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      "bari",
                      item.id,
                      "quantity",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="col-span-2 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-center text-xs"
                />
                <input
                  type="number"
                  value={item.estimatedValue}
                  onChange={(e) =>
                    handleItemChange(
                      "bari",
                      item.id,
                      "estimatedValue",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="col-span-4 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-right text-xs"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 bg-slate-900/40 p-3 font-semibold text-slate-300 border-t border-slate-900 font-mono text-[11px]">
            <div className="col-span-8 uppercase text-slate-400 tracking-wider">
              Subtotal Bari Value:
            </div>
            <div className="col-span-4 text-right text-white">
              PKR {subtotalBari.toLocaleString()}/-
            </div>
          </div>
        </div>
      </div>

      {/* 3. TOTALIZATION DISCLOSURE BOX */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex justify-between items-center font-mono">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">
            Grand Valuation Summary
          </span>
          <div className="text-xs text-slate-400 font-sans">
            Combined recovery calculation value for court-ready pleading.
          </div>
        </div>
        <div className="text-right text-base font-bold text-amber-400">
          PKR {grandTotalCombined.toLocaleString()}/-
        </div>
      </div>
    </div>
  );
}
