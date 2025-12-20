import Deck from '#models/deck'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserDecksController {
  // Display the decks of the connected user
  async index({ view, session }: HttpContext) {
    // Get the decks of the connected user
    const decks = await Deck.query()
      .where('userId', session.get('auth_web'))
      .orderBy('createdAt', 'asc')

    return view.render('pages/decks/user', { decks, title: 'Liste de vos decks' })
  }
}
