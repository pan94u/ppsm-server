import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

//二手求购表
export const shDB = defineModel('pss_second', {
    userId: Sequelize.STRING, //登记的用户名
    model: Sequelize.STRING, //机型
    volume: Sequelize.STRING, //容量,
    quality: Sequelize.STRING, //成色
    targetPrice: Sequelize.STRING, //期望价位
    phoneNumber: Sequelize.STRING, //电话号码
    replyStatus: Sequelize.INTEGER, //回复状态
    replyText: Sequelize.STRING //回复内容
});
