const chai = require('chai');
const requestHandler = require('../util/requestHandler');

describe('Viewing "Eventually Consistent" User Search Results Via API', () => {
    it('Customer requests a list of users using "eventually consistent" search', async () => {
        let query = {
            q: 'nickname:"Johnny1"',
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        console.log(`Nickname search status code: ${response.statusCode}`);
        console.log(`Nickname search body: ${response.body}`);
        chai.assert(response.statusCode == 200, "Status code returned from nickname search was not equal to 200");
        let bodyObj = JSON.parse(response.body);
    });

    it('Customer requests list of users using "eventually consistent" search and pages results', async () => {
        let query = {
            q: 'logins_count:[0 TO 5]',
            page: '2',
            per_page: '2',
            include_totals: 'true',
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        console.log(`Eventually consistent search status code: ${response.statusCode}`);
        console.log(`Eventually consistent search body: ${response.body}`);
        chai.assert(response.statusCode == 200, "Status code returned from 'eventually consistent' page search was not equal to 200");
        let bodyObj = JSON.parse(response.body);
    });
});