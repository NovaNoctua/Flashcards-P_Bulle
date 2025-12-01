import Deck from '#models/deck'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class EnsureUserMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { auth, session, response, params } = ctx

    try {
      const deck = await Deck.findOrFail(params.id ? params.id : params.deck_id)
      const userId = deck.userId
      const isAuthenticated = await auth.check()
      if (!isAuthenticated || (auth.user?.id != userId && !auth.user?.isAdmin)) {
        session.flash(
          'error',
          "Vous devez avoir les droits admin ou être l'utilisateur en question pour accéder à cette page"
        )

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
