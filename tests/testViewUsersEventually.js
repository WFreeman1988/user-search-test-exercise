const chai = require('chai');
const requestHandler = require('../util/requestHandler');

describe('Viewing "Eventually Consistent" User Search Results Via API', () => {
    it('Customer requests a list of users using exact match string search', async () => {
        let searchText = 'Doe'
        let query = {
            q: `family_name:"${searchText}"`,
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        let bodyObjArr = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from exact match string search was not equal to 200");
        chai.assert(bodyObjArr.length > 0, "No user search results were returned");
        for (i in bodyObjArr) {
            chai.assert(bodyObjArr[i].family_name == searchText, "Returned list of users contained a family_name which did not match the exact match search");
        }
    });

    it('Customer requests a list of users using exact match boolean search', async () => {
        let searchBool = false
        let query = {
            q: `email_verified:"${searchBool}"`,
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        let bodyObjArr = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from exact match boolean search was not equal to 200");
        chai.assert(bodyObjArr.length > 0, "No user search results were returned");
        for (i in bodyObjArr) {
            chai.assert(bodyObjArr[i].email_verified == searchBool, "Returned list of users contained a email_verified which did not match the exact match serach");
        }
    });

    it('Customer requests a list of users using exact match integer search', async () => {
        let searchInt = 0;
        let query = {
            q: `logins_count:"${searchInt}"`,
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        let bodyObjArr = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from exact match integer search was not equal to 200");
        chai.assert(bodyObjArr.length > 0, "No user search results were returned");
        for (i in bodyObjArr) {
            // Since we searched for a logins_count of 0 the accounts should not have this property
            chai.assert(bodyObjArr[i].hasOwnProperty('logins_count') == false, "Returned list of users contained a logins_count which did not match the exact match serach");
        }
    });

    it('Customer requests a list of users using AND logical search', async () => {
        let searchInt = 0;
        let searchText = "Doe";
        let query = {
            q: `logins_count:"${searchInt}" AND family_name:"${searchText}"`,
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        let bodyObjArr = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from exact match AND logical search was not equal to 200");
        chai.assert(bodyObjArr.length > 0, "No user search results were returned");
        for (i in bodyObjArr) {
            // Since we searched for a logins_count of 0 the accounts should not have this property
            chai.assert(bodyObjArr[i].hasOwnProperty('logins_count') == false && bodyObjArr[i].family_name == searchText, "Returned list of users contained a logins_count and family_name which did not match the combination exact match serach");
        }
    });

    it('Customer requests a list of users using OR logical search', async () => {
        let searchInt = 5;
        let searchText = "Doe";
        let query = {
            q: `logins_count:"${searchInt}" OR family_name:"${searchText}"`,
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        let bodyObjArr = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from exact match OR logical search was not equal to 200");
        chai.assert(bodyObjArr.length > 0, "No user search results were returned");
        for (i in bodyObjArr) {
            chai.assert(bodyObjArr[i].hasOwnProperty('logins_count') == true || bodyObjArr[i].family_name == searchText, "Returned list of users contained a logins_count or family_name which did not match the combination exact match serach");
        }
    });

    it('Customer requests a list of users using exact match metadata nested object search', async () => {
        let searchText = "findMe";
        let query = {
            q: `app_metadata.nestedObj.test:"${searchText}"`,
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        let bodyObjArr = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from exact metadata nested object search was not equal to 200");
        chai.assert(bodyObjArr.length > 0, "No user search results were returned");
        for (i in bodyObjArr) {
            let dataObj = bodyObjArr[i].app_metadata.nestedObj;
            chai.assert(dataObj.hasOwnProperty("test") && dataObj.test == searchText, "Returned list of users contained a metadata nested object property which did not match the exact match serach");
        }
    });

    it('Customer requests a list of users using exact match metadata nested array search', async () => {
        let searchText = "searchMe";
        let query = {
            q: `user_metadata.nestedObjArray.test:"${searchText}"`,
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        let bodyObjArr = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from exact match metadata nested array search was not equal to 200");
        chai.assert(bodyObjArr.length > 0, "No user search results were returned");
        for (i in bodyObjArr) {
            let found = false;
            let dataArr = bodyObjArr[i].user_metadata.nestedObjArray;
            for (j in dataArr) {
                if (dataArr[j].test == searchText) {
                    found = true;
                    break;
                }
            }
            chai.assert(found, "Returned list of users contained a metadata nested array property which did not match the exact match serach");
        }
    });

    it('Customer requests a list of users using wildcard match string search', async () => {
        let searchText = 'John'
        let query = {
            q: `given_name:${searchText}*`,
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        let bodyObjArr = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from wildcard match string search was not equal to 200");
        chai.assert(bodyObjArr.length > 0, "No user search results were returned");
        for (i in bodyObjArr) {
            chai.assert(bodyObjArr[i].given_name.startsWith(searchText), "Returned list of users contained a given_name which did not start with the search text");
        }
    });

    it('Customer requests a list of users using suffix wildcard match string search', async () => {
        let searchText = 'Doe'
        let query = {
            q: `name:*${searchText}`,
            search_engine: 'v3'
        };

        let response = await requestHandler.userSearch(query);
        let bodyObjArr = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from suffix wildcard match string search was not equal to 200");
        chai.assert(bodyObjArr.length > 0, "No user search results were returned");
        for (i in bodyObjArr) {
            chai.assert(bodyObjArr[i].name.endsWith(searchText), "Returned list of users contained a name which did not end with the search text");
        }
    });

    it('Customer requests a list of users using wildcard match metadata nested object search', async () => {
        let searchText = "find";
        let query = {
            q: `app_metadata.nestedObj.test:${searchText}*`,
            search_engine: 'v3'
        };

        try {
            await requestHandler.userSearch(query);
        } catch(err) {
            chai.assert(err.statusCode == 400, "Status code returned from starts with metadata nested object search was not equal to 400");
        }
    });
});