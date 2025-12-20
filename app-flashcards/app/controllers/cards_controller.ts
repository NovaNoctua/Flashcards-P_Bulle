import Card from '#models/card'
import Deck from '#models/deck'
import { cardValidator } from '#validators/card'
import type { HttpContext } from '@adonisjs/core/http'

export default class CardsController {
  // Redirect to the card add form page
  async create({ view, params }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    return view.render('pages/cards/create', { title: 'Ajouter des cartes', deck })
  }

  // Add a card in a deck
  async store({ request, response, params, session }: HttpContext) {
    // Information of the card
    const { question, answer } = await request.validateUsing(cardValidator)
    const deckId = params.id

    // Create card
    await Card.create({ deckId, question, answer })

    // Successful message
    session.flash('success', 'La nouvelle carte a été ajouté avec succès !')

    // Redirect
    return response.redirect().toRoute('deck.show', { id: deckId })
  }

  // Edit form page
  async edit({ params, view }: HttpContext) {
    const card = await Card.findOrFail(params.card_id)
    const deck = await Deck.findOrFail(params.deck_id)

    return view.render('pages/cards/edit.edge', { card, deck })
  }

  // Edit a card
  async update({ params, request, response }: HttpContext) {
    // Information of the edited card
    const { question, answer } = await request.validateUsing(cardValidator)
    const deckId = params.deck_id

    // Card to edit
    const card = await Card.findOrFail(params.card_id)

    // Edit the card
    if (card) {
      await card.merge({ question, answer, deckId }).save()
    }

    sessionStorage.flash('success', 'La carte a été modifiée avec succès !')

    // Redirect
    return response.redirect().toRoute('deck.show', { id: deckId })
  }

  // Delete a card
  async destroy({ params, session, response }: HttpContext) {
    // Find the right card
    const card = await Card.findOrFail(params.card_id)

    // Delete the card
    await card.delete()

    // Successful message
    session.flash('success', 'La carte a été supprimée avec succès !')

    // Redirect
    return response.redirect().toRoute('deck.show', { id: params.deck_id })
  }
}
