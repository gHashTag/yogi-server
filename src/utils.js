const jwt = require('jsonwebtoken')


function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization')
  let token = ''
  if (Authorization) {
    token = Authorization.replace('Bearer ', '')
  }

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET) 
    return userId
  }

  throw new AuthError()
}


function getTeacherId(ctx) {
  const Authorization = ctx.request.get('Authorization')
  let token = ''
  if (Authorization) {
    token = Authorization.replace('Bearer ', '')
  }

  if (token) {
    const { teacherId } = jwt.verify(token, process.env.APP_SECRET) 
    return teacherId
  }

  throw new AuthError()
}

const createTeacherToken = (teacherId) => {
  return jwt.sign({ teacherId, expiresIn: '7d' }, process.env.APP_SECRET)
}

class AuthError extends Error {
  constructor() {
    super('Авторизуйтесь!')
  }
}


module.exports = {
  createTeacherToken,
  getUserId,
  getTeacherId,
  AuthError
}
