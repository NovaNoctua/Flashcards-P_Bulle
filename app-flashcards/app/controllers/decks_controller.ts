import Card from '#models/card'
import Deck from '#models/deck'
import type { HttpContext } from '@adonisjs/core/http'
import { dd } from '@adonisjs/core/services/dumper'

export default class DecksController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const decks = await Deck.query()
      .where('isPublished', 1)
      .orderBy('createdAt', 'desc')
      .preload('user', (builder) => {
        builder.select('username')
      })

    return view.render('pages/home', { decks })
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const deck = await Deck.query()
      .where('id', params.id)
      .preload('user', (builder) => {
        builder.select('username')
      })
      .first()
    const cards = await Card.query().where('deckId', params.id).orderBy('id', 'asc')

    const data = [deck, cards]

    return view.render('pages/decks/show.edge', { title: "Flashcards d'un deck", data })
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, session, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    await deck.delete()

    session.flash('success', "L'enseignant a été supprimé avec succès !")

    return response.redirect().toRoute('home')
  }
}
