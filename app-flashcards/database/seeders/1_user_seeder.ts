import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        username: 'Nova',
        email: 'nova@gmail.com',
        password: 'novanova',
        firstname: 'Maël',
        lastname: 'Naudet',
        isAdmin: true,
        profilePicturePath: './',
      },
      {
        username: 'Owoox',
        email: 'owoox@gmail.com',
        password: 'owooxowoox',
        firstname: 'Alexandre',
        lastname: 'Jaeghers',
        isAdmin: false,
        profilePicturePath: './',
      },
    ])
  }
}
