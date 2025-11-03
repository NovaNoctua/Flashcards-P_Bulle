import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // PK
      table.increments('id')

      // Attributs
      table.string('question')
      table.string('answer')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // FK
      table
        .integer('deck_id')
        .unsigned()
        .references('id')
        .inTable('decks')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
