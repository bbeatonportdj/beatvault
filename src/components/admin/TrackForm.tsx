"use client";

import React, { useState } from 'react';
import { X, Upload, Loader2, Music, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TrackFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function TrackForm({ onClose, onSuccess }: TrackFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    bpm: '',
    key: '',
    genre: 'house',
    price: '499',
    label: 'BEATVAULT'
  });
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [duration, setDuration] = useState('0:00');

  const getDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        const m = Math.floor(audio.duration / 60);
        const s = Math.floor(audio.duration % 60);
        resolve(`${m}:${s.toString().padStart(2, '0')}`);
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverUrl = '';
      let audioUrl = '';

      // 1. Upload Cover Image
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('covers')
          .upload(fileName, coverFile);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(fileName);
        coverUrl = publicUrl;
      }

      // 2. Upload Audio File
      if (audioFile) {
        const fileExt = audioFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('tracks')
          .upload(fileName, audioFile);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('tracks').getPublicUrl(fileName);
        audioUrl = publicUrl;
      }

      // 3. Insert metadata into DB
      const { error } = await supabase.from('tracks').insert([{
        title: formData.title,
        artist: formData.artist,
        bpm: parseInt(formData.bpm),
        key: formData.key,
        genre: formData.genre,
        price: parseFloat(formData.price),
        label: formData.label,
        cover_url: coverUrl,
        audio_url: audioUrl,
        duration: duration
      }]);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl glass-dark border border-white/10 rounded-[2.5rem] overflow-hidden animate-zoom-in">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-2xl font-black">Add New Track</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Track Title</label>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-neon/50 transition-all text-sm"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Artist Name</label>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-neon/50 transition-all text-sm"
                value={formData.artist}
                onChange={(e) => setFormData({...formData, artist: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">BPM</label>
              <input 
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-neon/50 transition-all text-sm"
                value={formData.bpm}
                onChange={(e) => setFormData({...formData, bpm: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Key</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-neon/50 transition-all text-sm"
                placeholder="e.g. 4A, 7B"
                value={formData.key}
                onChange={(e) => setFormData({...formData, key: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Genre</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-neon/50 transition-all text-sm appearance-none"
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
              >
                <option value="house">House</option>
                <option value="techno">Techno</option>
                <option value="hiphop">Hip-Hop</option>
                <option value="drum-bass">D&B</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Cover Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Cover Artwork</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl hover:border-neon/30 hover:bg-neon/5 transition-all cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon size={24} className="text-white/20 mb-2" />
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    {coverFile ? coverFile.name : 'Upload JPG/PNG'}
                  </p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            {/* Audio Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Audio File (MP3/WAV)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl hover:border-neon/30 hover:bg-neon/5 transition-all cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Music size={24} className="text-white/20 mb-2" />
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    {audioFile ? audioFile.name : 'Upload Audio'}
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="audio/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0] || null;
                    setAudioFile(file);
                    if (file) {
                      const dur = await getDuration(file);
                      setDuration(dur);
                    }
                  }} 
                />
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-neon-solid py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload size={20} />
            )}
            Publish Track
          </button>
        </form>
      </div>
    </div>
  );
}
