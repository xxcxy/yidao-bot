const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.post('/slack/calculate', (req, res) => {
    console.log(JSON.stringify(req.body))
    res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening at ${port}`))