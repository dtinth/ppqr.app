module.exports = {
  async wrapAction(step, execute, state, context) {
    try {
      return await execute()
    } catch (e) {
      try {
        require('mkdirp').sync('e2e/error-shots')
        await require('taiko').screenshot({
          path: 'e2e/error-shots/' + Date.now() + '.png',
        })
      } catch (eee) {
        console.error(eee)
      }
      throw e
    }
  },
}
