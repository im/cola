"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
let defaultStatus = '...';
const statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
statusBar.text = defaultStatus;
statusBar.show();
let timerTask;
const update = (message) => {
    statusBar.text = message;
    !isNaN(timerTask) && clearTimeout(timerTask);
    timerTask = setTimeout(() => {
        statusBar.text = defaultStatus;
    }, 50000);
};
exports.default = {
    update
};
