import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async handleLogin({ request, auth, session, response }: HttpContext) {
    const { username, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(username, password)

    await auth.use('web').login(user)

    session.flash('success', "L'utilisateur s'est connecté avec succès")

    return response.redirect().toRoute('home')
  }

  async handleLogout({ auth, session, response }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', "L'utilisateur s'est déconnecté avec succès")
    return response.redirect().toRoute('home')
  }

  async handleRegister({ request, session, response, i18n }: HttpContext) {
    const { username, email, password, firstname, lastname } = await request.validateUsing(
      registerValidator,
      {
        messagesProvider: i18n.createMessagesProvider(),
      }
    )

    const profilePicturePath = './'
    const isAdmin = false

    await User.create({
      username,
      email,
      password,
      firstname,
      lastname,
      profilePicturePath,
      isAdmin,
    })

    session.flash('success', 'Compte utilisateur créé avec succès.')

    return response.redirect().toRoute('login')
  }
}
