const express = require('express')
const bodyParser = require('body-parser')
const Parser = require('expr-eval').Parser
const { Translate } = require('@google-cloud/translate').v2
const axios = require('axios')
const app = express()
const port = process.env.PORT || 3000

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

app.get('/slack/auth', (req, res) => {
  res.sendFile('add_to_slack.html')
})

app.get('/slack/auth/redirect', (req, res) => {
  const resUrl = `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}`
  axios.get(resUrl)
    .then(res => {
      if (res.data.ok) {
        res.send('Success!')
      } else {
        res.send('Error encountered: \n' + JSON.stringify(res.data)).status(200).end()
      }
    })
    .catch(() => res.send('Error').status(500).end())
})

app.listen(port, () => console.log(`Example app listening at ${port}`))
