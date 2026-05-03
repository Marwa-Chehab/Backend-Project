const Sequelize = require('sequelize')
const db = require('./database.js')
const user = require('./users.js')
const userGroupsModel = require('./userGroups.js');
const group = db.define('group', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(128),
    validate: {
      is: /^[a-z\-'\s]{1,128}$/i
        }
    }
}, { timestamps: false })


module.exports = group






