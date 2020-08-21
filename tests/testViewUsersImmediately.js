const ManagementClient = require('auth0').ManagementClient;
const argv = require('minimist')(process.argv.slice(2));
const updateUserInfo = require('../data/updateUserCreation.json');
const chalk = require('chalk');
const chai = require('chai');
const requestHandler = require('../util/requestHandler');
const randomstring = require('randomstring');

const auth0 = new ManagementClient({
    domain: `${argv.domain}`,
    token: `${argv.token}`
});

/**
 * Test suite used to confirm that a customer might be able to view their user
 * search results as expected when updated for Immediately Consistent searches
 */
describe('Viewing "Immediately Consistent" User Search Results Via API', () => {
    before(async function() {
        this.timeout(10000); // Increase timeout limits for user data creation

        // Create & Update users for this set of tests
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

    it('Customer searches for user by email after updating user information', async function() {
        this.timeout(5000); // Increase timout to update my user account data

        // No results were returned when performing this search on a newly created user
        // let response = await requestHandler.userSearchByEmail(updateUserInfo[0].email);
        // console.log(`Email search status code: ${response.statusCode}`);
        // console.log(`Email search body: ${response.body}`);

        // Update my user data (work around for no search results by email)
        let response = await requestHandler.userSearchByEmail('wfreeman1988@gmail.com');
        let initialBodyObj = JSON.parse(response.body);
        const myUserId = 'auth0|5f3d41a74766830067eacda2';
        await auth0.updateUser(
            {id:myUserId},
            {name:randomstring.generate({length: 12, charset: 'alphabetic'})}
        );
        response = await requestHandler.userSearchByEmail('wfreeman1988@gmail.com');

        let bodyObj = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from email search was not equal to 200");
        chai.assert(bodyObj.length > 0, "No user search results were returned");
        chai.assert(bodyObj[0].name != initialBodyObj[0].name, "Name update was not reflected properly for user email search");
    });

    it('Customer searches for user by ID after updating user information', async () => {            
        let response = await requestHandler.userSearchByID(updateUserInfo[1].user_id);
        let bodyObj = JSON.parse(response.body);
        chai.assert(response.statusCode == 200, "Status code returned from ID search was not equal to 200");
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