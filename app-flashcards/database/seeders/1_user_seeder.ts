import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        username: 'mael',
        email: 'nova@gmail.com',
        password: 'testtest',
        firstname: 'Maël',
        lastname: 'Naudet',
        isAdmin: true,
        profilePicturePath: './',
      },
      {
        username: 'rayan',
        email: 'owoox@gmail.com',
        password: 'testtest',
        firstname: 'Alexandre',
        lastname: 'Jaeghers',
        isAdmin: false,
        profilePicturePath: './',
      },
      {
        id: 321321,
        username: 'brendan',
        email: 'nova2@gmail.com',
        password: 'testtest',
        firstname: 'Maël',
        lastname: 'Naudet',
        isAdmin: false,
        profilePicturePath: './',
      },
    ])
  }
}
