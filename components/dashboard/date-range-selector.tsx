"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
} from "date-fns";

type DateRange = {
  startDate: Date;
  endDate: Date;
};

type DateRangeSelectorProps = {
  onRangeChange: (range: DateRange) => void;
};

export function DateRangeSelector({ onRangeChange }: DateRangeSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState("this-month");

  const presets = [
    {
      value: "this-month",
      label: "This Month",
      getRange: () => ({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
      }),
    },
    {
      value: "last-month",
      label: "Last Month",
      getRange: () => ({
        startDate: startOfMonth(subMonths(new Date(), 1)),
        endDate: endOfMonth(subMonths(new Date(), 1)),
      }),
    },
    {
      value: "last-3-months",
      label: "Last 3 Months",
      getRange: () => ({
        startDate: startOfMonth(subMonths(new Date(), 2)),
        endDate: endOfMonth(new Date()),
      }),
    },
    {
      value: "last-6-months",
      label: "Last 6 Months",
      getRange: () => ({
        startDate: startOfMonth(subMonths(new Date(), 5)),
        endDate: endOfMonth(new Date()),
      }),
    },
    {
      value: "this-year",
      label: "This Year",
      getRange: () => ({
        startDate: startOfYear(new Date()),
        endDate: endOfYear(new Date()),
      }),
    },
  ];

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    const preset = presets.find((p) => p.value === value);
    if (preset) {
      onRangeChange(preset.getRange());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedPreset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
