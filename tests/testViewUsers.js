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
describe('Viewing User Search Results Via API', function () {
    it('Customer requests a list of users using "eventually consistent" search', function() {
        return 'pending';
    });

    it('Customer requests list of users using "eventually consistent" search and pages results', function() {
        return 'pending';
    });

    describe('Customer requests a list of users using "immediately consistent" search after updating user information', function() {
        before(async function() {
            this.timeout(5000);

            let promises = [];
            for (idx in updateUserInfo) {
                const user = updateUserInfo[idx];
                promises.push(
                    auth0.createUser(user)
                        .then(function() {
                            console.log(chalk.green('Successfully created user with the following data:'));
                            for (key in user) {
                                console.log(chalk.green(`\t${key}: ${user[key]}`));
                            }
                            console.log('\n');
                        })
                        .catch(function(err) {
                            throw err;
                        })
                );
            }

            // wait for the users to get created before updating their information
            await Promise.all(promises);

            //Update user data
            promises = [];
            for (idx in updateUserInfo) {
                const userId = 'auth0|' + updateUserInfo[idx].user_id;
                promises.push(
                    auth0.updateUser({id:userId}, {name:`haveANewName${idx}`})
                        .then(function() {
                            console.log(chalk.green(`Successfully updated name for user id: ${userId}\n`));
                        })
                        .catch(function(err) {
                            throw err;
                        })
                );
            }

            // Wait for user data to be updated
            await Promise.all(promises);
        });

        it('Customer searches for user by email after updating user information', () => {
            var options = {
                method: 'GET',
                url: `https://${argv.domain}/api/v2/users-by-email`,
                qs: {email: updateUserInfo[0].email},
                headers: {authorization: `Bearer ${argv.token}`},
                resolveWithFullResponse: true
            };

            console.log(`USER EMAIL: ${updateUserInfo[0].email}`);

            return request(options)
                .then( (response) => {
                    console.log(`Email search status code: ${response.statusCode}`);
                    console.log(`Email search body: ${response.body}`);
                    chai.assert(response.statusCode == 200, "Status code returned from email search was not equal to 200");
                    let bodyObj = JSON.parse(response.body);
                    chai.assert(bodyObj.name == updateUserInfo[0].name, "Name update was not reflected properly for user email search");
                })
                .catch( (err) => {
                    throw err
                });
        });

        it('Customer searches for user by ID after updating user information', () => {
            var options = {
                method: 'GET',
                url: `https://${argv.domain}/api/v2/users/auth0|${updateUserInfo[1].user_id}`,
                headers: {authorization: `Bearer ${argv.token}`},
                resolveWithFullResponse: true
            };
            
            return request(options)
                .then( (response) => {
                    chai.assert(response.statusCode == 200, "Status code returned from ID search was not equal to 200");
                    let bodyObj = JSON.parse(response.body);
                    chai.assert(bodyObj.name != updateUserInfo[1].name, "Name update was not reflected properly for user ID search");
                })
                .catch( (err) => {
                    throw err
                });
        });

        after(async () => {
            // Delete created user profiles
            const promises = []
            for (idx in updateUserInfo) {
                const userId = 'auth0|' + updateUserInfo[idx].user_id;
                promises.push(
                    auth0.deleteUser({id:userId})
                        .then(function() {
                            console.log(chalk.green(`Successfully deleted user with id: ${userId}`));
                        })
                        .catch(function(err) {
                            console.log(chalk.red(`Failed to delete user with id: ${userId}`));
                            throw err;
                        })
                )
            }

            await Promise.all(promises);
        });
    });
});