'use strict';

const EventEmitter = require('events');

module.exports = Object.setPrototypeOf({
    graphApiVersion: null,
    fbPageAccessToken: null,
}, EventEmitter.prototype);

