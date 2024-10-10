'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('blockchain_prices', {
      id: {
        field: 'id',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        field: 'name',
        type: Sequelize.STRING,
        allowNull: false,
      },
      contractAddress: {
        field: 'contract_address',
        type: Sequelize.STRING,
        allowNull: false,
      },
      symbol: {
        field: 'symbol',
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      chain: {
        field: 'chain',
        type: Sequelize.STRING,
        allowNull: false,
      },
      exchange: {
        field: 'exchange',
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        field: 'price',
        type: Sequelize.DOUBLE,
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
    await queryInterface.dropTable('blockchain_prices');
  }
};
