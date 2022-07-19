import {
  Text,
  Box,
  Image,
  Divider,
  Stack,
  Button,
  VStack
} from '@chakra-ui/react';
import Link from 'next/link';
import { PodcastData } from '../pages/api/search';

const Podcast = ({ podcast }: { podcast: PodcastData }) => {
  return (
    <Box height={'750px'} p='2rem' shadow='md' borderWidth='3px'>
      <Image alt='podcast image' height={'50%'} src={podcast.image} />

      <Box height={'100px'}>
        <Text fontWeight={'bold'} fontSize={'20px'} mt='1rem'>
          {podcast.title.length > 75
            ? `${podcast.title.substring(0, 75)}...`
            : podcast.title}
        </Text>
        <Divider />
      </Box>
      <Text height={'150px'} fontSize={'16px'} mt='1rem'>
        {podcast.description.length > 150
          ? `${podcast.description.substring(0, 150)}...`
          : podcast.description}
      </Text>
      <VStack mt='1rem'>
        <Link
          href={{
            pathname: '/episodes',
            query: { id: podcast.id, title: podcast.title }
          }}
        >
          <Button colorScheme={'blackAlpha'} size={'md'}>
            View Episodes
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default Podcast;
