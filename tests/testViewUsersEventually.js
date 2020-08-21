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
});