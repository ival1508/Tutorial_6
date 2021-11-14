import React, { Component } from 'react';
import { TouchableHighlight, View, Text, TextInput, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { ListItem, Button } from 'react-native-elements';
import { graphql, Query } from 'react-apollo';
import { gql, useQuery } from '@apollo/client';


const query = gql`query { 
  customerList {
    queue_number name contact_number timestamp
  }
}`

class CustomerScreen extends Component {
  constructor() {
    super()
  }
  keyExtractor = (item, index) => index.toString() //function to extract and mapping result from GraphQL and render list item from the FlatList that will be added to the render section.

  renderItem = ({ item }) => (
    //<ListItem title={item.name} chevron bottomDivide />
    // <View>
    //   <Text> { item.queue_number } </Text>
    //   <Text> { item.name } </Text>
    //   <Text> { item.contact_number } </Text>
    //   <Text> { item.timestamp } </Text>
    // </View>
    <Row data={[ item.queue_number, item.name, item.contact_number, item.timestamp]} flexArr={[1, 2, 1, 1]}/>

)

  render () {
    return (
      <Query pollInterval={500} query={query}> 
        {({ loading, error, data }) => {
            if (loading) return(
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            );
            if (error) return(
                <View style={styles.activity}>
                    <Text>`Error! ${error.message}`</Text>
                </View>
            );
            return (
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={data.customerList}
                    renderItem={this.renderItem}
                    horizontal={false}
                />            );
        }}
    </Query>
    )
  }
}


export default class RNWaitlistApp extends Component { //export default class
  constructor() {
    super()
    this.state = {
      customers: []
    };
  }  

  render () {
    //Declare a constant before the class name for the query.??? why in our guide is the constant for the query is in render()?
    

    //Apollo Client GraphQL Query with pollInterval to make the page always request GraphQL data.

    return (
      <View style={styles.container}> 
        <Text style={{textAlign: 'center'}}>Welcome to Hotel California Booking Platform!</Text>
        <Row data={['queue_number', 'contact_name', 'contact_number', 'timestamp']} flexArr={[1, 2, 1, 1]} style={styles.head}/>
        <CustomerScreen />
        {/* <Table borderStyle={{borderWidth: 1}}>
          <Row data={tableHead} flexArr={[1, 2, 1, 1]} style={styles.head}/>
          <TableWrapper style={styles.wrapper}>
            <Rows data={this.state.tableData} flexArr={[2, 1, 1]} style={styles.row}/>
          </TableWrapper> 
        </Table> */}
      </View>
    );
  };
};

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff'
  },
  wrapper: {
    flexDirection: 'row'
  },
  row: {
    height: 28
  },
  input: {
    backgroundColor: '#dddddd',
    height: 50,
    margin: 20,
    marginBottom: 0,
    paddingLeft: 10
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})