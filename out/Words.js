"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const WordProvider_1 = require("./WordProvider");
const ReviewWordProvider_1 = require("./ReviewWordProvider");
const Config_1 = require("./Config");
const basic_1 = require("./statusBar/basic");
const memory_1 = require("./statusBar/memory");
const mastered_1 = require("./storage/mastered");
const review_1 = require("./storage/review");
const parse_1 = require("./utils/parse");
const WebviewPanel_1 = require("./WebviewPanel");
const moment = require('moment');
const dictionary_1 = require("./utils/dictionary");
const Command = require("./Command");
class WordsApp {
    constructor(context) {
        this.isMemory = false;
        this.learnWords = new WordProvider_1.default(context, Command.LEARN);
        this.masteredWords = new WordProvider_1.default(context, Command.MASTERED);
        this.reviewWords = new ReviewWordProvider_1.default(context);
        vscode_1.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        this.onActiveEditorChanged();
        context.subscriptions.push(Config_1.configReload);
        this.context = context;
    }
    onActiveEditorChanged() {
        Config_1.autoRefresh.value && this.refresh();
    }
    // 检查编辑器
    checkEditor() {
        if (!vscode_1.window.activeTextEditor) {
            basic_1.default.update('请切换到代码文件');
        }
        else if (vscode_1.window.activeTextEditor.document.uri.scheme !== 'file') {
            basic_1.default.update('只支持本地文件');
        }
        else {
            return true;
        }
    }
    dataInit() {
        this.learnWords.clear();
        this.masteredWords.clear();
    }
    analyse(text) {
        this.dataInit();
        (0, parse_1.default)(text).forEach((word) => {
            if (mastered_1.default.has(word)) {
                this.masteredWords.list.push(word);
            }
            else {
                const is = review_1.default.has(this.format(word));
                if (!is) {
                    this.learnWords.list.push(word);
                }
            }
        });
        this.learnWords.flush();
        this.masteredWords.flush();
    }
    format(word) {
        return word + '|' + moment().format('YYYY-MM-DD');
        // return word + '|' + '2023-03-15'
    }
    initReview() {
        const list = review_1.default.get();
        list.forEach(item => {
            this.reviewWords.push(item);
        });
    }
    addReview(word, app) {
        const source = {
            data: {
                word
            },
            trigger: Command.LEARN
        };
        const w = this.format(word);
        this.learnWords.remove(word);
        if (!review_1.default.has(w)) {
            this.reviewWords.push(w);
            review_1.default.add(w);
        }
        (0, WebviewPanel_1.default)(this.context, app).postMessage(this.getMessage(source, Command.ADD_REVIEW));
    }
    removeReview(word, app) {
        const w = word.split('|')[0];
        const source = {
            data: {
                word: w
            },
            trigger: Command.REVIEW
        };
        this.reviewWords.remove(word);
        review_1.default.remove(word);
        this.learnWords.push(w);
        (0, WebviewPanel_1.default)(this.context, app).postMessage(this.getMessage(source, Command.REMOVE_REVIEW));
    }
    learn(word, app) {
        const source = {
            data: {
                word
            },
            trigger: Command.LEARN
        };
        mastered_1.default.add(word);
        this.learnWords.remove(word);
        this.masteredWords.push(word);
        (0, WebviewPanel_1.default)(this.context, app).postMessage(this.getMessage(source, Command.LEARN));
    }
    mastered(word, app) {
        const source = {
            data: {
                word
            },
            trigger: Command.MASTERED
        };
        mastered_1.default.remove(word);
        this.learnWords.push(word);
        this.masteredWords.remove(word);
        (0, WebviewPanel_1.default)(this.context, app).postMessage(this.getMessage(source, Command.MASTERED));
    }
    getMessage(source, command) {
        const { data, trigger } = source;
        return {
            data: data,
            command,
            trigger: trigger,
            learnWords: this.learnWords.list,
            masteredWords: this.masteredWords.list,
            reviewWords: this.reviewWords.list,
            learnWordsTree: this.learnWords.tree,
            masteredWordsTree: this.masteredWords.tree,
            reviewWordsTree: this.reviewWords.tree,
            localDict: dictionary_1.localDict
        };
    }
    memory(source, app) {
        this.isMemory = !this.isMemory;
        memory_1.default.update(this.isMemory);
    }
    read(source, app) {
        source.data.word = source.word;
        (0, WebviewPanel_1.default)(this.context, app).postMessage(this.getMessage(source, Command.READ));
    }
    refresh() {
        this.initReview();
        if (this.checkEditor()) {
            basic_1.default.update('单词分析中...');
            if (vscode_1.window.activeTextEditor) {
                this.analyse(vscode_1.window.activeTextEditor.document.getText());
            }
        }
    }
}
exports.default = WordsApp;
//# sourceMappingURL=Words.js.map