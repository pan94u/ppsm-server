import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

//回收记录表
export const rcDB = defineModel('pss_recovery', {
    userId: Sequelize.STRING, //登记的用户名
    formId: Sequelize.BIGINT, //表单id
    model: Sequelize.STRING, //机型
    volume: Sequelize.STRING, //容量
    country: Sequelize.STRING, //国家
    display: Sequelize.STRING, //屏幕状况
    border: Sequelize.STRING, //边框状况
    warranty: Sequelize.STRING, //保修状况
    repairCase: Sequelize.STRING, //进水或拆修
    otherCase: Sequelize.STRING, //其他状况
    phoneNumber: Sequelize.STRING, //电话号码
    replyStatus:{
      type: Sequelize.INTEGER,
      allowNull: true
    }, //回复状态
    replyText: {
      type: Sequelize.STRING,
      allowNull: true
    } //回复内容
});

export default rcDB