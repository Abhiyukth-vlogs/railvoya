import React, { createContext, useContext, useState, useEffect } from "react";
import { Station } from "../types";

export interface RecentSearch {
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  date: string;
  quota: string;
  travelClass: string;
  timestamp: number;
}

interface SearchContextType {
  fromStation: Station | null;
  toStation: Station | null;
  journeyDate: string;
  travelClass: string;
  quota: string;
  recentSearches: RecentSearch[];
  setFromStation: (station: Station | null) => void;
  setToStation: (station: Station | null) => void;
  setJourneyDate: (date: string) => void;
  setTravelClass: (cls: string) => void;
  setQuota: (quota: string) => void;
  swapStations: () => void;
  saveRecentSearch: (search: Omit<RecentSearch, "timestamp">) => void;
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "railvoya_recent_searches";

export const getTomorrowDate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fromStation, setFromStation] = useState<Station | null>({
    code: "NDLS",
    name: "New Delhi",
    city: "New Delhi",
    state: "Delhi",
    hindi_name: "नई दिल्ली",
    is_major_junction: true,
  });

  const [toStation, setToStation] = useState<Station | null>({
    code: "MMCT",
    name: "Mumbai Central",
    city: "Mumbai",
    state: "Maharashtra",
    hindi_name: "मुंबई सेंट्रल",
    is_major_junction: true,
  });

  const [journeyDate, setJourneyDate] = useState<string>(getTomorrowDate());
  const [travelClass, setTravelClass] = useState<string>("ALL");
  const [quota, setQuota] = useState<string>("GN");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // LocalStorage access issues
    }
  }, []);

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const saveRecentSearch = (search: Omit<RecentSearch, "timestamp">) => {
    const newEntry: RecentSearch = { ...search, timestamp: Date.now() };
    const filtered = recentSearches.filter(
      (s) => !(s.fromCode === newEntry.fromCode && s.toCode === newEntry.toCode && s.date === newEntry.date)
    );
    const updated = [newEntry, ...filtered].slice(0, 5); // Keep up to 5
    setRecentSearches(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <SearchContext.Provider
      value={{
        fromStation,
        toStation,
        journeyDate,
        travelClass,
        quota,
        recentSearches,
        setFromStation,
        setToStation,
        setJourneyDate,
        setTravelClass,
        setQuota,
        swapStations,
        saveRecentSearch,
        clearRecentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
