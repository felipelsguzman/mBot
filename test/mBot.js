'use strict';

const run = require('ava');
const test = require('unit.js');
const mBot = require('../src/mBot');

run('checkProperties', () => {

    test.object(mBot)
        .hasOwnProperty('graphApiVersion')
        .hasOwnProperty('fbPageAccessToken');

});