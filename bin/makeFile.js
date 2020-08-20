require('shelljs/make');

const spawn = require('child_process').spawn;
const chalk = require('chalk');
const ManagementClient = require('auth0').ManagementClient;
const testUserAccounts = require('../data/initialUserCreation.json');

target.system = async args => {
    const argv = require('minimist')(args);
    console.log(chalk.green('Running system tests with the following arguments:'));
    for (key in argv) {
        // Skip the _ key value returned by minimist
        if (key != '_') {
            console.log(chalk.green(`\t${key}: ${argv[key]}`));
        }
    }

    if (!argv.domain) {
        console.log(chalk.red('You must specify an auth0 domain with the --domain argument'));
        process.exit(1);
    }
    if (!argv.token) {
        console.log(chalk.red('You must specify an auth0 API token with the --token argument'));
        process.exit(1);
    }

    console.log(chalk.green('Setting up user accounts for test purposes'));
    const auth0 = new ManagementClient({
        domain: `${argv.domain}`,
        token: `${argv.token}`
    });

    // Utilize promises here for performance gains when creating a larger dataset of users
    let promises = []
    for (idx in testUserAccounts) {
        const user = testUserAccounts[idx];
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

    // wait for the users to get created before starting testing
    await Promise.all(promises);

    const tests = spawn(`"./node_modules/.bin/mocha" --recursive tests --domain ${argv.domain} --token ${argv.token}`, { stdio: 'inherit', shell: true });

    tests.on('exit', async exitCode => {
        console.log(chalk.green('Removing user accounts which were used for test purposes'));
        // Delete created user profiles before process exit
        // Utilize promises here for performance gains when deleting a larger dataset of users
        promises = []
        for (idx in testUserAccounts) {
            const userId = 'auth0|' + testUserAccounts[idx].user_id;
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

        process.exit(exitCode);
    }); 
}