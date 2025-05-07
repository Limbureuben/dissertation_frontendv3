import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { inject, NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';

export function createApollo(): ApolloClientOptions<any> {
  const uri = 'http://127.0.0.1:8000/graphql/';
  const httpLink = inject(HttpLink);

  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [provideApollo(createApollo)],
})
export class GraphQLModule {}


// import { provideApollo } from 'apollo-angular';
// import { HttpLink } from 'apollo-angular/http';
// import { inject, NgModule } from '@angular/core';
// import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
// import { HttpHeaders } from '@angular/common/http';

// export function createApollo(): ApolloClientOptions<any> {
//   const uri = 'http://127.0.0.1:8000/graphql/'; // Your GraphQL server URL
//   const httpLink = inject(HttpLink);

//   // Check if localStorage is available and get token
//   const authToken = typeof window !== 'undefined' && localStorage.getItem('auth_token'); // Replace 'auth_token' with your actual key

//   // Correct usage of HttpHeaders
//   const headers = new HttpHeaders().set('Authorization', authToken ? `Bearer ${authToken}` : '');

//   return {
//     link: httpLink.create({
//       uri,
//       headers, // Use HttpHeaders here
//     }),
//     cache: new InMemoryCache(),
//   };
// }

// @NgModule({
//   providers: [provideApollo(createApollo)],
// })
// export class GraphQLModule {}
