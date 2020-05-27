const axios = require('axios')
const qs = require('qs')

function getRecentChallengesNotify (interval) {
  axios.get('https://api.topcoder.com/v4/challenges', { filter: 'status=ACTIVE', limit: 50, offset: 0 })
    .then(res => {
      const result = res.data.result
      if (result && result.success) {
        const now = Date.now()
        const newContents = result.content.filter(c => new Date(c.createdAt).getTime() + interval > now)
        if (newContents.length > 0) {
          const token = process.env.SLACK_BOT_TOKEN
          axios.get('https://slack.com/api/conversations.list', { token, types: 'im' }).then(res => {
            const args = {
              token,
              channel: res.data.channels.find(c => c.user === 'ULWCD57HD').id,
              text: `there are ${newContents.length} new challenges`,
              blocks: JSON.stringify(generateBlocks(newContents))
            }
            return axios.post('https://slack.com/api/chat.postMessage', qs.stringify(args))
          })
        }
      }
    }).catch(err => {
      console.error(err)
    })
}

function generateBlocks (contents) {
  return contents.flatMap(c => [{
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `<https://www.topcoder.com/challenges/${c.id}|${c.name}>\n - *Prize:$ ${c.totalPrize}*\n - *Technologies: ${c.technologies.join(', ')}*\n - *Type: ${c.subTrack}*`
    }
  }, { type: 'divider' }])
}

function getRecentChallengesView () {
  return axios.get('https://api.topcoder.com/v4/challenges', { filter: 'status=ACTIVE', limit: 50, offset: 0 })
    .then(res => JSON.stringify({
      type: 'home',
      title: {
        type: 'plain_text',
        text: 'Recent Challenges'
      },
      blocks: generateBlocks(res.data.result.content)
    }))
}

module.exports = {
  getRecentChallengesView,
  getRecentChallengesNotify
}
