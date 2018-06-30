import React, { Component } from 'react';
import queryString from 'query-string-es5';
import './App.css';


// Variables
let defaultStyle = {
  color: '#fafafa'
}

// PlaylistCounter Component
class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: '40%', display: 'inline-block' }}>
        <h2 style={{ marginBottom: '-20px' }}>{this.props.playlists.length}</h2>
        <h4>Playlists</h4>
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
        <h2 style={{ marginBottom: '-20px' }}>{Math.round(totalDuration / 60)}</h2>
        <h4>Hours</h4>
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
        <input type="text" className="searchBar" placeholder="Name a Track or Playlist" onKeyUp={event => {
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
      <div className="playlist" style={{ ...defaultStyle }}>
        <img src={playlist.imageUrl} style={{ 'borderRadius': '50%' }} alt="" />
        <div style={{ fontSize: '1.2rem', fontWeight: '700', margin: '25px 0', marginLeft: '-20px' }}>{
          playlist.name
        }
        </div>
        <ul className="list">
          {playlist.songs.map(song =>
            <li className="list-item"> {song.name} </li>
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

    if (!accessToken)
      return;

    // Fetch User Data
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.id
        }
      }))
      .catch(err => console.log('ERROR: ' + err))

    // Fetch Playlist Data
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      .then(playlistData => {
        let playlists = playlistData.items
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
          })
          let trackDataPromise = responsePromise
            .then(response => response.json())
          return trackDataPromise
        })
        let allTracksDatasPromises =
          Promise.all(trackDataPromises)
        let playlistsPromise = allTracksDatasPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }))
          })
          return playlists
        })
        return playlistsPromise
      })
      .then(playlists => this.setState({
        playlists: playlists.map(item => {
          return {
            name: item.name.split('').length > 15
              ? item.name.split('').splice(0, 17).join('') + '...'
              : item.name,
            imageUrl: item.images[0].url,
            songs: item.trackDatas.slice(0, 3)
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
        ? this.state.playlists.filter(playlist => {
          let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())
          let matchesSong = playlist.songs.find(song => song.name.toLowerCase().includes(this.state.filterString.toLowerCase()))
          return matchesPlaylist || matchesSong
        }) : []


    return (
      <div className="App" >
        {
          this.state.user ?
            <div>
              <h1 className="title">

                {this.state.user.name}
              </h1>
              <h3 style={{ marginTop: '-20px' }}>Playlists</h3>

              <PlaylistCounter playlists={playlistToRender} />

              <HoursCounter playlists={playlistToRender} />

              <Filter onTextChange={text => this.setState({ filterString: text })} />
              <div className="playlists">
                {
                  playlistToRender
                    .map(playlist =>
                      <Playlist playlist={playlist} />
                    )
                }
              </div>

            </div> : <div className='btn' style={{ 'margin': '25% 0' }}
              onClick={() => {
                window.location = window.location.href.includes('localhost')
                  ? 'http://localhost:8888/login'
                  : 'https://playlistme-backend.herokuapp.com/login'

              }}>Sign in with Spotify</div>

        }
      </div>
    );
  }
}

export default App;
