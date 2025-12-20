import Deck from '#models/deck'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class EnsureUserMiddleware {
  // Make sure the connected user has the rights to access this content (either the complete owner of it or admin)
  async handle(ctx: HttpContext, next: NextFn) {
    const { auth, session, response, params } = ctx

    try {
      // Find the deck
      const deck = await Deck.findOrFail(params.id ? params.id : params.deck_id)
      const userId = deck.userId

      // Authenticated
      const isAuthenticated = await auth.check()

      // Unauthorized user
      if (!isAuthenticated || (auth.user?.id != userId && !auth.user?.isAdmin)) {
        session.flash(
          'error',
          "Vous devez avoir les droits admin ou être l'utilisateur en question pour accéder à cette page"
        )

        return response.redirect().toRoute('home')
      }
      // Authorized user
      await next()
    } catch (error) {
      console.error('Erreur dans EnsureAdminMiddleware :', error)

      session.flash('error', 'Une erreur est survenue')
      return response.redirect().toRoute('home')
    }
  }
}
