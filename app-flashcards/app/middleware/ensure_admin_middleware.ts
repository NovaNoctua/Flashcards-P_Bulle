import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class EnsureAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { auth, session, response } = ctx

    try {
      const isAuthenticated = await auth.check()
      if (!isAuthenticated || !auth.user?.isAdmin) {
        session.flash('error', 'Vous devez avoir les droits admin pour accéder à cette page')

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
