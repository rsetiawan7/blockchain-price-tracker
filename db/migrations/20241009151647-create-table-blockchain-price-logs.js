'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('blockchain_price_logs', {
      id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      blockchainPriceId: {
        field: 'blockchain_price_id',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        field: 'price',
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      appliedAt: {
        field: 'applied_at',
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('blockchain_price_logs');
  }
};
