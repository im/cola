import { ExtensionContext, EventEmitter, Event, TreeItem, TreeItemCollapsibleState } from 'vscode';
import basicStatusBar from './statusBar/basic'
import { addWordTask, localDict } from './utils/dictionary'
import * as Command from './Command'

const path = require('path');

class ReviewWordProvider {
    context:ExtensionContext
    changeTreeDataEmitter: EventEmitter<any>
    onDidChangeTreeData: Event<any>
    list: any = []
    tree:any = null
    constructor (context:ExtensionContext) {
        this.context = context
        this.changeTreeDataEmitter = new EventEmitter();
        this.onDidChangeTreeData = this.changeTreeDataEmitter.event;
        this.list = [];
    }

    // 清空单词
    clear () {
        this.list = [];
        this.flush();
    }

    // 添加 单词
    push (word: string) {
        if (this.list.indexOf(word) === -1) {
            this.list.push(word);
            this.flush();
        }
    }

    // 删除单词
    remove (word:string) {
        this.list = this.list.filter((item: any) => word !== item);
        this.flush();
    }

    // 刷新
    flush () {
        const tree:any = [];
        const wordMap = this.list.reduce((acc:any,cur:any) => {
            const date = cur.split('|')[1]
            if (acc[date]) {
                acc[date].push(cur)
            } else {
                acc[date] = [cur]
            }
            return acc
        }, {})
        const list = Object.keys(wordMap).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        list.forEach(key => {
            const element = {
                prefix: key,
                children: wordMap[key]
            };
            tree.push(element)
        })

        this.tree = tree;

        // 更新列表
        this.changeTreeDataEmitter.fire(undefined);
        basicStatusBar.update('单词分析完毕！');

        // 创建翻译任务
        addWordTask(this.list.map((v:any) => v.split('|')[0]), () => {
            this.flush();
        });
    }

    // 获取子节点
    getChildren (element:any) {
        if (!element) {
            return this.tree;
        } else {
            return element.children;
        }
    }

    // 获取元素内容
    getTreeItem (element:any) {
        if (typeof element === 'object') {
            return new WordGroup(element);
        } else {
            return new WordItem(element);
        }
    }
}

class WordItem extends TreeItem {
    word = ''
    data: any = {}
    trigger = Command.REVIEW
    constructor (word:string) {
        const arr = word.split('|')
        const w = arr[0]
        super(w);
        this.word = w;
        this.data = localDict[w];
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

export default ReviewWordProvider