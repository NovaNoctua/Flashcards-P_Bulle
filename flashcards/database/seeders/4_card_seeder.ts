import { CardFactory } from '#database/factories/card_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await CardFactory.createMany(100)
  }
}
