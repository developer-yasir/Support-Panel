
import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ label, value, options, onChange, placeholder = "Select...", renderOption, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        const eventName = label ? label.toLowerCase() : 'select';
        onChange(option.value); // Pass value directly instead of mock event
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            {label && <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 h-11 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-left ${isOpen ? 'ring-4 ring-indigo-500/10 border-indigo-500 bg-white' : ''}`}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {selectedOption ? (
                        renderOption ? (
                            renderOption(selectedOption, true)
                        ) : (
                            <span className="text-gray-900 text-sm font-medium truncate">{selectedOption.label}</span>
                        )
                    ) : (
                        <span className="text-gray-400 text-sm">{placeholder}</span>
                    )}
                </div>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-60 overflow-y-auto py-1">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className={`px-3 py-2 cursor-pointer transition-colors flex items-center gap-2 text-sm
                                ${value === option.value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                            `}
                            >
                                {renderOption ? renderOption(option, false) : option.label}
                                {value === option.value && (
                                    <svg className="w-4 h-4 ml-auto text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
