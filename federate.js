const request = require('request-promise');
const { STS } = require('aws-sdk');

/**
 * uses STS::AssumeRole and signin federation to return a link to use
 * to access AWS resources
 * @param {string} roleArn the ARN of the role to assume using STS::AssumeRole
 * @param {string} roleSessionName a description of the session
 * @param {string} issuer the URL where users will be redirected to when their session expires
 * @param {string} destination the URL to go after federation is successful
 * @returns {string} a URL that users can use to access AWS resources
 */
module.exports = async function federate(
  roleArn,
  roleSessionName,
  issuer,
  destination
) {
  const federationEndpoint = 'https://signin.aws.amazon.com/federation';

  let response;
  let signinResponse;

  try {
    const sts = new STS();

    response = await sts
      .assumeRole({
        RoleArn: roleArn,
        RoleSessionName: roleSessionName
      })
      .promise();
  } catch (e) {
    throw new Error(`Couldn't reach AWS STS to get temporary credentials`);
  }

  const session = {
    sessionId: response.Credentials.AccessKeyId,
    sessionKey: response.Credentials.SecretAccessKey,
    sessionToken: response.Credentials.SessionToken
  };

  const encodedSession = encodeURIComponent(JSON.stringify(session));
  const signinTokenUrl = `${federationEndpoint}?Action=getSigninToken&SessionDuration=3600&Session=${encodedSession}`;

  try {
    signinResponse = await request(signinTokenUrl);
  } catch (e) {
    throw new Error(`Couldn't get signin token from AWS federation`);
  }

  return `${federationEndpoint}?Action=login&Issuer=${issuer}&Destination=${destination}&SigninToken=${
    JSON.parse(signinResponse).SigninToken
  }`;
};
