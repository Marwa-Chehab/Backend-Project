const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')
const { verify } = require('jws')
const { verifyToken } = require('../controllers/verify.js')

router.get('/api/users', verifyToken,user.getUsers)
 router.post('/api/users',user.newUser) 
router.put('/api/users/:id', verifyToken,user.updateUser)
router.delete('/api/users/:id',verifyToken, user.deleteUser)
router.post('/login', user.login)
router.put('/api/password',verifyToken,user.updatePassword)
module.exports = router
