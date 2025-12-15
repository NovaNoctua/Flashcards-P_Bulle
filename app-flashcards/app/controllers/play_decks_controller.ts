// import type { HttpContext } from '@adonisjs/core/http'

import Card from '#models/card'
import Deck from '#models/deck'
import { HttpContext } from '@adonisjs/core/http'

export default class PlayDecksController {
  /*
   * Play a deck
   */
  async play({ params, view, session, response }: HttpContext) {
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

    session.put('game', {
      deckId: deck.id,
      cardIndex: 0,
      side: 'question',
      stats: { right: 0, wrong: 0 },
    })

    return view.render('pages/decks/play.edge', {
      title: 'Jouer un deck',
      deck: deck,
    })
  }

  async currentCard({ session }: HttpContext) {
    const game = session.get('game')
    if (!game) {
      return {
        error: 'No game',
      }
    }

    const cards = await Card.query().where('deckId', game.deckId).orderBy('id')

    const card = cards[game.cardIndex]

    if (card) {
      return {
        side: game.side,
        question: card?.question,
        answer: card?.answer,
        index: game.cardIndex,
        stats: game.stats,
      }
    } else {
      return {
        finish: true,
      }
    }
  }

  async flip({ session }: HttpContext) {
    const game = session.get('game')
    if (!game) return { error: 'No game' }

    game.side = game.side === 'question' ? 'answer' : 'question'
    session.put('game', game)
    console.log(session.get('game.cardIndex'))

    return { side: game.side }
  }

  async next({ request, session }: HttpContext) {
    const game = session.get('game')
    if (!game) return { error: 'No game' }

    const isRight = request.input('right') === true

    if (isRight) {
      game.stats.right++
    } else {
      game.stats.wrong++
    }

    game.cardIndex++
    game.side = 'question'

    session.put('game', game)

    return { success: true }
  }
}
