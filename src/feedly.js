
const
    axios  = require('axios'),
    mem    = require('mem');

const feedly = {

    init : mem(access_token => {
        return axios.create({
            baseURL: 'https://cloud.feedly.com/v3',
            headers: {'Authorization': access_token} 
        });
    }),

    listTags : mem(feedly => {
        return feedly.get('/tags')
            .then(({ data }) => {
                data.map(labelData => {
                    if (labelData.id.includes('global.save')) {
                        labelData.label = 'Read later';
                    }
                    return data;
                });
                return data;
            })
        ;
    }),

    profile : mem(feedly => {
        return feedly.get('/profile');
    })
}
module.exports = feedly;
