import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, 
  Music, 
  GitMerge, 
  Clock, 
  Play, 
  Square, 
  ChevronDown, 
  Mic,
  Activity,
  Layers,
  VolumeX,
  Volume1
} from 'lucide-react';

// --- DATA ---
const categories = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'dynamics', label: 'Dynamics', icon: Volume2 },
  { id: 'arrangement', label: 'Arrangement', icon: Music },
  { id: 'transitions', label: 'Transitions', icon: GitMerge },
];

const cuesData = [
  {
    id: 'drop',
    category: 'dynamics',
    title: 'Drop / Down',
    shortDesc: 'Radically reduce the volume.',
    description: 'Instructs the band to immediately drop their dynamic level. Usually means drums stop entirely or switch to light rims, and guitars drop out or play very sparse, light parts.',
    exampleLabel: 'Transitioning to a soft Verse 2',
    exampleSay: '"Drop it down... Verse 2."',
    timing: ['1', '2', 'Drop', 'Verse']
  },
  {
    id: 'build',
    category: 'dynamics',
    title: 'Build',
    shortDesc: 'Gradually increase volume/intensity.',
    description: 'A cue for the band to slowly swell their instruments over the course of the section, leading to a peak.',
    exampleLabel: 'Building up through a pre-chorus',
    exampleSay: '"Slow build... 3... 4..."',
    timing: ['1', '2', 'Build', 'Chorus']
  },
  {
    id: 'all-in',
    category: 'dynamics',
    title: 'All In / Big',
    shortDesc: 'Maximum energy, full volume.',
    description: 'Tells everyone to play at their maximum dynamic level. Full drum beats, open strumming on guitars, heavy bass.',
    exampleLabel: 'Going into the final massive chorus',
    exampleSay: '"All in... Chorus."',
    timing: ['1', '2', 'Big', 'Chorus']
  },
  {
    id: 'trash',
    category: 'dynamics',
    title: 'Trash',
    shortDesc: 'Drummer washes crash cymbals.',
    description: 'A specific high-energy cue where the drummer rides the crash cymbals continuously instead of the hi-hat or ride.',
    exampleLabel: 'During a high-energy instrumental bridge',
    exampleSay: '"Trash it out... Bridge."',
    timing: ['1', '2', 'Trash', 'Bridge']
  },
  {
    id: 'diamonds',
    category: 'arrangement',
    title: 'Diamonds',
    shortDesc: 'Play whole notes and let them ring.',
    description: 'Everyone hits the chord on beat 1 and lets it ring out for the entire measure. Creates a spacious, open feel.',
    exampleLabel: 'At the start of a broken-down chorus',
    exampleSay: '"Diamonds... Chorus."',
    timing: ['1', '2', 'Diamonds', 'Chorus']
  },
  {
    id: 'chugs',
    category: 'arrangement',
    title: 'Chugs',
    shortDesc: 'Driving, palm-muted 8th/16th notes.',
    description: 'Used primarily for guitars and bass to build rhythmic tension without taking up too much sonic space.',
    exampleLabel: 'Building tension in a bridge',
    exampleSay: '"Guitar chugs... Bridge."',
    timing: ['1', '2', 'Chugs', 'Bridge']
  },
  {
    id: 'hits',
    category: 'arrangement',
    title: 'Hits / Stops',
    shortDesc: 'Specific rhythmic accents + silence.',
    description: 'The band plays short, staccato rhythmic accents together, immediately followed by silence to create dramatic impact.',
    exampleLabel: 'Executing a pre-planned rhythmic stop',
    exampleSay: '"Watch my hits... [BAM] [BAM]"',
    timing: ['Watch', 'My', 'Hits', '(BAM)']
  },
  {
    id: 'four-floor',
    category: 'arrangement',
    title: 'Four on the Floor',
    shortDesc: 'Kick drum on every quarter note.',
    description: 'The drummer plays the kick drum on beats 1, 2, 3, and 4. Drives the tempo and adds a dance/march feel.',
    exampleLabel: 'Driving a repetitive bridge progression',
    exampleSay: '"Four on the floor... Bridge."',
    timing: ['1', '2', 'Four', 'Floor']
  },
  {
    id: 'swell',
    category: 'transitions',
    title: 'Swell',
    shortDesc: 'A rapid volume build into a new section.',
    description: 'Usually led by cymbal rolls and synth pads, it glues two sections together by swelling into the downbeat.',
    exampleLabel: 'Moving from a quiet moment into a big song',
    exampleSay: '"Swell into it... 1... 2..."',
    timing: ['1', '2', 'Swell', 'Now']
  },
  {
    id: 'vamp',
    category: 'transitions',
    title: 'Vamp',
    shortDesc: 'Loop the current chord progression.',
    description: 'Keep playing the same chords continuously until given the next cue. Often used when the worship leader is speaking.',
    exampleLabel: 'Leader starts praying spontaneously',
    exampleSay: '"Just vamp here... vamp it..."',
    timing: ['1', '2', 'Keep', 'Vamping']
  },
  {
    id: 'break',
    category: 'transitions',
    title: 'Break',
    shortDesc: 'A sudden, complete stop in the music.',
    description: 'Everyone mutes their instruments instantly. Creates a massive dynamic contrast.',
    exampleLabel: 'Right before the final a cappella chorus',
    exampleSay: '"Break on 1... Chorus."',
    timing: ['1', '2', 'Break', 'Now!']
  }
];

// --- COMPONENTS ---

const CueCard = ({ cue, isExpanded, onToggle }) => {
  return (
    <div 
      className={`border border-slate-700 rounded-xl overflow-hidden transition-all duration-300 ${
        isExpanded ? 'bg-slate-800 ring-2 ring-emerald-500/50 shadow-lg' : 'bg-slate-800/50 hover:bg-slate-800'
      }`}
    >
      <button 
        onClick={onToggle}
        className="w-full text-left p-4 md:p-5 flex items-center justify-between focus:outline-none touch-manipulation"
      >
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
              {cue.category}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">{cue.title}</h3>
          <p className="text-slate-400 text-xs md:text-sm mt-1 line-clamp-1">{cue.shortDesc}</p>
        </div>
        <div className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>

      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 md:p-5 pt-0 border-t border-slate-700/50">
          <p className="text-slate-300 text-sm md:text-base mb-4 leading-relaxed">
            {cue.description}
          </p>
          
          <div className="bg-slate-900/80 rounded-lg p-3 md:p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Mic size={14} />
              <span className="font-semibold text-xs md:text-sm uppercase tracking-wide">Example Cue</span>
            </div>
            <p className="text-slate-400 text-[10px] md:text-xs mb-1 uppercase tracking-wide">{cue.exampleLabel}</p>
            <p className="text-lg md:text-xl font-mono text-white italic break-words">{cue.exampleSay}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TalkbackSimulator = React.forwardRef(({ selectedCue }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [bpm, setBpm] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtx = useRef(null);

  const playClick = useCallback((beatNumber) => {
    if (isMuted || !audioCtx.current) return;
    
    const osc = audioCtx.current.createOscillator();
    const envelope = audioCtx.current.createGain();

    osc.frequency.value = beatNumber === 0 ? 1000 : 800;
    osc.type = 'sine';

    envelope.gain.value = 0.15;
    envelope.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + 0.1);

    osc.connect(envelope);
    envelope.connect(audioCtx.current.destination);

    osc.start(audioCtx.current.currentTime);
    osc.stop(audioCtx.current.currentTime + 0.1);
  }, [isMuted]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const msPerBeat = 60000 / bpm;
      setCurrentBeat(0);
      playClick(0);

      interval = setInterval(() => {
        setCurrentBeat((prev) => {
          const next = (prev + 1) % 4;
          playClick(next);
          return next;
        });
      }, msPerBeat);
    } else {
      setCurrentBeat(-1);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm, playClick]);

  const beatLabels = selectedCue ? selectedCue.timing : ['1', '2', '3', '4'];
  const activeBeatColors = [
    'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105', 
    'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105', 
    'bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.7)] scale-110', 
    'bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.7)] scale-110'
  ];

  return (
    <div ref={ref} className="bg-slate-900 rounded-2xl p-4 md:p-6 border border-slate-700 shadow-2xl mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="text-emerald-400" size={20} /> 
            Timing Simulator
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Say your cues on the <span className="text-emerald-400 font-bold underline underline-offset-4 decoration-2">green beats</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-xl w-full md:w-auto">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-lg transition-colors ${isMuted ? 'text-red-400 bg-red-400/10' : 'text-slate-400 bg-slate-700'}`}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume1 size={18} />}
          </button>
          <div className="flex-1 md:flex-none flex items-center gap-2 px-2">
            <span className="text-xs font-bold text-slate-300 w-14">{bpm} BPM</span>
            <input 
              type="range" 
              min="50" 
              max="160" 
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              className="flex-1 w-24 accent-emerald-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6">
        {[0, 1, 2, 3].map((index) => {
          const isActive = currentBeat === index;
          const isCueBeat = index > 1;
          
          return (
            <div 
              key={index}
              className={`
                relative flex flex-col items-center justify-center h-20 md:h-32 rounded-xl transition-all duration-75
                ${isActive ? activeBeatColors[index] : (isCueBeat ? 'bg-emerald-900/30 border border-emerald-500/20' : 'bg-slate-800 border border-slate-700')}
                ${isActive ? 'text-white' : (isCueBeat ? 'text-emerald-400/60' : 'text-slate-500')}
              `}
            >
              <span className={`text-[10px] md:text-xs mb-1 font-bold ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {index === 0 ? 'ACCENT' : `BEAT ${index + 1}`}
              </span>
              <span className={`text-sm md:text-xl font-bold text-center px-1 break-words leading-tight transition-transform ${isActive ? 'scale-110' : ''}`}>
                {beatLabels[index]}
              </span>
              {isCueBeat && !isActive && (
                <div className="absolute -top-1 right-1">
                  <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-1 rounded border border-emerald-400/20 uppercase tracking-tighter">Talk</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all active:scale-95 touch-manipulation ${
            isPlaying 
              ? 'bg-red-500/10 text-red-500 border-2 border-red-500/50' 
              : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Square fill="currentColor" size={20} /> STOP
            </>
          ) : (
            <>
              <Play fill="currentColor" size={20} /> START SIMULATOR
            </>
          )}
        </button>
      </div>
    </div>
  );
});

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedCueId, setExpandedCueId] = useState(null);
  const [selectedCueForSim, setSelectedCueForSim] = useState(cuesData[0]);
  const simulatorRef = useRef(null);

  const filteredCues = activeTab === 'all' 
    ? cuesData 
    : cuesData.filter(cue => cue.category === activeTab);

  const handleToggleCue = (cue) => {
    if (expandedCueId === cue.id) {
      setExpandedCueId(null);
    } else {
      setExpandedCueId(cue.id);
      setSelectedCueForSim(cue);
      // Removed forced window.scrollTo(0,0). 
      // This allows the user to stay where they clicked while the cue loads in the background simulator.
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 pb-20">
      
      {/* HEADER */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 pt-10 pb-6 px-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-bold mb-3">
            <Activity size={14} /> LIVE WORSHIP MD TOOL
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">
            Talkback <span className="text-emerald-400">Mastery</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
            Direct your band with precision. Learn the timing and vocabulary of a professional Music Director.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        
        {/* SIMULATOR */}
        <TalkbackSimulator ref={simulatorRef} selectedCue={selectedCueForSim} />

        {/* CONTROLS */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
              Library
            </h2>
            <span className="text-xs text-slate-500 font-mono">{filteredCues.length} Cues</span>
          </div>
          
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto hide-scrollbar no-scrollbar scrollbar-hide">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap touch-manipulation flex-1 justify-center ${
                    isActive 
                      ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CUE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCues.map((cue) => (
            <CueCard 
              key={cue.id} 
              cue={cue} 
              isExpanded={expandedCueId === cue.id}
              onToggle={() => handleToggleCue(cue)}
            />
          ))}
        </div>

        {/* FOOTER HINT */}
        <div className="mt-12 text-center text-slate-600 px-6">
          <p className="text-xs italic leading-relaxed">
            "The band will go wherever you lead them, as long as they hear you early enough."
          </p>
        </div>
      </main>
      
      {/* MOBILE NAV STYLE OVERRIDES */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #0f172a;
        }
      `}} />
    </div>
  );
}