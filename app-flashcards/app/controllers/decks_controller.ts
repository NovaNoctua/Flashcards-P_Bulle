import Card from '#models/card'
import Deck from '#models/deck'
import { deckValidator } from '#validators/deck'
import type { HttpContext } from '@adonisjs/core/http'

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
  async create({ view }: HttpContext) {
    return view.render('pages/decks/create', { title: "Ajout d'un deck" })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, session, response }: HttpContext) {
    const { title } = await request.validateUsing(deckValidator)

    const userId = session.get('auth_web')

    const deck = await Deck.create({ title, isPublished: false, userId })

    session.flash('success', 'Le nouveau deck a été ajouté avec succès !')

    return response.redirect().toRoute('cards.create', deck)
  }

  /**
   * Show individual record
   */
  async show({ params, view, session, response }: HttpContext) {
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

    const cards = await Card.query().where('deckId', params.id).orderBy('id', 'asc')

    const data = [deck, cards]

    return view.render('pages/decks/show.edge', { title: "Flashcards d'un deck", data })
  }

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    return view.render('pages/decks/edit.edge', {
      title: 'Modifier un deck',
      deck,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, session, response }: HttpContext) {
    const { title } = await request.validateUsing(deckValidator)

    const deck = await Deck.findOrFail(params.id ? params.id : params.deck_id)

    const userId = deck.userId
    const isPublished = deck.isPublished

    if (deck) {
      await deck.merge({ title, isPublished, userId }).save()
    }

    session.flash('success', 'Le deck a été mis à jour avec succès !')

    return response.redirect().toRoute('deck.show', { id: deck.id })
  }

  /**
   * Delete record
   */
  async destroy({ params, session, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    await deck.delete()

    session.flash('success', 'Le deck a été supprimé avec succès !')

    return response.redirect().toRoute('userDecks.index', { user_id: session.get('auth_web') })
  }

  /*
   * Publish or depublish a deck
   */
  async publish({ params, session, response }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)
    let { title, isPublished, userId } = deck

    isPublished = !isPublished

    await deck.merge({ title, isPublished, userId }).save()

    session.flash(
      'success',
      isPublished ? 'Le deck a été publié avec succès.' : 'Le deck a été mis en privé avec succès.'
    )

    return response.redirect().back()
  }
}
