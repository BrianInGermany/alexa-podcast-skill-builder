let PodcastPlayer

module.exports = {
  set PodcastPlayer (clazz) {
    PodcastPlayer = clazz
  },
  get PodcastPlayer () {
    return PodcastPlayer
  },
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request

    return request.type === 'IntentRequest' &&
      request.intent.name === 'RewindIntent'
  },
  async handle (handlerInput) {
    const attrs = handlerInput.attributesManager.getRequestAttributes()
    const t = attrs.t
    const podcast = new PodcastPlayer(handlerInput)

    if (!podcast.hasPlayingToken) {
      const speechText = t('SPEECH_PLAYER_STATE_IS_NOT_PLAYING')
      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse()
    }

    const skipMinutes = attrs.getSlotValueAsInt('skipMinutes')
    await podcast.rewind(skipMinutes)

    return podcast.response
      .speak(t('SPEECH_REWIND_X_MIN', { postProcess: 'sprintf', sprintf: { skipMinutes } }))
      .getResponse()
  }
}
