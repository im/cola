// 状态栏
import { window, StatusBarAlignment } from 'vscode'
import { autoRefresh } from '../Config'

import * as Command from '../Command'

let defaultStatus:any;

const getStatus = () => {
    defaultStatus = autoRefresh.value ? '自动分析单词' : '点击分析单词';
    return defaultStatus
}

const statusBar = window.createStatusBarItem(StatusBarAlignment.Right);
statusBar.text = getStatus();
statusBar.show();
statusBar.tooltip = 'Cola';
statusBar.command = Command.REFRESH;

autoRefresh.change(() => {
    statusBar.text = getStatus();
});

let timerTask:any

const update = (message:any) => {
    statusBar.text = message;
    !isNaN(timerTask) && clearTimeout(timerTask);
    timerTask = setTimeout(() => {
        statusBar.text = defaultStatus;
    }, 5000);
}
export default {
    update
}