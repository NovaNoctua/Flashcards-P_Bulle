import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'decks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // PK
      table.increments('id')

      // Attributes
      table.string('title').notNullable().unique()
      table.boolean('is_published').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // FK
      // Relation : 1 deck -> 1 user
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .unique()
        .notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
