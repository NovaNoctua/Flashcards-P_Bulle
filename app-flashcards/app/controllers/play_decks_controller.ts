// import type { HttpContext } from '@adonisjs/core/http'

import Card from '#models/card'
import Deck from '#models/deck'
import { HttpContext } from '@adonisjs/core/http'

export default class PlayDecksController {
  // Play a deck
  async play({ params, view, session, response }: HttpContext) {
    // Gets the right deck
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

    // Creates a session for the game
    session.put('game', {
      deckId: deck.id,
      cardIndex: 0,
      side: 'question',
      stats: { right: 0, wrong: 0 },
    })

    // Redirect for the play page
    return view.render('pages/decks/play.edge', {
      title: 'Jouer un deck',
      deck: deck,
    })
  }

  // Get the current card of the game
  async currentCard({ session }: HttpContext) {
    // Get the game session
    const game = session.get('game')
    if (!game) {
      return {
        error: 'No game',
      }
    }

    // Get all the cards
    const cards = await Card.query().where('deckId', game.deckId).orderBy('id')

    // Card needed
    const card = cards[game.cardIndex]

    // If there is a card return the current card
    if (card) {
      return {
        side: game.side,
        question: card?.question,
        answer: card?.answer,
        index: game.cardIndex,
      }
    }
    // Game is finished
    else {
      return {
        finish: true,
        stats: game.stats,
      }
    }
  }

  // Flip a card
  async flip({ session }: HttpContext) {
    // Get game session
    const game = session.get('game')
    if (!game) return { error: 'No game' }

    // Change the side of the card
    game.side = game.side === 'question' ? 'answer' : 'question'
    session.put('game', game)

    return { side: game.side }
  }

  // Get the next card and tells wether the player did the previous correctly or not
  async next({ request, session }: HttpContext) {
    // Game session
    const game = session.get('game')
    if (!game) return { error: 'No game' }

    // Correct input or not
    const isRight = request.input('right') === true
    if (isRight) {
      game.stats.right++
    } else {
      game.stats.wrong++
    }

    // Increase the card index (next card)
    game.cardIndex++
    game.side = 'question'

    session.put('game', game)

    return { success: true }
  }
}
