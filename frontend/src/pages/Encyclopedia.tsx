import React, { useState, useEffect } from 'react';
import { Search, Filter, Bookmark, BookmarkCheck, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../services/api';

export const Encyclopedia: React.FC = () => {
  const [diseases, setDiseases] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<any>(null);

  useEffect(() => {
    const fetchEncyclopedia = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/encyclopedia`);
        setDiseases(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEncyclopedia();

    // Load bookmarks
    const saved = localStorage.getItem('crop_bookmarks');
    if (saved) {
      setBookmarkedIds(JSON.parse(saved));
    }
  }, []);

  const handleToggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(bid => bid !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    localStorage.setItem('crop_bookmarks', JSON.stringify(updated));
  };

  const getFilteredDiseases = () => {
    return diseases.filter(item => {
      const matchSearch = item.disease.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCrop = selectedCrop === 'All' || item.crop === selectedCrop;
      
      let matchCat = true;
      if (selectedCategory === 'Diseased') {
        matchCat = !item.disease.includes('Healthy');
      } else if (selectedCategory === 'Healthy') {
        matchCat = item.disease.includes('Healthy');
      } else if (selectedCategory === 'Bookmarked') {
        matchCat = bookmarkedIds.includes(item.id);
      }
      
      return matchSearch && matchCrop && matchCat;
    });
  };

  const uniqueCrops = ['All', ...Array.from(new Set(diseases.map(d => d.crop)))];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 font-mono">LOADING ENCYCLOPEDIA DATABASE...</p>
        </div>
      </div>
    );
  }

  const filtered = getFilteredDiseases();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">Agricultural Encyclopedia</h2>
        <p className="text-xs text-gray-400 font-sans tracking-wide mt-1">
          Search pathogen catalogs, study botanical symptoms, and learn organic control recipes.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="glass-panel p-5 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop or disease name..."
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filter Crop */}
        <div>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            {uniqueCrops.map((c, i) => (
              <option key={i} value={c}>{c === 'All' ? 'All Crop Species' : c}</option>
            ))}
          </select>
        </div>

        {/* Filter Category */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Diseased">Diseased Only</option>
            <option value="Healthy">Healthy States</option>
            <option value="Bookmarked">My Bookmarks</option>
          </select>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Master: Grid list */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const isBookmarked = bookmarkedIds.includes(item.id);
              const isHealthy = item.disease.includes('Healthy');
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`glass-panel p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left flex flex-col justify-between h-48 relative overflow-hidden group hover:scale-[1.01] ${
                    activeItem && activeItem.id === item.id 
                      ? 'border-emerald-500/50 bg-emerald-500/5' 
                      : 'border-white/5 hover:border-white/15 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                        {item.crop}
                      </span>
                      <button
                        onClick={(e) => handleToggleBookmark(item.id, e)}
                        className="text-gray-500 hover:text-emerald-400 transition-colors"
                      >
                        {isBookmarked ? <BookmarkCheck className="h-4.5 w-4.5 text-emerald-400" /> : <Bookmark className="h-4.5 w-4.5" />}
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-white font-display mt-2 group-hover:text-emerald-400 transition-colors leading-relaxed">
                      {item.disease}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1.5 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <span className="text-[9px] font-mono text-gray-600 block text-right mt-2 flex items-center justify-end gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>View Specifications</span>
                  </span>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 glass-panel p-10 rounded-2xl border border-white/5 text-center text-gray-500 font-mono text-xs">
              No matching agricultural pathogens logged.
            </div>
          )}
        </div>

        {/* Detail View Drawer */}
        <div className="lg:col-span-1">
          {activeItem ? (
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-[#0c0f1d]/50 space-y-4 animate-in fade-in slide-in-from-right-6 duration-300">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-display">{activeItem.disease}</h3>
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Scientific Pathogen Record</span>
                </div>
                <button
                  onClick={(e) => handleToggleBookmark(activeItem.id, e)}
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  {bookmarkedIds.includes(activeItem.id) ? (
                    <BookmarkCheck className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="space-y-4 text-xs max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                <div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Description</span>
                  <p className="text-gray-300 leading-relaxed">{activeItem.description}</p>
                </div>
                
                <div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Symptoms</span>
                  <p className="text-gray-300 leading-relaxed">{activeItem.symptoms}</p>
                </div>

                <div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Causes</span>
                  <p className="text-gray-300 leading-relaxed">{activeItem.causes}</p>
                </div>

                <div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Organic Control</span>
                  <p className="text-emerald-400 leading-relaxed font-semibold">{activeItem.organic_treatment}</p>
                </div>

                <div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Chemical Control</span>
                  <p className="text-rose-400 leading-relaxed font-semibold">{activeItem.chemical_treatment}</p>
                </div>

                <div>
                  <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Future Prevention</span>
                  <p className="text-gray-400 leading-relaxed">{activeItem.prevention}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-10 rounded-3xl border border-white/5 text-center text-gray-500 flex flex-col items-center justify-center h-64">
              <HelpCircle className="h-8 w-8 text-gray-600 mb-3 animate-pulse" />
              <h4 className="text-xs font-semibold text-white font-display">Pathology Specifications</h4>
              <p className="text-[10px] text-gray-500 max-w-xs mt-1 leading-relaxed">
                Click any pathogen card in the list to load scientific symptoms, organic recipes, and chemical controls.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Encyclopedia;
