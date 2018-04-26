const pubsub = require('./pubsub');
const { makeExecutableSchema } = require('graphql-tools');
const data = [
  { id: '1', name: 'Petya' },
  { id: '2', name: 'Vasya' },
  { id: '3', name: 'Tolik' },
];

// SCHEMA DEFINITION
const typeDefs = `
type Query {
  users: [User]
  user(id: ID!): User
}
type Subscription {
  userChanged: User
}
type Mutation {
  change(id: ID!, name: String!): User
}
type User {
  id: ID!
  name: String
}`;

// RESOLVERS
const resolvers = {
  Query: {
    users: (root, args, context, info) => data,
    user: (root, args, context, info) => {
      return data.find(item => item.id == args.id);
    },
  },
  Subscription: {
    userChanged: {
      resolve: (payload, args, context, info) => {
        console.log('resolve!!!!', payload);
        // Manipulate and return the new value
        return payload.userChanged;
      },
      subscribe: () => {
        console.log('userChanged subscribe!');
        return pubsub.asyncIterator('USER_CHANGED');
      },
    },
  },
  Mutation: {
    change: (parent, { id, name }) => {
      const user = data.find(item => item.id == id);
      if (user) {
        user.name = name;
      }
      pubsub.publish('USER_CHANGED', {
        userChanged: user,
      });
      return user;
    },
  },
};

// TODO (EXECUTABLE) SCHEMA
module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
