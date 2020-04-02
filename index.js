const express = require('express')
const bodyParser = require('body-parser')
const Parser = require('expr-eval').Parser
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/slack/calculate', (req, res) => {
    console.log(JSON.stringify(req.body))
    res.send(Parser.evaluate(req.body.text).toString())
})

app.listen(port, () => console.log(`Example app listening at ${port}`))