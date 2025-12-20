import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string().minLength(3).maxLength(16),
    password: vine.string().minLength(8).maxLength(256),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(3)
      .maxLength(16)
      .unique(async (query, field) => {
        const user = await query.from('users').where('username', field).first()
        return !user
      }),
    email: vine
      .string()
      .email()
      .unique(async (query, field) => {
        const mail = await query.from('users').where('email', field).first()
        return !mail
      }),
    password: vine.string().minLength(8).maxLength(256).confirmed(),
    firstname: vine.string().minLength(2).maxLength(50),
    lastname: vine.string().minLength(2).maxLength(50),
  })
)
