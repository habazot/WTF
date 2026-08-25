import React, { useState, useEffect } from 'react';
import { 
  Wine, Clock, Plus, Save, ExternalLink,
  CheckCircle, Globe, Eye, MapPin, Search, Info, CalendarDays, FileText
} from 'lucide-react';

const TASTING_WHEEL_CATEGORIES = [
  { name: 'Floral', color: '#7778bd', notes: ['Rose', 'Violet', 'Potpourri', 'Hibiscus', 'Jasmine', 'Lavender'] },
  { name: 'Citrus', color: '#91bd43', notes: ['Lime', 'Lemon', 'Grapefruit', 'Orange', 'Marmalade'] },
  { name: 'Tree Fruit', color: '#f5a142', notes: ['Quince', 'Apple', 'Pear', 'Nectarine', 'Peach', 'Apricot', 'Persimmon'] },
  { name: 'Tropical Fruit', color: '#ed4929', notes: ['Pineapple', 'Mango', 'Guava', 'Kiwi', 'Lychee'] },
  { name: 'Red Fruit', color: '#d94b42', notes: ['Bubblegum', 'Cranberry', 'Red Plum', 'Pomegranate', 'Sour Cherry', 'Strawberry', 'Cherry'] },
  { name: 'Black Fruit', color: '#912f55', notes: ['Raspberry', 'Boysenberry', 'Black Currant', 'Black Cherry', 'Blackberry', 'Blueberry', 'Olive'] },
  { name: 'Dried Fruit', color: '#9e678d', notes: ['Raisin', 'Date', 'Fig', 'Prune'] },
  { name: 'Non-Fruit', color: '#d2b83e', notes: ['Nut', 'Cocoa', 'Coffee', 'Tobacco', 'Leather', 'Meat', 'Smoke'] },
  { name: 'Spice', color: '#17b7b5', notes: ['White Pepper', 'Black Pepper', 'Cinnamon', 'Clove', 'Anise', 'Nutmeg'] },
  { name: 'Vegetable', color: '#329b62', notes: ['Bell Pepper', 'Grass', 'Tomato Leaf', 'Black Olive', 'Green Bean', 'Eucalyptus'] },
  { name: 'Earth', color: '#80a33b', notes: ['Mushroom', 'Truffle', 'Forest Floor', 'Potting Soil', 'Wet Stone'] },
  { name: 'Microbial', color: '#d6d24f', notes: ['Butter', 'Yogurt', 'Cheese', 'Sourdough', 'Kefir'] },
  { name: 'Oak Aging', color: '#c59d28', notes: ['Dill', 'Smoke', 'Cigar Box', 'Baking Spices', 'Coconut', 'Vanilla'] },
  { name: 'General Aging', color: '#d28129', notes: ['Leather', 'Tobacco', 'Dried Flowers', 'Dried Herbs', 'Walnut'] },
  { name: 'Brett', color: '#b75c40', notes: ['Barnyard', 'Band-Aid', 'Sweaty Horse', 'Mousy'] },
  { name: 'Cooked', color: '#b84770', notes: ['Jammy', 'Cooked Fruit', 'Stewed Fruit', 'Burnt Sugar'] },
  { name: 'Volatile Acidity', color: '#9a4e91', notes: ['Vinegar', 'Acetone', 'Nail Polish Remover'] },
  { name: 'Sulfide & Mercaptan', color: '#bd713d', notes: ['Rubber', 'Matchstick', 'Cabbage', 'Onion', 'Garlic'] },
];

const CONTINENTS = [
  'Europe', 'North America', 'South America', 
  'Oceania', 'Africa', 'Asia'
];

const WINE_COLORS = [
  { name: 'Pale Straw', color: '#e9e3b5', group: 'White' }, { name: 'Medium Straw', color: '#e5dc91', group: 'White' }, { name: 'Deep Straw', color: '#d8d477', group: 'White' },
  { name: 'Pale Yellow', color: '#f4ed9d', group: 'White' }, { name: 'Medium Yellow', color: '#e6df3e', group: 'White' }, { name: 'Deep Yellow', color: '#d8cf16', group: 'White' },
  { name: 'Pale Gold', color: '#e7d58a', group: 'White' }, { name: 'Medium Gold', color: '#e1bf3d', group: 'White' }, { name: 'Deep Gold', color: '#d79f19', group: 'White' },
  { name: 'Pale Brown', color: '#d9a94c', group: 'White' }, { name: 'Medium Brown', color: '#a66719', group: 'White' }, { name: 'Deep Brown', color: '#4b2d13', group: 'White' },
  { name: 'Pale Amber', color: '#e8a936', group: 'White' }, { name: 'Medium Amber', color: '#e87918', group: 'White' }, { name: 'Deep Amber', color: '#bd4b16', group: 'White' },
  { name: 'Pale Copper', color: '#e5b09d', group: 'Rosé' }, { name: 'Medium Copper', color: '#df765a', group: 'Rosé' }, { name: 'Deep Copper', color: '#ce4d2e', group: 'Rosé' },
  { name: 'Pale Salmon', color: '#f0aaa0', group: 'Rosé' }, { name: 'Medium Salmon', color: '#e96c5d', group: 'Rosé' }, { name: 'Deep Salmon', color: '#dc4936', group: 'Rosé' },
  { name: 'Pale Pink', color: '#f2c0c6', group: 'Rosé' }, { name: 'Medium Pink', color: '#e86886', group: 'Rosé' }, { name: 'Deep Pink', color: '#c71948', group: 'Rosé' },
  { name: 'Pale Ruby', color: '#c22e50', group: 'Red' }, { name: 'Medium Ruby', color: '#8e1836', group: 'Red' }, { name: 'Deep Ruby', color: '#4c0718', group: 'Red' },
  { name: 'Pale Purple', color: '#bd2863', group: 'Red' }, { name: 'Medium Purple', color: '#870b43', group: 'Red' }, { name: 'Deep Purple', color: '#31051e', group: 'Red' },
  { name: 'Pale Garnet', color: '#b52b30', group: 'Aged' }, { name: 'Medium Garnet', color: '#7d161c', group: 'Aged' }, { name: 'Deep Garnet', color: '#3e0b0d', group: 'Aged' },
  { name: 'Pale Tawny', color: '#bd6d39', group: 'Aged' }, { name: 'Medium Tawny', color: '#93451f', group: 'Aged' }, { name: 'Deep Tawny', color: '#552315', group: 'Aged' },
];

const WineGlass = ({ color, large = false }) => (
  <span className={`relative block ${large ? 'w-12 h-14' : 'w-9 h-10'}`} aria-hidden="true">
    <span className="absolute inset-x-1 top-0 h-[70%] overflow-hidden rounded-[45%_45%_50%_50%] border-2 border-slate-300/80 bg-white/10 shadow-inner">
      <span className="absolute inset-x-0 bottom-0 h-[68%] rounded-[0_0_48%_48%] opacity-90" style={{ backgroundColor: color }} />
      <span className="absolute left-[22%] top-[8%] h-[55%] w-[12%] rounded-full bg-white/50" />
    </span>
    <span className="absolute left-1/2 top-[68%] h-[23%] w-px -translate-x-1/2 bg-slate-300/80" />
    <span className="absolute bottom-0 left-1/2 h-px w-[70%] -translate-x-1/2 bg-slate-300/80" />
  </span>
);

const DEFAULT_SUBSTAGES = [
  { id: 'sub-1', label: 'Immediate', elapsedMinutes: 0 },
  { id: 'sub-2', label: 'Half Hour', elapsedMinutes: 30 },
  { id: 'sub-3', label: '2 Hours', elapsedMinutes: 120 },
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
  translucency: 3,
  isCommitted: false,
  guesses: {
    continent: 'Europe',
    country: '',
    region: 'Bordeaux',
    winery: '',
    grapeVarieties: 'Cabernet Sauvignon',
    vintage: '',
    alcohol: '',
  },
  stages: DEFAULT_SUBSTAGES.reduce((acc, stage) => {
    acc[stage.id] = {
      elapsedMinutes: stage.elapsedMinutes,
      color: 'Ruby',
      translucency: 3,
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

const normalizeWine = (wine, index) => {
  const initialWine = createInitialWine(index);
  return {
    ...initialWine,
    ...wine,
    translucency: wine.translucency || 3,
    guesses: { ...initialWine.guesses, ...wine.guesses, alcohol: wine.guesses?.alcohol || '' },
    stages: DEFAULT_SUBSTAGES.reduce((stages, stage) => {
      stages[stage.id] = {
        ...initialWine.stages[stage.id],
        ...(wine.stages?.[stage.id] || {}),
        elapsedMinutes: stage.elapsedMinutes,
        color: wine.stages?.[stage.id]?.color || wine.color || initialWine.stages[stage.id].color,
        translucency: wine.stages?.[stage.id]?.translucency || wine.translucency || 3,
      };
      return stages;
    }, {}),
  };
};

const createSession = (wines = [], index = 0) => ({
  id: `session-${Date.now()}-${index}`,
  title: `Tasting Session ${index + 1}`,
  notes: '',
  createdAt: new Date().toISOString(),
  startedAt: new Date().toISOString().slice(0, 16),
  wines,
});

const formatSessionDate = (dateValue) => {
  if (!dateValue) return 'No date set';
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime())
    ? 'No date set'
    : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

const wineFollyGrapeUrl = (grapeName) => {
  const grapeSlug = grapeName.split(' / ')[0].toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `https://winefolly.com/grapes/${grapeSlug}/`;
};

export default function WineBlindTastingApp() {
  const [wineCount, setWineCount] = useState(4);
  const [wines, setWines] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeWineIdx, setActiveWineIdx] = useState(0);
  const [activeStageId, setActiveStageId] = useState('sub-1');
  const [activeView, setActiveView] = useState('tasting'); // 'tasting' | 'reveal' | 'explorer' | 'sessions'

  // Explorer State
  const [selectedRegion, setSelectedRegion] = useState('Bordeaux');
  const [selectedGrape, setSelectedGrape] = useState('Cabernet Sauvignon');
  const [expandedNoseCategory, setExpandedNoseCategory] = useState(null);
  const [expandedPalateCategory, setExpandedPalateCategory] = useState(null);
  const [colorPickerWineIdx, setColorPickerWineIdx] = useState(null);
  const [colorPickerStageId, setColorPickerStageId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('wine_blind_tasting_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const loadedSessions = (Array.isArray(parsed)
          ? [createSession(parsed, 0)]
          : parsed.sessions || []).map(session => ({
            ...session,
            wines: (session.wines || []).map(normalizeWine),
          }));
        const firstSession = loadedSessions[0] || createSession([], 0);
        const loadedActiveSession = loadedSessions.find(session => session.id === parsed.activeSessionId) || firstSession;
        setSessions(loadedSessions.length ? loadedSessions : [firstSession]);
        setActiveSessionId(loadedActiveSession.id);
        setWines(loadedActiveSession.wines || []);
        setWineCount((loadedActiveSession.wines || []).length);
      } catch (e) {
        initWines(4);
      }
    } else {
      initWines(4);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && wines.length > 0 && activeSessionId) {
      setSessions(prev => prev.map(session => (
        session.id === activeSessionId ? { ...session, wines } : session
      )));
    }
  }, [wines, activeSessionId, isLoaded]);

  useEffect(() => {
    if (isLoaded && sessions.length > 0) {
      localStorage.setItem('wine_blind_tasting_data', JSON.stringify({ sessions, activeSessionId }));
    }
  }, [sessions, activeSessionId, isLoaded]);

  const initWines = (count) => {
    const initial = Array.from({ length: count }, (_, i) => createInitialWine(i));
    setWines(initial);
    const session = createSession(initial, sessions.length);
    setSessions([session]);
    setActiveSessionId(session.id);
  };

  const activeSession = sessions.find(session => session.id === activeSessionId);

  const updateSession = (field, value) => {
    setSessions(prev => prev.map(session => (
      session.id === activeSessionId ? { ...session, [field]: value } : session
    )));
  };

  const switchSession = (session) => {
    setActiveSessionId(session.id);
    setWines(session.wines || []);
    setWineCount((session.wines || []).length);
    setActiveWineIdx(0);
    setActiveStageId('sub-1');
    setActiveView('tasting');
  };

  const createNewSession = () => {
    const newSession = createSession(
      Array.from({ length: wineCount }, (_, i) => createInitialWine(i)),
      sessions.length
    );
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    setWines(newSession.wines);
    setActiveWineIdx(0);
    setActiveStageId('sub-1');
    setActiveView('tasting');
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
        ...(key === 'color' ? { color: value } : {}),
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

  const commitGuesses = () => {
    setWines(prev => prev.map((w, idx) => idx === activeWineIdx ? { ...w, isCommitted: true } : w));
  };

  const updateRevealInfo = (wineIdx, field, val) => {
    setWines(prev => prev.map((w, idx) => idx === wineIdx ? { ...w, reveal: { ...w.reveal, [field]: val } } : w));
  };

  const renderFlavorCell = (field, stageId) => {
    const expandedCategory = field === 'noseNotes' ? expandedNoseCategory : expandedPalateCategory;
    const setExpandedCategory = field === 'noseNotes' ? setExpandedNoseCategory : setExpandedPalateCategory;
    const stage = currentWine?.stages?.[stageId];

    return <div className="space-y-1.5 min-w-[190px]">
      {TASTING_WHEEL_CATEGORIES.map(category => {
        const notes = stage?.[field] || {};
        const selectedCount = category.notes.filter(note => notes[note]).length;
        const categoryKey = `${stageId}:${field}:${category.name}`;
        const isExpanded = expandedCategory === categoryKey;

        return (
          <div key={category.name} className="rounded-lg border border-slate-700/70 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedCategory(isExpanded ? null : categoryKey)}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-xs font-semibold transition hover:brightness-110"
              style={{ backgroundColor: `${category.color}35`, borderLeft: `4px solid ${category.color}` }}
              aria-expanded={isExpanded}
            >
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }} />
                {category.name}
                {selectedCount > 0 && <span className="text-[10px] text-slate-300">{selectedCount} selected</span>}
              </span>
              <span className="text-slate-300 text-base leading-none">{isExpanded ? '−' : '+'}</span>
            </button>

            {isExpanded && (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-950/50 border-t border-slate-700/70">
                {category.notes.map(note => {
                  const intensity = notes[note] || 0;
                  const intensitySuffix = intensity === 1 ? '55' : intensity === 2 ? '99' : 'dd';
                  return (
                    <button
                      type="button"
                      key={note}
                      onClick={() => toggleFlavorNote(stageId, field, note)}
                      className="px-2.5 py-1 rounded-full text-xs transition border flex items-center gap-1.5 text-slate-100 hover:brightness-125"
                      style={{
                        backgroundColor: intensity ? `${category.color}${intensitySuffix}` : `${category.color}20`,
                        borderColor: intensity ? category.color : `${category.color}80`,
                      }}
                      title={intensity ? `Intensity ${intensity}. Click to increase.` : 'Click to mark as mild.'}
                    >
                      {note}
                      {intensity > 0 && <span className="bg-slate-950/60 px-1.5 py-0.2 rounded-full text-[10px]">{intensity}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>;
  };

  if (!currentWine && activeView !== 'explorer' && activeView !== 'sessions') return null;

  const regionInfo = REGION_DATABASE[selectedRegion] || REGION_DATABASE['Bordeaux'];
  const grapeInfo = GRAPE_DATABASE[selectedGrape] || GRAPE_DATABASE['Cabernet Sauvignon'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pb-6 border-b border-slate-800 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Wine className="w-8 h-8 text-rose-500" />
          <h1 className="text-2xl font-bold tracking-tight">Wine Tasting Friend</h1>
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
              onClick={() => setActiveView('sessions')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${activeView === 'sessions' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Sessions
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
              <div key={w.id} className="relative">
                <button
                  onClick={() => setActiveWineIdx(idx)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-semibold transition whitespace-nowrap ${
                    activeWineIdx === idx
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-white/70" style={{ backgroundColor: WINE_COLORS.find(color => color.name === w.color)?.color || '#a93645' }} />
                  Wine #{w.number}
                  {w.isCommitted && <CheckCircle className="w-4 h-4 text-emerald-400 ml-1" />}
                </button>
                <button type="button" onClick={() => setColorPickerWineIdx(colorPickerWineIdx === idx ? null : idx)} title="Choose wine colour" aria-label={`Choose colour for Wine ${w.number}`} className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-slate-950 border border-slate-400 text-[10px] text-white leading-none">+</button>
                {colorPickerWineIdx === idx && <div className="absolute z-20 top-full left-0 mt-1 w-[min(26rem,calc(100vw-2rem))] p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {WINE_COLORS.map(wineColor => <button type="button" key={wineColor.name} title={wineColor.name} aria-label={`Set Wine ${w.number} colour to ${wineColor.name}`} onClick={() => { setWines(prev => prev.map((wine, wineIdx) => wineIdx === idx ? { ...wine, color: wineColor.name } : wine)); setColorPickerWineIdx(null); }} className="min-w-0 flex flex-col items-center gap-1 text-center text-[9px] leading-tight text-slate-200 hover:text-white"><WineGlass color={wineColor.color} large /><span className="w-full break-words">{wineColor.name}</span></button>)}
                </div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'tasting' && activeSession && (
        <section className="max-w-6xl mx-auto mb-6 bg-slate-800/80 border border-slate-700 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Session title</label>
              <input
                type="text"
                value={activeSession.title}
                onChange={(e) => updateSession('title', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Date and time</label>
              <input
                type="datetime-local"
                value={activeSession.startedAt || activeSession.createdAt.slice(0, 16)}
                onChange={(e) => updateSession('startedAt', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Session notes</label>
              <textarea
                rows="2"
                value={activeSession.notes}
                onChange={(e) => updateSession('notes', e.target.value)}
                placeholder="Who was tasting, what was served, or anything worth remembering..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white"
              />
            </div>
          </div>
        </section>
      )}

      {/* SESSION DIRECTORY */}
      {activeView === 'sessions' && (
        <main className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-rose-400 font-bold mb-1">Journal archive</p>
              <h2 className="text-2xl font-bold text-slate-100">Tasting Sessions</h2>
              <p className="text-sm text-slate-400 mt-1">Open a previous tasting or start a fresh session.</p>
            </div>
            <button
              onClick={createNewSession}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map(session => (
              <div key={session.id} className={`bg-slate-800/80 border rounded-xl p-5 space-y-4 ${session.id === activeSessionId ? 'border-rose-500' : 'border-slate-700'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-slate-100 truncate">{session.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" /> {formatSessionDate(session.startedAt || session.createdAt)}
                    </p>
                  </div>
                  {session.id === activeSessionId && <span className="text-[10px] uppercase tracking-wider text-rose-300 border border-rose-700 rounded px-2 py-1">Open</span>}
                </div>
                <p className="text-sm text-slate-300 min-h-10 whitespace-pre-wrap">{session.notes || 'No session notes yet.'}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <span className="text-xs text-slate-400">{session.wines?.length || 0} wines</span>
                  <button onClick={() => switchSession(session)} className="text-xs font-bold text-rose-400 hover:text-rose-300">
                    Open session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* TASTING VIEW */}
      {activeView === 'tasting' && (
        <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700 rounded-xl p-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
              <div>
                <h3 className="font-semibold text-slate-200 flex items-center gap-2"><Clock className="w-4 h-4 text-rose-400" /> Tasting timeline</h3>
                <p className="text-[11px] text-slate-400 mt-1">Time runs left to right. Select a category to reveal its outer notes.</p>
              </div>
              <span className="text-[11px] text-slate-400">Intensity: 1 → 2 → 3 → Off</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-1 text-xs">
                <thead>
                  <tr>
                    <th className="w-28 text-left text-[11px] uppercase tracking-wide text-slate-400 p-2">Tasting note</th>
                    {Object.entries(currentWine.stages).map(([sId, sData]) => (
                      <th key={sId} className={`min-w-[220px] p-2 rounded text-left ${activeStageId === sId ? 'bg-rose-950/70 text-rose-200' : 'bg-slate-900 text-slate-300'}`}>
                        <button type="button" onClick={() => setActiveStageId(sId)} className="font-bold">{sData.elapsedMinutes === 0 ? 'Immediate' : sData.elapsedMinutes === 30 ? 'Half hour' : '2 hours'}</button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="text-left align-top text-slate-300 p-2">Colour</th>
                    {Object.entries(currentWine.stages).map(([sId, stage]) => (
                      <td key={sId} className="align-top bg-slate-900/70 rounded p-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setColorPickerStageId(colorPickerStageId === sId ? null : sId)}
                            className="flex items-center gap-2 text-[10px] text-slate-300 hover:text-white"
                            aria-label={`Choose colour for ${stage.elapsedMinutes === 0 ? 'Immediate' : stage.elapsedMinutes === 30 ? 'Half hour' : '2 hours'}`}
                          >
                            <WineGlass color={WINE_COLORS.find(wineColor => wineColor.name === (stage.color || currentWine.color))?.color || '#a93645'} />
                            {stage.color || currentWine.color}
                          </button>
                          {colorPickerStageId === sId && <div className="absolute z-30 top-full left-0 mt-1 w-[min(26rem,calc(100vw-2rem))] p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {WINE_COLORS.map(wineColor => <button type="button" key={wineColor.name} title={wineColor.name} aria-label={`Set colour to ${wineColor.name}`} onClick={() => { updateStageData(sId, 'color', wineColor.name); setColorPickerStageId(null); }} className="min-w-0 flex flex-col items-center gap-1 text-center text-[9px] leading-tight text-slate-200 hover:text-white"><WineGlass color={wineColor.color} large /><span className="w-full break-words">{wineColor.name}</span></button>)}
                          </div>}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="text-left align-top text-slate-300 p-2">Translucency</th>
                    {Object.entries(currentWine.stages).map(([sId, stage]) => (
                      <td key={sId} className="align-top bg-slate-900/70 rounded p-2"><div className="flex gap-1 mb-1">{[1, 2, 3, 4, 5].map(level => <button type="button" key={level} onClick={() => updateStageData(sId, 'translucency', level)} className={`w-5 h-5 rounded-full border ${stage.translucency >= level ? 'bg-rose-400 border-rose-300' : 'bg-slate-950 border-slate-600'}`} aria-label={`Translucency ${level} of 5`} />)}</div><span className="text-[10px] text-slate-400">{stage.translucency || 3} / 5</span></td>
                    ))}
                  </tr>
                  <tr>
                    <th className="text-left align-top text-slate-300 p-2">Aroma</th>
                    {Object.keys(currentWine.stages).map(sId => <td key={sId} className="align-top bg-slate-900/70 rounded p-2">{renderFlavorCell('noseNotes', sId)}</td>)}
                  </tr>
                  <tr>
                    <th className="text-left align-top text-slate-300 p-2">Taste</th>
                    {Object.keys(currentWine.stages).map(sId => <td key={sId} className="align-top bg-slate-900/70 rounded p-2">{renderFlavorCell('palateNotes', sId)}</td>)}
                  </tr>
                  <tr>
                    <th className="text-left align-top text-slate-300 p-2">Acidity level</th>
                    {Object.entries(currentWine.stages).map(([sId, stage]) => <td key={sId} className="align-top bg-slate-900/70 rounded p-2"><input type="range" min="1" max="10" value={stage.acidity || 5} onChange={(e) => updateStageData(sId, 'acidity', Number(e.target.value))} className="w-full accent-rose-500" /><span className="text-rose-300">{stage.acidity || 5} / 10</span></td>)}
                  </tr>
                  <tr>
                    <th className="text-left align-top text-slate-300 p-2">Tannin level</th>
                    {Object.entries(currentWine.stages).map(([sId, stage]) => <td key={sId} className="align-top bg-slate-900/70 rounded p-2"><input type="range" min="1" max="10" value={stage.tannins || 5} onChange={(e) => updateStageData(sId, 'tannins', Number(e.target.value))} className="w-full accent-rose-500" /><span className="text-rose-300">{stage.tannins || 5} / 10</span></td>)}
                  </tr>
                  <tr>
                    <th className="text-left align-top text-slate-300 p-2">Alcohol level</th>
                    {Object.entries(currentWine.stages).map(([sId]) => <td key={sId} className="align-top bg-slate-900/70 rounded p-2"><div className="flex items-center gap-1"><input type="number" min="0" max="25" step="0.1" placeholder="13.5" value={currentWine.guesses.alcohol || ''} onChange={(e) => updateGuess('alcohol', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white" /><span className="text-slate-400">%</span></div></td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Guesses */}
          <div className="space-y-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 grid grid-cols-2 gap-3">
              <h3 className="col-span-2 font-semibold text-slate-200 border-b border-slate-700 pb-2 flex items-center gap-2">
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
                className={`col-span-2 w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
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
                <a
                  href={wineFollyGrapeUrl(selectedGrape)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[11px] text-rose-400 hover:text-rose-300 mt-1"
                >
                  Open {selectedGrape} on Wine Folly ↗
                </a>
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
