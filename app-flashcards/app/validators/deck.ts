import vine from '@vinejs/vine'

const deckValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(64),
    isPublished: vine.boolean(),
  })
)

export { deckValidator }
