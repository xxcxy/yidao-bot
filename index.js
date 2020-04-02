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
    .then(enText => axios.post(resUrl, { text: enText }))
    .catch(err => console.error(err))
})

app.listen(port, () => console.log(`Example app listening at ${port}`))
