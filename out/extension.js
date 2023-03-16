"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const Words_1 = require("./Words");
const Command = require("./Command");
const config = vscode.workspace.getConfiguration();
const KEYS = {
    'dGFuZ3hpYW9taQ==': true,
    'MTAwMDM2': true
};
function activate(context) {
    // const secretKey = Buffer.from(config.cola.secretKey || '', 'utf-8').toString('base64')
    // if (!KEYS[secretKey]) {
    //     vscode.window.showInformationMessage('Please enter the secret key!');
    //     return false
    // }
    const { window, commands } = vscode;
    const { registerTreeDataProvider } = window;
    const { registerCommand } = commands;
    const app = new Words_1.default(context);
    registerTreeDataProvider('cola-learn-main', app.learnWords);
    registerTreeDataProvider('cola-learn', app.learnWords);
    registerTreeDataProvider('cola-mastered', app.masteredWords);
    registerTreeDataProvider('cola-review', app.reviewWords);
    registerCommand(Command.REFRESH, () => { app.refresh(); });
    registerCommand(Command.REVIEW, (word) => { app.removeReview(word, app); });
    registerCommand(Command.LEARN, (word) => { app.learn(word, app); });
    registerCommand(Command.MASTERED, (word) => { app.mastered(word, app); });
    registerCommand(Command.READ, (data) => { app.read(data, app); });
    registerCommand(Command.MEMORY, (data) => { app.memory(data, app); });
}
exports.activate = activate;
function deactivate() {
    //
}
exports.deactivate = deactivate;
