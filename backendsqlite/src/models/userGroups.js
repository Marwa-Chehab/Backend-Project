const Sequelize = require('sequelize')
const db = require('./database.js')
const user = require('./users.js')
const group = require('./group.js')
const userGroups = db.define('userGroups', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  gid: {
    type: Sequelize.INTEGER,
    references: {
        model: group,
        key: 'id'
    }
  },
  uid: {
    type: Sequelize.INTEGER,
    references: {
        model: user,
        key: 'id'
    }
  },
  isHost: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    validate:{
      isIn: [[true, false]],
    }
  }
}, { timestamps: false })




module.exports = userGroups






