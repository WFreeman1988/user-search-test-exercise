const chai = require('chai');
const userSearch = require('../util/requestHandler').userSearch;

describe('Sorting User Search Results Via API', () => {
    it('Customer sorts viewed results using string field via ascending order', async () => {
        let query = {
            q: 'logins_count:[0 TO 5]',
            sort: 'email:1',
            search_engine: 'v3'
        };

        let response = await userSearch(query);
        chai.assert(response.statusCode == 200, "Status code returned from login range count search was not equal to 200");
        let bodyObjArr = JSON.parse(response.body);
        let prevEmailValue = bodyObjArr[0].email;
        for (let i = 1; i < bodyObjArr.length; i++) {
            let curEmailValue = bodyObjArr[i].email;
            chai.assert(prevEmailValue <= curEmailValue, "Returned list of users was not sorted by ascending email order");
            prevEmailValue = curEmailValue;
        }
    });

    it('Customer sorts viewed results using string field via descending order', async () => {
        let query = {
            q: 'logins_count:[0 TO 5]',
            sort: 'email:-1',
            search_engine: 'v3'
        }

        let response = await userSearch(query);
        chai.assert(response.statusCode == 200, "Status code returned from login range count search was not equal to 200");
        let bodyObjArr = JSON.parse(response.body);
        let prevEmailValue = bodyObjArr[0].email;
        for (let i = 1; i < bodyObjArr.length; i++) {
            let curEmailValue = bodyObjArr[i].email;
            chai.assert(prevEmailValue >= curEmailValue, "Returned list of users was not sorted by descending email order");
            prevEmailValue = curEmailValue;
        }
    });

    it('Customer sorts viewed results using string field via ascending order and pages results', async function() {
        this.timeout(5000); // Increase timeout to account for multiple pages of users

        let total = null;
        let pageNum = 0;
        let usersFound = 0;
        let prevEmailValue = null;

        while (usersFound != total) {
            let query = {
                q: 'logins_count:[0 TO 5]',
                sort: 'email:1',
                page: pageNum,
                per_page: '3',
                include_totals: 'true',
                search_engine: 'v3'
            };
    
            let response = await userSearch(query);
            chai.assert(response.statusCode == 200, "Status code returned from page search was not equal to 200");
            let bodyObj = JSON.parse(response.body);
            let users = bodyObj.users;
            
            if (prevEmailValue == null) {
                // Initial page validation
                prevEmailValue = users[0].email;
                for (let i = 1; i < users.length; i++) {
                    let curEmailValue = users[i].email;
                    chai.assert(prevEmailValue <= curEmailValue, "Initial returned page of users was not sorted by ascending email order");
                    prevEmailValue = curEmailValue;
                }
            } else {
                // Additional page validation
                for (let i = 0; i < users.length; i++) {
                    let curEmailValue = users[i].email;
                    chai.assert(prevEmailValue <= curEmailValue, "Additional returned page of users was not sorted by ascending email order");
                    prevEmailValue = curEmailValue;
                }
            }

            if (total == null) {
                total = bodyObj.total;
            }
            usersFound += users.length;
            pageNum++;
        }
    });

    it('Customer sorts viewed results using string field via descending order and pages results', async function() {
        this.timeout(5000); // Increase timeout to account for multiple pages of users

        let total = null;
        let pageNum = 0;
        let usersFound = 0;
        let prevEmailValue = null;

        while (usersFound != total) {
            let query = {
                q: 'logins_count:[0 TO 5]',
                sort: 'email:-1',
                page: pageNum,
                per_page: '3',
                include_totals: 'true',
                search_engine: 'v3'
            };
    
            let response = await userSearch(query);
            chai.assert(response.statusCode == 200, "Status code returned from page search was not equal to 200");
            let bodyObj = JSON.parse(response.body);
            let users = bodyObj.users;
            
            if (prevEmailValue == null) {
                // Initial page validation
                prevEmailValue = users[0].email;
                for (let i = 1; i < users.length; i++) {
                    let curEmailValue = users[i].email;
                    chai.assert(prevEmailValue >= curEmailValue, "Initial returned page of users was not sorted by descending email order");
                    prevEmailValue = curEmailValue;
                }
            } else {
                // Additional page validation
                for (let i = 0; i < users.length; i++) {
                    let curEmailValue = users[i].email;
                    chai.assert(prevEmailValue >= curEmailValue, "Additional returned page of users was not sorted by descending email order");
                    prevEmailValue = curEmailValue;
                }
            }

            if (total == null) {
                total = bodyObj.total;
            }
            usersFound += users.length;
            pageNum++;
        }
    });

    it('Customer sorts viewed results using boolean field via ascending order', async () => {
        let query = {
            q: 'logins_count:[0 TO 5]',
            sort: 'email_verified:1',
            search_engine: 'v3'
        };

        let response = await userSearch(query);
        chai.assert(response.statusCode == 200, "Status code returned from login range count search was not equal to 200");
        let bodyObjArr = JSON.parse(response.body);
        let prevEmailVerifiedValue = bodyObjArr[0].email_verified;
        for (let i = 1; i < bodyObjArr.length; i++) {
            let curEmailVerifiedValue = bodyObjArr[i].email_verified;
            chai.assert(prevEmailVerifiedValue <= curEmailVerifiedValue, "Returned list of users was not sorted by ascending email_verified order");
            prevEmailVerifiedValue = curEmailVerifiedValue;
        }
    });

    it('Customer sorts viewed results using boolean field via descending order', async () => {
        let query = {
            q: 'logins_count:[0 TO 5]',
            sort: 'email_verified:-1',
            search_engine: 'v3'
        }

        let response = await userSearch(query);
        chai.assert(response.statusCode == 200, "Status code returned from login range count search was not equal to 200");
        let bodyObjArr = JSON.parse(response.body);
        let prevEmailVerifiedValue = bodyObjArr[0].email_verified;
        for (let i = 1; i < bodyObjArr.length; i++) {
            let curEmailVerifiedValue = bodyObjArr[i].email_verified;
            chai.assert(prevEmailVerifiedValue >= curEmailVerifiedValue, "Returned list of users was not sorted by descending email_verified order");
            prevEmailVerifiedValue = curEmailVerifiedValue;
        }
    });

    it('Customer sorts viewed results using boolean field via ascending order and pages results', async function() {
        this.timeout(5000); // Increase timeout to account for multiple pages of users

        let total = null;
        let pageNum = 0;
        let usersFound = 0;
        let prevEmailVerifiedValue = null;

        while (usersFound != total) {
            let query = {
                q: 'logins_count:[0 TO 5]',
                sort: 'email_verified:1',
                page: pageNum,
                per_page: '3',
                include_totals: 'true',
                search_engine: 'v3'
            };
    
            let response = await userSearch(query);
            chai.assert(response.statusCode == 200, "Status code returned from page search was not equal to 200");
            let bodyObj = JSON.parse(response.body);
            let users = bodyObj.users;
            
            if (prevEmailVerifiedValue == null) {
                // Initial page validation
                prevEmailVerifiedValue = users[0].email;
                for (let i = 1; i < users.length; i++) {
                    let curEmailVerifiedValue = users[i].email;
                    chai.assert(prevEmailVerifiedValue <= curEmailVerifiedValue, "Initial returned page of users was not sorted by ascending email_verified order");
                    prevEmailVerifiedValue = curEmailVerifiedValue;
                }
            } else {
                // Additional page validation
                for (let i = 0; i < users.length; i++) {
                    let curEmailVerifiedValue = users[i].email;
                    chai.assert(prevEmailVerifiedValue <= curEmailVerifiedValue, "Additional returned page of users was not sorted by ascending email_verified order");
                    prevEmailVerifiedValue = curEmailVerifiedValue;
                }
            }

            if (total == null) {
                total = bodyObj.total;
            }
            usersFound += users.length;
            pageNum++;
        }
    });

    it('Customer sorts viewed results using boolean field via descending order and pages results', async function() {
        this.timeout(5000); // Increase timeout to account for multiple pages of users

        let total = null;
        let pageNum = 0;
        let usersFound = 0;
        let prevEmailVerifiedValue = null;

        while (usersFound != total) {
            let query = {
                q: 'logins_count:[0 TO 5]',
                sort: 'email_verified:-1',
                page: pageNum,
                per_page: '3',
                include_totals: 'true',
                search_engine: 'v3'
            };
    
            let response = await userSearch(query);
            chai.assert(response.statusCode == 200, "Status code returned from page search was not equal to 200");
            let bodyObj = JSON.parse(response.body);
            let users = bodyObj.users;
            
            if (prevEmailVerifiedValue == null) {
                // Initial page validation
                prevEmailVerifiedValue = users[0].email;
                for (let i = 1; i < users.length; i++) {
                    let curEmailVerifiedValue = users[i].email;
                    chai.assert(prevEmailVerifiedValue >= curEmailVerifiedValue, "Initial returned page of users was not sorted by descending email_verified order");
                    prevEmailVerifiedValue = curEmailVerifiedValue;
                }
            } else {
                // Additional page validation
                for (let i = 0; i < users.length; i++) {
                    let curEmailVerifiedValue = users[i].email;
                    chai.assert(prevEmailVerifiedValue >= curEmailVerifiedValue, "Additional returned page of users was not sorted by descending email_verified order");
                    prevEmailVerifiedValue = curEmailVerifiedValue;
                }
            }

            if (total == null) {
                total = bodyObj.total;
            }
            usersFound += users.length;
            pageNum++;
        }
    });

    /**
     * Was going to do this but test data is too inaccurate to ensure proper validation
     * since logins_count appears to be the only integer value and I could not see
     * a way to update or add this value through and API or during user creation
     */
    it('Customer sorts viewed results using integer field via ascending order');
    it('Customer sorts viewed results using integer field via descending order');
});