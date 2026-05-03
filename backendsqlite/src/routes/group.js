const express = require('express')
const router = express.Router()
const group = require('../controllers/group.js')
const { verify } = require('jws')
const { verifyToken, verifyGroupes } = require('../controllers/verify.js')

router.get('/api/mygroups', verifyToken,group.listAllGroups)
router.post('/api/mygroups',verifyToken,group.newGroup)
router.get('/api/mygroups/:gid', verifyToken,group.getGroupMembers) 
router.delete('/api/mygroups/:gid',verifyToken, group.deleteGroup)
router.put('/api/mygroups/:gid/:uid',verifyToken,group.addGroupMember)
router.delete('/api/mygroups/:gid/:uid',verifyToken,group.deleteGroupMember)
router.get('/api/groupsmember',verifyToken,group.getGroup)
module.exports = router
