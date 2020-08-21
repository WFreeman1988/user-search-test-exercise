const chai = require('chai');
const userSearch = require('../util/requestHandler').userSearch;

describe('Sorting User Search Results Via API', () => {
    it('Customer sorts viewed results field via ascending order', async () => {
        let query = {
            q: 'logins_count:[0 TO 5]',
            sort: 'created_at:1',
            search_engine: 'v3'
        };

        let response = await userSearch(query);
        console.log(`login range count search status code: ${response.statusCode}`);
        console.log(`login range count search body: ${response.body}`);
        chai.assert(response.statusCode == 200, "Status code returned from login range count search was not equal to 200");
        let bodyObj = JSON.parse(response.body);
        //chai.assert(bodyObj.name == updateUserInfo[0].name, "Name update was not reflected properly for user email search");
    });

    it('Customer sorts viewed results field via descending order', async () => {
        let query = {
            q: 'logins_count:[0 TO 5]',
            sort: 'created_at:-1',
            search_engine: 'v3'
        }

        let response = await userSearch(query);
        console.log(`login range count search status code: ${response.statusCode}`);
        console.log(`login range count search body: ${response.body}`);
        chai.assert(response.statusCode == 200, "Status code returned from login range count search was not equal to 200");
        let bodyObj = JSON.parse(response.body);
        //chai.assert(bodyObj.name == updateUserInfo[0].name, "Name update was not reflected properly for user email search");
    });
});