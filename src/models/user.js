import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

//用户表
export const userDB = defineModel('pss_user', {
    userId: Sequelize.STRING, //用户名
    openid: Sequelize.STRING, //小程序用户唯一值
    session_key: {
      type: Sequelize.STRING,
      allowNull: true
    }, //小程序session
    nickName: {
      type: Sequelize.STRING,
      allowNull: true
    }, //小程序用户名
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    }, //小程序手机号
    countryCode: {
      type: Sequelize.STRING,
      allowNull: true
    }, //区号
    gender: {
      type: Sequelize.INTEGER,
      allowNull: true
    }, //性别
    language: {
      type: Sequelize.STRING,
    }, //语言
    city: {
      type: Sequelize.STRING,
      allowNull: true
    }, //市
    province: {
      type: Sequelize.STRING,
      allowNull: true
    }, //省
    country: {
      type: Sequelize.STRING,
      allowNull: true
    }, //国家
    avatarUrl: {
      type: Sequelize.STRING,
      allowNull: true
    }, //微信头像
    token: {
      type: Sequelize.STRING,
      allowNull: true
    } //token
});
