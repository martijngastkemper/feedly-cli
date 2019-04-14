const axios  = require('axios');

module.exports = class Feedly {

    constructor(access_token) {
        this.api =  axios.create({
            baseURL: 'https://cloud.feedly.com/v3',
            headers: {'Authorization': access_token} 
        });
    }

    listTags() {
        return this.api.get('/tags')
            .then(({ data }) => {
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
        return this.api.get('/profile');
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
        });
    };
}
