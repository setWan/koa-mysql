const Router = require('koa-router');
const router = new Router();
const user = require('../controller/user.js');

router.get('/info/:account', user.getUserInfo);

module.exports = router;
