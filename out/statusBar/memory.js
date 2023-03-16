"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 状态栏
const vscode_1 = require("vscode");
const Command = require("../Command");
let defaultStatus = '记忆模式: 关';
const statusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right);
statusBar.text = defaultStatus;
statusBar.show();
statusBar.tooltip = 'Cola';
statusBar.command = Command.MEMORY;
const update = (flag) => {
    statusBar.text = flag ? '记忆模式: 开' : defaultStatus;
};
exports.default = {
    update
};
//# sourceMappingURL=memory.js.map