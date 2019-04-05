import { defineModel } from '../lib/sequelize'
import Sequelize from 'sequelize'

//成色列表
export const volumeListDB = defineModel('pss_volume_list', {
  name: Sequelize.STRING,
  apply: {
    type: Sequelize.TEXT,
    allowNull: true
  },
});
