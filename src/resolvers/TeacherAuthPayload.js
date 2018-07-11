const TeacherAuthPayload = {
  teacher: async ({ teacher: { facebookUserId } }, args, ctx, info) => {
    return ctx.db.query.teacher({ where: { facebookUserId } }, info)
  },
}

module.exports = { TeacherAuthPayload }
