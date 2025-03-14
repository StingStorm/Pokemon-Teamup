import { useEffect, useRef, useState } from 'react';
import type { Pokemon } from '../../types';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/16/solid';

type MultiSelectProps = {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Pokemon[];
  placeholder?: string;
  triggerValidation?: () => void;
  maxSelections?: number;
  hasError: boolean;
};

const MultiSelect = ({
  id,
  value,
  onChange,
  options,
  placeholder,
  maxSelections,
  hasError,
}: MultiSelectProps) => {
  const [filter, setFilter] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(
    ({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase()) &&
      !value.includes(name.toLowerCase())
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleOption = (option: string) => {
    setFilter('');

    if (maxSelections && value.length >= maxSelections) {
      setIsOpen(false);
      return;
    }

    onChange([...value, option.toLowerCase()]);
  };

  const handleRemoveBadge = (
    e: React.MouseEvent<HTMLButtonElement>,
    name: string
  ) => {
    e.stopPropagation();
    onChange(value.filter(item => item !== name));
  };
  return (
    <div
      ref={dropdownRef}
      className={`flex flex-wrap items-start gap-1 relative min-h-8 px-3 py-1 border rounded-[0.25rem] ${
        hasError && !isOpen
          ? 'border-red-500 shadow-[0_0_0_1px_rgb(239,68,68)]'
          : 'border-gray-400  has-[:hover]:border-purple-800 has-[:hover]:shadow-[0_0_0_1px_rgb(107,33,168)] has-[:focus]:border-purple-800 has-[:focus]:shadow-[0_0_0_1px_rgb(107,33,168)]'
      }`}
      onClick={() => setIsOpen(true)}
    >
      {value.length > 0 &&
        value.map(item => (
          <div
            key={item}
            className="flex justify-center items-center bg-gray-200 px-2.5 py-0.5 rounded-xl"
          >
            {item}
            <button type="button" onClick={e => handleRemoveBadge(e, item)}>
              <XMarkIcon className="size-3 -mb-[0.125rem]" />
            </button>
          </div>
        ))}
      <input
        className={`flex-grow focus-visible:outline-none w-[130px] whitespace-pre-wrap px-1 ${
          !isOpen && hasError && 'text-red-500 placeholder:text-red-500'
        }`}
        id={id}
        type="text"
        name="select-filter"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />

      <ChevronDownIcon
        className={`size-4 absolute right-0 top-1/2 -translate-y-1/2 transition-transform ease-linear duration-200 ${
          isOpen && '-rotate-180'
        }`}
      />

      {isOpen && (
        <ul className="flex flex-col absolute top-[calc(100%+6px)] left-0 w-full max-h-[200px] min-h-14 border-2 rounded-[0.25rem] border-purple-800 overflow-y-auto bg-white scrollbar-custom">
          {filteredOptions.length === 0 ? (
            <li className="px-2 h-7 cursor-pointer hover:bg-purple-500 hover:text-white focus:bg-purple-500 focus:text-white focus:outline-none">
              No Options here...
            </li>
          ) : (
            filteredOptions.map(({ name }) => {
              return (
                <li
                  key={name}
                  className="px-2 h-7 cursor-pointer border-b last:border-b-0 hover:bg-purple-500 hover:text-white focus:bg-purple-500 focus:text-white focus:outline-none"
                  tabIndex={0}
                  onClick={() => toggleOption(name)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      toggleOption(name);
                    }
                  }}
                  role="option"
                >
                  {name}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
