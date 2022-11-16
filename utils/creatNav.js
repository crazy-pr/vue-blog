/**
 * 根据docs文件夹下的md文件生成侧边栏
 */
const fs = require("fs");
let path = require("path");
const matter = require('gray-matter');

//要遍历的文件夹所在的路径
let initFilePath = path.resolve("./docs");

// 遍历文件夹
const readDir = (filePath) => {
    return new Promise((resolve) => {
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, (err, files) => {
            if (err) {
                console.warn(err, "读取文件夹错误！");
                resolve(null);
            } else {
                loop(files, filePath) // 获取文件夹下文件信息
                    .then((res) => {
                        resolve(res);
                    });
            }
        });
    });
};
// 循环执行，获取文件夹下文件信息
const loop = (files, filePath) => {
    return new Promise((resolve) => {
        const list = [];
        const loopThis = async (files, filePath) => {
            const filename = files[0];
            const filedir = path.join(filePath, filename);
            if (filename !== ".vuepress") {
                const data = await statInfo(filedir, filename, filePath);
                if (data) {
                    console.log(data)
                    list.push(data);
                }
                files.splice(0, 1);
                if (files.length) {
                    loopThis(files, filePath);
                } else {
                    resolve(list);
                }
            } else {
                files.splice(0, 1);
                if (files.length) {
                    loopThis(files, filePath);
                } else {
                    resolve(list);
                }
            }
        };
        loopThis(files, filePath);
    });
};

//根据文件路径获取文件信息，返回一个fs.Stats对象，判断是文件还是文件夹
const statInfo = (filedir, filename, filePath) => {
    return new Promise((resolve) => {
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, (eror, stats) => {
            if (eror) {
                console.warn("获取文件stats失败");
                resolve(null);
            } else {
                let isFile = stats.isFile(); //是文件
                let isDir = stats.isDirectory(); //是文件夹

                // 文件读取区
                if (isFile) {
                    getFileInfo(filename, filePath).then((res) => {
                        resolve(res);
                    });
                }

                // 非 .vuepress 文件夹，读取文件夹下信息，并根据是否有 Group 标识创建目录
                if (isDir) {
                    readDir(filedir, `${filePath}/${filename}`) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        .then((res) => {
                            if (filename.endsWith("Group")) {
                                // 分类group
                                let dir = {
                                    text: filename, // 必要的
                                    order: 0, // 排序
                                    collapsable: false, // 可选的, 默认值是 true, 是否收起分组
                                    sidebarDepth: 1, // 可选的, 默认值是 1
                                    children: [],
                                };
                                const groupConfig = res.filter(
                                    (item) => item.type && item.type === "group"
                                )[0];
                                if (groupConfig) {
                                    delete groupConfig.children
                                }

                                dir = {
                                    ...dir,
                                    ...groupConfig
                                }
                                dir.children = res
                                    .filter((item) => !item.type)
                                    .sort((a, b) => a.order - b.order)
                                    .map((item) => {
                                        return item
                                    });
                                resolve(dir);
                            } else {
                                resolve(res);
                            }
                        });
                }
            }
        });
    });
};
// 获取文件信息
const getFileInfo = (filename, filePath) => {
    return new Promise((resolve) => {
        if (filename === 'config.json') {
            const config = require(filePath + "\\" + filename)
            const groupInfo = {
                type: "group",
                ...config
            };
            // txt文件，配置组名
            resolve(groupInfo);
        }
        if (filename.endsWith(".md")) {
            // md文件
            readMdWord(filename, filePath).then((res) => {
                resolve(res);
            });
        }
    });
};

// 配置连接 ， 读取md文件，配置侧边栏
const readMdWord = (filename, filePath) => {
    return new Promise((resolve) => {
        const info = {
            link: "",
            text: "",
            order: "",
        };
        // 读取文件内容
        fs.readFile(filePath + "/" + filename, "utf8", (err, dataStr) => {
            if (err) {
                console.warn("读取文件内容", err);
                resolve(null);
            } else {
                const obj = matter(dataStr)
                const name = obj.data.title || filename.split(".")[0]
                const order = obj.data.order || 0
                const link = `${filePath
                    .split("\\docs")[1]
                    .replace(/\\/g, "/")}/${filename}`;
                info.link = ['readme.md', 'index.md'].includes(filename) ? link.replace(/readme.md|index.md/, '') : link;
                info.text = name;
                info.order = Number(order);
                resolve(info);
            }
        });
    });
};

readDir(initFilePath).then((res) => {
    const content = `module.exports =${JSON.stringify(
        res
            .sort((a, b) => a.order - b.order)
            .map((item) => {
                return item;
            })
    )}`;
    fs.writeFile("./utils/sidebar.js", content, {
        encoding: "utf8"
    }, (err) => {
        console.log(err);
    });
});