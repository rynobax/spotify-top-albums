export interface PlaylistResponse {
  href: string;
  items?: (TrackItem)[] | null;
  limit: number;
  next?: null;
  offset: number;
  previous?: null;
  total: number;
}

interface TrackItem {
  added_at: string;
  added_by: AddedBy;
  is_local: boolean;
  primary_color?: null;
  track: Track;
  video_thumbnail: VideoThumbnail;
}

interface AddedBy {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface ExternalUrls {
  spotify: string;
}

interface Track {
  album: Album;
  artists?: (Artist)[] | null;
  available_markets?: (string)[] | null;
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

interface Album {
  album_type: string;
  artists?: (Artist)[] | null;
  available_markets?: (string)[] | null;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images?: (ImagesEntity)[] | null;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface ImagesEntity {
  height: number;
  url: string;
  width: number;
}

interface ExternalIds {
  isrc: string;
}

interface VideoThumbnail {
  url?: null;
}
