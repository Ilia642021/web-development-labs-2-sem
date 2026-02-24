import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

Event.belongsTo(User, { foreignKey: 'createdBy' });
User.hasMany(Event, { foreignKey: 'createdBy' });

export default Event;
