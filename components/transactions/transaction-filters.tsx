"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type TransactionFiltersProps = {
  onFilterChange: (filters: {
    type?: "INCOME" | "EXPENSE" | "ALL";
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => void;
};

export function TransactionFilters({
  onFilterChange,
}: TransactionFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    type: "ALL" as "INCOME" | "EXPENSE" | "ALL",
    categoryId: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Convert filters to API format
    const apiFilters: Record<string, string> = {};
    if (newFilters.type !== "ALL") apiFilters.type = newFilters.type;
    if (newFilters.categoryId) apiFilters.categoryId = newFilters.categoryId;
    if (newFilters.startDate) apiFilters.startDate = newFilters.startDate;
    if (newFilters.endDate) apiFilters.endDate = newFilters.endDate;
    if (newFilters.search) apiFilters.search = newFilters.search;

    onFilterChange(apiFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      type: "ALL" as const,
      categoryId: "",
      startDate: "",
      endDate: "",
      search: "",
    };
    setFilters(defaultFilters);
    onFilterChange({});
  };

  const hasActiveFilters =
    filters.type !== "ALL" ||
    filters.categoryId ||
    filters.startDate ||
    filters.endDate ||
    filters.search;

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search description..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.categoryId}
            onValueChange={(value) => handleFilterChange("categoryId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
