import React, { useRef, useState } from 'react';

const RichTextEditor = ({ value, onChange, error }) => {
    const textareaRef = useRef(null);
    const [showCannedResponses, setShowCannedResponses] = useState(false);

    const cannedResponses = [
        { title: 'Request More Info', content: 'Thank you for reaching out. To better assist you, could you please provide:\n\n• More details about the issue\n• Screenshots if applicable\n• Steps to reproduce the problem\n\nWe\'ll get back to you as soon as possible.' },
        { title: 'Acknowledge Receipt', content: 'Thank you for contacting us. We have received your request and our team is reviewing it. We will get back to you within 24 hours.\n\nTicket Reference: #[TICKET_NUMBER]' },
        { title: 'Issue Resolved', content: 'We\'re pleased to inform you that the issue has been resolved. Please verify and let us know if you need any further assistance.\n\nIf the issue persists, feel free to reopen this ticket.' },
        { title: 'Follow Up', content: 'We wanted to follow up on your previous inquiry. Have you had a chance to review our last response?\n\nPlease let us know if you need any additional clarification or assistance.' },
    ];

    const insertFormatting = (before, after = before) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        let newText;
        let newCursorPos;

        if (selectedText) {
            newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
            newCursorPos = start + before.length + selectedText.length + after.length;
        } else {
            newText = value.substring(0, start) + before + after + value.substring(end);
            newCursorPos = start + before.length;
        }

        onChange({ target: { value: newText } });

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (!url) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const linkText = selectedText || 'link text';

        const newText = value.substring(0, start) + `[${linkText}](${url})` + value.substring(end);
        onChange({ target: { value: newText } });

        setTimeout(() => textarea.focus(), 0);
    };

    const insertImage = () => {
        const url = prompt('Enter image URL:');
        if (!url) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const altText = prompt('Enter image description (optional):') || 'image';

        const newText = value.substring(0, start) + `![${altText}](${url})` + value.substring(start);
        onChange({ target: { value: newText } });

        setTimeout(() => textarea.focus(), 0);
    };

    const insertList = () => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        let listText;
        if (selectedText) {
            const lines = selectedText.split('\n').filter(line => line.trim());
            listText = lines.map(line => `• ${line.trim()}`).join('\n');
        } else {
            listText = '• ';
        }

        const newText = value.substring(0, start) + listText + value.substring(end);
        onChange({ target: { value: newText } });

        setTimeout(() => textarea.focus(), 0);
    };

    const insertHeading = () => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const selectedText = value.substring(start, textarea.selectionEnd);
        const headingText = selectedText || 'Heading';

        const newText = value.substring(0, start) + `### ${headingText}` + value.substring(textarea.selectionEnd);
        onChange({ target: { value: newText } });

        setTimeout(() => textarea.focus(), 0);
    };

    const insertCode = () => {
        insertFormatting('`');
    };

    const insertCannedResponse = (content) => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const newText = value.substring(0, start) + (value ? '\n\n' : '') + content + value.substring(start);
        onChange({ target: { value: newText } });
        setShowCannedResponses(false);
        setTimeout(() => textarea.focus(), 0);
    };

    const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
    const charCount = value.length;

    return (
        <div className={`flex flex-col border rounded-xl overflow-hidden bg-white transition-all duration-200 shadow-sm
        ${error
                ? 'border-red-300 ring-4 ring-red-500/10'
                : 'border-gray-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10'
            }`}
        >
            {/* Toolbar */}
            <div className="bg-gradient-to-b from-gray-50 to-gray-50/30 border-b border-gray-200 px-3 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <ToolbarBtn
                        tooltip="Bold (Ctrl+B)"
                        onClick={() => insertFormatting('**')}
                        icon={<BoldIcon />}
                    />
                    <ToolbarBtn
                        tooltip="Italic (Ctrl+I)"
                        onClick={() => insertFormatting('*')}
                        icon={<ItalicIcon />}
                    />
                    <ToolbarBtn
                        tooltip="Underline"
                        onClick={() => insertFormatting('__')}
                        icon={<UnderlineIcon />}
                    />
                    <div className="w-px h-5 bg-gray-300 mx-1.5"></div>
                    <ToolbarBtn
                        tooltip="Heading"
                        onClick={insertHeading}
                        icon={<HeadingIcon />}
                    />
                    <ToolbarBtn
                        tooltip="Code"
                        onClick={insertCode}
                        icon={<CodeIcon />}
                    />
                    <div className="w-px h-5 bg-gray-300 mx-1.5"></div>
                    <ToolbarBtn
                        tooltip="Insert Link"
                        onClick={insertLink}
                        icon={<LinkIcon />}
                    />
                    <ToolbarBtn
                        tooltip="Insert Image"
                        onClick={insertImage}
                        icon={<ImageIcon />}
                    />
                    <div className="w-px h-5 bg-gray-300 mx-1.5"></div>
                    <ToolbarBtn
                        tooltip="Bulleted List"
                        onClick={insertList}
                        icon={<ListIcon />}
                    />

                    {/* Canned Responses Dropdown */}
                    <div className="relative ml-2">
                        <button
                            type="button"
                            onClick={() => setShowCannedResponses(!showCannedResponses)}
                            className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1.5"
                            title="Quick Responses"
                        >
                            <TemplateIcon />
                            Templates
                        </button>

                        {showCannedResponses && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowCannedResponses(false)}></div>
                                <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                                    {cannedResponses.map((response, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => insertCannedResponse(response.content)}
                                            className="w-full px-4 py-2.5 text-left hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="font-medium text-sm text-gray-900">{response.title}</div>
                                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{response.content}</div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Character Count */}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{wordCount} words</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span>{charCount} characters</span>
                </div>
            </div>

            {/* Text Area */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-4 min-h-[320px] outline-none text-gray-800 text-[15px] leading-relaxed resize-y placeholder-gray-400"
                placeholder="Describe the issue in detail... Use markdown formatting for better readability."
            />
        </div>
    );
};

// Icon Components
const BoldIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
    </svg>
);

const ItalicIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m2 14l-2-2m-6-6l2-2" />
    </svg>
);

const UnderlineIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 21h14M7 3v9a5 5 0 0010 0V3" />
    </svg>
);

const HeadingIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h7m0 0v12m0-12l5 5m-5-5L6 11m5 7h7m0 0V6m0 12l-5-5m5 5l-5-5" />
    </svg>
);

const CodeIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const LinkIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const ImageIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ListIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const TemplateIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ToolbarBtn = ({ tooltip, onClick, icon }) => (
    <button
        type="button"
        onClick={onClick}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 hover:text-indigo-600 transition-all duration-150 active:scale-95"
        title={tooltip}
    >
        {icon}
    </button>
);

export default RichTextEditor;
