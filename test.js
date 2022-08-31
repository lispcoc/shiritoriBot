const fs = require('fs');

var list = [];

minify();

function minify() {
    let text = fs.readFileSync("list.json", 'utf-8');
    list = JSON.parse(text);
    fs.writeFileSync("list.json", JSON.stringify(list));
}

function generateSortedList() {
    let text = fs.readFileSync("list.json", 'utf-8');
    list = JSON.parse(text);
    //console.log(list);
    var key = "ァ";
    for (key = "ァ"; key != "ン"; key = String.fromCharCode(key.charCodeAt(0) + 1)) {
        for (var len = 2; len < 30; len++) {
            var res = list.filter(e => {
                return e.yomi.match("^" + key) && e.len == len;
            });
            if (res.length > 0) {
                //fs.writeFileSync("list/" + key + "_" + len + ".json", JSON.stringify(res, null, 4));
            } else {
                console.log(key + len + " not found.");
            }
        }
    }
}

function generateList() {
    for (var i = 1; i <= 2211; i++) {
        let text = fs.readFileSync("data/" + i + ".html", 'utf-8');

        text.split("\n").forEach(line => {
            var g1 = line.match("（(.+)）");
            var g2 = line.match("href=\"/wiki/.+? title=\"([^\"]+)\"");
            var yomi = null;
            var title = null;
            if (g1) {
                yomi = g1[1];
            }
            if (g2) {
                title = g2[1];
            }
            if (!yomi && title) {
                yomi = title;
            }
            if (yomi && !title) {
                title = yomi;
            }
            if (yomi) {
                var g = ex_hira(yomi);
                if (g) {
                    yomi = g[0];
                } else {
                    yomi = null;
                }
            }
            if (yomi) {
                var obj = { title: title, yomi: yomi, len: yomi.length };
                list.push(obj);
                //console.log(title + " / " + yomi + "(" + yomi.length + ")");
            }
        });
        if (i % 100 == 0) {
            console.log(i);
        }
    }
    fs.writeFileSync("list.json", JSON.stringify(list, null, 4));
}

function remove_dot(str) {
    return str.replace("・", "");
}

function ex_hira(str) {
    str = str.replace(/[ぁ-ん]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + 0x60);
    });
    str = remove_dot(str);
    var res = str.match("^[ァ-ヴぁ-んー]+$");
    return res;
}