import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import * as d3 from 'd3-hierarchy';
import { Search, ZoomIn, ZoomOut, Maximize, Underline, StickyNote, X, Hand, Highlighter, PenTool, Link2 } from 'lucide-react';

const BOARD_WIDTH = 20000;
const BOARD_HEIGHT = 10000;

interface BibleBook {
  name: string;
  abbrev: string;
  chapters: string[][];
}

type Tool = 'pan' | 'underline' | 'note' | 'marker' | 'draw' | 'cross-reference';

const bookGenres: Record<string, string> = {
  "Genesis": "Law", "Exodus": "Law", "Leviticus": "Law", "Numbers": "Law", "Deuteronomy": "Law",
  "Joshua": "History", "Judges": "History", "Ruth": "History", "1 Samuel": "History", "2 Samuel": "History", "1 Kings": "History", "2 Kings": "History", "1 Chronicles": "History", "2 Chronicles": "History", "Ezra": "History", "Nehemiah": "History", "Esther": "History",
  "Job": "Poetry", "Psalms": "Poetry", "Proverbs": "Poetry", "Ecclesiastes": "Poetry", "Song of Solomon": "Poetry",
  "Isaiah": "Major Prophets", "Jeremiah": "Major Prophets", "Lamentations": "Major Prophets", "Ezekiel": "Major Prophets", "Daniel": "Major Prophets",
  "Hosea": "Minor Prophets", "Joel": "Minor Prophets", "Amos": "Minor Prophets", "Obadiah": "Minor Prophets", "Jonah": "Minor Prophets", "Micah": "Minor Prophets", "Nahum": "Minor Prophets", "Habakkuk": "Minor Prophets", "Zephaniah": "Minor Prophets", "Haggai": "Minor Prophets", "Zechariah": "Minor Prophets", "Malachi": "Minor Prophets",
  "Matthew": "Gospels", "Mark": "Gospels", "Luke": "Gospels", "John": "Gospels",
  "Acts": "NT History",
  "Romans": "Pauline Epistles", "1 Corinthians": "Pauline Epistles", "2 Corinthians": "Pauline Epistles", "Galatians": "Pauline Epistles", "Ephesians": "Pauline Epistles", "Philippians": "Pauline Epistles", "Colossians": "Pauline Epistles", "1 Thessalonians": "Pauline Epistles", "2 Thessalonians": "Pauline Epistles", "1 Timothy": "Pauline Epistles", "2 Timothy": "Pauline Epistles", "Titus": "Pauline Epistles", "Philemon": "Pauline Epistles",
  "Hebrews": "General Epistles", "James": "General Epistles", "1 Peter": "General Epistles", "2 Peter": "General Epistles", "1 John": "General Epistles", "2 John": "General Epistles", "3 John": "General Epistles", "Jude": "General Epistles",
  "Revelation": "Prophecy"
};

const palettes: Record<string, Record<string, string>> = {
  pastel: {
    "Law": "#fee2e2",
    "History": "#ffedd5",
    "Poetry": "#fef9c3",
    "Major Prophets": "#dcfce7",
    "Minor Prophets": "#d1fae5",
    "Gospels": "#dbeafe",
    "NT History": "#cffafe",
    "Pauline Epistles": "#e0e7ff",
    "General Epistles": "#ede9fe",
    "Prophecy": "#f3e8ff"
  },
  earth: {
    "Law": "#e6ccb2",
    "History": "#ddb892",
    "Poetry": "#b08968",
    "Major Prophets": "#a3b18a",
    "Minor Prophets": "#588157",
    "Gospels": "#cad2c5",
    "NT History": "#84a98c",
    "Pauline Epistles": "#52796f",
    "General Epistles": "#354f52",
    "Prophecy": "#2f3e46"
  },
  monochrome: {
    "Law": "#f5f5f4",
    "History": "#e7e5e4",
    "Poetry": "#d6d3d1",
    "Major Prophets": "#a8a29e",
    "Minor Prophets": "#78716c",
    "Gospels": "#f5f5f4",
    "NT History": "#e7e5e4",
    "Pauline Epistles": "#d6d3d1",
    "General Epistles": "#a8a29e",
    "Prophecy": "#78716c"
  }
};

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-24 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-1 sm:gap-2 bg-white/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-lg border border-stone-200">
      <button onClick={() => zoomIn()} className="p-2 sm:p-3 hover:bg-stone-100 rounded-xl transition-colors text-stone-700" title="Zoom In">
        <ZoomIn size={20} className="sm:w-6 sm:h-6" />
      </button>
      <button onClick={() => zoomOut()} className="p-2 sm:p-3 hover:bg-stone-100 rounded-xl transition-colors text-stone-700" title="Zoom Out">
        <ZoomOut size={20} className="sm:w-6 sm:h-6" />
      </button>
      <button onClick={() => resetTransform()} className="p-2 sm:p-3 hover:bg-stone-100 rounded-xl transition-colors text-stone-700" title="Reset View">
        <Maximize size={20} className="sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

const Toolbox = ({ activeTool, setActiveTool, palette, setPalette }: any) => {
  const tools = [
    { id: 'pan', icon: Hand, label: 'Pan', color: 'bg-stone-800 text-white' },
    { id: 'underline', icon: Underline, label: 'Underline', color: 'bg-emerald-600 text-white' },
    { id: 'marker', icon: Highlighter, label: 'Marker', color: 'bg-yellow-400 text-stone-900' },
    { id: 'draw', icon: PenTool, label: 'Draw', color: 'bg-red-500 text-white' },
    { id: 'note', icon: StickyNote, label: 'Note', color: 'bg-amber-500 text-white' },
    { id: 'cross-reference', icon: Link2, label: 'Cross Ref', color: 'bg-blue-500 text-white' },
  ];

  return (
    <>
      {/* Tools Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-xl border border-stone-200 overflow-x-auto max-w-[90vw] sm:max-w-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tools.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            className={`p-2 sm:p-3 rounded-xl transition-all flex items-center justify-center min-w-[44px] sm:min-w-[48px] ${activeTool === t.id ? t.color + ' shadow-md scale-105' : 'hover:bg-stone-100 text-stone-600'}`}
            title={t.label}
          >
            <t.icon size={20} className="sm:w-6 sm:h-6" />
          </button>
        ))}
      </div>

      {/* Palette Selector */}
      <div className="absolute top-6 right-4 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-lg border border-stone-200">
        {['pastel', 'earth', 'monochrome'].map(p => (
          <button
            key={p}
            onClick={() => setPalette(p)}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all border-2 ${palette === p ? 'border-stone-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
            style={{ 
              background: p === 'pastel' ? 'linear-gradient(135deg, #fee2e2 50%, #dbeafe 50%)' : 
                          p === 'earth' ? 'linear-gradient(135deg, #e6ccb2 50%, #84a98c 50%)' : 
                          'linear-gradient(135deg, #f5f5f4 50%, #a8a29e 50%)' 
            }}
            title={`${p.charAt(0).toUpperCase() + p.slice(1)} Palette`}
          />
        ))}
      </div>
    </>
  );
};

const Chapter = React.memo(({ chapter, book, scale, onVerseClick, highlights, activeTool }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '2000px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const width = chapter.x1 - chapter.x0;
  const height = chapter.y1 - chapter.y0;

  const verses = chapter.data.verses;
  const isPsalms = book.data.name === 'Psalms';
  const isPsalm119 = isPsalms && chapter.data.chapterNumber === 119;
  
  const paragraphs = useMemo(() => {
    const paras = [];
    let currentVerses = [...verses];
    let title = null;

    if (isPsalms && chapter.data.chapterNumber !== 119) {
      const firstVerse = currentVerses[0];
      const titleMatch = firstVerse.match(/^\[(.*?)\]\s*/);
      if (titleMatch) {
        title = titleMatch[1].replace(/[{}]/g, '');
        currentVerses[0] = firstVerse.substring(titleMatch[0].length);
      }
    }

    if (isPsalm119) {
      const hebrewLetters = ["ALEPH", "BETH", "GIMEL", "DALETH", "HE", "VAU", "ZAIN", "CHETH", "TETH", "JOD", "CAPH", "LAMED", "MEM", "NUN", "SAMECH", "AIN", "PE", "TZADDI", "KOPH", "RESH", "SCHIN", "TAU"];
      for (let i = 0; i < currentVerses.length; i += 8) {
        paras.push({
          title: hebrewLetters[i / 8] || '',
          verses: currentVerses.slice(i, i + 8),
          startIndex: i,
          isPsalmTitle: false
        });
      }
    } else {
      for (let i = 0; i < currentVerses.length; i += 5) {
        paras.push({
          title: i === 0 ? title : null,
          verses: currentVerses.slice(i, i + 5),
          startIndex: i,
          isPsalmTitle: i === 0 && title !== null
        });
      }
    }
    return paras;
  }, [verses, isPsalms, isPsalm119, chapter.data.chapterNumber]);

  const textLength = paragraphs.reduce((acc: number, p: any) => acc + p.verses.join(' ').length, 0);
  const padding = 16;
  const availableWidth = Math.max(10, width - padding * 2);
  const availableHeight = Math.max(10, height - padding * 2);
  const availableArea = availableWidth * availableHeight;
  
  // Calculate font size to fit the area without scrolling.
  // We account for the extra vertical space taken by paragraph margins and titles.
  const titlePenalty = paragraphs[0]?.isPsalmTitle ? 80 : 0;
  const effectiveTextLength = textLength + (paragraphs.length * 50) + titlePenalty;
  
  // Area per char is roughly fontSize^2 * 0.60
  const estimatedFontSize = Math.sqrt(availableArea / (effectiveTextLength * 0.60));
  const fontSize = Math.max(1, estimatedFontSize * 0.88); // 0.88 safety factor to tightly pack without overflow

  const showText = scale * fontSize > 3;
  const showNumber = !showText && scale * Math.min(width, height) > 20;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: chapter.x0 - book.x0, 
        top: chapter.y0 - book.y0, 
        width, 
        height,
      }}
      className="border border-stone-200/50 bg-white/90 p-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {isVisible && (
        <>
          {showText ? (
            <div 
              style={{ 
                fontSize: `${fontSize}px`, 
                lineHeight: '1.4',
                columnWidth: `${fontSize * 25}px`,
                columnGap: `${fontSize * 2}px`
              }} 
              className="text-stone-800 text-justify font-serif w-full h-full"
            >
              {paragraphs.map((p: any, pIdx: number) => (
                <div key={pIdx} style={{ marginBottom: `${fontSize * 0.8}px` }}>
                  {p.title && (
                    <div style={{ 
                      fontSize: p.isPsalmTitle ? `${fontSize * 0.9}px` : `${fontSize * 1.2}px`, 
                      fontWeight: p.isPsalmTitle ? 'normal' : 'bold', 
                      fontStyle: p.isPsalmTitle ? 'italic' : 'normal',
                      marginTop: pIdx > 0 ? `${fontSize}px` : 0, 
                      marginBottom: `${fontSize * 0.4}px`, 
                      textTransform: p.isPsalmTitle ? 'none' : 'uppercase', 
                      letterSpacing: p.isPsalmTitle ? 'normal' : '0.1em',
                      color: '#57534e',
                      textAlign: p.isPsalmTitle ? 'center' : 'left',
                      breakAfter: 'avoid'
                    }}>
                      {p.title}
                    </div>
                  )}
                  {pIdx === 0 && (
                    <span 
                      style={{ fontSize: `${fontSize * 3}px`, lineHeight: '0.8' }}
                      className="font-bold float-left mr-2 mt-1 text-stone-900 font-serif"
                    >
                      {chapter.data.chapterNumber}
                    </span>
                  )}
                  {p.verses.map((verse: string, vIdx: number) => {
                    const actualVerseNum = p.startIndex + vIdx + 1;
                    const verseId = `${book.data.name}-${chapter.data.chapterNumber}-${actualVerseNum}`;
                    const highlight = highlights[verseId];
                    return (
                      <span 
                        key={vIdx} 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeTool !== 'pan') {
                            onVerseClick(verseId, verse, e.clientX, e.clientY, activeTool);
                          }
                        }}
                        className={`transition-colors relative ${activeTool !== 'pan' ? 'cursor-pointer hover:bg-stone-200/50' : ''} ${highlight?.underlined ? 'underline decoration-emerald-500' : ''} ${highlight?.draw ? 'text-red-600 font-medium' : ''}`}
                        style={{ 
                          backgroundColor: highlight?.marker ? 'rgba(250, 204, 21, 0.4)' : highlight?.note ? 'rgba(253, 224, 71, 0.2)' : 'transparent',
                          textUnderlineOffset: `${fontSize * 0.2}px`,
                          textDecorationThickness: `${Math.max(1, fontSize * 0.1)}px`
                        }}
                      >
                        <sup style={{ fontSize: `${fontSize * 0.6}px` }} className="text-stone-400 mr-1 font-sans font-medium">{actualVerseNum}</sup>
                        {verse}
                        {highlight?.note && (
                          <span className="inline-flex items-center justify-center ml-1 text-amber-500" style={{ width: `${fontSize * 0.8}px`, height: `${fontSize * 0.8}px` }}>
                            <StickyNote size={fontSize * 0.6} />
                          </span>
                        )}
                        {' '}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : showNumber ? (
            <div className="w-full h-full flex items-center justify-center">
              <span 
                style={{ fontSize: `${Math.min(width, height) * 0.4}px` }}
                className="font-bold text-stone-300 font-serif"
              >
                {chapter.data.chapterNumber}
              </span>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
});

const Book = React.memo(({ book, scale, totalValue, onVerseClick, highlights, activeTool, palette }: any) => {
  const width = book.x1 - book.x0;
  const height = book.y1 - book.y0;

  const expectedArea = (book.value / totalValue) * (BOARD_WIDTH * BOARD_HEIGHT);
  const expectedSide = Math.sqrt(expectedArea);
  const titleHeight = Math.max(20, Math.min(100, expectedSide * 0.1));
  const titleFontSize = titleHeight * 0.5;

  const genre = bookGenres[book.data.name] || "Law";
  const bgColor = palettes[palette][genre] || "#f5f5f4";

  return (
    <div
      id={`book-${book.data.name}`}
      style={{
        position: 'absolute',
        left: book.x0, top: book.y0, width, height,
        backgroundColor: bgColor
      }}
      className="border-2 border-stone-300 rounded-2xl overflow-hidden transition-colors duration-500"
    >
      {/* Book Title */}
      <div
        className="absolute top-0 left-0 w-full flex items-center justify-center bg-white/40 backdrop-blur-sm z-10"
        style={{ height: titleHeight }}
      >
        <h2 
          className="font-bold font-serif text-stone-800 tracking-tight"
          style={{ fontSize: titleFontSize }}
        >
          {book.data.name}
        </h2>
      </div>

      {/* Chapters Container */}
      <div className="relative w-full h-full">
        {book.children.map((chapter: any) => (
          <Chapter 
            key={chapter.data.name} 
            chapter={chapter} 
            book={book} 
            scale={scale} 
            onVerseClick={onVerseClick}
            highlights={highlights}
            activeTool={activeTool}
          />
        ))}
      </div>
    </div>
  );
});

export default function BibleBoard() {
  const { isSidebarOpen } = useOutletContext<any>();
  const [bibleData, setBibleData] = useState<BibleBook[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(0.05);
  const [selectedBook, setSelectedBook] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  
  const [activeTool, setActiveTool] = useState<Tool>('pan');
  const [palette, setPalette] = useState<string>('pastel');

  const [highlights, setHighlights] = useState<Record<string, { underlined?: boolean, note?: string, marker?: boolean, draw?: boolean }>>(() => {
    const saved = localStorage.getItem('bible-highlights');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeVerse, setActiveVerse] = useState<{ id: string, text: string, x: number, y: number } | null>(null);
  const [noteText, setNoteText] = useState('');

  const rootNodeRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('bible-highlights', JSON.stringify(highlights));
  }, [highlights]);

  const handleVerseClick = (id: string, text: string, x: number, y: number, tool: Tool) => {
    if (tool === 'underline') {
      setHighlights(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          underlined: !prev[id]?.underlined
        }
      }));
    } else if (tool === 'marker') {
      setHighlights(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          marker: !prev[id]?.marker
        }
      }));
    } else if (tool === 'draw') {
      setHighlights(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          draw: !prev[id]?.draw
        }
      }));
    } else if (tool === 'note' || tool === 'cross-reference') {
      setActiveVerse({ id, text, x, y });
      setNoteText(highlights[id]?.note || '');
    }
  };

  const saveNote = () => {
    if (!activeVerse) return;
    setHighlights(prev => ({
      ...prev,
      [activeVerse.id]: {
        ...prev[activeVerse.id],
        note: noteText
      }
    }));
    setActiveVerse(null);
  };

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json')
      .then(res => res.json())
      .then(data => {
        setBibleData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load Bible JSON:", err);
        setLoading(false);
      });
  }, []);

  const rootNode = useMemo(() => {
    if (!bibleData) return null;

    const hierarchyData = {
      name: "Bible",
      children: bibleData.map(book => {
        const bookTextLength = book.chapters.reduce((sum, verses) => sum + verses.join(" ").length, 0);
        // Compress the range of book sizes so small books (Philemon, Jude) get worthy real estate
        const desiredBookValue = Math.pow(bookTextLength, 0.35); 
        
        return {
          name: book.name,
          children: book.chapters.map((verses, i) => {
            const chapterTextLength = verses.join(" ").length;
            // Distribute the desired book value proportionally to chapter length
            const chapterRatio = chapterTextLength / bookTextLength;
            
            return {
              name: `${book.name} ${i + 1}`,
              chapterNumber: i + 1,
              verses: verses,
              value: desiredBookValue * chapterRatio
            };
          })
        };
      })
    };

    const root = d3.hierarchy(hierarchyData).sum((d: any) => d.value);
    const totalValue = root.value;

    d3.treemap()
      .size([BOARD_WIDTH, BOARD_HEIGHT])
      .tile(d3.treemapSquarify.ratio(1))
      .paddingOuter(40)
      .paddingInner(16)
      .paddingTop((node: any) => {
        if (node.depth === 1) {
          const expectedArea = (node.value / totalValue) * (BOARD_WIDTH * BOARD_HEIGHT);
          const expectedSide = Math.sqrt(expectedArea);
          return Math.max(30, Math.min(120, expectedSide * 0.15));
        }
        return 0;
      })
      .round(true)(root);

    rootNodeRef.current = root;
    return root;
  }, [bibleData]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDFBF7]">
        <div className="w-16 h-16 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-serif text-stone-800 font-bold">Loading the Holy Bible...</h2>
        <p className="text-stone-500 mt-2">Preparing the infinite board</p>
      </div>
    );
  }

  if (!rootNode) return null;

  return (
    <div className="w-full h-full relative bg-stone-200 overflow-hidden">
      <TransformWrapper
        initialScale={0.05}
        minScale={0.01}
        maxScale={20}
        limitToBounds={false}
        centerOnInit={true}
        panning={{ disabled: activeTool !== 'pan' }}
        onTransformed={(ref) => {
          if (Math.abs(ref.state.scale - scale) > 0.05) {
            setScale(ref.state.scale);
          }
          
          const root = rootNodeRef.current;
          if (root && ref.state.scale > 0.2) {
            const centerX = (-ref.state.positionX + window.innerWidth / 2) / ref.state.scale;
            const centerY = (-ref.state.positionY + window.innerHeight / 2) / ref.state.scale;
            
            let foundBook = '';
            let foundChapter = '';
            
            for (const book of root.children) {
              if (centerX >= book.x0 && centerX <= book.x1 && centerY >= book.y0 && centerY <= book.y1) {
                foundBook = book.data.name;
                for (const chapter of book.children) {
                  if (centerX >= chapter.x0 && centerX <= chapter.x1 && centerY >= chapter.y0 && centerY <= chapter.y1) {
                    foundChapter = chapter.data.chapterNumber.toString();
                    break;
                  }
                }
                break;
              }
            }
            
            const newLocation = foundBook ? `${foundBook}${foundChapter ? ` ${foundChapter}` : ''}` : '';
            setCurrentLocation(prev => prev !== newLocation ? newLocation : prev);
          } else {
            setCurrentLocation(prev => prev !== '' ? '' : prev);
          }
        }}
      >
        {({ zoomToElement }) => (
          <>
            {/* Unified Navigation Badge */}
            <div 
              className={`absolute top-6 z-50 flex items-center bg-white/90 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-stone-200 transition-all hover:shadow-xl max-w-[60vw] sm:max-w-md ${isSidebarOpen ? 'left-4 sm:left-6' : 'left-16 sm:left-16'}`}
            >
              <Search size={18} className="text-stone-400 mr-2 sm:mr-3 shrink-0" />
              <div className="relative flex items-center w-full">
                <select
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  value={selectedBook}
                  onChange={(e) => {
                    const bookName = e.target.value;
                    setSelectedBook(bookName);
                    if (bookName) {
                      zoomToElement(`book-${bookName}`, 0.5, 800);
                    }
                  }}
                >
                  <option value="">Select a book...</option>
                  {bibleData?.map(book => (
                    <option key={book.name} value={book.name}>{book.name}</option>
                  ))}
                </select>
                <h1 className="font-serif font-bold text-lg sm:text-2xl text-stone-800 tracking-tight pointer-events-none flex items-center gap-1 sm:gap-2 truncate">
                  <span className="truncate">{currentLocation || 'Explore Bible'}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400 mt-1 shrink-0"><path d="m6 9 6 6 6-6"/></svg>
                </h1>
              </div>
            </div>

            <Controls />
            <Toolbox activeTool={activeTool} setActiveTool={setActiveTool} palette={palette} setPalette={setPalette} />

            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
              <div
                style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
                className="relative bg-stone-100 shadow-2xl"
              >
                {rootNode.children?.map((book: any) => (
                  <Book 
                    key={book.data.name} 
                    book={book} 
                    scale={scale} 
                    totalValue={rootNode.value} 
                    onVerseClick={handleVerseClick}
                    highlights={highlights}
                    activeTool={activeTool}
                    palette={palette}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Verse Action Popover */}
      {activeVerse && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={() => setActiveVerse(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md m-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif font-bold text-lg text-stone-800">
                {activeVerse.id.replace(/-/g, ' ')}
              </h3>
              <button onClick={() => setActiveVerse(null)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-stone-600 font-serif italic mb-6 border-l-4 border-stone-200 pl-4 max-h-32 overflow-y-auto">
              "{activeVerse.text}"
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <StickyNote size={16} />
                  Notes
                </label>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Add your thoughts here..."
                  className="w-full h-24 p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <Link2 size={16} />
                  Cross References
                </label>
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-sm text-stone-600">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-stone-800 shrink-0">John 3:16</span>
                      <span className="text-stone-500 line-clamp-1">For God so loved the world...</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-stone-800 shrink-0">Romans 5:8</span>
                      <span className="text-stone-500 line-clamp-1">But God commendeth his love toward us...</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-stone-800 shrink-0">1 John 4:9</span>
                      <span className="text-stone-500 line-clamp-1">In this was manifested the love of God...</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={saveNote}
                className="bg-stone-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-stone-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

