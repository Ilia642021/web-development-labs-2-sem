import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: { isDate: true },
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Зависимости перенесены в models/associations.js, для избежания циклической зависимости

export default Event;
