import React, { Component } from 'react'
import { TouchableHighlight, View, Text, TextInput, StyleSheet } from 'react-native'

import { graphql } from 'react-apollo';
import gql from 'graphql-tag'

export default class RNApp extends Component { //export default class
  constructor() {
    super()
    this.state = {
      name: 'Glasha',
    }
    this.updateName = this.updateName.bind(this)
  }
  updateName(name) {
    this.setState({
      name
    })
  }
  render () {
    const query = gql`query ($name: String!) { 
      customerRequest(customer: {name: $name}) {
        queue_number
        name
        contact_number
        timestamp
      }
    }`

    const Customers = ({ data }) => ( //view corresponding to the president
      <View style={{paddingLeft: 20, paddingTop: 20}}>
        <Text>queue_number: {data.customerRequest && data.customerRequest.queue_number}</Text>
        <Text>name: {data.customerRequest && data.customerRequest.name}</Text>
        <Text>contact_number: {data.customerRequest && data.customerRequest.contact_number}</Text>
      </View>
    )
    
    const ViewWithData = graphql(query, {
      options: { variables: { name: this.state.name } }
    })(Customers)

    return (
      <View> 
        <Text style={{textAlign: 'center'}}>Enter customer's name to find info details</Text>
        <TextInput
        onChangeText={this.updateName}
        // when somebody tries to change content, we immediately call function to update name
        style={styles.input} />
        <ViewWithData />
      </View>
    );
  };
};

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#dddddd',
    height: 50,
    margin: 20,
    marginBottom: 0,
    paddingLeft: 10
  }
})