import React, { useRef } from "react";
import Head from "next/head";
import { NextComponentType, NextPageContext } from "next";

import PlayIcon from "../components/PlayIcon";

import { getPlaylist, Playlist } from "../spotify";

import "../styles/index.css";

let cacheIsMobile: boolean | undefined;
function isMobile() {
  if (cacheIsMobile === undefined) {
    cacheIsMobile = /iPhone|iPad|iPod|Android/i.test(
      window.navigator.userAgent
    );
  }
  return cacheIsMobile;
}

interface InitialProps {
  playlist: Playlist;
}

const Home: NextComponentType<NextPageContext, InitialProps, InitialProps> = ({
  playlist,
}) => {
  // Not all tracks have preview
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const nowPlaying = useRef<number | null>(null);

  function playOrPause(i: number) {
    const refs = audioRefs.current;
    if (!refs) return;
    const ref = refs[i];
    if (!ref) return;
    // Quiet the music down on desktop
    if (!isMobile()) ref.volume = 0.1;

    const npNdx = nowPlaying.current;
    if (npNdx !== null && npNdx !== i) {
      const npref = refs[npNdx];
      npref.pause();
    }

    if (ref.paused) {
      nowPlaying.current = i;
      ref.play();
    } else {
      nowPlaying.current = null;
      ref.pause();
    }
  }

  return (
    <div className="bg-gray-800">
      <Head>
        <title>Home</title>
        <link rel="icon" href="/public/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Titillium+Web:400,700"
          rel="stylesheet"
        ></link>
      </Head>

      <div className="text-center text-5xl text-gray-200 pt-8">
        {`Ryan's fav albums`.toUpperCase()}
      </div>

      <div className="container mx-auto md mt-8 flex flex-row flex-wrap justify-center subpixel-antialiased">
        {playlist.map((track, ndx) => {
          const rank = ndx + 1;
          return (
            <div
              className="rounded my-4 rounded-lg flex-shrink-0 w-64 overflow-hidden mx-8 flex flex-col"
              key={track.album.id}
            >
              <PlayIcon className="w-64 h-64 p-24 absolute" />
              <img
                className={
                  "flex-initial w-64 h-64 z-10" +
                  (track.preview ? " audio-hover cursor-pointer" : "")
                }
                src={track.img}
                onClick={() => playOrPause(ndx)}
              />
              {track.preview && (
                <audio
                  src={track.preview}
                  preload="none"
                  ref={e => (audioRefs.current[ndx] = e)}
                />
              )}
              <div className="p-2 flex flex-col flex-1 bg-gray-100">
                <div className="flex flex-row align-middle flex-0">
                  <div className="flex flex-col flex-0 h-full justify-center">
                    <div className="flex-grow-0">
                      <span className="text-xl">#</span>
                      <span className="text-4xl">{rank}</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col pl-2">
                    <div className="text-xl text-gray-800 font-bold leading-tight text-right">
                      <a
                        className="hover:underline hover:text-gray-900"
                        href={track.album.uri}
                      >
                        {track.album.name}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <div className="text-xl text-gray-600">
                    {track.artists.map((a, i) => (
                      <React.Fragment key={a.name}>
                        <a
                          className="hover:underline hover:text-gray-900"
                          href={a.uri}
                        >
                          {a.name}
                        </a>
                        {i !== track.artists.length - 1 && ", "}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Home.getInitialProps = async () => {
  const playlist = await getPlaylist("1D9hvrANrHxVGGVx49v4x1");
  return { playlist };
};

export default Home;
