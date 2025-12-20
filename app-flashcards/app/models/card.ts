import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Deck from './deck.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Card extends BaseModel {
  // Attributes
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare question: string

  @column()
  declare answer: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Foreign keys
  @column()
  declare deckId: number

  // Relations
  @belongsTo(() => Deck)
  declare deck: BelongsTo<typeof Deck>
}
