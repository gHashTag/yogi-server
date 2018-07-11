const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createTeacherToken, getTeacherId } = require('../../utils')

const auth = {
  async refreshTeacherToken(parent, { token }, ctx, info) {
    const teacherId = await getTeacherId(ctx, token) 
    return createTeacherToken(teacherId) 
  },

  async signupTeacher(parent, args, ctx, info) {
    const teacher = await ctx.db.mutation.createTeacher({
      data: { ...args },
    })

    return {
      token: createTeacherToken(teacher.id),
      teacher,
    }
  },

  async loginTeacher(parent, { facebookUserId }, ctx, info) {
    const teacher = await ctx.db.query.teacher({ where: { facebookUserId } })
    if (!teacher) {
      return {
        error: {
          field: 'facebookUserId',
          msg: 'No user found'
        }
      }
    }

    return {
      payload: {
        token: createTeacherToken(teacher.id),
        teacher 
      }
    }

  },

  async updateTeacher(parent, { facebookUserId, gender, name, text }, ctx, info) {
    const teacher = await ctx.db.query.teacher({ where: { facebookUserId } })
    if (!teacher) {
      return {
        error: {
          field: 'facebookUserId',
          msg: 'No user found'
        }
      }
    }

    return ctx.db.mutation.updateTeacher(
      {
        where: { facebookUserId },
        data: {
          gender,
          name,
          text,
        }
      },
      info,
    )
  },

  async signup(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: { ...args, password },
    })

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },

  async login(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      throw new Error(`No such user found for email: ${email}`)
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },
}

module.exports = { auth }
