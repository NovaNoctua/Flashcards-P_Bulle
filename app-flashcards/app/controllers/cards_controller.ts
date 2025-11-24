import Card from '#models/card'
import Deck from '#models/deck'
import { cardValidator } from '#validators/card'
import type { HttpContext } from '@adonisjs/core/http'

export default class CardsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({ view, params }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    return view.render('pages/cards/create', { title: 'Ajouter des cartes', deck })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, params }: HttpContext) {
    const { question, answer } = await request.validateUsing(cardValidator)

    const deckId = params.id

    await Card.create({ deckId, question, answer })

    return response.redirect().toRoute('deck.show', { id: deckId })
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

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
  async destroy({ params }: HttpContext) {}
}
