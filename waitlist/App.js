import React, { Component } from "react";
//import { ActivityIndicator, TextInput, View, Text } from "react-native";
import RNWaitlistApp from "./Tut_6_RNApp";
import RNApp from "./Tut_6_5_RNApp";
import { ApolloProvider, Query } from "react-apollo";

import ApolloClient from "apollo-boost";
//import gql from "graphql-tag";

const client = new ApolloClient({ uri: 'http://192.168.86.20:3000/graphql' });

export default class App extends Component {

  render() {
    return (
      <ApolloProvider client={client}>
        <RNWaitlistApp />
        <RNApp />
      </ApolloProvider>
    );
  }
}