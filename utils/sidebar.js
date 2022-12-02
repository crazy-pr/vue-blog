module.exports = [{
    "link": "/",
    "text": "介绍",
    "order": 0
}, {
    "text": "测试分组",
    "order": 2,
    "collapsable": false,
    "sidebarDepth": 1,
    "children": [{
        "link": "/testGroup/",
        "text": "第一项",
        "order": 0
    }, {
        "link": "/testGroup/second.md",
        "text": "测试第二项",
        "order": 1
    }],
    "type": "group"
}]