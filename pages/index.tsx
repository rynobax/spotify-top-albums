import React from 'react';
import Head from 'next/head';
import { NextComponentType, NextPageContext } from 'next';
import { getPlaylist } from '../spotify';
import { PlaylistResponse } from '../spotify/types/playlist';

import '../styles/index.css';

const qualifiers = [' (Deluxe)', ' (Extended)'];
const removeQualifiers = (name: string) =>
  qualifiers.reduce((n, q) => n.replace(q, ''), name);

interface InitialProps {
  playlist: PlaylistResponse;
}

const Home: NextComponentType<NextPageContext, InitialProps, InitialProps> = ({
  playlist
}) => {
  console.log(playlist);

  const tracks = playlist.items
    .map(item => item.track)
    .map(({ album, artists }) => ({
      artist: artists[0].name,
      album: removeQualifiers(album.name),
      img: album.images[1].url,
      uri: album.uri
    }));

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/public/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Titillium+Web"
          rel="stylesheet"
        ></link>
      </Head>

      <div className="container mx-auto md mt-8 shadow rounded">
        {tracks.map((track, ndx) => {
          const rank = ndx + 1;
          return (
            <div className="flex flex-row items-center rounded my-4 py-4 h-24">
              <div className="flex-initial w-12 bg-gray-300 m-h-full shadow-md h-full flex flex-row items-center rounded-l justify-center">
                <div className="">
                  <span className="text-xl">#</span>
                  <span className="text-4xl">{rank}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-row bg-gray-300 ml-4 items-center shadow-md h-full rounded-r overflow-hidden">
                <img className="flex-initial h-full" src={track.img} />
                <div className="flex-1 flex flex-row text-xl">
                  <div className="flex-2">{track.album}</div>
                  <div className="flex-1">{track.artist}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bg-gray-800 inset-0" style={{ zIndex: -1 }} />
    </div>
  );
};

Home.getInitialProps = async () => {
  const playlist = await getPlaylist('1D9hvrANrHxVGGVx49v4x1');
  return { playlist };
};

export default Home;
