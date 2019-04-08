const Feedly = require('./src/feedly.js');

if (process.env.SENTRY_DSN) {
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn: process.env.SENTRY_DSN });
}

let response;

exports.lambdaHandler = async (event, context) => {
    try {
        const api = Feedly.init(process.env.FEEDLY_ACCESS_KEY);
        const tags = await Feedly.listTags(api);
        response = {
            'statusCode': 200,
            'body': JSON.stringify(tags)
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
