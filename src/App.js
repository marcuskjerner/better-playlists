import React, { Component } from 'react';
import './App.css';

// Variables
let defaultStyle = {
  color: '#fafafa'
}

let fakeServerData = {
  user: {
    name: 'Marcus',
    playlists: [
      {
        name: 'My Favorites',
        songs: [
            {name: 'Beat It', duration: 346},
            {name: 'Cammeloni Makaroni', duration: 221},
            {name: 'Rosa Helikopter', duration: 303}
          ]
      },
      {
        name: 'Discover Weekly',
        songs: [{name: 'Le Song', duration: 286}, 
        {name: 'The Kalsong Song', duration: 286}, 
        {name: 'Heroes', duration: 286}, 
        {name: 'One', duration: 286}]

      },
      {
        name: 'Kids Today',
        songs: ['Ich bin Schnappi', 'Here comes Pippe Longstocking', 'Donald Ducker']
      },
      {
        name: 'My Best Songs',
        songs: ['Wunderbaum', '99 Luftballong', 'Scharzwald', 'Kartoffeln']
      }
    ]
  } 
}

// PlaylistCounter Component
class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{this.props.playlists && this.props.playlists.length} Playlists</h2>
      </div>
    );
  }
};


// HoursCounter Component
class HoursCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{this.props.playlists && this.props.playlists.length} Hours</h2>
      </div>
    );
  }
};

// Filter Component
class Filter extends Component {
  render() {
    return (
      <div style={{defaultStyle}}>
        <img alt=""/>
        <input type="text" />
      </div>
    );
  }
}


// Playlist Component
class Playlist extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "25%", display: "inline-block"}}>
        <img alt=""/>
        <h3>Playlist Name</h3>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
        </ul>
      </div>
    );
  }
}

// MAIN APP
class App extends Component {
  
  constructor() {
    super();
    this.state = {serverData: {}};
  }

  componentDidMount() {
    // Fake Server Response Time
    setTimeout(() => {
      this.setState({serverData: fakeServerData});
    }, 150);
    
  }
  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
          <div> 
            <h1 className="title">
            {this.state.serverData.user.name}'s Playlist
          </h1>
          <PlaylistCounter playlists={this.state.serverData.user.playlists}/>
          <HoursCounter playlists={this.state.serverData.user.playlists}/>
          <Filter />
          <Playlist />
          <Playlist />
          <Playlist /> 
        </div> : <h2 style={defaultStyle}>Loading ...</h2>
        }
      </div>
    );
  }
}

export default App;
