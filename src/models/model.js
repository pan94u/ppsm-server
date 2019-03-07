import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

export const modelDB = defineModel('sp_model', {
    groupId: Sequelize.INTEGER,
    name: Sequelize.STRING,
    color: Sequelize.STRING,
    country: {
        type: Sequelize.INTEGER,
        get() {
            if(!this.getDataValue('country')) {return} //使用get()后，左连接查询时，字段必现并取到undefined
            switch (this.getDataValue('country')) {
                case 1:
                    return '国行'
                    break
                case 2:
                    return '港行'
                    break
                default:
                    return '未知版本'
            }
        }
    },
    chartsUrl: Sequelize.STRING, //趋势图链接
    originText: Sequelize.STRING //型号识别文字
});