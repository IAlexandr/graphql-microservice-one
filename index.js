import expresss from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'graphql-server-express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import expressPlayground from 'graphql-playground-middleware-express';
import cookieParser from 'cookie-parser';
import { express } from 'graphql-voyager/middleware';
import path from 'path';
import schema from './schema';

const PORT = 3001;
const app = expresss();
app.use(cookieParser());

app.use('/voyager', express({ endpointUrl: '/graphql' }));
app.use('/graphql', bodyParser.json(), (req, res, next) => {
  return graphqlExpress({
    schema,
  })(req, res, next);
});
app.get(
  '/playground',
  expressPlayground({
    endpoint: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
  })
);

const serverListening = () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
  const ss = new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: ws,
      path: '/subscriptions',
    }
  );
};

const ws = http.Server(app);
ws.listen(PORT, serverListening);
