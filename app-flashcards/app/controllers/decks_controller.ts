import Card from '#models/card'
import Deck from '#models/deck'
import { deckValidator } from '#validators/deck'
import type { HttpContext } from '@adonisjs/core/http'

export default class DecksController {
  // Get the published deck
  async index({ view }: HttpContext) {
    const decks = await Deck.query()
      .where('isPublished', 1)
      .orderBy('createdAt', 'desc')
      .preload('user', (builder) => {
        builder.select('username')
      })

    return view.render('pages/home', { decks })
  }

  // Redirect to the create deck form page
  async create({ view }: HttpContext) {
    return view.render('pages/decks/create', { title: "Ajout d'un deck" })
  }

  // Create a deck
  async store({ request, session, response }: HttpContext) {
    // Informations of the new deck
    const { title } = await request.validateUsing(deckValidator)
    const userId = session.get('auth_web')

    // Create a deck
    const deck = await Deck.create({ title, isPublished: false, userId })

    // Successful message
    session.flash('success', 'Le nouveau deck a été ajouté avec succès !')

    // Redirect to create a card
    return response.redirect().toRoute('cards.create', deck)
  }

  // Gets the information of a deck and its cards
  async show({ params, view, session, response }: HttpContext) {
    // Information of the deck
    const deck = await Deck.query()
      .where('id', params.id)
      .preload('user', (builder) => {
        builder.select('username')
      })
      .first()

    if (!deck) {
      session.flash('error', "Un erreur est survenue, ce deck n'existe pas.")
      return response.redirect().toRoute('home')
    }

    // Cards of the deck
    const cards = await Card.query().where('deckId', params.id).orderBy('id', 'asc')

    const data = [deck, cards]

    // Show page
    return view.render('pages/decks/show.edge', { title: "Flashcards d'un deck", data })
  }

  // Render the edit deck page form
  async edit({ params, view }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    return view.render('pages/decks/edit.edge', {
      title: 'Modifier un deck',
      deck,
    })
  }

  // Update a deck
  async update({ params, request, session, response }: HttpContext) {
    // Deck informations
    const { title } = await request.validateUsing(deckValidator)
    const deck = await Deck.findOrFail(params.id ? params.id : params.deck_id)
    const userId = deck.userId
    const isPublished = deck.isPublished

    // Deck changes
    if (deck) {
      await deck.merge({ title, isPublished, userId }).save()
    }

    // Successful message
    session.flash('success', 'Le deck a été mis à jour avec succès !')

    // Redirect to show page of the deck
    return response.redirect().toRoute('deck.show', { id: deck.id })
  }

  // Delete a deck
  async destroy({ params, session, response }: HttpContext) {
    // Find deck to delete
    const deck = await Deck.findOrFail(params.id)

    // Delete the deck
    await deck.delete()

    // Successful message
    session.flash('success', 'Le deck a été supprimé avec succès !')

    // Redirect to the user's decks page
    return response.redirect().toRoute('userDecks.index', { user_id: session.get('auth_web') })
  }

  // Publish or depublish a deck
  async publish({ params, session, response }: HttpContext) {
    // Deck informations
    const deck = await Deck.findOrFail(params.id)
    let { title, isPublished, userId } = deck

    // Change the publish status
    isPublished = !isPublished

    // Save changes
    await deck.merge({ title, isPublished, userId }).save()

    // Successful message
    session.flash(
      'success',
      isPublished ? 'Le deck a été publié avec succès.' : 'Le deck a été mis en privé avec succès.'
    )

    return response.redirect().back()
  }
}
