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
    <Box p='2rem' shadow='md' borderWidth='3px'>
      <Image alt='podcast image' height={'50%'} src={podcast.image} />

      <Text fontWeight={'bold'} fontSize={'20px'} mt='1rem'>
        {podcast.title}
      </Text>
      <Divider />
      <Text height='200px' fontSize={'16px'} mt='1rem'>
        {podcast.description.length > 400
          ? `${podcast.description.substring(0, 400)}...`
          : podcast.description}
      </Text>
      <VStack mt='2rem'>
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
