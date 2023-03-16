"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 状态栏
const vscode_1 = require("vscode");
const Config_1 = require("../Config");
const Command = require("../Command");
let defaultStatus;
const getStatus = () => {
    defaultStatus = Config_1.autoRefresh.value ? '自动分析单词' : '点击分析单词';
    return defaultStatus;
};
const statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right);
statusBar.text = getStatus();
statusBar.show();
statusBar.tooltip = '会了吧';
statusBar.command = Command.REFRESH;
Config_1.autoRefresh.change(() => {
    statusBar.text = getStatus();
});
let timerTask;
const update = (message) => {
    statusBar.text = message;
    !isNaN(timerTask) && clearTimeout(timerTask);
    timerTask = setTimeout(() => {
        statusBar.text = defaultStatus;
    }, 5000);
};
exports.default = {
    update
};
//# sourceMappingURL=basic.js.map