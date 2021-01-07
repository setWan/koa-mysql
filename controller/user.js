const utils = require('../utils')
/*
 * 获取用户信息
 */
async function getUserInfo (ctx, next) {
  let { account } = ctx.params
  if (account == null) {
    ctx.body = {
      code: '201',
      message: '账户不能为空',
      results: null
    }
    return;
  }

  var sql = 'SELECT * FROM t_accounts WHERE account = "' + account + '"';
  let { err, rows } = await $queryDB(sql);
  if (err) {
    ctx.body = {
      code: '202',
      message: err.message,
      results: null
    }
    throw err;
  }

  if (rows.length == 0) {
    ctx.body = {
      code: '200',
      message: '账户不存在',
      results: null
    }
    return;
  }

  ctx.body = {
    code: '200',
    message: '查询成功',
    results: rows[0]
  }

}

module.exports = {
  getUserInfo
}
