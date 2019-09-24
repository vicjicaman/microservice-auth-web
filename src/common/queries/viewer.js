import { gql } from "apollo-boost";


export const GET = gql`
  query {
    viewer {
      id
      username
    }
  }
`;
