const status = require('http-status')

const userModel = require('../models/users.js')
const { group: groupModel, groupuser: userGroupsModel, groupuser } = require('../models/associations.js');

const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const db = require('../models/database.js')
const bcrypt = require('bcrypt')
const jws = require('jws');
const { where } = require('sequelize');
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env


module.exports = {
//Créer un groupe
// Il appartiendra à son créateur/name
  async newGroup (req, res) {
    
    if(!has(req.body,['name']))
      throw new CodeError('Group must have a name', status.BAD_REQUEST)
    const {name} = req.body;
    const uid = req.user.id;
    const grp = await groupModel.create({name})
    await userGroupsModel.create({uid: uid, gid: grp.id})
    res.json({
      status: true,
      message: 'Group Added'
    })
  },
  async getGroup (req, res) {
    try {
      const userId = req.user.id;
      console.log("Fetching groups for userId", userId);
      const userGroupsList = await userGroupsModel.findAll({
        where: {uid: userId},
        include: [{
          model: groupModel,
          as: 'group',
          attributes: ['id', 'name']
        }]
      });
      console.log("userGroupList = ",userGroupsList)
      const groups = userGroupsList.map(ug => ug.group);
      res.json({
        status: true,
        message: 'User groups retrieved successfully',
        data: groups
    });
    } catch (error) {
        console.error("Error retrieving user groups:", error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  },
  async getGroupMembers (req,res) {
    try {
      const groupId = req.params.gid;
      console.log("Fetching groups for userId", groupId);

      const groupMemList = await userGroupsModel.findAll({
        where: {gid: groupId},
        include: [{
          model: userModel,
          as: 'user',
          attributes: ['id', 'name', 'email', 'passhash','isAdmin']
        }]
      });
      console.log("members list = ",groupMemList)
      const users = groupMemList.map(ug => ug.user);
      res.json({
        status: true,
        message: 'Group users retrieved successfully',
        data: users
    });
    } catch (error) {
        console.error("Error retrieving group users:", error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    
  },

  async deleteGroup (req, res) {
    if (!has(req.params, 'gid')) 
      throw new CodeError('You must specify the group id', status.BAD_REQUEST)
    const { gid } = req.params
    await groupModel.destroy({ where: { id: gid } })
    res.json({ status: true, message: 'Group deleted' })
  },

    async addGroupMember (req,res) {
    if (! has(req.params, 'gid') || !has(req.params, 'uid') )
        throw new CodeError('You must specify the group id and group user id ', status.BAD_REQUEST)
    
    const { gid , uid } = req.params
    console.log(`Adding user uid=${uid} to gid=${gid} and `);
  
    const user = await userGroupsModel.findOne({where: { id: gid, uid: uid}});
    
    console.log ("Found user", user)
    if (user)
      return res.json({ status: true, message: 'User already in group' });
    else {
      await userGroupsModel.create({id: gid, uid: uid });

      res.json({
        status: true,
        message: 'User Added'
      })
    }


  },

  async deleteGroupMember (req,res) { 
    console.log('Received parameters:', req.params);
 
  if (! has(req.params, 'gid') || !has(req.params, 'uid') )
    throw new CodeError('You must specify the group id and group user id ', status.BAD_REQUEST)
    const { gid , uid } = req.params
    console.log(`Deleting group member with gid=${gid} and uid=${uid}`);

    await userGroupsModel.destroy({where : { id : gid , uid: uid  }})
    res.json ({status :true , message : 'Groupmenber deleted'})
  },

  async listAllGroups (req,res) {
    const data = await groupModel.findAll({attributs: ['id', 'name']})
    res.json({ status: true, message: 'Returning groups', data})
  }
}
