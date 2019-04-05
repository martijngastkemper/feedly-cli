
const
    axios  = require('axios'),
    mem    = require('mem');

const feedly = {

    init : mem((getAccessToken) => {
        return getAccessToken()
            .then(access_token => {
                return axios.create({
                    baseURL: 'https://cloud.feedly.com/v3',
                    headers: {'Authorization': access_token} 
                });
            });
    }),


    listTags : mem((feedly) => {
        return feedly 
            .then(feedly => feedly.get('/tags'))
            .then(({ data }) => data)
        ;
    })



}
module.exports = feedly;
