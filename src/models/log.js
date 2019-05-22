import { defineModel } from '../lib/sequelize'
import Sequelize from 'sequelize'

export const errorDB = defineModel('pss_error', {
  userId: {
    type: Sequelize.STRING,
    allowNull: true
  }, // 用户名
  requestURL: {
    type: Sequelize.STRING,
    allowNull: true
  }, // 请求url
  method: {
    type: Sequelize.STRING,
    allowNull: true
  }, // 请求方法
  clientIP: {
    type: Sequelize.STRING,
    allowNull: true
  }, // 客户端IP
  requestBody: {
    type: Sequelize.TEXT,
    allowNull: true
  }, // 请求体
  errorName: {
    type: Sequelize.STRING,
    allowNull: true
  }, // 错误名称
  errorMsg: {
    type: Sequelize.STRING,
    allowNull: true
  }, // 错误消息
  errorStack: {
    type: Sequelize.TEXT,
    allowNull: true
  }, // 错误堆栈
});

export const resDB = defineModel('pss_response', {
  userId: {
    type: Sequelize.STRING,
    allowNull: true
  }, // 用户名
  requestURL: {
    type: Sequelize.STRING,
    allowNull: true
  }, // 请求url
  method: {
    type: Sequelize.STRING,
    allowNull: true
  }, // 请求方法
  clientIP: {
    type: Sequelize.STRING,
    allowNull: true
  }, // 客户端IP
  requestBody: {
    type: Sequelize.TEXT,
    allowNull: true
  }, // 请求体
  status: {
    type: Sequelize.INTEGER,
    allowNull: true
  }, // status
  responseBody: {
    type: Sequelize.TEXT,
    allowNull: true
  }, // 请求体
})