const FORMAT_REGISTRY = {
    agy: {
        label: 'AGY',
        description: 'Default AGY-style reference'
    },
    'claude-code': {
        label: 'Claude Code',
        description: 'Claude Code-style reference'
    },
    codex: {
        label: 'Codex',
        description: 'Codex-style reference'
    },
    markdown: {
        label: 'Markdown',
        description: 'Markdown link with line anchor'
    },
    plain: {
        label: 'Plain',
        description: 'path:line format'
    }
};

function normalizeFormat(format) {
    const value = String(format || '').toLowerCase();
    return FORMAT_REGISTRY[value] ? value : 'agy';
}

function getMarkdownAnchor(lineInfo) {
    if (lineInfo.includes('-')) {
        const [startLine, endLine] = lineInfo.split('-');
        return `#L${startLine}-L${endLine}`;
    }

    return `#L${lineInfo}`;
}

function buildReferenceText(relativePath, selection, format, readSelectionText, readLineText) {
    const selectedFormat = normalizeFormat(format);
    let lineInfo = '';
    let selectedText = readSelectionText(selection);

    if (!selection.isEmpty) {
        const startLine = selection.start.line + 1;
        const endLine = selection.end.line + 1;
        lineInfo = startLine === endLine ? `${startLine}` : `${startLine}-${endLine}`;
    } else {
        const currentLine = selection.active.line + 1;
        lineInfo = `${currentLine}`;
        selectedText = readLineText(selection.active.line);
    }

    switch (selectedFormat) {
        case 'agy':
        case 'codex':
        case 'claude-code':
            return `@${relativePath}\n\nline ${lineInfo}:\n${selectedText}\n`;
        case 'markdown':
            return `[${relativePath}](./${relativePath}${getMarkdownAnchor(lineInfo)})\n\n${selectedText}\n`;
        case 'plain':
            return `${relativePath}:${lineInfo}\n\n${selectedText}\n`;
        default:
            return `@${relativePath}\n\nline ${lineInfo}:\n${selectedText}\n`;
    }

}

module.exports = {
    FORMAT_REGISTRY,
    normalizeFormat,
    getMarkdownAnchor,
    buildReferenceText
};
