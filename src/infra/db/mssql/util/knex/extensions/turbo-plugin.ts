import k, { Knex } from 'knex';

const ALlOWED_DRIVERS = ['MSSQL'];

function getCurrentDrive(config: Knex.Config) {
  return String(config.client).toUpperCase();
}

export function turboPlugin(knex: typeof k) {
  knex.QueryBuilder.extend('turbo', function () {
    if (!ALlOWED_DRIVERS.includes(getCurrentDrive(this.client.config)))
      return this;

    this._turbo = true;

    return this;
  });

  return knex;
}