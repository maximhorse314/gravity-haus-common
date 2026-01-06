'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const tableName = 'Subscription'
      await queryInterface.describeTable(tableName)
    } catch (e) {
      
      await queryInterface.createTable('Subscription', {

        
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        displayName: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        displayValue: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        displayValueCondition: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        displayValueInfo: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        displayInstruction: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        stripePlanId: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        stripePlanCurrentCoupon: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        stripePlanReferralCoupon: {
          allowNull: false,
          type: Sequelize.STRING,
        },

        autoApprove: {
          allowNull: false,
          type: Sequelize.NUMBER,
        },
        serviceId: {
          allowNull: false,
          type: Sequelize.NUMBER,
        },
        productId: {
          allowNull: false,
          type: Sequelize.NUMBER,
        },
        subscriptionTypeId: {
          allowNull: false,
          type: Sequelize.NUMBER,
        },
      });
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.dropTable('Subscription');
    } catch (e) {
      console.log('no table')
    }
  }
};
