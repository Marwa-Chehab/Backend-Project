const Sequelize = require('sequelize')
const db = require('./database.js')
const user = require('./users.js')
const group = require('./group.js')
const groupuser = require('./userGroups.js')
const { use } = require('../app.js')


user.belongsToMany(group, { through: groupuser, foreignKey: 'uid' });
group.belongsToMany(user, { through: groupuser, foreignKey: 'gid' });

// Associations directes pour l’inclusion dans findAll()
groupuser.belongsTo(group, { foreignKey: 'gid', as: 'group' });
groupuser.belongsTo(user, { foreignKey: 'uid', as: 'user' });

module.exports = { user, group, groupuser };