// import { provideApollo } from 'apollo-angular';
// import { HttpLink } from 'apollo-angular/http';
// import { inject, NgModule } from '@angular/core';
// import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';

// export function createApollo(): ApolloClientOptions<any> {
//   const uri = 'http://172.17.20.207:8000/graphql/';
//   // const uri = 'http://127.0.0.1:8000/graphql/'; // <-- add the URL of the GraphQL server here
//   const httpLink = inject(HttpLink);

//   return {
//     link: httpLink.create({ uri }),
//     cache: new InMemoryCache(),
//   };
// }

// @NgModule({
//   providers: [provideApollo(createApollo)],
// })
// export class GraphQLModule {}

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { inject, NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export function createApollo(): ApolloClientOptions<any> {
  const uri = 'http://172.17.20.207:8000/graphql/'; // Update if needed
  const httpLink = inject(HttpLink);

  // Middleware to attach JWT token
  const authLink = setContext(() => {
    const token = localStorage.getItem('success_token'); // Ensure this is the correct token key
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "", // Attach token if available
      },
    };
  });

  return {
    link: authLink.concat(httpLink.create({ uri })), // Chain authLink with httpLink
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [provideApollo(createApollo)],
})
export class GraphQLModule {}
