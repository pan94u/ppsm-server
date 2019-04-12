import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

//二手求购表
export const shDB = defineModel('pss_second', {
    userId: Sequelize.STRING, //登记的用户名
    formId: Sequelize.BIGINT, //表单id
    model: Sequelize.STRING, //机型
    volume: Sequelize.STRING, //容量,
    quality: Sequelize.STRING, //成色
    targetPrice: Sequelize.STRING, //期望价位
    phoneNumber: Sequelize.STRING, //电话号码
    replyStatus:{
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: true
    }, //回复状态
    replyText: {
      type: Sequelize.STRING,
      allowNull: true
    } //回复内容
});
