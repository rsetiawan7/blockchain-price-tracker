'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('blockchain_prices', [
      {
        name: 'Ethereum',
        contract_address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
        symbol: 'ETH',
        chain: 'bsc',
        exchange: 'bsc',
        price: 2000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Polygon',
        contract_address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        symbol: 'MATIC',
        chain: 'eth',
        exchange: 'eth',
        price: 0.37,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Bitcoin',
        contract_address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        symbol: 'WBTC',
        chain: 'eth',
        exchange: 'eth',
        price: 60639.75,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('blockchain_prices', {
      contract_address: {
        [Sequelize.Op.in]: [
          '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
          '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        ],
      },
    }, {});
  }
};
