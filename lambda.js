const Feedly = require('./src/feedly.js');

if (process.env.SENTRY_DSN) {
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn: process.env.SENTRY_DSN });
}

let response = {};

exports.lambdaHandler = async (event, context) => {
    try {
        const api = new Feedly(process.env.FEEDLY_ACCESS_KEY);
        if (event.path === '/status') {
            const profile = await api.profile();
            const headers = profile.headers;
            response = {
                "statusCode": 200,
                'body': `Hi ${profile.data.givenName}, You've ${headers['x-ratelimit-limit'] - headers['x-ratelimit-count']} calls left for the next ${Math.round(headers['x-ratelimit-reset'] / 360) / 10} hours.`
            };
        } else if (event.path === '/labels') {
            const tags = await api.listTags();
            response = {
                'statusCode': 200,
                'body': JSON.stringify(tags)
            };
        } else if (event.path === '/read-later') {
            const body = JSON.parse(event.body);
            const url = body.url;

            const tagList = await api.listTags();
            const readLaterTag = tagList.find(({label}) => label === "Read later");
            const result = await api.post(url, [readLaterTag.id], "title", "description");
            response = {
                'statusCode': 200,
                'body': "Klaar!"
            };
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
