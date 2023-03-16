"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const basic_1 = require("./statusBar/basic");
const dictionary_1 = require("./utils/dictionary");
const Command = require("./Command");
const path = require('path');
class WordProvider {
    constructor(context, command) {
        this.list = [];
        this.tree = null;
        this.trigger = '';
        this.context = context;
        this.changeTreeDataEmitter = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this.changeTreeDataEmitter.event;
        this.list = [];
        this.trigger = command;
    }
    clear() {
        this.list = [];
        this.flush();
    }
    push(word) {
        if (this.list.indexOf(word) == -1) {
            this.list.push(word);
            this.flush();
        }
    }
    remove(word) {
        this.list = this.list.filter((item) => word != item);
        this.flush();
    }
    flush() {
        const tree = [];
        let element = {};
        this.list.sort().forEach((word) => {
            let prefix = word.substr(0, 1);
            if (element.prefix != prefix) {
                element = {
                    prefix,
                    children: []
                };
                tree.push(element);
            }
            element.children.push(word);
        });
        this.tree = tree;
        // 更新列表
        this.changeTreeDataEmitter.fire(undefined);
        basic_1.default.update('单词分析完毕！');
        (0, dictionary_1.addWordTask)(this.list, () => {
            this.flush();
        });
    }
    getChildren(element) {
        if (!element) {
            return this.tree;
        }
        else {
            return element.children;
        }
    }
    getTreeItem(element) {
        if (typeof element === 'object') {
            return new WordGroup(element);
        }
        else {
            return new WordItem(element, this.trigger);
        }
    }
}
class WordItem extends vscode_1.TreeItem {
    constructor(word, trigger) {
        super(word);
        this.word = '';
        this.data = {};
        this.trigger = null;
        this.word = word;
        this.data = dictionary_1.localDict[word];
        this.trigger = trigger;
    }
    // @ts-ignore
    get command() {
        return {
            command: Command.READ,
            title: `播放 ${this.word}`,
            arguments: [this]
        };
    }
    // @ts-ignore
    get tooltip() {
        return this.data ?
            this.data.phonetic ?
                [
                    `音标：[${this.data.phonetic}]`,
                    `解释：${this.data.translation.replace(/\n/g, '\n　　　')}`
                ].join('\n')
                : this.data.translation
            : 'loading...';
    }
    // @ts-ignore
    get iconPath() {
        return {
            light: path.join(__filename, '..', 'resources', 'light', 'icon.svg'),
            dark: path.join(__filename, '..', 'resources', 'dark', 'icon.svg')
        };
    }
    // @ts-ignore
    get description() {
        return this.data ?
            (this.data.translation || '').replace(/\n/g, '、')
            : '未收录';
    }
    // @ts-ignore
    get contextValue() {
        return 'word';
    }
}
class WordGroup extends vscode_1.TreeItem {
    constructor(element) {
        super(element.prefix.toUpperCase());
        this.description = `共${element.children.length}个`;
        this.collapsibleState = vscode_1.TreeItemCollapsibleState.Expanded;
        this.tooltip = `${element.prefix.toUpperCase()}开头的单词${this.description}`;
    }
}
exports.default = WordProvider;
