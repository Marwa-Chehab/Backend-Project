const router = require('express').Router()
router.use(require('./user'))
router.use(require('./group'))
module.exports = router
