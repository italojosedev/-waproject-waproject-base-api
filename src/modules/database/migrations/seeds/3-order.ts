import * as Knex from 'knex';
import { IOrder } from 'modules/database/interfaces/order';

export async function seed(knex: Knex): Promise<void> {
  const order1: IOrder = {
    description: 'First order',
    quantity:1,
    value:1,
    createdBy:1,
    createdDate: new Date(),
    updatedDate: new Date()
  };

  const order = await knex
    .count()
    .from('Order')
    .first();

  if (Number(order.count) > 0) return;

  await knex.insert(order1).into('Order');
}
