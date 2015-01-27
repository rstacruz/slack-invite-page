# Deprecated

Use this instead: https://github.com/rauchg/slackin

### Slack integration

Configure an "Incoming Webhook" (team admin > integrations > incoming webhooks)
and copy the "Webhook URL" field. You'll need this for the config

    https://<team>.slack.com/services/new/incoming-webhook

### Dev setup

    cp env.sample .env
    vi .env
    npm start

### Prod setup (via heroku)

    heroku create
    heroku config:set WEBHOOK_URL="https://hooks.slack.com/..."
    #... see env.sample for the rest of the options
