import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

export const priceDB = defineModel('sp_price', {
    price: Sequelize.STRING,
    modelId: Sequelize.INTEGER,
    groupId: Sequelize.INTEGER,
    country: {
        type: Sequelize.INTEGER,
        get() {
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
});