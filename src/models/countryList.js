import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

//国家列表
export const countryListDB = defineModel('pss_country_list', {
    name: Sequelize.STRING,
    apply: {
      type: Sequelize.TEXT,
      allowNull: true
    },
});
