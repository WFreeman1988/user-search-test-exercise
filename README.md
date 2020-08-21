# user-search-test-exercise
## Test Setup & Execution
1. run `npm install` to load the node module dependencies
2. Execute tests with `npm run test:system` cmd with the folloing cmd line arguments:
  - `domain`(required) specifies the Auth0 domain endpoint where these execute
    - Note: you must specify your full domain with region & origin e.g. `--domain dev-4fwk1wij.us.auth0.com`
  - `token`(required) specifies the Auth0 API token used for API access
  - `testFile` (optional) specify specific test file for execution
    - Note: if this is not specificed all tests under the `tests` folder will run

## Execution Example
`npm run test:system -- --domain {YOUR_DOMAIN} --token {YOUR_API_TOKEN}`
