import vine from '@vinejs/vine'

const cardValidator = vine.compile(
  vine.object({
    question: vine.string().minLength(3).maxLength(256),
    answer: vine.string().minLength(3).maxLength(1024),
  })
)

export { cardValidator }
