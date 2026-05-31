import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { AvatarChip } from './AvatarChip';
import { Check } from 'lucide-react';

export interface SelectOption {
  id: string;
  label: string;
  sublabel?: string;
  avatarUrl?: string | null;
}

interface MultiSelectDropdownProps {
  options: SelectOption[];
  selected: string[]
  onChange: (ids: string[]) => void;
  placeholder?: string;
  label?: string;
  maxSelections?: number;
  disabled?: boolean;
}

export function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = 'Search...',
  label,
  maxSelections,
  disabled = false,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          e.target as Node
        )
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () =>
      document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.sublabel?.toLowerCase().includes(q)
    );
  }, [options, search]);

  const selectedOptions = useMemo(
    () =>
      options.filter((opt) =>
        selected.includes(opt.id)
      ),
    [options, selected]
  );

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (
      !maxSelections ||
      selected.length < maxSelections
    ) {
      onChange([...selected, id]);
    }
  };

  const removeOption = (id: string) => {
    onChange(selected.filter((s) => s !== id));
  };

  const atLimit = maxSelections
    ? selected.length >= maxSelections
    : false;

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger / Selected chips area */}
      <div
        className={`min-h-10.5 px-3 py-2 border rounded-lg flex flex-wrap items-center gap-1.5 cursor-text transition-colors
          ${isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-gray-300 hover:border-gray-400'}
          ${disabled
            ? 'bg-gray-50 cursor-not-allowed'
            : 'bg-white'}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        {selectedOptions.map((opt) => (
          <AvatarChip
            key={opt.id}
            name={opt.label}
            avatarUrl={opt.avatarUrl}
            size="sm"
            onRemove={
              disabled
                ? undefined
                : () => removeOption(opt.id)
            }
          />
        ))}
        {!disabled && (
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={
              selected.length === 0
                ? placeholder
                : ''
            }
            className="flex-1 min-w-20 outline-none text-sm bg-transparent"
          />
        )}
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found
            </div>
          ) : (
            filtered.map((opt) => {
              const isSelected = selected.includes(opt.id);
              const isDisabledOpt = atLimit && !isSelected;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isDisabledOpt}
                  onClick={() => toggleOption(opt.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                    ${isSelected
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'}
                    ${isDisabledOpt
                      ? 'opacity-40 cursor-not-allowed'
                      : 'cursor-pointer'}`}
                >
                  <AvatarChip
                    name={opt.label}
                    avatarUrl={opt.avatarUrl}
                    size="sm"
                    showName={false}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {opt.label}
                    </div>
                    {opt.sublabel && (
                      <div className="text-xs text-gray-500 truncate">
                        {opt.sublabel}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-blue-600 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
