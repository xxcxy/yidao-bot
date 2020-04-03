# YIDAO Bot

YIDAO bot is a learning project to familiar with slack apps!

This is a lightweight bot that can handle translate to english and calcualte number.

## Features
To translate :  
`/trans-to-en 一些非英语国家的语言`

To calculate number :  
`/calculate 5 * 40 + 80 / 2`

## LOCAL DEPLOYMENT

### Configurate enviroment

* CLIENT_ID // `the slack app client_id`
* CLIENT_SECRET // `the slack app client_secret`
* GOOGLE_APPLICATION_CREDENTIALS // `the google api key json location`
* projectId // `the google translate project id`

### Start server

```
npm install
npm start
```

## Usage

### Integrating into Team
Clicking [this link](https://slack.com/oauth/v2/authorize?client_id=697171562659.1043256071556&scope=commands) to authorize the app for your team.

The [Slack App Documentation](https://api.slack.com/apps) is a great resource here.
