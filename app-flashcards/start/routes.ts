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

router.get('/', [DecksController, 'index']).as('home')

// CRUD DECKS
router.get('/decks/:id/show', [DecksController, 'show']).as('deck.show')

router.delete('/decks/:id/destroy', [DecksController, 'destroy']).as('deck.destroy')

router.get('deck/add', [DecksController, 'create']).as('deck.create')
router.post('deck/add', [DecksController, 'store']).as('deck.store')

router.get('/deck/:id/edit', [DecksController, 'edit']).as('deck.edit')
router.post('/deck/:id/update', [DecksController, 'update']).as('deck.update')

// AUTHENTICATION
router
  .group(() => {
    router.post('register', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix('users')
