import { window, StatusBarAlignment } from 'vscode'

let defaultStatus:any = '...';

const statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
statusBar.text = defaultStatus;
statusBar.show();
statusBar.color = '#fff'

let timerTask:any

const update = (message:any, isError:any) => {
    statusBar.text = message;
    statusBar.color = isError ? '#fe5351' : '#fff'
    !isNaN(timerTask) && clearTimeout(timerTask);
    timerTask = setTimeout(() => {
        statusBar.text = defaultStatus;
    }, 50000);
}
export default {
    update
}