import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

//回收记录表
export const rcDB = defineModel('pss_recovery', {
    userId: Sequelize.STRING, //登记的用户名
    model: Sequelize.STRING, //机型
    volume: Sequelize.INTEGER, //容量
    country: Sequelize.INTEGER, //国家
    display: Sequelize.INTEGER, //屏幕状况
    border: Sequelize.INTEGER, //边框状况
    warranty: Sequelize.INTEGER, //保修状况
    repairCase: Sequelize.INTEGER, //进水或拆修
    otherCase: Sequelize.STRING, //其他状况
    phoneNumber: Sequelize.STRING, //电话号码
});

export default rcDB