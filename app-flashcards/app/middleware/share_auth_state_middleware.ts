import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ShareAuthStateMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { auth, view } = ctx

    try {
      const isAuthenticated = await auth.check()

      view.share({ isAuthenticated })
    } catch (error) {
      console.log(error)
      view.share({ isAuthenticated: false })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    await next()
  }
}
