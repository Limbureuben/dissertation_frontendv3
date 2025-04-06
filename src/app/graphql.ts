import { gql } from '@apollo/client/core';


export const REGISTER_USER = gql`
  mutation RegisterUser($password: String!, $passwordConfirm: String!, $username: String!, $sessionId: String) {
    registerUser(input: { password: $password, passwordConfirm: $passwordConfirm, username: $username, sessionId: $sessionId }) {
      output {
        message
        success
        user {
          id
          username
        }
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: UserLoginInputObject!) {
    loginUser(input: $input) {
      message
      success
        user {
          accessToken
          id
          isStaff
          refreshToken
          username
        }
    }
  }
`;

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

export const GET_OPENSPACE_COUNT = gql`
    query MyQuery {
      totalOpenspaces
  }
  `;

export const GET_HISTORY_COUNT = gql`
  query MyQuery {
    totalHistorys
}
`;

export const GET_REPORT_COUNT = gql`
  query MyQuery {
    totalReport
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


export const REGISTER_REPORT_MUTATION = gql`
  mutation RegisterReport($input: ReportInputObject!) {
    registerReport(input: $input) {
      output {
        message
        success
        report {
          id
          description
          email
          fileUrl
        }
      }
    }
  }
`;

  export const CREATE_REPORT = gql`
  mutation CreateReport($description: String!, $email: String, $filePath: String, $spaceName: String, $latitude: Float, $longitude: Float, $userId: ID) {
    createReport(description: $description, email: $email, filePath: $filePath, spaceName: $spaceName, latitude: $latitude, longitude: $longitude, userId: $userId) {
      report {
        reportId
        description
        email
        file
        createdAt
        latitude
        longitude
        createdAt
      }
    }
  }
`;

export const GET_ALL_REPORTS = gql`
  query MyQuery {
    allReports {
      createdAt
      description
      email
      file
      id
      latitude
      longitude
      reportId
      spaceName
    }
  }
`;

export const GET_ALL_HISTORY = gql`
   query MyQuery {
    allHistorys {
      createdAt
      description
      reportId
    }
  }
`;


export const CONFIRM_REPORT = gql`
  mutation MyMutation($reportId: String!) {
    confirmReport(reportId: $reportId) {
      message
      success
    }
  }
`;

export const GET_ANONYMOUS_REPORTS = gql`
  query GetAnonymousReports($sessionId: String!) {
    anonymous(sessionId: $sessionId) {
      createdAt
      description
    }
  }
`;

// export const GET_REPORTS = gql`
//   query GetReports($sessionId: String, $userId: ID) {
//     reports(sessionId: $sessionId, userId: $userId) {
//       createdAt
//       description
//     }
//   }
// `;

export const GET_MY_REPORTS = gql`
  query GetMyReports {
    myReports {
      description
      createdAt
      reportId
    }
  }
`;

// export const GET_USER_PROFILE = gql`
//   query GetUserprofile {
//     query {
//       profile {
//         id
//         username
//       }
//     }
//    }
// `;

export const GET_USER_PROFILE = gql`
  query {
    profile {
      id
      username
    }
  }
`;

export const GET_ALL_REPORT_USSD = gql`
  query MyQuery {
    allReportsUssds {
      description
      id
      openSpace
      phoneNumber
      referenceNumber
      status
    }
  }
`;

