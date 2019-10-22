import axios from "axios";
const Vibrant: TVibrant = require("node-vibrant");

type Palette = Record<
  | "DarkMuted"
  | "DarkVibrant"
  | "DarkMuted"
  | "LightMuted"
  | "Muted"
  | "Vibrant",
  { rgb: [number, number, number] }
>;

interface VibrantInstance {
  getPalette: () => Promise<Palette>;
}

interface TVibrant {
  from: (url: string) => VibrantInstance;
}

import { PlaylistResponse } from "./types/playlist";

// albums: 1D9hvrANrHxVGGVx49v4x1

const ID = process.env.ID;
const SECRET = process.env.SECRET;

const inNode = typeof window === "undefined";

function b64Encode(str: string) {
  if (inNode) {
    return Buffer.from(str).toString("base64");
  } else {
    return btoa(str);
  }
}

const BASIC_AUTH = b64Encode(`${ID}:${SECRET}`);

const spotifyAuth = axios.create({
  baseURL: "https://accounts.spotify.com/api/",
});

if (!ID || !SECRET) throw Error("Did not find ID or SECRET, check .env");

async function getAccessTokenFromSpotify() {
  const res = await spotifyAuth.post("token", "grant_type=client_credentials", {
    headers: {
      Authorization: `Basic ${BASIC_AUTH}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return res.data.access_token;
}

let token: string | null = null;
async function getClient() {
  if (!token) {
    token = await getAccessTokenFromSpotify();
  }
  return axios.create({
    baseURL: "https://api.spotify.com/v1/",
    headers: { Authorization: `Bearer ${token}` },
  });
}

const qualifiers = [/ (\(.*\))/];
const removeQualifiers = (name: string) =>
  qualifiers.reduce((n, q) => n.replace(q, ""), name);

type ExtractPromise<T> = T extends Promise<infer U> ? U : never;
export type Playlist = ExtractPromise<ReturnType<typeof getPlaylist>>;

export async function getPlaylist(playlistId: string) {
  const spotify = await getClient();
  const { data: playlist } = await spotify.get<PlaylistResponse>(
    `playlists/${playlistId}/tracks`
  );
  const tracks = await Promise.all(
    playlist.items
      .map(item => item.track)
      .map(async ({ album, artists }) => {
        const v = Vibrant.from(album.images[1].url);
        const palette = await v.getPalette();
        return {
          artist: artists[0].name,
          album: removeQualifiers(album.name),
          // 0: 640px, 1: 300px, 2: 64px
          img: album.images[1].url,
          uri: album.uri,
          palette,
        };
      })
  );

  return tracks;
}
