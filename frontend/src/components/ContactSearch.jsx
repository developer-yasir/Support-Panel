
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const ContactSearch = ({ value, onChange, error }) => {
    const [query, setQuery] = useState(value || '');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Sync internal state if external value changes (e.g. form reset)
        if (value !== query) {
            setQuery(value);
            // If value is cleared externally, clear selected contact
            if (!value) setSelectedContact(null);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchContacts = async () => {
            if (!query || query.length < 2 || selectedContact) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await api.get(`/contacts?search=${encodeURIComponent(query)}`);
                setResults(response.data);
                if (!isOpen) setIsOpen(true);
            } catch (err) {
                console.error("Search error", err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(searchContacts, 300);
        return () => clearTimeout(timeoutId);
    }, [query, selectedContact]);

    const handleSelect = (contact) => {
        setSelectedContact(contact);
        setQuery(contact.email);
        onChange(contact.email);
        setIsOpen(false);
    };

    const handleClear = () => {
        setSelectedContact(null);
        setQuery('');
        onChange('');
        setIsOpen(false);
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val);
        setSelectedContact(null); // Clear selected state if typing
        setIsOpen(true);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                {selectedContact ? (
                    // SELECTED STATE (Rich Chip)
                    <div className={`w-full pl-5 pr-4 h-11 bg-white border border-indigo-200 rounded-lg flex items-center justify-between group transition-all duration-200 shadow-sm ring-4 ring-indigo-500/5`}>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">
                                {selectedContact.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col truncate">
                                <span className="text-xs font-bold text-gray-900 leading-none truncate">{selectedContact.name}</span>
                                <span className="text-[10px] text-gray-500 leading-none mt-0.5 truncate">{selectedContact.email}</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ) : (
                    // SEARCH INPUT STATE
                    <>
                        <input
                            type="text"
                            className={`w-full px-4 h-11 bg-gray-50 border rounded-lg outline-none transition-all duration-200 hover:bg-white hover:border-gray-300
                            ${error
                                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/50'
                                    : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white'
                                } placeholder-gray-400 text-gray-900 font-medium`}
                            placeholder="Search name or email..."
                            value={query}
                            onChange={handleChange}
                            onFocus={() => setIsOpen(true)}
                        />
                        {loading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {isOpen && query.length >= 2 && !selectedContact && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden text-sm animate-in fade-in zoom-in-95 duration-100">
                    {results.length > 0 ? (
                        <ul className="max-h-60 overflow-y-auto py-1">
                            {results.map((contact) => (
                                <li
                                    key={contact._id}
                                    onClick={() => handleSelect(contact)}
                                    className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-none flex items-center gap-3 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{contact.name}</div>
                                        <div className="text-gray-500 text-xs">{contact.email}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-gray-500 bg-gray-50/50 border-t border-gray-100">
                            {!loading && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">No match found.</span>
                                    <span className="text-indigo-600 font-medium">New contact will be created.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactSearch;
