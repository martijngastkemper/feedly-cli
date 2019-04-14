const axios  = require('axios'),
    { IncomingWebhook } = require('@slack/webhook')
;
const webhook = new IncomingWebhook(process.env.SLACK_FEEDLY_USAGE);

module.exports = class Feedly {

    constructor(access_token) {
        this.api =  axios.create({
            baseURL: 'https://cloud.feedly.com/v3',
            headers: {'Authorization': access_token}
        });
    }

    notifySlack(feedlyResponse) {
        const headers = feedlyResponse.headers;
        const text = `You've ${headers['x-ratelimit-limit'] - headers['x-ratelimit-count']} calls left for the next ${Math.round(headers['x-ratelimit-reset'] / 360) / 10} hours.`;
        return new Promise((resolve, reject) => {
            (async () => {
                await webhook.send({
                    text: text
                });
                resolve(feedlyResponse);
            })();
        });
    }

    listTags() {
        return this.api.get('/tags')
            .then(this.notifySlack)
            .then(({data}) => {
                data.map(labelData => {
                    if (labelData.id.includes('global.save')) {
                        labelData.label = 'Read later';
                    }
                    return data;
                });
                return data;
            }) ;
    }

    profile() {
        return this.api.get('/profile')
            .then(this.notifySlack);
    }

    createTag(tagId) {
        return {id: tagId};
    }

    post(url, tags, title, description) {
        return this.api.post('/entries', {
            tags: tags.map(this.createTag), 
            alternate: [
                {
                    href: url,
                    type: 'text/html'
                }
            ],
            origin: {
                "title": title,
                "htmlUrl": url
            },
            title: title,
            description: description
        }).then(this.notifySlack);
    };
}
