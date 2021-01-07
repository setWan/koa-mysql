const Router = require('koa-router');
const fs = require('fs')
const router = new Router();

const files = fs.readdirSync(__dirname).filter(file => file !== 'index.js')
for (const file of files) {
  if (file.toLowerCase().endsWith('js')) {
    const controller = require(`./${file}`)
    const name = file.replace(/\.js/, '')
    router.use(`/${name}`, controller.routes(), controller.allowedMethods());
  }
}
// const user = require('./user.js');
// router.use('/user', user.routes(), user.allowedMethods());

module.exports = router