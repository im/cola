import { ExtensionContext, window } from 'vscode';
import WordProvider from './WordProvider'
import ReviewWordProvider from './ReviewWordProvider'
import { configReload, autoRefresh } from './Config'
import basicStatusBar from './statusBar/basic'
// import memoryStatusBar from './statusBar/memory'
import MasteredStorage from './storage/mastered'
import ReviewStorage from './storage/review'
import parse from './utils/parse'
import WebviewPanel from './WebviewPanel'
import { addWordTask, localDict } from './utils/dictionary'
import * as Command from './Command'
import deteFormat from './utils/dateFormat'

class WordsApp {
    learnWords: any
    masteredWords:any
    reviewWords: any
    context:ExtensionContext
    isMemory = false
    constructor (context:ExtensionContext) {

        this.learnWords = new WordProvider(context, Command.LEARN)
        this.masteredWords = new WordProvider(context, Command.MASTERED)
        this.reviewWords = new ReviewWordProvider(context)

        window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        this.onActiveEditorChanged();

        context.subscriptions.push(configReload);

        this.context = context
    }

    onActiveEditorChanged () {
        autoRefresh.value && this.refresh()
    }

    // 检查编辑器
    checkEditor () {
        if (!window.activeTextEditor) {
            basicStatusBar.update('请切换到代码文件');
        } else if (window.activeTextEditor.document.uri.scheme !== 'file') {
            basicStatusBar.update('只支持本地文件');
        } else {
            return true
        }
    }

    dataInit () {
        this.learnWords.clear()
        this.masteredWords.clear()
    }

    analyse (text: string) {
        this.dataInit()

        parse(text).forEach((word:any) => {
            if (MasteredStorage.has(word)) {
                this.masteredWords.list.push(word)
            } else {
                const is = ReviewStorage.has(this.format(word))
                if (!is) {
                    this.learnWords.list.push(word)
                }
            }
        })

        this.learnWords.flush()
        this.masteredWords.flush()
    }

    format (word:string) {
        return word + '|' + deteFormat()
        // return word + '|' + '2023-03-15'
    }

    initReview () {
        const list = ReviewStorage.get()
        list.forEach(item => {
            this.reviewWords.push(item)
        })
    }

    addReview (word:any, app:any) {
        const source = {
            data: {
                word
            },
            trigger: Command.LEARN
        }
        const w = this.format(word)
        this.learnWords.remove(word);
        if (!ReviewStorage.has(w)) {
            this.reviewWords.push(w)
            ReviewStorage.add(w)
        }
        WebviewPanel(this.context, app).postMessage(this.getMessage(source, Command.ADD_REVIEW))
    }

    removeReview (word:string, app:any) {
        const w = word.split('|')[0]
        const source = {
            data: {
                word: w
            },
            trigger: Command.REVIEW
        }
        this.reviewWords.remove(word);
        ReviewStorage.remove(word)
        this.learnWords.push(w)

        WebviewPanel(this.context, app).postMessage(this.getMessage(source, Command.REMOVE_REVIEW))
    }
    learn (word:string, app:any) {
        const source = {
            data: {
                word
            },
            trigger: Command.LEARN
        }

        MasteredStorage.add(word);

        this.learnWords.remove(word);
        this.masteredWords.push(word);

        WebviewPanel(this.context, app).postMessage(this.getMessage(source, Command.LEARN))
    }
    mastered (word:string, app:any) {
        const source = {
            data: {
                word
            },
            trigger: Command.MASTERED
        }
        MasteredStorage.remove(word);
        this.learnWords.push(word);
        this.masteredWords.remove(word);

        WebviewPanel(this.context, app).postMessage(this.getMessage(source, Command.MASTERED))
    }

    getMessage (source:any, command:any) {
        const { data, trigger } = source
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
            localDict: localDict
        }
    }

    memory (source:any, app:any) {
        this.isMemory = !this.isMemory
        // memoryStatusBar.update(this.isMemory)
    }

    read (source:any, app:any) {
        source.data.word = source.word
        WebviewPanel(this.context, app).postMessage(this.getMessage(source, Command.READ))
    }

    refresh () {
        this.initReview()
        if (this.checkEditor()) {
            basicStatusBar.update('单词分析中...');
            if (window.activeTextEditor) {
                this.analyse(window.activeTextEditor.document.getText())
            }
        }
    }
}

export default WordsApp
