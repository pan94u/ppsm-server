import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

//企业采购表
const companyDB = defineModel('pss_company', {
    userId: Sequelize.STRING, //登记的用户名
    companyName: Sequelize.STRING, //企业名称
    companyContact: Sequelize.STRING, //企业联系人
    companyContactPhoneNumber: Sequelize.STRING, //企业联系人电话
    tradeMode: Sequelize.INTEGER, //交易方式
    model: Sequelize.STRING, //机型
    volume: Sequelize.STRING, //容量
    quality: Sequelize.STRING, //成色
    targetPrice: Sequelize.STRING, //期望价位
    num: Sequelize.INTEGER, //需求数量
});

export default companyDB