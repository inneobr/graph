import { gql } from 'graphql-tag';
export const typeDefs = gql`
  type Meteored {
    DATE: String
    NAME: String
    ICON: String
    DESC: String
    TEMP: String
    SENS: String
    TMAX: String
    TMIN: String
    WIND: String
    BURS: String
    RAIN: String
    PROV: String
    CIDADE: Int
  }

  type Nexthour {
    HOUR: String
    DATE: String
    TEMP: String
    SENS: String
    RAIN: String
    PROV: String
    CLOD: String
    FOGS: String
    VISB: String
    DEWS: String
    UMID: String
    DESC: String
    WIND: String
    BURS: String
    PRES: String
    IFPS: String
    ICON: String
    CIDADE: Int
  }

  type Today {
    ID: ID
    DATE: String
    INDI: String
    DESC: String
    VALU: String
    INFO: String
    RESU: String
    PLUZ: String
    NSUN: String
    MDAY: String
    PSUN: String
    ULUZ: String
    CIDADE: Int
  }

  type GoogleResult {
    title: String
    link: String
    description: String
  }

  type YouTubeResult {
    uuid: String
    title: String
    link: String
    thumbnail: String
    channel: String
  }

  type Query {
    today(cidadeId: Int!): [Today]
    meteored(cidadeId: Int!): [Meteored]
    nexthour(cidadeId: Int!): [Nexthour]
    google(query: String!): [GoogleResult]
    youtube(query: String!): [YouTubeResult]
  }
`;