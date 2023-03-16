// 翻译
import basicStatusBar from '../statusBar/basic'

const wordApi = require('../../dictionary/ECDICT');

// 词典缓存
export const localDict:any = {};

// 添加翻译任务
export const addWordTask = (list:any, callback:any) => {
    const undefinedWords = list.filter((item:any) => !localDict[item]);
    //存在 没有翻译结果的单词
    if (undefinedWords.length > 0) {
        basicStatusBar.update('正在翻译中...');
        wordApi.all(undefinedWords).then((datas:any) => {
            datas.forEach((data:any) => {
                if (data.status) {
                    localDict[data.word] = {
                        phonetic: data.phonetic,
                        translation: data.translation.replace(/\\n/g, '\n')
                    };
                } else {
                    localDict[data.word] = {
                        error: data.message
                    };
                }
            });
            callback();
            basicStatusBar.update('单词分析完毕！');
        });
    }
};
