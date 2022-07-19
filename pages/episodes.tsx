import {
  Center,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Box
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import ConnectWalletButton from '../components/ConnectWalletButton';
import { useEffect, useState } from 'react';
import Episode from '../components/Episode';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Episodes: NextPage = () => {
  const [results, setResults] = useState([]);

  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    const search = async () => {
      try {
        const response = await fetch('/api/search?id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });
        const data = await response.json();
        console.log('Reponse Data -->>', data);
        setResults(data);
      } catch (error) {
        console.error(error);
      }
    };
    search();
  }, [id]);

  return (
    <Box>
      <Container mt={'3rem'}>
        <Grid templateColumns='repeat(20, 1fr)' gap={6}>
          <GridItem colSpan={19}>
            <Center width={'75%'} margin='1rem'>
              <VStack>
                <Heading>NFT Podcasts</Heading>
                <Text fontStyle={'italic'}>
                  Earn NFTs by listening to podcasts
                </Text>
              </VStack>
            </Center>
          </GridItem>
          <GridItem colSpan={1}>
            <ConnectWalletButton />
          </GridItem>
        </Grid>
      </Container>
      {results.length > 0 ? (
        <SimpleGrid margin={'3rem'} spacing={2} columns={[1, null, 3]}>
          {results.length &&
            results.map((episode) => {
              return (
                <Episode
                  key={results.indexOf(episode)}
                  episode={episode}
                  title={
                    router.query.title ? (router.query.title as string) : ''
                  }
                ></Episode>
              );
            })}
        </SimpleGrid>
      ) : (
        <VStack textAlign={'center'}>
          <Text fontStyle={'italic'}>
            Your search results will be displayed here...
          </Text>
        </VStack>
      )}
      <Image
        width={'100px'}
        height={'10px'}
        alt='listen notes logo'
        src={'/listenNotes.png'}
      />
    </Box>
  );
};

export default Episodes;
