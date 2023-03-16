const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
import inputStatusBar from './statusBar/input'
import fillStatusBar from './statusBar/fill'
import showStatusBar from './statusBar/show'
import { addWordTask, localDict } from './utils/dictionary'
let _readPanel:any = null;

function getWebViewContent (context:any , templatePath:any) {
    const config = vscode.workspace.getConfiguration()
    const cdn = config.cola.cdn
    const resourcePath = path.join(context.extensionPath, templatePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m:any, $1:any, $2:any) => {
        if (cdn[$2]) {
            return $1 + cdn[$2] + '"'
        }
        return $1 + $2 + '"'
    });
    return html;
}
const MAX_LENGTH = 15
const inputText = (text:any) => {
    return '     ' + text + ' | '
}

const fillText = (text:any) => {
    let s = text
    s = s + ' | '
    const len = MAX_LENGTH - s.length
    let fill = ''
    let i = 0
    while (i <= len) {
        fill = fill + 'a'
        i++
    }
    return fill
}

const showText = (word:any, app:any) => {
    const data = localDict[word] || {}
    return [
        app.isMemory ? '' : `<${word}>`,
        data.phonetic ? `/${data.phonetic}/` : '',
        data.translation ? `[ ${(data.translation || '').replace(/\n/g, '、')} ]` : '',
    ].join('　')
}

export default (context:any, app:any) => {
    if (!_readPanel) {

        const panel = _readPanel = vscode.window.createWebviewPanel(
            'ReadPanel',
            'Cola',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = getWebViewContent(context, 'view/index.html')

        // 读完关闭
        panel.webview.onDidReceiveMessage((_data:any) => {
            const { data, handleType, removeWord, text, isError } = _data;

            if (handleType === 'review') {
                return app.addReview(data.word, app)
            }
            if (handleType === 'removeReview') {
                return app.removeReview(removeWord, app)
            }
            if (handleType === 'addMastered') {
                return app.learn(data.word, app)
            }
            if (handleType === 'memory') {
                app.isMemory = !app.isMemory
            }
            inputStatusBar.update(inputText(text), isError)
            fillStatusBar.update(fillText(text))
            showStatusBar.update(showText(data.word, app))
        });

        // 关闭事件
        panel.onDidDispose(() => {
            _readPanel = null;
        });
    }
    return _readPanel.webview;
};
