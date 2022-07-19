import { Text, Box, Image, Divider, VStack, Button } from '@chakra-ui/react';
import { EpisodeData } from '../pages/api/search';
import ReactAudioPlayer from 'react-audio-player';
import { useState } from 'react';
import { useAddress, useMetamask } from '@thirdweb-dev/react';
import { useNFTCollection } from '@thirdweb-dev/react';

const Episode = ({
  episode,
  title
}: {
  episode: EpisodeData;
  title: string;
}) => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const nftCollection = useNFTCollection(
    '0xfc92dc3b7AF0744eCD994C1DB27A4dAe88503Ac5'
  );

  const [timeListened, setTimeListened] = useState(0);
  const [completedEpisode, setCompletedEpisode] = useState(false);
  const [loading, setLoading] = useState(false);

  const ended = (e: any) => {
    const halfTime = episode.length / 2;
    console.log('Half time', halfTime);
    console.log('time listened', timeListened);
    if (timeListened < halfTime - 15) {
      return;
    } else {
      setCompletedEpisode(true);
    }
  };

  const claimNFT = async () => {
    setLoading(true);
    if (!completedEpisode) {
      setLoading(false);
      return;
    } else {
      try {
        const response = await fetch('/api/mint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ episode, address, title })
        });
        const data = await response.json();
        console.log('Reponse Data -->>', data);

        if (response && response.status !== 400) {
          connectWithMetamask;
          const mintInput = {
            signature: data.signature,
            payload: data.payload
          };

          await nftCollection?.signature.mint(mintInput);
          setLoading(false);
          alert('NFT successfully minted!');
        }

        if (response.status === 400) {
          setLoading(false);
          alert('You have already claimed this NFT');
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  const countTime = (e: any) => {
    const updatedTime = timeListened + 15;
    setTimeListened(updatedTime);
  };
  return (
    <Box p='2rem' shadow='md' borderWidth='3px'>
      <Image alt='episode image' height={'50%'} src={episode.image} />

      <Box height={'100px'}>
        <Text fontWeight={'bold'} fontSize={'20px'} mt='1rem'>
          {episode.title}
        </Text>
        <Divider />
      </Box>

      <VStack spacing={10} mt='2rem'>
        <ReactAudioPlayer
          listenInterval={15000}
          onEnded={ended}
          src={episode.audio}
          controls
          onListen={countTime}
        />
        <VStack>
          {loading ? (
            <Box>
              <Text fontStyle={'italic'} textAlign={'center'}>
                <b>Minting your NFT...</b> This may take up to 1 minute
              </Text>
              <Divider />
              <Text fontStyle={'italic'} textAlign={'center'}>
                You will need to approve <b>1 transaction</b>
              </Text>
            </Box>
          ) : (
            <VStack>
              <Button
                onClick={claimNFT}
                colorScheme={'green'}
                disabled={!completedEpisode}
              >
                Claim NFT
              </Button>
              <Text
                display={!completedEpisode ? '' : 'none'}
                color={'gray'}
                fontSize={'14px'}
              >
                You must listen to the full episode before claiming an NFT
              </Text>
            </VStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Episode;
