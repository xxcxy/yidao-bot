const { createEventAdapter } = require('@slack/events-api')
const { WebClient } = require('@slack/web-api')
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET
const slackEvents = createEventAdapter(slackSigningSecret)
const port = process.env.PORT || 3000
const token = process.env.SLACK_TOKEN

const web = new WebClient(token)
slackEvents.on('message', async (event) => {
  console.log(JSON.stringify(event))
  await web.chat.postMessage({
    text: 'Hello world!',
    channel: event.channel
  })
})

// All errors in listeners are caught here. If this weren't caught, the program would terminate.
slackEvents.on('error', (error) => {
  console.log(error.name) // TypeError
});

(async () => {
  const server = await slackEvents.start(port)
  console.log(`Listening for events on ${server.address().port}`)
})()
