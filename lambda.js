const Feedly = require('./src/feedly.js');

if (process.env.SENTRY_DSN) {
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn: process.env.SENTRY_DSN });
}

let response;

exports.lambdaHandler = async (event, context) => {
    try {
        const api = Feedly.init(process.env.FEEDLY_ACCESS_KEY);
        if (event.path === '/status') {
            const profile = await Feedly.profile(api);
            const headers = profile.headers;
            response = {
                "statusCode": 200,
                'body': `Hi ${profile.data.givenName}, You've ${headers['x-ratelimit-limit'] - profile.headers['x-ratelimit-count']} calls left for the next ${Math.round(headers['x-ratelimit-reset'] / 360) / 10} hours.`
            };
        } else if (event.path === '/hello') {
            const tags = await Feedly.listTags(api);
            response = {
                'statusCode': 200,
                'body': JSON.stringify(tags)
            };
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
