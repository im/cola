import { EventEmitter, workspace } from 'vscode'
const configAll:any = [];
class Config {
    changeEvent: EventEmitter<any>
    key = ''
    constructor (key:string) {
        configAll.push(this);
        this.key = key;
        this.changeEvent = new EventEmitter();
    }

    get value () {
        return workspace.getConfiguration().get(this.key);
    }

    set value (newVal) {
        this.trigger();
        workspace.getConfiguration().update(this.key, newVal, true);
    }

    change (func:any) {
        this.changeEvent.event(func)
    }

    trigger () {
        this.changeEvent.fire(null);
    }
}

export const autoRefresh = new Config('cola.autoRefresh')
export const configReload = workspace.onDidChangeConfiguration(() => {
    configAll.forEach((item:any) => item.trigger())
})