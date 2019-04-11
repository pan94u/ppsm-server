import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

//企业采购表
const companyDB = defineModel('pss_company', {
    userId: Sequelize.STRING, //登记的用户名
    formId: Sequelize.BIGINT, //表单id
    companyName: Sequelize.STRING, //企业名称
    companyContact: Sequelize.STRING, //企业联系人
    companyContactPhoneNumber: Sequelize.STRING, //企业联系人电话
    tradeMode: Sequelize.INTEGER, //交易方式
    model: Sequelize.STRING, //机型
    volume: Sequelize.STRING, //容量
    quality: Sequelize.STRING, //成色
    targetPrice: Sequelize.STRING, //期望价位
    num: Sequelize.INTEGER, //需求数量
    replyStatus:{
      type: Sequelize.INTEGER,
      allowNull: true
    }, //回复状态
    replyText: {
      type: Sequelize.STRING,
      allowNull: true
    } //回复内容
});

export default companyDB