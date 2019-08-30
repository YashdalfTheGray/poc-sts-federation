# poc-sts-federation

Trying to get STS to assume role using AWS credentials from the CLI

## Setup

Once this repo has been pulled down and you've run `npm install` on it, you're going to need to create a file called `.env` in the project root and put some keys in it. The keys are listed below.

| Key                   | Value                                                                     | Notes                                                                                   |
| --------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `ROLE_ARN`            | The ARN of the role that you want to assume                               |                                                                                         |
| `ROLE_SESSION_NAME`   | A name that you want to give the federated session                        | Usually something meaningful that identifies the application/purpose of the federation. |
| `DESTINATION_URL`     | After federation is successful, this is where AWS signin will redirect    | Defaults to https://console.aws.amazon.com/console/home                                 |
| `INTERNAL_ISSUER_URL` | This is where a user will be redirected to when their session has expired | Defaults to https://aws.amazon.com/                                                     |

## Running

Once the right keys are in place (or the information has been added to the environment variables), a simple `node index.js` will run the code and output a URL that can be given to users to federate into the `DESTINATION_URL`.

The script will exit with error code 1 if something went wrong with either contacting AWS STS or with signin federation.

## References

- [Signin Federation Developer Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_enable-console-custom-url.html)
- [`STS::AssumeRole`](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html)
