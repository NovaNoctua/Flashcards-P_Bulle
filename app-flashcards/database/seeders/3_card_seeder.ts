import Card from '#models/card'
import Deck from '#models/deck'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const deckPays = await Deck.findBy('title', 'Pays du monde')
    const deckCapitales = await Deck.findBy('title', 'Capitales du monde')
    const deckEurope = await Deck.findBy('title', "Capitales d'Europe")

    if (deckPays) {
      await Card.createMany([
        {
          question: 'Quel pays est surnommé le pays du Soleil-Levant ?',
          answer: 'Japon',
          deckId: deckPays.id,
        },
        {
          question: 'Dans quel pays se trouve la ville de Tombouctou ?',
          answer: 'Mali',
          deckId: deckPays.id,
        },
        {
          question: 'Quel est le plus grand pays du monde par sa superficie ?',
          answer: 'Russie',
          deckId: deckPays.id,
        },
        {
          question: "Quel pays a une feuille d'érable sur son drapeau ?",
          answer: 'Canada',
          deckId: deckPays.id,
        },
      ])
    }

    if (deckCapitales) {
      await Card.createMany([
        {
          question: 'Quelle est la capitale de l’Australie ?',
          answer: 'Canberra',
          deckId: deckCapitales.id,
        },
        {
          question: 'Quelle est la capitale du Brésil ?',
          answer: 'Brasilia',
          deckId: deckCapitales.id,
        },
        {
          question: 'Quelle est la capitale du Canada ?',
          answer: 'Ottawa',
          deckId: deckCapitales.id,
        },
      ])
    }

    if (deckEurope) {
      await Card.createMany([
        {
          question: 'Quelle est la capitale de l’Espagne ?',
          answer: 'Madrid',
          deckId: deckEurope.id,
        },
        {
          question: 'Quelle est la capitale de l’Allemagne ?',
          answer: 'Berlin',
          deckId: deckEurope.id,
        },
        {
          question: 'Quelle est la capitale de l’Italie ?',
          answer: 'Rome',
          deckId: deckEurope.id,
        },
        {
          question: "Quelle est la capitale de l'Ukraine ?",
          answer: 'Kiev',
          deckId: deckEurope.id,
        },
      ])
    }
  }
}
