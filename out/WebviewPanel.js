"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const input_1 = require("./statusBar/input");
const fill_1 = require("./statusBar/fill");
const show_1 = require("./statusBar/show");
const dictionary_1 = require("./utils/dictionary");
let _readPanel = null;
function getWebViewContent(context, templatePath) {
    const config = vscode.workspace.getConfiguration();
    const cdn = config.cola.cdn;
    const resourcePath = path.join(context.extensionPath, templatePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        if (cdn[$2]) {
            return $1 + cdn[$2] + '"';
        }
        return $1 + $2 + '"';
    });
    return html;
}
const MAX_LENGTH = 15;
const inputText = (text) => {
    return '     ' + text + ' | ';
};
const fillText = (text) => {
    let s = text;
    s = s + ' | ';
    const len = MAX_LENGTH - s.length;
    let fill = '';
    let i = 0;
    while (i <= len) {
        fill = fill + 'a';
        i++;
    }
    return fill;
};
const showText = (word, app) => {
    const data = dictionary_1.localDict[word] || {};
    return [
        app.isMemory ? '' : `<${word}>`,
        data.phonetic ? `/${data.phonetic}/` : '',
        data.translation ? `[ ${(data.translation || '').replace(/\n/g, '、')} ]` : '',
    ].join('　');
};
exports.default = (context, app) => {
    if (!_readPanel) {
        const panel = _readPanel = vscode.window.createWebviewPanel('ReadPanel', 'Cola', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = getWebViewContent(context, 'view/index.html');
        // 读完关闭
        panel.webview.onDidReceiveMessage((_data) => {
            const { data, handleType, removeWord, text, isError } = _data;
            if (handleType === 'review') {
                return app.addReview(data.word, app);
            }
            if (handleType === 'removeReview') {
                return app.removeReview(removeWord, app);
            }
            input_1.default.update(inputText(text), isError);
            fill_1.default.update(fillText(text));
            show_1.default.update(showText(data.word, app));
        });
        // 关闭事件
        panel.onDidDispose(() => {
            _readPanel = null;
        });
    }
    return _readPanel.webview;
};
