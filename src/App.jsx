import React, { useState, useEffect } from 'react';
import { 
  Wine, Clock, Plus, Save, ExternalLink, 
  CheckCircle, Globe, Eye, MapPin, Search, Info
} from 'lucide-react';

const WINE_FOLLY_FLAVORS = [
  'Floral', 'Citrus', 'Tree Fruit', 'Tropical Fruit', 
  'Red Fruit', 'Black Fruit', 'Herbal / Green', 'Spice', 
  'Earth / Mineral', 'Oak / Vanilla', 'Butter / Dairy', 'Leather / Tobacco'
];

const CONTINENTS = [
  'Europe', 'North America', 'South America', 
  'Oceania', 'Africa', 'Asia'
];

const DEFAULT_SUBSTAGES = [
  { id: 'sub-1', label: 'Initial Pour', elapsedMinutes: 0 },
  { id: 'sub-2', label: '5 Minutes In', elapsedMinutes: 5 },
  { id: 'sub-3', label: '30 Minutes In', elapsedMinutes: 30 },
  { id: 'sub-4', label: 'Post-Food / +1hr', elapsedMinutes: 60 },
];

// Region Database: Maps & Grapes ranked by popularity
const REGION_DATABASE = {
  'Bordeaux': {
    country: 'France',
    mapQuery: 'Bordeaux+Wine+Region+France',
    grapes: [
      { name: 'Merlot', share: '66% of plantings', type: 'Red' },
      { name: 'Cabernet Sauvignon', share: '22% of plantings', type: 'Red' },
      { name: 'Cabernet Franc', share: '9% of plantings', type: 'Red' },
      { name: 'Sauvignon Blanc', share: 'White blend leader', type: 'White' },
      { name: 'Sémillon', share: 'Sweet & White blends', type: 'White' },
      { name: 'Petit Verdot', share: 'Minor blending grape', type: 'Red' }
    ]
  },
  'Burgundy': {
    country: 'France',
    mapQuery: 'Burgundy+Wine+Region+France',
    grapes: [
      { name: 'Pinot Noir', share: 'Primary Red Variety', type: 'Red' },
      { name: 'Chardonnay', share: 'Primary White Variety', type: 'White' },
      { name: 'Gamay', share: 'Beaujolais & Maconnais', type: 'Red' },
      { name: 'Aligoté', share: 'Secondary White Variety', type: 'White' }
    ]
  },
  'Tuscany': {
    country: 'Italy',
    mapQuery: 'Tuscany+Wine+Region+Italy',
    grapes: [
      { name: 'Sangiovese', share: 'Dominant (Chianti, Brunello)', type: 'Red' },
      { name: 'Cabernet Sauvignon', share: 'Super Tuscan blend', type: 'Red' },
      { name: 'Merlot', share: 'Super Tuscan blend', type: 'Red' },
      { name: 'Canaiolo', share: 'Traditional Chianti blend', type: 'Red' },
      { name: 'Trebbiano', share: 'Traditional White', type: 'White' }
    ]
  },
  'Napa Valley': {
    country: 'United States',
    mapQuery: 'Napa+Valley+California',
    grapes: [
      { name: 'Cabernet Sauvignon', share: '50%+ total acreage', type: 'Red' },
      { name: 'Chardonnay', share: 'Primary White Variety', type: 'White' },
      { name: 'Merlot', share: 'Key Red Variety', type: 'Red' },
      { name: 'Sauvignon Blanc', share: 'Crisp White Variety', type: 'White' },
      { name: 'Zinfandel', share: 'Heritage Variety', type: 'Red' }
    ]
  },
  'Rioja': {
    country: 'Spain',
    mapQuery: 'Rioja+Wine+Region+Spain',
    grapes: [
      { name: 'Tempranillo', share: '80%+ of plantings', type: 'Red' },
      { name: 'Garnacha (Grenache)', share: 'Key blending grape', type: 'Red' },
      { name: 'Graciano', share: 'Aromatic red blend', type: 'Red' },
      { name: 'Mazuelo (Carignan)', share: 'Structure & acidity', type: 'Red' },
      { name: 'Viura (Macabeo)', share: 'Primary White Variety', type: 'White' }
    ]
  },
  'Barossa Valley': {
    country: 'Australia',
    mapQuery: 'Barossa+Valley+Australia',
    grapes: [
      { name: 'Shiraz (Syrah)', share: 'Iconic Variety', type: 'Red' },
      { name: 'Cabernet Sauvignon', share: 'Major Red', type: 'Red' },
      { name: 'Grenache', share: 'Old Vine Specialty', type: 'Red' },
      { name: 'Riesling', share: 'Eden Valley neighbour', type: 'White' }
    ]
  }
};

// Grape Database: Regions where grape is typically grown
const GRAPE_DATABASE = {
  'Cabernet Sauvignon': [
    { region: 'Bordeaux (Left Bank)', country: 'France', style: 'Structured, Cassis, Cedar, High Tannin' },
    { region: 'Napa Valley', country: 'USA', style: 'Bold, Ripe Blackberry, Oak, Full-bodied' },
    { region: 'Coonawarra', country: 'Australia', style: 'Mint, Eucalyptus, Dark Fruit' },
    { region: 'Maipo Valley', country: 'Chile', style: 'Blackcurrant, Green Pepper, Structured' },
    { region: 'Tuscany (Super Tuscans)', country: 'Italy', style: 'Black Cherry, Tobacco, High Acidity' }
  ],
  'Pinot Noir': [
    { region: 'Burgundy (Côte d\'Or)', country: 'France', style: 'Red Cherry, Earth, Mushroom, Elegant' },
    { region: 'Willamette Valley', country: 'USA', style: 'Cherry, Raspberry, Forest Floor' },
    { region: 'Central Otago', country: 'New Zealand', style: 'Vibrant Red Fruit, Plum, Spice' },
    { region: 'Pfaltz / Baden (Spätburgunder)', country: 'Germany', style: 'Savory, Light Cranberry, Earth' },
    { region: 'Walker Bay', country: 'South Africa', style: 'Ripe Strawberry, Minerals, Soft' }
  ],
  'Chardonnay': [
    { region: 'Burgundy (Chablis, Côte de Beaune)', country: 'France', style: 'Flinty/Steely to Rich & Buttery' },
    { region: 'Sonoma Coast & Napa', country: 'USA', style: 'Full-bodied, Vanilla, Rich Oak, Butter' },
    { region: 'Yarra Valley & Margaret River', country: 'Australia', style: 'Citrus, White Peach, Fine Acidity' },
    { region: 'Mendoza', country: 'Argentina', style: 'Tropical Fruit, Crisp Mineral Finish' }
  ],
  'Sangiovese': [
    { region: 'Chianti Classico', country: 'Italy', style: 'Tart Red Cherry, Dried Herbs, Earth, High Acidity' },
    { region: 'Brunello di Montalcino', country: 'Italy', style: 'Bold Dried Plum, Leather, Firm Tannins' },
    { region: 'Vino Nobile di Montepulciano', country: 'Italy', style: 'Black Cherry, Tobacco, Balanced' }
  ],
  'Syrah / Shiraz': [
    { region: 'Northern Rhône (Hermitage, Côte-Rôtie)', country: 'France', style: 'Black Pepper, Olive, Savory, Blackberry' },
    { region: 'Barossa & McLaren Vale', country: 'Australia', style: 'Jammy Plum, Chocolate, Bold Spice' },
    { region: 'Paso Robles', country: 'USA', style: 'Dark Berry, Smoke, Full-bodied' }
  ],
  'Tempranillo': [
    { region: 'Rioja', country: 'Spain', style: 'Leather, Cherry, Vanilla Oak, Medium Tannin' },
    { region: 'Ribera del Duero', country: 'Spain', style: 'Bold Black Fruit, Intense Structure, Oak' },
    { region: 'Toro', country: 'Spain', style: 'Powerful, Dark Plum, High Alcohol & Tannin' }
  ]
};

const createInitialWine = (index) => ({
  id: `wine-${Date.now()}-${index}`,
  number: index + 1,
  color: 'Ruby',
  isCommitted: false,
  guesses: {
    continent: 'Europe',
    country: '',
    region: 'Bordeaux',
    winery: '',
    grapeVarieties: 'Cabernet Sauvignon',
    vintage: '',
  },
  stages: DEFAULT_SUBSTAGES.reduce((acc, stage) => {
    acc[stage.id] = {
      elapsedMinutes: stage.elapsedMinutes,
      noseNotes: {},
      palateNotes: {},
      acidity: 5,
      tannins: 5,
      generalNotes: '',
    };
    return acc;
  }, {}),
  reveal: {
    actualName: '',
    producer: '',
    countryRegion: '',
    grape: '',
    vintage: '',
    imageUrl: '',
  }
});

export default function WineBlindTastingApp() {
  const [wineCount, setWineCount] = useState(4);
  const [wines, setWines] = useState([]);
  const [activeWineIdx, setActiveWineIdx] = useState(0);
  const [activeStageId, setActiveStageId] = useState('sub-1');
  const [customStageLabel, setCustomStageLabel] = useState('');
  const [customStageMins, setCustomStageMins] = useState(15);
  const [activeView, setActiveView] = useState('tasting'); // 'tasting' | 'reveal' | 'explorer'

  // Explorer State
  const [selectedRegion, setSelectedRegion] = useState('Bordeaux');
  const [selectedGrape, setSelectedGrape] = useState('Cabernet Sauvignon');

  useEffect(() => {
    const saved = localStorage.getItem('wine_blind_tasting_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWines(parsed);
        setWineCount(parsed.length);
      } catch (e) {
        initWines(4);
      }
    } else {
      initWines(4);
    }
  }, []);

  useEffect(() => {
    if (wines.length > 0) {
      localStorage.setItem('wine_blind_tasting_data', JSON.stringify(wines));
    }
  }, [wines]);

  const initWines = (count) => {
    const initial = Array.from({ length: count }, (_, i) => createInitialWine(i));
    setWines(initial);
  };

  const handleWineCountChange = (newCount) => {
    const count = Math.max(1, Math.min(12, Number(newCount)));
    setWineCount(count);
    setWines(prev => {
      if (count > prev.length) {
        const added = Array.from({ length: count - prev.length }, (_, i) => 
          createInitialWine(prev.length + i)
        );
        return [...prev, ...added];
      } else {
        return prev.slice(0, count);
      }
    });
    if (activeWineIdx >= count) setActiveWineIdx(count - 1);
  };

  const currentWine = wines[activeWineIdx];

  const updateGuess = (field, value) => {
    setWines(prev => prev.map((w, idx) => {
      if (idx !== activeWineIdx) return w;
      return { ...w, guesses: { ...w.guesses, [field]: value } };
    }));
  };

  const updateStageData = (stageId, key, value) => {
    setWines(prev => prev.map((w, idx) => {
      if (idx !== activeWineIdx) return w;
      return {
        ...w,
        stages: {
          ...w.stages,
          [stageId]: { ...w.stages[stageId], [key]: value }
        }
      };
    }));
  };

  const toggleFlavorNote = (stageId, category, flavor) => {
    const stage = currentWine?.stages[stageId] || {};
    const notes = { ...(stage[category] || {}) };
    
    if (!notes[flavor]) {
      notes[flavor] = 1;
    } else if (notes[flavor] === 3) {
      delete notes[flavor];
    } else {
      notes[flavor] += 1;
    }

    updateStageData(stageId, category, notes);
  };

  const addCustomSubstage = () => {
    if (!customStageLabel) return;
    const newId = `sub-${Date.now()}`;
    const newStageObj = {
      elapsedMinutes: Number(customStageMins),
      noseNotes: {},
      palateNotes: {},
      acidity: 5,
      tannins: 5,
      generalNotes: '',
    };

    setWines(prev => prev.map((w, idx) => {
      if (idx !== activeWineIdx) return w;
      return {
        ...w,
        stages: { ...w.stages, [newId]: newStageObj }
      };
    }));

    setActiveStageId(newId);
    setCustomStageLabel('');
  };

  const commitGuesses = () => {
    setWines(prev => prev.map((w, idx) => idx === activeWineIdx ? { ...w, isCommitted: true } : w));
  };

  const updateRevealInfo = (wineIdx, field, val) => {
    setWines(prev => prev.map((w, idx) => idx === wineIdx ? { ...w, reveal: { ...w.reveal, [field]: val } } : w));
  };

  if (!currentWine && activeView !== 'explorer') return null;

  const activeStage = currentWine?.stages[activeStageId] || (currentWine ? Object.values(currentWine.stages)[0] : null);
  const regionInfo = REGION_DATABASE[selectedRegion] || REGION_DATABASE['Bordeaux'];
  const grapeInfo = GRAPE_DATABASE[selectedGrape] || GRAPE_DATABASE['Cabernet Sauvignon'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pb-6 border-b border-slate-800 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Wine className="w-8 h-8 text-rose-500" />
          <h1 className="text-2xl font-bold tracking-tight">Sommelier Blind Tasting Journal</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setActiveView('tasting')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${activeView === 'tasting' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Tasting Session
            </button>
            <button
              onClick={() => setActiveView('explorer')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${activeView === 'explorer' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <MapPin className="w-3.5 h-3.5" /> Region & Grape Map
            </button>
            <button
              onClick={() => setActiveView('reveal')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${activeView === 'reveal' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Eye className="w-3.5 h-3.5" /> Reveal & Store
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-sm">
            <span>Total Wines:</span>
            <input
              type="number"
              min="1"
              max="12"
              value={wineCount}
              onChange={(e) => handleWineCountChange(e.target.value)}
              className="w-12 bg-slate-900 border border-slate-700 rounded text-center py-0.5 text-rose-400 font-bold"
            />
          </div>
        </div>
      </header>

      {/* Wine Selector Tabs */}
      {activeView !== 'explorer' && (
        <div className="max-w-6xl mx-auto mb-6 overflow-x-auto pb-2">
          <div className="flex items-center gap-2">
            {wines.map((w, idx) => (
              <button
                key={w.id}
                onClick={() => setActiveWineIdx(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition whitespace-nowrap ${
                  activeWineIdx === idx 
                    ? 'bg-rose-950/60 border-rose-500 text-rose-200' 
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Wine className="w-4 h-4" />
                Wine #{w.number}
                {w.isCommitted && <CheckCircle className="w-4 h-4 text-emerald-400 ml-1" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TASTING VIEW */}
      {activeView === 'tasting' && (
        <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Substage Selector */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Timed Evaluation Substages
                </span>
                <span className="text-xs text-slate-400">Track structural evolution over time</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(currentWine.stages).map(([sId, sData]) => (
                  <button
                    key={sId}
                    onClick={() => setActiveStageId(sId)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${
                      activeStageId === sId
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    +{sData.elapsedMinutes}m Stage
                  </button>
                ))}
              </div>

              <div className="flex gap-2 items-center pt-2 border-t border-slate-700/60">
                <input
                  type="text"
                  placeholder="Label (e.g., +45m / Air Exposure)"
                  value={customStageLabel}
                  onChange={(e) => setCustomStageLabel(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white flex-1"
                />
                <input
                  type="number"
                  placeholder="Mins"
                  value={customStageMins}
                  onChange={(e) => setCustomStageMins(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white w-16"
                />
                <button
                  onClick={addCustomSubstage}
                  className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1 rounded flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Stage
                </button>
              </div>
            </div>

            {/* Flavor Wheel Sensory Profile */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-5">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <h3 className="font-semibold text-slate-200">Wine Folly Sensory Profile</h3>
                <span className="text-xs text-slate-400">Off → Mild (1) → Medium (2) → Intense (3)</span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-rose-300 mb-2.5">Aroma / Nose Notes</h4>
                <div className="flex flex-wrap gap-2">
                  {WINE_FOLLY_FLAVORS.map(flavor => {
                    const intensity = activeStage?.noseNotes?.[flavor] || 0;
                    return (
                      <button
                        key={flavor}
                        onClick={() => toggleFlavorNote(activeStageId, 'noseNotes', flavor)}
                        className={`px-2.5 py-1 rounded-full text-xs transition border flex items-center gap-1.5 ${
                          intensity === 1 ? 'bg-amber-950/80 border-amber-600 text-amber-200' :
                          intensity === 2 ? 'bg-orange-900/80 border-orange-500 text-orange-200' :
                          intensity === 3 ? 'bg-rose-900 border-rose-500 text-rose-100 font-bold' :
                          'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {flavor}
                        {intensity > 0 && <span className="bg-slate-950/60 px-1.5 py-0.2 rounded-full text-[10px]">{intensity}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-2.5">Palate / Taste Notes</h4>
                <div className="flex flex-wrap gap-2">
                  {WINE_FOLLY_FLAVORS.map(flavor => {
                    const intensity = activeStage?.palateNotes?.[flavor] || 0;
                    return (
                      <button
                        key={flavor}
                        onClick={() => toggleFlavorNote(activeStageId, 'palateNotes', flavor)}
                        className={`px-2.5 py-1 rounded-full text-xs transition border flex items-center gap-1.5 ${
                          intensity === 1 ? 'bg-indigo-950/80 border-indigo-600 text-indigo-200' :
                          intensity === 2 ? 'bg-purple-900/80 border-purple-500 text-purple-200' :
                          intensity === 3 ? 'bg-rose-900 border-rose-500 text-rose-100 font-bold' :
                          'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {flavor}
                        {intensity > 0 && <span className="bg-slate-950/60 px-1.5 py-0.2 rounded-full text-[10px]">{intensity}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-700/60">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Acidity Level</span>
                    <span className="text-rose-400 font-bold">{activeStage?.acidity || 5} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={activeStage?.acidity || 5}
                    onChange={(e) => updateStageData(activeStageId, 'acidity', Number(e.target.value))}
                    className="w-full accent-rose-500 bg-slate-900 h-2 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Tannin Level</span>
                    <span className="text-rose-400 font-bold">{activeStage?.tannins || 5} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={activeStage?.tannins || 5}
                    onChange={(e) => updateStageData(activeStageId, 'tannins', Number(e.target.value))}
                    className="w-full accent-rose-500 bg-slate-900 h-2 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Stage Notes</label>
                <textarea
                  rows="2"
                  value={activeStage?.generalNotes || ''}
                  onChange={(e) => updateStageData(activeStageId, 'generalNotes', e.target.value)}
                  placeholder="Record structural changes or food pairing observations..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Guesses */}
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-slate-200 border-b border-slate-700 pb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-400" /> Blind Deductions
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Continent Origin</label>
                <select
                  value={currentWine.guesses.continent}
                  onChange={(e) => updateGuess('continent', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
                <input
                  type="text"
                  placeholder="e.g., France, Italy"
                  value={currentWine.guesses.country}
                  onChange={(e) => updateGuess('country', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Region / Appellation</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Bordeaux, Barolo"
                    value={currentWine.guesses.region}
                    onChange={(e) => updateGuess('region', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <button 
                    onClick={() => { setSelectedRegion(currentWine.guesses.region || 'Bordeaux'); setActiveView('explorer'); }}
                    title="Lookup Region Map & Popular Grapes"
                    className="bg-slate-700 hover:bg-slate-600 px-2.5 rounded-lg text-xs flex items-center justify-center"
                  >
                    <MapPin className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Winery / Producer</label>
                <input
                  type="text"
                  placeholder="Producer guess..."
                  value={currentWine.guesses.winery}
                  onChange={(e) => updateGuess('winery', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Grape Varieties</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Nebbiolo / Pinot Noir"
                    value={currentWine.guesses.grapeVarieties}
                    onChange={(e) => updateGuess('grapeVarieties', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <button 
                    onClick={() => { setSelectedGrape(currentWine.guesses.grapeVarieties || 'Cabernet Sauvignon'); setActiveView('explorer'); }}
                    title="Lookup Regions for this Grape"
                    className="bg-slate-700 hover:bg-slate-600 px-2.5 rounded-lg text-xs flex items-center justify-center"
                  >
                    <Search className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Vintage / Estimated Age</label>
                <input
                  type="text"
                  placeholder="e.g., 2018 or 5-8 years"
                  value={currentWine.guesses.vintage}
                  onChange={(e) => updateGuess('vintage', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <button
                onClick={commitGuesses}
                disabled={currentWine.isCommitted}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  currentWine.isCommitted
                    ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg'
                }`}
              >
                {currentWine.isCommitted ? (
                  <><CheckCircle className="w-4 h-4" /> Guesses Committed & Saved</>
                ) : (
                  <><Save className="w-4 h-4" /> Commit Guesses to Database</>
                )}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* REGION & GRAPE MAP EXPLORER VIEW */}
      {activeView === 'explorer' && (
        <main className="max-w-6xl mx-auto space-y-8">
          {/* Section 1: Region Map & Grapes by Popularity */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-700 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-400" /> Wine Region Map & Grapes by Popularity
                </h2>
                <p className="text-xs text-slate-400">Explore geographical terroirs and leading grape plantings</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-300">Select Region:</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                >
                  {Object.keys(REGION_DATABASE).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map iFrame Container */}
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 h-80 relative">
                <iframe
                  title={`Map of ${selectedRegion}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?q=${regionInfo.mapQuery}&t=&z=9&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>

              {/* Grapes Ranked by Popularity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-rose-300 text-sm flex items-center justify-between">
                  <span>Top Grapes Grown in {selectedRegion} ({regionInfo.country})</span>
                  <span className="text-xs text-slate-400">Ranked by prominence</span>
                </h3>

                <div className="space-y-2.5">
                  {regionInfo.grapes.map((g, idx) => (
                    <div key={g.name} className="bg-slate-900/90 border border-slate-700 rounded-lg p-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-rose-400">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-xs text-white">{g.name}</div>
                          <div className="text-[11px] text-slate-400">{g.share}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${
                        g.type === 'Red' ? 'bg-rose-950/80 border-rose-800 text-rose-300' : 'bg-amber-950/80 border-amber-800 text-amber-300'
                      }`}>
                        {g.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Grape Variety & Typical Regions Lookup */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-700 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Search className="w-5 h-5 text-rose-400" /> Grape Variety & Global Regions Lookup
                </h2>
                <p className="text-xs text-slate-400">Find benchmark regions where specific grape varieties thrive</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-300">Select Grape Variety:</label>
                <select
                  value={selectedGrape}
                  onChange={(e) => setSelectedGrape(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                >
                  {Object.keys(GRAPE_DATABASE).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grapeInfo.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-rose-300">{item.region}</h4>
                    <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                      {item.country}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-start gap-1.5 pt-1">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-400">Style & Profile:</strong> {item.style}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* REVEAL VIEW */}
      {activeView === 'reveal' && (
        <main className="max-w-6xl mx-auto space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
            <h2 className="text-xl font-bold mb-4 text-slate-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-rose-400" /> Host Reveal & Retailer Lookup
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wines.map((w, idx) => {
                const vinmonopoletUrl = `https://www.vinmonopolet.no/search?q=${encodeURIComponent(w.reveal.actualName || w.guesses.winery || 'Wine')}`;
                return (
                  <div key={w.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="font-bold text-rose-400">Wine #{w.number}</span>
                      <span className="text-xs text-slate-400">
                        Guest Guess: {w.guesses.continent} / {w.guesses.country || 'N/A'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-slate-400 block">Actual Wine Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Château Margaux"
                          value={w.reveal.actualName}
                          onChange={(e) => updateRevealInfo(idx, 'actualName', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block">Producer/Winery</label>
                        <input
                          type="text"
                          placeholder="Producer"
                          value={w.reveal.producer}
                          onChange={(e) => updateRevealInfo(idx, 'producer', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block">Country / Region</label>
                        <input
                          type="text"
                          placeholder="Origin"
                          value={w.reveal.countryRegion}
                          onChange={(e) => updateRevealInfo(idx, 'countryRegion', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block">Image URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={w.reveal.imageUrl}
                          onChange={(e) => updateRevealInfo(idx, 'imageUrl', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white mt-1"
                        />
                      </div>
                    </div>

                    {w.reveal.imageUrl && (
                      <img
                        src={w.reveal.imageUrl}
                        alt="Bottle"
                        className="h-32 object-contain mx-auto rounded my-2"
                      />
                    )}

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <a
                        href={vinmonopoletUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold"
                      >
                        Search on Vinmonopolet.no <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
