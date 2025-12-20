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
import CardsController from '#controllers/cards_controller'
import UserDecksController from '#controllers/user_decks_controller'
import PlayDecksController from '#controllers/play_decks_controller'

// DECKS ------------------------------
// Create
router.get('decks/add', [DecksController, 'create']).as('deck.create').use(middleware.auth())
router.post('decks/add', [DecksController, 'store']).as('deck.store').use(middleware.auth())

// Read
router.get('/', [DecksController, 'index']).as('home')
router
  .get('/decks/:id/show', [DecksController, 'show'])
  .as('deck.show')
  .use(middleware.ensurePublished())

// Update
router
  .get('/decks/:id/edit', [DecksController, 'edit'])
  .as('deck.edit')
  .use(middleware.ensureUser())
router
  .post('/decks/:id/update', [DecksController, 'update'])
  .as('deck.update')
  .use(middleware.ensureUser())

// Delete
router
  .delete('/decks/:id/destroy', [DecksController, 'destroy'])
  .as('deck.destroy')
  .use(middleware.ensureUser())

// Publish deck
router
  .put('/decks/:id/publish', [DecksController, 'publish'])
  .as('deck.publish')
  .use(middleware.ensureUser())

// All user's decks
router
  .get('/users/decks', [UserDecksController, 'index'])
  .as('userDecks.index')
  .use(middleware.auth())

// PLAY DECK --------------------------
router
  .get('/decks/:id/play', [PlayDecksController, 'play'])
  .as('deck.play')
  .use(middleware.auth())
  .use(middleware.ensurePublished())

router
  .get('/deck/:id/play/current', [PlayDecksController, 'currentCard'])
  .as('deck.current')
  .use(middleware.auth())
  .use(middleware.ensurePublished())

router
  .get('/decks/:id/play/flip', [PlayDecksController, 'flip'])
  .as('deck.flip')
  .use(middleware.auth())
  .use(middleware.ensurePublished())

router
  .post('/decks/:id/play/next', [PlayDecksController, 'next'])
  .as('deck.next')
  .use(middleware.auth())
  .use(middleware.ensurePublished())

// CARDS
// Create
router
  .get('decks/:id/cards/add', [CardsController, 'create'])
  .as('cards.create')
  .use(middleware.ensureUser())
router
  .post('decks/:id/cards/add', [CardsController, 'store'])
  .as('cards.store')
  .use(middleware.ensureUser())

// Update
router
  .get('/decks/:deck_id/cards/:card_id/edit', [CardsController, 'edit'])
  .as('cards.edit')
  .use(middleware.ensureUser())
router
  .post('/decks/:deck_id/cards/:card_id/edit', [CardsController, 'update'])
  .as('cards.update')
  .use(middleware.ensureUser())

// Destroy
router
  .delete('/decks/:deck_id/cards/:card_id/destroy', [CardsController, 'destroy'])
  .as('cards.destroy')
  .use(middleware.ensureUser())

// AUTHENTICATION
router
  .get('/login', ({ view }: HttpContext) => {
    return view.render('pages/login', { title: 'Se connecter' })
  })
  .as('login')
router.post('/login', [AuthController, 'handleLogin']).as('auth.handleLogin')
router.post('/logout', [AuthController, 'handleLogout']).as('auth.handleLogout')
router
  .get('/register', ({ view }: HttpContext) => {
    return view.render('pages/register', { title: 'Créer un compte' })
  })
  .as('register')
router.post('/register', [AuthController, 'handleRegister']).as('auth.handleRegister')

// ERRORS
// router
//   .get('/error', ({ view }: HttpContext) => {
//     return view.render('pages/errors/not_found')
//   })
//   .as('error.notFound')
