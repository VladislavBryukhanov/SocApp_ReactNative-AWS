import { CognitoAuth } from '@api/auth';
import { AUTH_TYPE } from 'aws-appsync';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import errorHandler from '@store/errorHandler';
import { ApolloLink } from 'apollo-link';
import graphqlConfig from '../../../aws-resources/appSync/chat/aws-exports';
import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';

const httpLink = createHttpLink({
  uri: graphqlConfig.aws_appsync_graphqlEndpoint,
});

const errLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
  graphQLErrors.map((error) => {
    errorHandler(error, '[GraphQL error]');
  });

  if (networkError) {
    errorHandler(networkError, '[GraphQL Network error]');
  }
});

const subscriptionLink = createSubscriptionHandshakeLink(graphqlConfig.aws_appsync_graphqlEndpoint, httpLink);

const authLink = createAuthLink({
  url: graphqlConfig.aws_appsync_graphqlEndpoint,
  region: graphqlConfig.aws_appsync_region,
  auth: {
    type: graphqlConfig.aws_appsync_authenticationType as AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: () => CognitoAuth.retreiveSessionToken()
  },
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([ 
    authLink,
    subscriptionLink,
    errLink 
  ]),
  cache: new InMemoryCache()
});
