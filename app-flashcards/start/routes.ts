/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import DecksController from '#controllers/decks_controller'
import { HttpContext } from '@adonisjs/core/http'

// CRUD DECKS
// Create
router
  .get('deck/add', [DecksController, 'create'])
  .as('deck.create')
  .use(middleware.auth())
  .use(middleware.ensureAdmin())
router
  .post('deck/add', [DecksController, 'store'])
  .as('deck.store')
  .use(middleware.auth())
  .use(middleware.ensureAdmin())

// Read
router.get('/', [DecksController, 'index']).as('home')
router.get('/decks/:id/show', [DecksController, 'show']).as('deck.show')

// Update
router
  .get('/deck/:id/edit', [DecksController, 'edit'])
  .as('deck.edit')
  .use(middleware.auth())
  .use(middleware.ensureAdmin())
router
  .post('/deck/:id/update', [DecksController, 'update'])
  .as('deck.update')
  .use(middleware.auth())

// Delete
router
  .delete('/decks/:id/destroy', [DecksController, 'destroy'])
  .as('deck.destroy')
  .use(middleware.auth())
  .use(middleware.ensureAdmin())

// AUTHENTICATION
router
  .get('/login', ({ view }: HttpContext) => {
    return view.render('pages/login', { title: 'Se connecter' })
  })
  .as('login')
router.post('/login', [AuthController, 'handleLogin']).as('auth.handleLogin')
router.post('/logout', [AuthController, 'handleLogout']).as('auth.handleLogout')
