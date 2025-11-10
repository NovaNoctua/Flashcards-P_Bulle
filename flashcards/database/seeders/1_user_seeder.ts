import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        username: 'Nova',
        email: 'nova@gmail.com',
        password: 'nova',
        firstname: 'Maël',
        lastname: 'Naudet',
        profilePicturePath: './',
      },
    ])
  }
}
