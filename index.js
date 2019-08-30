require('dotenv').config();

const chalk = require('chalk');

const federate = require('./federate');

const internalUrl =
  process.env.INTERNAL_ISSUER_URL || 'https://aws.amazon.com/';
const consoleUrl =
  process.env.DESTINATION_URL || 'https://console.aws.amazon.com/home';

(async () => {
  try {
    const loginUrl = await federate(
      process.env.ROLE_ARN,
      process.env.ROLE_SESSION_NAME,
      internalUrl,
      consoleUrl
    );

    console.log(
      `\nFederated login ${chalk.green(
        'successful'
      )}, go to the following URL in your browser. This link is valid for ${chalk.yellow(
        '15 minutes'
      )}.`
    );
    console.log(loginUrl);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
