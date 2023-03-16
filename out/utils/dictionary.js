"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWordTask = exports.localDict = void 0;
// 翻译
const basic_1 = require("../statusBar/basic");
const wordApi = require('../../dictionary/ECDICT');
// 词典缓存
exports.localDict = {};
// 添加翻译任务
const addWordTask = (list, callback) => {
    const undefinedWords = list.filter((item) => !exports.localDict[item]);
    //存在 没有翻译结果的单词
    if (undefinedWords.length > 0) {
        basic_1.default.update('正在翻译中...');
        wordApi.all(undefinedWords).then((datas) => {
            datas.forEach((data) => {
                if (data.status) {
                    exports.localDict[data.word] = {
                        phonetic: data.phonetic,
                        translation: data.translation.replace(/\\n/g, '\n')
                    };
                }
                else {
                    exports.localDict[data.word] = {
                        error: data.message
                    };
                }
            });
            callback();
            basic_1.default.update('单词分析完毕！');
        });
    }
};
exports.addWordTask = addWordTask;
//# sourceMappingURL=dictionary.js.map