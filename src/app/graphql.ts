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


export const TOGGLE_OPENSPACE_STATUS = gql`
 mutation ToggleOpenspaceStatus($input: ToggleOpenspaceInput!) {
  toggleOpenspaceStatus(input: $input) {
    openspace {
      id
      name
      isActive
    }
  }
}
`;

export const GET_ALL_OPENSPACES = gql`
  query {
    allOpenSpaces {
      id
      isActive
      name
      longitude
      latitude
      district
    }
  }
`;

export const GET_ALL_OPENSPACES_ADMIN = gql`
  query MyQuery {
    allOpenSpacesAdmin {
      district
      id
      isActive
      latitude
      longitude
      name
    }
  }
`;

export const GET_ALL_OPENSPACES_USER = gql`
  query MyQuery {
    allOpenSpacesUser {
      id
      isActive
      name
      longitude
      latitude
      district
    }
  }
`;