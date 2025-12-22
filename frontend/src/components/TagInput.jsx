
import React, { useState } from 'react';

const TagInput = ({ tags = [], onTagsChange, placeholder = "Type and press Enter to add..." }) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = inputValue.trim();

            if (newTag) {
                if (!tags.includes(newTag)) {
                    onTagsChange([...tags, newTag]);
                }
                setInputValue('');
            }
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove last tag if backspace pressed with empty input
            onTagsChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div
            className={`w-full bg-gray-50 border rounded-lg transition-all duration-200 flex items-center flex-wrap gap-2 px-3
                ${isFocused
                    ? 'border-indigo-500 ring-4 ring-indigo-500/10 bg-white'
                    : 'border-gray-200 hover:bg-white hover:border-gray-300'
                }
            `}
            style={{ minHeight: '44px' }} // Match h-11
        >
            {tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-indigo-400 hover:text-indigo-900 focus:outline-none"
                    >
                        ×
                    </button>
                </span>
            ))}

            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={tags.length === 0 ? placeholder : ""}
                className="bg-transparent border-none outline-none flex-1 py-2 text-sm text-gray-900 font-medium placeholder-gray-400 h-full min-w-[120px]"
            />
        </div>
    );
};

export default TagInput;
