import {defineModel} from '../lib/sequelize'
import Sequelize from 'sequelize'

//成色列表
export const qualityListDB = defineModel('pss_quality_list', {
    name: Sequelize.STRING,
    apply: {
      type: Sequelize.TEXT,
      allowNull: true
    },
});
