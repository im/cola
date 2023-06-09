const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, '..', '..', '..', 'review-list.txt');

const reviewList = new Set();

// 保存到硬盘
function saveToFile () {
    const list = Array.from(reviewList).map(word => {
        return word;
    });
    // fs.writeFileSync(dbFile, '');
    fs.writeFileSync(dbFile, list.join('\n'));
}

// 是否包含单词
function has (item:any) {
    return reviewList.has(item);
}

// 添加单词记录
function add (item:any) {
    reviewList.add(item);
    saveToFile();
}

// 删除单词记录
function remove (item:any) {
    reviewList.delete(item);
    saveToFile();
}

function get () {
    if (fs.existsSync(dbFile)) {
        const json = fs.readFileSync(dbFile).toString();
        json.split('\n').forEach((word:any) => {
            if (word.trim() && !has(word)) {
                reviewList.add(word.trim());
            }
        });
    }
    return [...reviewList]
}

export default {
    has,
    add,
    remove,
    get
}