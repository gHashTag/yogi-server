const { Query } = require('./Query')
const { Subscription } = require('./Subscription')
const { auth } = require('./Mutation/auth')
const { post } = require('./Mutation/post')
const { AuthPayload } = require('./AuthPayload')
const { TeacherAuthPayload } = require('./TeacherAuthPayload')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...post,
  },
  Subscription,
  TeacherAuthPayload,
  AuthPayload,
}
