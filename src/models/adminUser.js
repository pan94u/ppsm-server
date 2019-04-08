import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

//用户表
export const userDB = defineModel('psa_user', {
    userId: Sequelize.STRING, //用户名
    passWord: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    token: {
      type: Sequelize.STRING,
      allowNull: true
    } //token
});
