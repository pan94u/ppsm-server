import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

export const groupDB = defineModel('sp_group', {
    name: Sequelize.STRING,
    originText: Sequelize.STRING, //分组识别文字
    weight: Sequelize.INTEGER, //权重
    new: Sequelize.INTEGER, //新品标志
    hot: Sequelize.INTEGER, //热卖标志
});
