import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const themes = [
  { id: 'default', name: 'Normal', icon: '✨', color: '#4f46e5' },
  { id: 'automata', name: 'Operation', icon: '🤖', color: '#dad4bb' },
  { id: 'neon', name: 'Neon', icon: '🌌', color: '#00f2ff' },
  { id: 'cherry', name: 'Cherry', icon: '🌸', color: '#fb7185' },
  { id: 'astral', name: 'Astral', icon: '🌿', color: '#10b981' },
] as const;

export default function ThemeSwitcher() {
  const { theme: activeTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {/* Theme Options */}
      <div className={`flex flex-col gap-3 transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10'
        }`}>
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={(e) => {
              setTheme(t.id, e);
              setIsOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 ${activeTheme === t.id
                ? 'bg-primary text-surface ring-2 ring-primary ring-offset-2'
                : 'bg-surface text-text-main border border-border'
              }`}
          >
            <span className="text-xl">{t.icon}</span>
            <span className="font-semibold text-sm">{t.name}</span>
          </button>
        ))}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform ${isOpen ? 'rotate-180 bg-red-500 text-white' : 'bg-primary text-surface'
          } hover:scale-110 active:scale-90`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        )}
      </button>
    </div>
  );
}
