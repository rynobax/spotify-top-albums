import React from "react";
import Head from "next/head";
import { NextComponentType, NextPageContext } from "next";

import { getPlaylist, Playlist } from "../spotify";

import "../styles/index.css";

interface InitialProps {
  playlist: Playlist;
}

const Home: NextComponentType<NextPageContext, InitialProps, InitialProps> = ({
  playlist,
}) => {
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/public/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Titillium+Web:400,700"
          rel="stylesheet"
        ></link>
      </Head>

      <div className="container mx-auto md mt-8 flex flex-row flex-wrap">
        {playlist.map((track, ndx) => {
          console.log({ track });
          const rank = ndx + 1;
          return (
            <div
              className="rounded my-4 rounded-lg flex-shrink-0 bg-gray-100 w-64 overflow-hidden mx-8"
              key={track.album}
            >
              <img className="flex-initial w-64 h-64" src={track.img} />
              <div className="p-2">
                <div className="flex flex-row align-middle">
                  <div className="flex flex-col flex-0 h-full justify-center">
                    <div className="flex-grow-0">
                      <span className="text-xl">#</span>
                      <span className="text-4xl">{rank}</span>
                    </div>
                  </div>
                  <div className="flex-0 flex flex-col pl-2">
                    <div className="h-24 text-xl text-gray-800 font-bold leading-tight">
                      {track.album}
                    </div>
                  </div>
                </div>
                <div className="h-6 text-xl text-gray-600">{track.artist}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bg-gray-800 inset-0" style={{ zIndex: -1 }} />
    </div>
  );
};

Home.getInitialProps = async () => {
  const playlist = await getPlaylist("1D9hvrANrHxVGGVx49v4x1");
  return { playlist };
};

export default Home;
