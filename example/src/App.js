import React, { Component } from 'react'

import { MapOfRomania } from 'numeromania'

export default class App extends Component {
  
  constructor(props) {
      super(props)
      this.state = { 
          mapData : [],
      };
  }

  // componentDidMount() {
  //     fetch('data/county_population_data.json')
  //         .then((res) => res.json())
  //         .then((res) => this.setState({
  //             mapData: res,
  //             colorFunction: colorFunction(res.map(item => item.pop2011))
  //         }, () => { console.log(res)}));
  // }

  render () {
      return (
          <div>
              <MapOfRomania 
                  showLabels
                  mapData={this.state.mapData}/>            
          </div>
      )
  }
}
