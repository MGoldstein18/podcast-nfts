import { Button, Text } from '@chakra-ui/react';
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useChainId,
  ChainId
} from '@thirdweb-dev/react';

const ConnectWalletButton = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const chainId = useChainId();
  return (
    <div>
      {address ? (
        <>
          {chainId !== ChainId.Polygon ? (
            <Text textAlign={'center'} color={'red'} fontWeight='bold'>
              Please connect to Polygon
            </Text>
          ) : (
            <p></p>
          )}
          <Button size={'sm'} colorScheme={'pink'} onClick={disconnectWallet}>
            Disconnect Wallet
          </Button>
        </>
      ) : (
        <Button size={'sm'} colorScheme={'pink'} onClick={connectWithMetamask}>
          Connect with Metamask
        </Button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
