"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (text) => {
    const wordsSet = new Set();
    text
        // 分析大写单词：常量
        .replace(/([A-Z]{2,})/g, ($0, $1) => {
        wordsSet.add($1.toLowerCase());
        return '-';
    })
        // 分析小写单词
        .replace(/([A-Za-z][a-z]+)/g, ($0, $1) => {
        wordsSet.add($1.toLowerCase());
        return '-';
    });
    const wordsList = Array.from(wordsSet);
    wordsSet.clear();
    return wordsList;
};
//# sourceMappingURL=parse.js.map