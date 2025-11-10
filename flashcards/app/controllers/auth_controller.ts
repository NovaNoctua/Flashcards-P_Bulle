import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  /**
   * Creates an OAT token after validating user infos
   */
  async login({ request, response }: HttpContext) {
    // Validate data
    const { username, password } = await request.validateUsing(loginValidator)

    // Validate user exists in db
    const user = await User.verifyCredentials(username, password)

    // Creates OAT token
    const token = await User.accessTokens.create(user)

    // Returns token and user infos
    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }

  /*
   * Register a user
   */
  async register({ request, response }: HttpContext) {
    // Validates user infos
    const payload = await request.validateUsing(registerValidator)

    // Creates user
    const user = await User.create(payload)

    // Return user infos
    return response.created(user)
  }

  /*
   * Delete OAT token of connected user
   */
  async logout({ auth, response }: HttpContext) {
    // Get connected user
    const user = auth.getUserOrFail()

    // Get connected user's token
    const token = auth.user?.currentAccessToken.identifier

    // If no token, return error 404
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }

    // Delete token
    await User.accessTokens.delete(user, token)

    // Confirm to user that logout was a success
    return response.ok({ message: 'Logged out' })
  }
}
