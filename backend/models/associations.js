// models/associations.js
import User from './User.js';
import Event from './Event.js';

export default function setupAssociations() {
  // User → много Events
  User.hasMany(Event, {
    foreignKey: 'createdBy',
    as: 'Events',
    onDelete: 'CASCADE', // если удалить пользователя — удаляются его события
  });

  // Event → один User (создатель)
  Event.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'Creator',
  });
}
