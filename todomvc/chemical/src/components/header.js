'use strict';

var
    component = require('componently');

var
    templates = require('../templates');

module.exports = function (data) {
    this.template = templates['templates/header.html'];
    component.call(this, data);
};