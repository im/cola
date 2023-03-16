"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configReload = exports.autoRefresh = void 0;
const vscode_1 = require("vscode");
const configAll = [];
class Config {
    constructor(key) {
        this.key = '';
        configAll.push(this);
        this.key = key;
        this.changeEvent = new vscode_1.EventEmitter();
    }
    get value() {
        return vscode_1.workspace.getConfiguration().get(this.key);
    }
    set value(newVal) {
        this.trigger();
        vscode_1.workspace.getConfiguration().update(this.key, newVal, true);
    }
    change(func) {
        this.changeEvent.event(func);
    }
    trigger() {
        this.changeEvent.fire(null);
    }
}
exports.autoRefresh = new Config('cola.autoRefresh');
exports.configReload = vscode_1.workspace.onDidChangeConfiguration(() => {
    configAll.forEach((item) => item.trigger());
});
//# sourceMappingURL=Config.js.map