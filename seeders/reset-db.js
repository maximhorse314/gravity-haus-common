'use strict';

const exec = require('node-async-exec');


module.exports = {
  async up (queryInterface) {
    const copyDev = 'mysql --host=127.0.0.1 --port=3305 -uroot -ppassword gh_quiver_develop < ./seeders/schema.sql'
    const copyTest = 'mysql --host=127.0.0.1 --port=3305 -uroot -ppassword gh_quiver_test < ./seeders/schema.sql'

    try {
      await exec({ cmd: copyDev })
      await exec({ cmd: copyTest })
    } catch (err) {
      console.log(err);
    }
  },

  down: (queryInterface, Sequelize) => {
    console.log('No Down')
  }
};
