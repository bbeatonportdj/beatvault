"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Track } from './PlayerContext';

interface Crate {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface CrateContextType {
  crates: Crate[];
  addTrackToCrate: (crateId: string, trackId: string) => Promise<void>;
  createCrate: (name: string) => Promise<void>;
  deleteCrate: (crateId: string) => Promise<void>;
}

const CrateContext = createContext<CrateContextType | undefined>(undefined);

export function CrateProvider({ children }: { children: React.ReactNode }) {
  const [crates, setCrates] = useState<Crate[]>([]);

  const fetchCrates = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('crates')
      .select('*')
      .eq('user_id', session.user.id);

    if (!error) setCrates(data || []);
  };

  useEffect(() => {
    fetchCrates();
  }, []);

  const createCrate = async (name: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('crates')
      .insert([{ name, user_id: session.user.id }]);

    if (!error) fetchCrates();
  };

  const addTrackToCrate = async (crateId: string, trackId: string) => {
    const { error } = await supabase
      .from('crate_tracks')
      .insert([{ crate_id: crateId, track_id: trackId }]);

    if (error) {
      console.error("Error adding to crate:", error.message);
      alert("Track already in crate!");
    } else {
      alert("Added to crate successfully!");
    }
  };

  const deleteCrate = async (crateId: string) => {
    const { error } = await supabase.from('crates').delete().eq('id', crateId);
    if (!error) fetchCrates();
  };

  return (
    <CrateContext.Provider value={{ crates, addTrackToCrate, createCrate, deleteCrate }}>
      {children}
    </CrateContext.Provider>
  );
}

export function useCrates() {
  const context = useContext(CrateContext);
  if (context === undefined) {
    throw new Error('useCrates must be used within a CrateProvider');
  }
  return context;
}
