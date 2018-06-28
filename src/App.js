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
          { name: 'Beat It', duration: 346 },
          { name: 'Cammeloni Makaroni', duration: 221 },
          { name: 'Rosa Helikopter', duration: 303 }
        ]
      },
      {
        name: 'Discover Weekly',
        songs: [
          { name: 'Le Song', duration: 183 },
          { name: 'The Kalsong Song', duration: 286 },
          { name: 'Heroes', duration: 186 },
          { name: 'One', duration: 286 }]
      },
      {
        name: 'Kids Today',
        songs: [{ name: 'Ich bin Schnappi', duration: 189 },
        { name: 'Here comes Pippi Longstocking', duration: 189 },
        { name: 'Donald Ducker', duration: 189 }
        ]
      },
      {
        name: 'Amazing Times',
        songs: [{ name: 'Streets of Philadelphia', duration: 219 },
        { name: 'Fields of Gold', duration: 210 },
        { name: 'One', duration: 139 },
        { name: 'Romeo & Juliet', duration: 184 }
        ]
      }
    ]
  }
}

// PlaylistCounter Component
class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: '40%', display: 'inline-block' }}>
        <h2>{this.props.playlists.length} Playlists</h2>
      </div>
    );
  }
};


// HoursCounter Component
class HoursCounter extends Component {
  render() {
    // All Songs to an Array
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs);
    }, []);

    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration;
    }, 0);
    return (
      <div style={{ ...defaultStyle, width: '40%', display: 'inline-block' }}>
        <h2>{Math.round(totalDuration / 60)} Hours</h2>
      </div>
    );
  }
};

// Filter Component
class Filter extends Component {
  render() {
    return (
      <div style={{ defaultStyle }}>
        <img alt="" />
        <input type="text" />
      </div>
    );
  }
}


// Playlist Component
class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div className="playlist" style={{ ...defaultStyle, width: "25%", display: "inline-block" }}>
        <img alt="" />
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li> {song.name} </li>
          )}
        </ul>
      </div>
    );
  }
}

// MAIN APP
class App extends Component {

  constructor() {
    super();
    this.state = { serverData: {} };
  }

  componentDidMount() {
    // Fake Server Response Time
    setTimeout(() => {
      this.setState({ serverData: fakeServerData });
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
            <PlaylistCounter playlists={this.state.serverData.user.playlists} />
            <HoursCounter playlists={this.state.serverData.user.playlists} />
            <Filter />
            {this.state.serverData.user.playlists.map(playlist =>
              <Playlist playlist={playlist} />
            )}
          </div> : <h2 style={defaultStyle}>Loading ...</h2>
        }
      </div>
    );
  }
}

export default App;
