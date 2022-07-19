import { PayloadToSign721, ThirdwebSDK } from '@thirdweb-dev/sdk';
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
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const key = process.env.KEY;

  if (!apiKey || !contractAddress || !key) {
    return res.status(400).json({ message: 'bad request' });
  }

  const sdk = ThirdwebSDK.fromPrivateKey(key, 'mumbai');
  const contract = sdk.getNFTCollection(contractAddress);

  switch (req.method) {
    case 'GET':
      res.status(200).json('get');
      break;
    case 'POST':
      const {
        address,
        episode,
        title
      }: { address: string; episode: EpisodeData; title: string } = req.body;

      const walletNfts = await contract.getOwned(address);

      let eligibleToMint = true;

      walletNfts.forEach((nft) => {
        if (
          nft.metadata.attributes &&
          // @ts-ignore
          nft.metadata.attributes.id === episode.id
        ) {
          eligibleToMint = false;
        }
      });

      if (!eligibleToMint) {
        return res.status(400).json({ message: 'Already minted NFT' });
      } else {
        const metadata: PayloadToSign721 = {
          metadata: {
            name: episode.title
              .replace('<p>', ' ')
              .replace('</p>', ' ')
              .substring(0, 100),
            description: title,
            image: episode.image,
            attributes: { id: episode.id }
          },
          mintStartTime: new Date(0),
          to: address
        };

        try {
          const response = await contract.signature.generate(metadata);

          res.status(201).json({
            payload: response?.payload,
            signature: response?.signature
          });
        } catch (error) {
          res.status(500).json({ error });
          console.error(error);
        }
      }

      break;
    default:
      res.status(200).json('nfts');
      break;
  }
}
