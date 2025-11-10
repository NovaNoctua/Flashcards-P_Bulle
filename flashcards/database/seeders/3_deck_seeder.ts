import Deck from '#models/deck'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Deck.createMany([
      {
        title: 'Pays du monde',
        isPublished: true,
        userId: 1,
      },
      {
        title: 'Capitales du monde',
        isPublished: true,
        userId: 1,
      },
      {
        title: "Capitales d'Europe",
        isPublished: false,
        userId: 1,
      },
    ])
  }
}
