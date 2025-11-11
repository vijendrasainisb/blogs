'use strict';

/**
 * blog controller changes
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog.blog');
