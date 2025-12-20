import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  // Login function
  async handleLogin({ request, auth, session, response }: HttpContext) {
    // Get informations provided
    const { username, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(username, password)

    // Create a session for the user
    await auth.use('web').login(user)

    // Successful message
    session.flash('success', "L'utilisateur s'est connecté avec succès")

    return response.redirect().toRoute('home')
  }

  // Logout function
  async handleLogout({ auth, session, response }: HttpContext) {
    // Deletes the session
    await auth.use('web').logout()

    // Successful message
    session.flash('success', "L'utilisateur s'est déconnecté avec succès")

    return response.redirect().toRoute('home')
  }

  // Register function
  async handleRegister({ request, session, response }: HttpContext) {
    // Gets information provided
    const { username, email, password, firstname, lastname } =
      await request.validateUsing(registerValidator)

    // Default options that cannot be changed atm
    const profilePicturePath = './'
    const isAdmin = false

    // Creates a user
    await User.create({
      username,
      email,
      password,
      firstname,
      lastname,
      profilePicturePath,
      isAdmin,
    })

    // Successful message
    session.flash('success', 'Compte utilisateur créé avec succès.')

    // Redirect to login
    return response.redirect().toRoute('login')
  }
}
