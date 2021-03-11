'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     return queryInterface.bulkInsert('users', [
      {
        id: "695a1536-2d2c-47f3-8944-5d0d38c4aadc",
        userName: 'Yash.Science',
        email: 'yashpandey.science@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2fc8f1b8-c413-4776-b44c-d9b3018b1fd7",
        userName: 'HisCodeSmells',
        email: 'guptamanas1998@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkInsert('users', null, {});
  }
};
