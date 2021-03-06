let http = require('http');
let fs = require('fs');
let url = require('url');
// 获取轮播图 /sliders
let sliders = require('./sliders');

function read(cb) {
    fs.readFile(__dirname + '\\book.json', 'utf8', function(err, data) {
        if (err || data.length == 0) {
            cb([]);
        } else {
            cb(JSON.parse(data)); //将读出来的内容转化成对象
        }
    })
}

function write(data, cb) {
    fs.writeFile(__dirname + '\\book.json', JSON.stringify(data), cb);
}

let pageSize = 5; //每页显示5
http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("X-Powered-By", ' 3.2.1')
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    if (req.method == "OPTIONS") return res.end();
    let {
        pathname,
        query
    } = url.parse(req.url, true); //true把query转化成对象
    if (pathname === '/page') {
        let offset = parseInt(query.offset) || 0;
        read(function(books) {
            let hasMore = true;
            let result = books.reverse().slice(offset, offset + pageSize);
            if (books.length <= offset + pageSize) {
                hasMore = false;
            }
            res.setHeader('Content-Type', 'application/json;charset=utf8')

            res.end(JSON.stringify({ hasMore, books: result }));
        });
        return;
    }
    if (pathname === '/sliders') {
        res.setHeader('Content-Type', 'application/json;charset=utf8')
        return res.end(JSON.stringify(sliders));
    }
    if (pathname === '/hot') {
        read(function(books) {
            let hot = books.reverse().slice(0, 6);
            res.end(JSON.stringify(hot));
        })
        return;
    }
    if (pathname === '/book') { //对书的增删改查 
        let id = parseInt(query.id); //取出的字符串
        switch (req.method) {
            case 'GET':
                if (!isNaN(id)) { //查询一个
                    read(function(books) {
                        let book = books.find(item => item.bookId === id);
                        if (!book) book = {};
                        res.setHeader('Content-Type', 'application/json;charset=utf8');
                        res.end(JSON.stringify(book));
                    });
                } else { //获取所有图书
                    read(function(books) {
                        res.setHeader('Content-Type', 'application/json;charset=utf8')
                        res.end(JSON.stringify(books.reverse()));
                    });
                }
                break;
            case 'POST':
                let str = '';
                req.on('data', chunk => {
                    str += chunk;
                });
                req.on('end', () => {
                    let book = JSON.parse(str);
                    read(function(books) {
                        book.bookId = books.length ? books[books.length - 1].bookId + 1 : 1;
                        books.push(book);
                        write(books, function() {
                            res.end(JSON.stringify(book));
                        });
                    });
                });
                break;
            case 'PUT':
                if (id) {
                    let str = '';
                    req.on('data', chunk => {
                        str += chunk;
                    });
                    req.on('end', () => {
                        let book = JSON.parse(str);
                        read(function(books) {
                            books = books.map(item => {
                                if (item.bookId === id) {
                                    return book;
                                }
                                return item;
                            });
                            write(books, function() {
                                res.end(JSON.stringify(book));
                            })
                        });
                    })
                }
                break;
            case 'DELETE':
                read(function(books) {
                    books = books.filter(item => item.bookId !== id);
                    write(books, function() {
                        res.end(JSON.stringify({})); //删除返回空对象
                    })
                });
                break;
        }
        return
    }
}).listen(3000);