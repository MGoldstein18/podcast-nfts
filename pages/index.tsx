import {
  Button,
  Center,
  Container,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  VStack,
  SimpleGrid,
  Box
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import ConnectWalletButton from '../components/ConnectWalletButton';
import { useState } from 'react';
import Podcast from '../components/Podcast';

const Home: NextPage = () => {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearchPhraseChange = (e: any) => {
    setSearchPhrase(e.target.value);
  };

  const search = async () => {
    setSearching(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchPhrase })
      });
      const data = await response.json();
      console.log('Reponse Data -->>', data);
      setResults(data);
    } catch (error) {
      console.error(error);
    }
    setSearching(false);
    setSearchPhrase('');
  };

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
        <Center mt='1.5rem'>
          <VStack width={'100%'}>
            <Input
              onChange={handleSearchPhraseChange}
              value={searchPhrase}
              placeholder='Which podcast do you want to listen to?'
              borderColor={'darkslategrey'}
              variant={'filled'}
            />
            <Button onClick={search}>Search Now</Button>
          </VStack>
        </Center>
      </Container>
      {results.length > 0 ? (
        <SimpleGrid margin={'3rem'} spacing={2} columns={3}>
          {results.length &&
            results.map((podcast) => {
              return (
                <Podcast
                  key={results.indexOf(podcast)}
                  podcast={podcast}
                ></Podcast>
              );
            })}
        </SimpleGrid>
      ) : (
        <VStack textAlign={'center'}>
          <Text></Text>
        </VStack>
      )}
    </Box>
  );
};

export default Home;
