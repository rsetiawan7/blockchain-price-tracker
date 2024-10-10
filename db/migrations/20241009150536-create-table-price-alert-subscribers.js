'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('price_alert_subscribers', {
      id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        field: 'email',
        type: Sequelize.STRING,
        allowNull: false,
      },
      chain: {
        field: 'chain',
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        field: 'price',
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      hasAlerted: {
        field: 'has_alerted',
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('price_alert_subscribers');
  }
};
