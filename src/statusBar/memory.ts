// 状态栏
import { window, StatusBarAlignment } from 'vscode'
import * as Command from '../Command'

let defaultStatus:any = '记忆模式: 关';

const statusBar = window.createStatusBarItem(StatusBarAlignment.Right);
statusBar.text = defaultStatus;
statusBar.show();
statusBar.tooltip = 'Cola';
statusBar.command = Command.MEMORY;

const update = (flag:any) => {
    statusBar.text = flag ? '记忆模式: 开' : defaultStatus;
}
export default {
    update
}