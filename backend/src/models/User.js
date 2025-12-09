import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  alias: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: {
        msg: "Debe ser un email válido"
      },
      notEmpty: false // Permitir string vacío
    }
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  foto: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: null
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Users',
  timestamps: true
});

// Método para comparar contraseñas
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.contraseña);
};

// No incluir contraseña y refreshToken en las respuestas JSON
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.contraseña;
  delete values.refreshToken;
  return values;
};

export default User;
