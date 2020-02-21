import fetch from "isomorphic-unfetch";

import { PlaylistResponse } from "./types/playlist";

// albums: 1D9hvrANrHxVGGVx49v4x1

// typeof window === "undefined" checks if we are in node
// If not, the code gets stripped by webpack

let ID;
let SECRET;
let REFRESH_TOKEN;

if (typeof window === "undefined") {
  ID = process.env.ID;
  SECRET = process.env.SECRET;
  REFRESH_TOKEN = process.env.REFRESH_TOKEN;
}

function b64Encode(str: string) {
  if (typeof window === "undefined") {
    return Buffer.from(str).toString("base64");
  } else {
    return btoa(str);
  }
}

const BASIC_AUTH = b64Encode(`${ID}:${SECRET}`);

if (typeof window === "undefined") {
  if (!ID || !SECRET || !REFRESH_TOKEN)
    throw Error("Did not find one of ID, SECRET, REFRESH_TOKEN, check .env");
}

function formEncode(obj: { [k: string]: string }) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

async function getAccessTokenFromSpotify() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC_AUTH}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: formEncode({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });
  if (res.status !== 200) {
    const data = await res.json();
    console.error(data);
    throw Error(`${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  return data.access_token;
}

let token: string | null = null;
async function makeSpotifyReq<T>(url: string) {
  if (!token) {
    token = await getAccessTokenFromSpotify();
  }
  const response = await fetch(`https://api.spotify.com/v1/${url}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data as T;
}

const qualifiers = [/ (\(.*\))/];
const removeQualifiers = (name: string) =>
  qualifiers.reduce((n, q) => n.replace(q, ""), name);

type ExtractPromise<T> = T extends Promise<infer U> ? U : never;
export type Playlist = ExtractPromise<ReturnType<typeof getPlaylist>>;

export async function getPlaylist(playlistId: string) {
  const playlist = await makeSpotifyReq<PlaylistResponse>(
    `playlists/${playlistId}/tracks?market=US`
  );
  const tracks = await Promise.all(
    playlist.items
      .map(item => item.track)
      .map(async ({ album, preview_url }) => ({
        artists: album.artists.map(a => ({
          id: a.id,
          name: a.name,
          uri: a.uri,
        })),
        album: {
          id: album.id,
          name: removeQualifiers(album.name),
          uri: album.uri,
        },
        // 0: 640px, 1: 300px, 2: 64px
        img: album.images[1].url,
        uri: album.uri,
        preview: preview_url,
      }))
  );

  return tracks;
}
