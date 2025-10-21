import { startServerAndCreateNextHandler } from '@as-integrations/next';

import { ApolloServer } from '@apollo/server';
import { NextRequest } from 'next/server';

import { resolvers } from "@/config/resolvers"
import { typeDefs } from "@/config/types"

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server);
export { handler as GET, handler as POST };