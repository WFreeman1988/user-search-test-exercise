const request = require("request-promise");
const argv = require('minimist')(process.argv.slice(2));

/**
 * Sends out API request to obtain a list of users based on a speified search
 * query
 * 
 * @param {Object} queryObj Query object containing search values/options
 * @returns {Promise} Object containing request response
 */
function userSearch(queryObj) {
    let options = {
        method: 'GET',
        url: `https://${argv.domain}/api/v2/users`,
        qs: queryObj,
        headers: {authorization: `Bearer ${argv.token}`},
        resolveWithFullResponse: true
    };

    return request(options);
}

/**
 * Sends out API request to obtain user information based on the user email
 * specified
 * 
 * @param {String} email email value for the user 
 * @returns {Promise} Object containing request response
 */
function userSearchByEmail(email) {
    let options = {
        method: 'GET',
        url: `https://${argv.domain}/api/v2/users-by-email`,
        qs: {email: email},
        headers: {authorization: `Bearer ${argv.token}`},
        resolveWithFullResponse: true
    };

    return request(options);
}

/**
 * Sends out API request to obtain user information based on the userID
 * specified
 * 
 * @param {String} id ID value for the user 
 * @returns {Promise} Object containing request response
 */
function userSearchByID(id) {
    let options = {
        method: 'GET',
        url: `https://${argv.domain}/api/v2/users/auth0|${id}`,
        headers: {authorization: `Bearer ${argv.token}`},
        resolveWithFullResponse: true
    };

    return request(options);
}

module.exports = {
    userSearch,
    userSearchByEmail,
    userSearchByID
}