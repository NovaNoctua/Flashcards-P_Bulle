import Deck from '#models/deck'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class EnsurePublishedMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { auth, session, response, params } = ctx

    try {
      const deck = await Deck.findOrFail(params.id ? params.id : params.deck_id)
      const userId = deck.userId

      if (auth.user?.id !== userId && !auth.user?.isAdmin && !deck.isPublished) {
        session.flash('error', "Vous n'avez pas accès à ce deck")

        return response.redirect().toRoute('home')
      }

      await next()
    } catch (error) {
      console.error('Erreur dans EnsureAdminMiddleware :', error)

      session.flash('error', 'Une erreur est survenue')
      return response.redirect().toRoute('home')
    }
  }
}
