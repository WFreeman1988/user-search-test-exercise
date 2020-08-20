const argv = require('minimist')(process.argv.slice(2));
const request = require("request-promise");
const chai = require('chai');

describe('Sorting User Search Results Via API', () => {
    it('Customer sorts viewed results field via ascending order', async () => {
        let options = {
            method: 'GET',
            url: `https://${argv.domain}/api/v2/users`,
            qs: {q: 'logins_count:[0 TO 5]', sort: 'created_at:1', search_engine: 'v3'},
            headers: {authorization: `Bearer ${argv.token}`},
            resolveWithFullResponse: true
        };

        let response = await request(options);
        console.log(`login range count search status code: ${response.statusCode}`);
        console.log(`login range count search body: ${response.body}`);
        chai.assert(response.statusCode == 200, "Status code returned from login range count search was not equal to 200");
        let bodyObj = JSON.parse(response.body);
        //chai.assert(bodyObj.name == updateUserInfo[0].name, "Name update was not reflected properly for user email search");
    });

    it('Customer sorts viewed results field via descending order', async () => {
        let options = {
            method: 'GET',
            url: `https://${argv.domain}/api/v2/users`,
            qs: {q: 'logins_count:[0 TO 5]', sort: 'created_at:-1', search_engine: 'v3'},
            headers: {authorization: `Bearer ${argv.token}`},
            resolveWithFullResponse: true
        };

        let response = await request(options);
        console.log(`login range count search status code: ${response.statusCode}`);
        console.log(`login range count search body: ${response.body}`);
        chai.assert(response.statusCode == 200, "Status code returned from login range count search was not equal to 200");
        let bodyObj = JSON.parse(response.body);
        //chai.assert(bodyObj.name == updateUserInfo[0].name, "Name update was not reflected properly for user email search");
    });
});