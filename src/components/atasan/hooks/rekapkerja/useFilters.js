// hooks/rekapterja/useFilters.js
"use client";

import { useState, useCallback, useMemo } from "react";

export function useFilters() {
  const [search, setSearch] = useState("");
  const [bulanFilter, setBulanFilter] = useState("");
  const [tahunFilter, setTahunFilter] = useState("");
  const [wilayahFilter, setWilayahFilter] = useState("");

  // Generate bulan options (1-12)
  const getBulanOptions = useCallback(() => {
    const bulanNames = [
      { value: "1", label: "Januari" },
      { value: "2", label: "Februari" },
      { value: "3", label: "Maret" },
      { value: "4", label: "April" },
      { value: "5", label: "Mei" },
      { value: "6", label: "Juni" },
      { value: "7", label: "Juli" },
      { value: "8", label: "Agustus" },
      { value: "9", label: "September" },
      { value: "10", label: "Oktober" },
      { value: "11", label: "November" },
      { value: "12", label: "Desember" }
    ];
    return bulanNames;
  }, []);

  // Generate tahun options (current year - 5 to current year + 1)
  const getTahunOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  }, []);

  // Get bulan label from value
  const getBulanLabel = useCallback((bulanValue) => {
    const bulanNames = {
      "1": "Januari",
      "2": "Februari", 
      "3": "Maret",
      "4": "April",
      "5": "Mei",
      "6": "Juni",
      "7": "Juli",
      "8": "Agustus",
      "9": "September",
      "10": "Oktober",
      "11": "November",
      "12": "Desember"
    };
    return bulanNames[bulanValue] || "";
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearch("");
    setBulanFilter("");
    setTahunFilter("");
    setWilayahFilter("");
  }, []);

  // Set to current month and year
  const setToCurrentMonth = useCallback(() => {
    const now = new Date();
    const currentBulan = (now.getMonth() + 1).toString();
    const currentTahun = now.getFullYear().toString();
    setBulanFilter(currentBulan);
    setTahunFilter(currentTahun);
    setWilayahFilter("");
    setSearch("");
  }, []);

  // Count active filters (excluding search)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (bulanFilter) count++;
    if (tahunFilter) count++;
    if (wilayahFilter) count++;
    if (search) count++;
    return count;
  }, [bulanFilter, tahunFilter, wilayahFilter, search]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return activeFilterCount > 0;
  }, [activeFilterCount]);

  // Get filter summary for display
  const getFilterSummary = useCallback(() => {
    const filters = [];
    if (bulanFilter) filters.push(`Bulan: ${getBulanLabel(bulanFilter)}`);
    if (tahunFilter) filters.push(`Tahun: ${tahunFilter}`);
    if (wilayahFilter) filters.push(`Wilayah: ${wilayahFilter}`);
    if (search) filters.push(`Pencarian: ${search}`);
    return filters;
  }, [bulanFilter, tahunFilter, wilayahFilter, search, getBulanLabel]);

  return {
    // State
    search,
    bulanFilter,
    tahunFilter,
    wilayahFilter,
    
    // Setters
    setSearch,
    setBulanFilter,
    setTahunFilter,
    setWilayahFilter,
    
    // Actions
    resetFilters,
    setToCurrentMonth,
    
    // Helpers
    getBulanOptions,
    getTahunOptions,
    getBulanLabel,
    getFilterSummary,
    
    // Computed
    activeFilterCount,
    hasActiveFilters
  };
}