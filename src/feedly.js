
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
            .then(({ data }) => data)
        ;
    }),

    profile : mem(feedly => {
        return feedly.get('/profile');
    })
}
module.exports = feedly;
