const { Model } = require('objection');
const Knex = require('knex');
const { development } = require('../../knexfile')

// Initialize knex.
const knex = Knex(development);

// Give the knex instance to objection.
Model.knex(knex);

module.exports = {
    Model,
    knex
};