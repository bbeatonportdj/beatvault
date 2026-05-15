"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  bpmRange: [number, number];
  setBpmRange: (range: [number, number]) => void;
  selectedKey: string;
  setSelectedKey: (key: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [bpmRange, setBpmRange] = useState<[number, number]>([0, 200]);
  const [selectedKey, setSelectedKey] = useState('all');

  return (
    <SearchContext.Provider value={{ 
      searchQuery, setSearchQuery, 
      sortBy, setSortBy, 
      bpmRange, setBpmRange,
      selectedKey, setSelectedKey
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
