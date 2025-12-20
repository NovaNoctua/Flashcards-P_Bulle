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
  async store({ request, response, params, session }: HttpContext) {
    const { question, answer } = await request.validateUsing(cardValidator)

    const deckId = params.id

    await Card.create({ deckId, question, answer })

    session.flash('success', 'La nouvelle carte a été ajouté avec succès !')

    return response.redirect().toRoute('deck.show', { id: deckId })
  }

  /**
   * Show individual record
   */
  async show({}: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const card = await Card.findOrFail(params.card_id)
    const deck = await Deck.findOrFail(params.deck_id)

    return view.render('pages/cards/edit.edge', { card, deck })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const { question, answer } = await request.validateUsing(cardValidator)

    const deckId = params.deck_id

    const card = await Card.findOrFail(params.card_id)

    if (card) {
      await card.merge({ question, answer, deckId }).save()
    }

    return response.redirect().toRoute('deck.show', { id: deckId })
  }

  /**
   * Delete record
   */
  async destroy({ params, session, response }: HttpContext) {
    const card = await Card.findOrFail(params.card_id)

    await card.delete()

    session.flash('success', 'La carte a été supprimée avec succès !')

    return response.redirect().toRoute('deck.show', { id: params.deck_id })
  }
}
