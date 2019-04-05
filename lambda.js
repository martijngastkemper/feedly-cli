const Feedly = require('./src/feedly.js');

let response;

const getAccessToken = () => {
    return new Promise((resolve, reject) => {
        resolve(process.env.FEEDLY_ACCESS_KEY);
    });
};

exports.lambdaHandler = async (event, context) => {
    try {
        const api = Feedly.init(getAccessToken);
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
