import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('Order', table => {
    table.increments('id').primary();
    table.string('description', 250).notNullable();
    table.integer('quantity', 11).nullable();
    table.integer('value', 11).nullable();
    table.integer('createdBy').nullable();

    table.dateTime('createdDate').notNullable();
    table.dateTime('updatedDate').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('Order');
}
