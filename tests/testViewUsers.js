const ManagementClient = require('auth0').ManagementClient;
const argv = require('minimist')(process.argv.slice(2));
const request = require("request-promise");
const updateUserInfo = require('../data/updateUserCreation.json');
const chalk = require('chalk');
const chai = require('chai');

const auth0 = new ManagementClient({
    domain: `${argv.domain}`,
    token: `${argv.token}`
});

/**
 * Test suite used to confirm that a customer might be able to view their user
 * search results as expected
 */
describe('Viewing User Search Results Via API', () => {
    it('Customer requests a list of users using "eventually consistent" search', async () => {
        let options = {
            method: 'GET',
            url: `https://${argv.domain}/api/v2/users`,
            qs: {q: 'nickname:"Johnny1"', search_engine: 'v3'},
            headers: {authorization: `Bearer ${argv.token}`},
            resolveWithFullResponse: true
        };

        let response = await request(options);
        console.log(`Nickname search status code: ${response.statusCode}`);
        console.log(`Nickname search body: ${response.body}`);
        chai.assert(response.statusCode == 200, "Status code returned from nickname search was not equal to 200");
        let bodyObj = JSON.parse(response.body);
    });

    it('Customer requests list of users using "eventually consistent" search and pages results', async () => {
        let options = {
            method: 'GET',
            url: `https://${argv.domain}/api/v2/users`,
            qs: {
                q: 'logins_count:[0 TO 5]',
                page: '2',
                per_page: '2',
                include_totals: 'true',
                search_engine: 'v3'
            },
            headers: {authorization: `Bearer ${argv.token}`},
            resolveWithFullResponse: true
        };

        let response = await request(options);
        console.log(`Eventually consistent search status code: ${response.statusCode}`);
        console.log(`Eventually consistent search body: ${response.body}`);
        chai.assert(response.statusCode == 200, "Status code returned from 'eventually consistent' page search was not equal to 200");
        let bodyObj = JSON.parse(response.body);
    });

    describe('Customer requests a list of users using "immediately consistent" search after updating user information', () => {
        before(async function() {
            this.timeout(10000); // Increase timeout limits for user data creation

            for (idx in updateUserInfo) {
                const user = updateUserInfo[idx];
                try {
                    await auth0.createUser(user);
                    console.log(chalk.green('Successfully created user with the following data:'));
                    for (key in user) {
                        console.log(chalk.green(`\t${key}: ${user[key]}`));
                    }
                    console.log('\n');
                } catch(err) {
                    console.log(chalk.red('Failed to create user with the following data:'));
                    for (key in user) {
                        console.log(chalk.green(`\t${key}: ${user[key]}`));
                    }
                    console.log('\n');
                    throw err;
                }
                
                // Update the user's data
                const userId = 'auth0|' + updateUserInfo[idx].user_id;
                try {
                    await auth0.updateUser({id:userId}, {name:`haveANewName${idx}`});
                    console.log(chalk.green(`Successfully updated name for user id: ${userId}\n`));
                } catch(err) {
                    console.log(chalk.red(`Failed to update the name for user id: ${userId}\n`));
                    throw err;
                }
            }
        });

        it('Customer searches for user by email after updating user information', async () => {
            var options = {
                method: 'GET',
                url: `https://${argv.domain}/api/v2/users-by-email`,
                qs: {email: updateUserInfo[0].email},
                headers: {authorization: `Bearer ${argv.token}`},
                resolveWithFullResponse: true
            };

            let response = await request(options);
            console.log(`Email search status code: ${response.statusCode}`);
            console.log(`Email search body: ${response.body}`);
            chai.assert(response.statusCode == 200, "Status code returned from email search was not equal to 200");
            let bodyObj = JSON.parse(response.body);
            chai.assert(bodyObj.name == updateUserInfo[0].name, "Name update was not reflected properly for user email search");
        });

        it('Customer searches for user by ID after updating user information', async () => {
            var options = {
                method: 'GET',
                url: `https://${argv.domain}/api/v2/users/auth0|${updateUserInfo[1].user_id}`,
                headers: {authorization: `Bearer ${argv.token}`},
                resolveWithFullResponse: true
            };
            
            let response = await request(options);
            chai.assert(response.statusCode == 200, "Status code returned from ID search was not equal to 200");
            let bodyObj = JSON.parse(response.body);
            chai.assert(bodyObj.name != updateUserInfo[1].name, "Name update was not reflected properly for user ID search");
        });

        after(async () => {
            // Delete created user profiles
            for (idx in updateUserInfo) {
                const userId = 'auth0|' + updateUserInfo[idx].user_id;
                try {
                    await auth0.deleteUser({id:userId});
                    console.log(chalk.green(`Successfully deleted user with id: ${userId}`));
                } catch (err) {
                    console.log(chalk.red(`Failed to delete user with id: ${userId}`));
                    throw err;
                }
            }
        });
    });
});