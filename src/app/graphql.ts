import { gql } from '@apollo/client/core';

export const ADD_OPENSPACE = gql`
  mutation AddOpenSpace($name: String!, $latitude: Float!, $longitude: Float!, $district: String!) {
    addSpace(input: { name: $name, latitude: $latitude, longitude: $longitude, district: $district }) {
      openspace {
        name
        latitude
        longitude
        district
      }
      output {
        message
        success
        openspace {
          name
          latitude
          longitude
          district
        }
      }
    }
  }
`;

export const GET_ALL_OPENSPACES = gql`
  query {
    allOpenSpaces {
      name
      longitude
      latitude
      district
    }
  }
`;