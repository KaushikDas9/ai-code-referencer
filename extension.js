const vscode = require('vscode');
const { FORMAT_REGISTRY, normalizeFormat, buildReferenceText } = require('./formatter');

function getHostDefaultFormat() {
    const appName = (vscode.env.appName || '').toLowerCase();
    const config = vscode.workspace.getConfiguration('agyCodeReferencer');
    const hostDefaults = config.get('hostDefaults', {});

    const hostKeywords = [
        { keyword: 'cursor', format: hostDefaults.cursor },
        { keyword: 'vscode', format: hostDefaults.vscode },
        { keyword: 'codium', format: hostDefaults.codium },
        { keyword: 'windsurf', format: hostDefaults.windsurf },
        { keyword: 'code', format: hostDefaults.code }
    ];

    for (const host of hostKeywords) {
        if (host.format && appName.includes(host.keyword)) {
            return normalizeFormat(host.format);
        }
    }

    return 'agy';
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    async function copyWithFormat(format) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active text editor found.');
            return;
        }

        const relativePath = vscode.workspace.asRelativePath(editor.document.uri);
        const normalizedFormat = normalizeFormat(format);
        const formattedOutput = buildReferenceText(
            relativePath,
            editor.selection,
            normalizedFormat,
            (selection) => editor.document.getText(selection),
            (lineNumber) => editor.document.lineAt(lineNumber).text
        );
        await vscode.env.clipboard.writeText(formattedOutput);
        vscode.window.setStatusBarMessage(`$(check) ${normalizedFormat} reference copied to clipboard!`, 3000);
    }

    let disposableCopy = vscode.commands.registerCommand('agy.copyReference', async function () {
        const config = vscode.workspace.getConfiguration('agyCodeReferencer');
        const configuredFormat = config.get('defaultFormat', '');
        const format = configuredFormat || getHostDefaultFormat();
        await copyWithFormat(format);
    });

    let disposableChooseFormat = vscode.commands.registerCommand('agy.copyReferenceChooseFormat', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active text editor found.');
            return;
        }

        const choice = await vscode.window.showQuickPick(
            Object.entries(FORMAT_REGISTRY).map(([value, meta]) => ({
                label: meta.label,
                value,
                description: meta.description
            })),
            { placeHolder: 'Choose the copy format for this reference' }
        );

        if (!choice) {
            return;
        }

        await copyWithFormat(choice.value);
    });

    let disposableClaudeCode = vscode.commands.registerCommand('agy.copyReferenceClaudeCode', async function () {
        await copyWithFormat('claude-code');
    });

    let disposableCodex = vscode.commands.registerCommand('agy.copyReferenceCodex', async function () {
        await copyWithFormat('codex');
    });

    let disposableCoffee = vscode.commands.registerCommand('agy.supportKoFi', function () {
        vscode.env.openExternal(vscode.Uri.parse('https://ko-fi.com/koushikdas'));
    });


    context.subscriptions.push(
        disposableCopy,
        disposableChooseFormat,
        disposableClaudeCode,
        disposableCodex,
        disposableCoffee
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
    buildReferenceText,
    normalizeFormat,
    getHostDefaultFormat
};
