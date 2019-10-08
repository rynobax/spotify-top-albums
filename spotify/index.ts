import axios from 'axios';
import { PlaylistResponse } from './types/playlist';

// albums: 1D9hvrANrHxVGGVx49v4x1

const ID = process.env.ID;
const SECRET = process.env.SECRET;

const inNode = typeof window === 'undefined';

function b64Encode(str: string) {
  if (inNode) {
    return Buffer.from(str).toString('base64');
  } else {
    return btoa(str);
  }
}

const BASIC_AUTH = b64Encode(`${ID}:${SECRET}`);

const spotifyAuth = axios.create({
  baseURL: 'https://accounts.spotify.com/api/'
});

if (!ID || !SECRET) throw Error('Did not find ID or SECRET, check .env');

async function getAccessTokenFromSpotify() {
  const res = await spotifyAuth.post('token', 'grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${BASIC_AUTH}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return res.data.access_token;
}

let token: string | null = null;
async function getClient() {
  if (!token) {
    token = await getAccessTokenFromSpotify();
  }
  return axios.create({
    baseURL: 'https://api.spotify.com/v1/',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getPlaylist(playlistId: string) {
  const spotify = await getClient();
  const { data } = await spotify.get<PlaylistResponse>(
    `playlists/${playlistId}/tracks`
  );
  return data;
}
