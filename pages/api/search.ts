import type { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
const { Client } = require('podcast-api');

dotenv.config();

export interface PodcastData {
  title: string;
  image: string;
  thumbnail: string;
  id: string;
  description: string;
}

export interface EpisodeData extends PodcastData {
  audio: string;
  length: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.LISTEN_NOTES_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ message: 'bad request' });
  }

  switch (req.method) {
    case 'GET':
      res.status(200).json('get');
      break;
    case 'POST':
      const client = Client({ apiKey });
      if (req.body.id) {
        let episodes: EpisodeData[];
        const results = await client
          .fetchPodcastById({
            id: req.body.id
          })
          .then((response: any) => {
            return response.data;
          })
          .catch((error: any) => {
            console.log(error);
          });

        episodes = results?.episodes?.map((episode: any) => {
          const newEpisode: EpisodeData = {
            title: episode.title,
            description: episode.description,
            audio: episode.audio,
            id: episode.id,
            image: episode.image,
            thumbnail: episode.thumbnail,
            length: episode.audio_length_sec
          };
          return newEpisode;
        });

        console.log('Episodes --->>> ', episodes ? episodes : 'episodes');
        res.status(200).json(episodes);
        break;
      } else {
        let podcasts: PodcastData[];

        const results = await client
          .search({
            q: req.body.searchPhrase,
            sort_by_date: 0,
            type: 'podcast'
          })
          .then((response: any) => {
            return response.data.results;
          })
          .catch((error: any) => {
            console.log(error);
          });
        podcasts = results.map((podcast: any) => {
          const newPodcast: PodcastData = {
            description: podcast.description_original
              .replace('<p>', ' ')
              .replace('</p>', ' ')
              .replace('</p><p>', ' ')
              .replace('<p>', ' ')
              .replace('</p>', ' '),
            title: podcast.title_original,
            image: podcast.image,
            thumbnail: podcast.thumbnail,
            id: podcast.id
          };
          return newPodcast;
        });
        console.log('Podcasts --->>>', podcasts);
        res.status(200).json(podcasts);
        break;
      }

    default:
      res.status(200).json('nfts');
      break;
  }
}
