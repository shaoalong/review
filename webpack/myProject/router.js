const express = require('express');

const db = require('./db.js');

const router = express.Router();

/* 查询列表页 */
router.get('/api/getUserList', (req, res) => {
  db.query('select * from userinfo', (err, data) => {
    if (err) {
      res.status(500).send('database err').end();
    } else {
      res.send({
        code: '000000',
        data,
        msg: '',
      });
    }
  });
});

router.post('/api/delUser', (req, res) => {
  const { id } = req.body;
  db.query(`delete from userinfo where id= ${id}`, (err, data) => {
    if (err) {
      res.end(`删除失败： ${err}`);
    } else {
      console.log(data);
      res.json({
        code: '000000',
        data: '',
        msg: '删除成功',
      });
    }
  });
});

router.post('/api/addUser', (req, res) => {
  const { name, age, id } = req.body;
  let sql = `insert into userinfo(name, age) values( '${name}' , '${age}' )`;
  if (id) {
    sql = `update userinfo set name = '${name}', age = '${age}' where id = '${id}'`;
  }
  db.query(sql, (err, data) => {
    if (err) {
      res.end(`添加失败： ${err}`);
    } else {
      console.log(data);
      res.send({
        code: '000000',
        data: '',
        msg: '添加成功',
      });
    }
  });
});

/* 查询 */
router.get('/api/search', (req, res) => {
  const { id } = req.query;
  db.query(`select * from userinfo where id = ${id}`, (err, data) => {
    if (err) {
      res.end('查询失败:', err);
    } else {
      res.send({
        code: '000000',
        data: {
          name: data[0].name,
          age: data[0].age,
        },
        msg: '查询成功',
      });
    }
  });
});

module.exports = router;
