'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const tableName = 'Audit'
      await queryInterface.describeTable(tableName)
    } catch (e) {
      await queryInterface.createTable('Audit', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        modelId: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        modelName: {
          allowNull: false,
          type: Sequelize.STRING
        },
        values: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        changedValues: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('NOW()'),
        },
      });
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.dropTable('Audit');
    } catch (e) {
      console.log('no table')
    }
  }
};
