import * as vscode from 'vscode';
import WordsApp from './Words'
import * as Command from './Command'

export function activate (context: vscode.ExtensionContext) {
    const { window, commands } = vscode;
    const { registerTreeDataProvider } = window;
    const { registerCommand } = commands;

    const app = new WordsApp(context);

    registerTreeDataProvider('cola-learn-main', app.learnWords)
    registerTreeDataProvider('cola-learn', app.learnWords)
    registerTreeDataProvider('cola-mastered', app.masteredWords)
    registerTreeDataProvider('cola-review', app.reviewWords)
    registerCommand(Command.REFRESH, () => { app.refresh() });
    registerCommand(Command.REVIEW, function (word) {
        app.removeReview(word, app)
    });
    registerCommand(Command.LEARN, (word) => { app.learn(word,app) });
    registerCommand(Command.MASTERED, (word) => { app.mastered(word,app) });
    registerCommand(Command.READ, (data) => { app.read(data,app) });
    registerCommand(Command.MEMORY, (data) => { app.memory(data,app) });
}

export function deactivate () {
    //
}
