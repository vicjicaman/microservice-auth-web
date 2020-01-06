import { gql } from "apollo-boost";

export const GET = gql`
  query ACCOUNT_GET {
    viewer {
      id
      username
      account {
        get {
          id
          username
          email
          status
          created_at
        }
      }
    }
  }
`;
