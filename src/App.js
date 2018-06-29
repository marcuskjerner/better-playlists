import React, { Component } from 'react';
import queryString from 'query-string';
import './App.css';

// Variables
let defaultStyle = {
  color: '#fafafa'
}

// let fakeServerData = {
//   user: {
//     name: 'Marcus',
//     playlists: [
//       {
//         name: 'My Favorites',
//         songs: [
//           { name: 'Beat It', duration: 346 },
//           { name: 'Cammeloni Makaroni', duration: 221 },
//           { name: 'Rosa Helikopter', duration: 303 }
//         ]
//       }
//     ]
//   }
// }

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
        <input type="text" onKeyUp={event => {
          this.props.onTextChange(event.target.value)
        }}
        />
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
        <img src={playlist.imageUrl} style={{ 'width': '50%', 'border-radius': '50%' }} alt="" />
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
    this.state = {
      serverData: {},
      filterString: ''
    }
  }

  componentDidMount() {
    const parsed = queryString.parse(window.location.search);
    const accessToken = parsed.access_token;
    // const url = 'https://api.spotify.com/v1/me';

    // Fetch User Data
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }))
      .catch(err => console.log('ERROR: ' + err))

    // Fetch Playlist Data
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      .then(data => this.setState({
        playlists: data.items.map(item => {
          console.log(data.items)
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: []
          }
        })
      })
      )
      .catch(err => console.log('ERROR: ' + err))

  }

  render() {
    let playlistToRender =
      this.state.user &&
        this.state.playlists
        ? this.state.playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()))
        : []
    return (
      <div className="App" >
        {this.state.user ?
          <div>
            <h1 className="title">
              {this.state.user.name}'s Playlists
              </h1>
            <PlaylistCounter playlists={playlistToRender} />

            <HoursCounter playlists={playlistToRender} />

            <Filter onTextChange={text => this.setState({ filterString: text })} />

            {
              playlistToRender
                .map(playlist =>
                  <Playlist playlist={playlist} />
                )
            }

          </div> : <div className='btn' style={{ 'margin': '25% 0' }} onClick={() => window.location = 'http://localhost:8888/login'}>Sign in with Spotify</div>

        }
      </div>
    );
  }
}

export default App;
