import gql from "graphql-tag"

export const GET_APPOINTMENTS_QUERY = gql`
  query GetAppointments {
    getAppointments {
      color
      customerId
      status
      label {
        id
        color
        name
      }
      customer {
        id
        lastName
        firstName
      }
      packages {
        id
        deleted
        duration
        name
        price
        services {
          id
          name
          serviceDuration
          color
        }
      }
      services {
        id
        deleted
        name
        serviceDuration
        color
      }
      remiderSent
      followUpSent
      didNotShow
      didNotShowSent
      duration
      date
      lastDate
      note
      id
    }
  }
`

// `
//   query GetAppointments {
//     getAppointments {
//       id
//       customerId
//       status
//       customer {
//         id
//         phoneNumber
//         countryCode
//         isoCode
//         email
//         firstName
//         lastName
//         dob
//         gender
//         avatar
//         verified
//         created
//         fcmToken
//         socketId
//         facebook
//         instagram
//         twitter
//         pinterest
//         website
//         description
//         addressId
//       }
//       label {
//         id
//         color
//         name
//         storeId
//         isActive
//         description
//         isEditable
//         created
//       }
//       labelId

//       lastDate
//       date
//       status
//       color
//       note
//       storeId
//       isCheckIn
//       labelId
//       created
//       remiderSent
//       followUpSent
//       didNotShow
//       didNotShowSent
//       duration
//     }
//   }
// `
