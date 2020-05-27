const express = require('express')
const bodyParser = require('body-parser')
const Parser = require('expr-eval').Parser
const { Translate } = require('@google-cloud/translate').v2
const axios = require('axios')
const qs = require('qs')
const { getRecentChallengesView, getRecentChallengesNotify } = require('./notification')
const app = express()
const port = process.env.PORT || 3000
const intervalTime = process.env.NOTIFY_INTERVAL || 600

const translate = new Translate({ projectId: process.env.projectId })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/slack/calculate', (req, res) => {
  res.send(Parser.evaluate(req.body.text).toString())
})

app.post('/slack/trans-to-en', (req, res) => {
  const text = req.body.text
  const resUrl = req.body.response_url
  res.send('')
  translate.translate(text, 'en')
    .then(enText => axios.post(resUrl, { text: enText[0] }))
    .catch(err => console.error(err))
})

app.post('/slack/events', (req, res) => {
  const { type, user } = req.body.event

  if (type === 'app_home_opened') {
    getRecentChallengesView().then(data => {
      const args = {
        token: process.env.SLACK_BOT_TOKEN,
        user_id: user,
        view: data
      }
      return axios.post('/views.publish', qs.stringify(args))
    }).catch(err => {
      console.error(err)
      res.send('Error').status(500).end()
    })
  }
})

app.get('/slack/auth', (req, res) => {
  res.sendFile('add_to_slack.html')
})

app.get('/slack/auth/redirect', (req, res) => {
  axios.post('https://slack.com/api/oauth.v2.access', qs.stringify({ code: req.query.code }), { auth: { username: process.env.CLIENT_ID, password: process.env.CLIENT_SECRET } })
    .then(response => {
      if (response.data.ok) {
        res.send('Success!')
      } else {
        res.send('Error encountered: \n' + JSON.stringify(response.data)).status(200).end()
      }
    })
    .catch(err => {
      console.error(err)
      res.send('Error').status(500).end()
    })
})

setInterval(getRecentChallengesNotify, parseInt(intervalTime) * 1000, parseInt(intervalTime) * 1000)

app.listen(port, () => console.log(`Example app listening at ${port}`))
