const expresss = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('graphql-server-express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const expressPlayground = require('graphql-playground-middleware-express');
const cookieParser = require('cookie-parser');
const { express } = require('graphql-voyager/middleware');
const path = require('path');
const schema = require('./schema');

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
  expressPlayground.default({
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
