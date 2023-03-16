import { window, StatusBarAlignment } from 'vscode'

let defaultStatus:any = '...';

const statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
statusBar.text = defaultStatus;
statusBar.show();

let timerTask:any

const update = (message:any) => {
    statusBar.text = message;
    !isNaN(timerTask) && clearTimeout(timerTask);
    timerTask = setTimeout(() => {
        statusBar.text = defaultStatus;
    }, 50000);
}
export default {
    update
}