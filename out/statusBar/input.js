"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
let defaultStatus = '...';
const statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
statusBar.text = defaultStatus;
statusBar.show();
statusBar.color = '#fff';
let timerTask;
const update = (message, isError) => {
    statusBar.text = message;
    statusBar.color = isError ? '#fe5351' : '#fff';
    !isNaN(timerTask) && clearTimeout(timerTask);
    timerTask = setTimeout(() => {
        statusBar.text = defaultStatus;
    }, 50000);
};
exports.default = {
    update
};
