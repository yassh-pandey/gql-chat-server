'use strict';
const {Sequelize} = require("../models");
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING(20),
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      imageUrl: {
        type: DataTypes.STRING
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('users');
  }
};