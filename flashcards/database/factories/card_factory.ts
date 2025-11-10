import factory from '@adonisjs/lucid/factories'
import Card from '#models/card'
import Deck from '#models/deck'

export const CardFactory = factory
  .define(Card, async ({ faker }) => {
    const question = faker.person.firstName()
    const answer = faker.person.lastName()
    const deckIds = (await Deck.all()).map((u) => u.id)
    return {
      question: question,
      answer: answer,
      deckId: faker.helpers.arrayElement(deckIds),
    }
  })
  .build()
