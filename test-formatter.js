const assert = require('assert');

const formatter = require('./formatter');

function makeDocument(filePath, lines) {
    return {
        uri: { fsPath: filePath },
        lineAt(index) {
            return { text: lines[index] };
        },
        getText(selection) {
            if (!selection || selection.isEmpty) {
                return '';
            }
            return lines.slice(selection.start.line, selection.end.line + 1).join('\n');
        }
    };
}

function makeSelection(startLine, endLine, empty = false) {
    return {
        isEmpty: empty,
        start: { line: startLine },
        end: { line: endLine },
        active: { line: startLine }
    };
}

function run() {
    const doc = makeDocument('/workspace/app/file.py', [
        'first line',
        'second line',
        'third line'
    ]);

    const singleLine = formatter.buildReferenceText(
        'app/file.py',
        makeSelection(1, 1),
        'agy',
        (selection) => doc.getText(selection),
        (lineNumber) => doc.lineAt(lineNumber).text
    );
    assert.ok(singleLine.includes('@'));
    assert.ok(singleLine.includes('line 2:'));
    assert.ok(singleLine.includes('second line'));

    const markdown = formatter.buildReferenceText(
        'app/file.py',
        makeSelection(0, 2),
        'markdown',
        (selection) => doc.getText(selection),
        (lineNumber) => doc.lineAt(lineNumber).text
    );
    assert.ok(markdown.includes('#L1-L3'));
    assert.ok(markdown.includes('first line'));

    assert.strictEqual(formatter.normalizeFormat('CLAUDE-CODE'), 'claude-code');
    assert.strictEqual(formatter.normalizeFormat('unknown'), 'agy');
    assert.strictEqual(formatter.getMarkdownAnchor('15-20'), '#L15-L20');
    assert.strictEqual(formatter.getMarkdownAnchor('15'), '#L15');

    console.log('Formatter smoke tests passed.');
}

run();
