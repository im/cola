import { ExtensionContext, EventEmitter, Event, TreeItem, TreeItemCollapsibleState } from 'vscode';
import basicStatusBar from './statusBar/basic'
import { addWordTask, localDict } from './utils/dictionary'
import * as Command from './Command'

const path = require('path');

class WordProvider {
    context:ExtensionContext
    changeTreeDataEmitter: EventEmitter<any>
    onDidChangeTreeData: Event<any>
    list: any = []
    tree:any = null
    trigger = ''
    constructor (context:ExtensionContext, command:any) {
        this.context = context
        this.changeTreeDataEmitter = new EventEmitter();
        this.onDidChangeTreeData = this.changeTreeDataEmitter.event;
        this.list = []
        this.trigger = command
    }

    clear () {
        this.list = [];
        this.flush();
    }

    push (word: string) {
        if (this.list.indexOf(word) == -1) {
            this.list.push(word);
            this.flush();
        }
    }

    remove (word:string) {
        this.list = this.list.filter((item: any) => word != item);
        this.flush();
    }

    flush () {
        const tree:any = [];
        let element:any = {};
        this.list.sort().forEach((word:any) => {
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
        basicStatusBar.update('单词分析完毕！');

        addWordTask(this.list, () => {
            this.flush();
        });
    }

    getChildren (element:any) {
        if (!element) {
            return this.tree;
        } else {
            return element.children;
        }
    }

    getTreeItem (element:any) {
        if (typeof element === 'object') {
            return new WordGroup(element);
        } else {
            return new WordItem(element, this.trigger);
        }
    }
}

class WordItem extends TreeItem {
    word = ''
    data: any = {}
    trigger = null
    constructor (word:string, trigger:any) {
        super(word);
        this.word = word;
        this.data = localDict[word];
        this.trigger = trigger
    }

    // @ts-ignore
    get command () {
        return {
            command: Command.READ,
            title: `播放 ${this.word}`,
            arguments: [this]
        };
    }

    // @ts-ignore
    get tooltip () {
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
    get iconPath () {
        return {
            light: path.join(__filename, '..', 'resources', 'light', 'icon.svg'),
            dark: path.join(__filename, '..', 'resources', 'dark', 'icon.svg')
        }
    }

    // @ts-ignore
    get description () {
        return this.data ?
            (this.data.translation || '').replace(/\n/g, '、')
            : '未收录';
    }

    // @ts-ignore
    get contextValue () {
        return 'word';
    }
}

class WordGroup extends TreeItem {
    constructor (element:any) {
        super(element.prefix.toUpperCase());
        this.description = `共${element.children.length}个`;
        this.collapsibleState = TreeItemCollapsibleState.Expanded;
        this.tooltip = `${element.prefix.toUpperCase()}开头的单词${this.description}`;
    }
}

export default WordProvider