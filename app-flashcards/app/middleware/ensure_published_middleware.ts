import Deck from '#models/deck'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class EnsurePublishedMiddleware {
  // Ensure the deck is either published or the user is the owner of the deck
  async handle(ctx: HttpContext, next: NextFn) {
    const { auth, session, response, params } = ctx

    try {
      // Find the deck
      const deck = await Deck.findOrFail(params.id ? params.id : params.deck_id)
      const userId = deck.userId

      // Not the right user
      if (auth.user?.id !== userId && !auth.user?.isAdmin && !deck.isPublished) {
        session.flash('error', "Vous n'avez pas accès à ce deck")
        return response.redirect().toRoute('home')
      }
      // Right user
      await next()
    } catch (error) {
      console.error('Erreur dans EnsureAdminMiddleware :', error)

      session.flash('error', 'Une erreur est survenue')
      return response.redirect().toRoute('home')
    }
  }
}
