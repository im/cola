const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, '..', '..', '..', 'mastered-list.txt');

const masteredList = new Set();

// 读取记录
if (fs.existsSync(dbFile)) {
    const json = fs.readFileSync(dbFile).toString();
    json.split('\n').forEach((word:any) => {
        masteredList.add(word.trim());
    });
}

// 保存到硬盘
function saveToFile () {
    const list = Array.from(masteredList).map(word => {
        return word;
    });
    fs.writeFileSync(dbFile, list.join('\n'));
}

// 是否包含单词
function has (item:any) {
    return masteredList.has(item);
}

// 添加单词记录
function add (item:any) {
    masteredList.add(item);
    saveToFile();
}

// 删除单词记录
function remove (item:any) {
    masteredList.delete(item);
    saveToFile();
}

export default {
    has,
    add,
    remove
}