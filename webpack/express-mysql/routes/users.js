var express = require('express');
var router = express.Router();
var db = require('./db.js');

/* 查询列表页 */
router.get('/', function(req, res, next) {
    db.query('select * from userinfo', function(err, rows) {
        if (err) {
            res.render('users', { title: 'Express', datas: []});
        } else {
            res.render('users', { title: 'Express', datas: rows});
        }
    });
});

/* 新增页面跳转 */
router.get('/add', function(req, res) {
    res.render('add');
});
router.post('/add', function (req, res) {
    var name = req.body.name;
    var age = req.body.age;
    db.query("insert into userinfo(name, age) values('" + name + "'," + age + " )", function (err, rows) {
        if (err) {
            res.end('新增失败');
        } else {
            res.redirect('/users');
        }
    });
});

/**
 * 删
 */
router.post('/del', function (req, res) {
    var id = req.body.id;
    db.query("delete from userinfo where id=" + id, function (err, rows) {
        if (err) {
            res.end('删除失败：' + err);
        } else {
            console.log(rows);
            res.json({
                code: '000000',
                data: '',
                msg: '删除成功',
            });
        }
    });
});

/* 修改页面跳转 */
router.get('/toUpdate/:id', function(req, res) {
    var id = req.params.id;
    db.query("select * from userinfo where id=" + id, function(err, rows) {
        if (err) {
            res.end('修改页面跳转失败' + err);
        } else {
            res.render('update', {datas: rows});
        }
    });
});
router.post('/update', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var age = req.body.age;
    db.query("update userinfo set name = '" + name + "',age = '" + age + "' where id = " + id, function (err, rows) {
        if (err) {
            res.end('修改失败:' + err);
        } else {
            res.redirect('/users');
        }
    });
});

/* 查询 */
router.post('/search', function (req, res) {
    var name = req.body.s_name;
    var age = req.body.s_age;
    var sql = 'select * from userinfo';
    if (name) {
        sql += " and name = '" + name + "' ";
    }
    if (age) {
        sql += " and age = '" + age + "' ";
    }
    sql = sql.replace('and', 'where');
    db.query(sql, function(err, rows) {
        if (err) {
            res.end('查询失败:', err);
        } else {
            res.render('users', { title: 'Express', datas: rows, s_name: name, s_age: age});
        }
    });
});

module.exports = router;