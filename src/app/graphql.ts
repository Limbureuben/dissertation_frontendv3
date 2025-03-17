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
      id
      name
      longitude
      latitude
      district
    }
  }
`;

export const DELETE_OPEN_SPACE = gql`
  mutation MyMutation($id: ID!) {
    deleteOpenSpace(id: $id) {
      message
      success
    }
  }
`;

export const GET_MESSAGE_COUNT = gql`
    query MyQuery {
      totalOpenspaces
  }
  `;
