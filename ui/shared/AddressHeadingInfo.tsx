import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import useIsSafeAddress from 'lib/hooks/useIsSafeAddress';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressActionsMenu from 'ui/shared/AddressActions/Menu';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  address: Pick<Address, 'hash' | 'is_contract' | 'implementation_name' | 'watchlist_names' | 'watchlist_address_id'>;
  token?: TokenInfo | null;
  isLinkDisabled?: boolean;
  isLoading?: boolean;
}

const AddressHeadingInfo = ({ address, token, isLinkDisabled, isLoading }: Props) => {
  const isSafeAddress = useIsSafeAddress(!isLoading && address.is_contract ? address.hash : undefined);

  return (
    <Flex alignItems="center">
      <AddressEntity
        address={{ ...address, name: '' }}
        isLoading={ isLoading }
        fontFamily="heading"
        fontSize="lg"
        fontWeight={ 500 }
        noLink={ isLinkDisabled }
        isSafeAddress={ isSafeAddress }
      />
      { !isLoading && address.is_contract && token && <AddressAddToWallet ml={ 2 } token={ token }/> }
      { !isLoading && !address.is_contract && config.features.account.isEnabled && (
        <AddressFavoriteButton hash={ address.hash } watchListId={ address.watchlist_address_id } ml={ 3 }/>
      ) }
      <AddressQrCode address={ address } ml={ 2 } isLoading={ isLoading } flexShrink={ 0 }/>
      { config.features.account.isEnabled && <AddressActionsMenu isLoading={ isLoading }/> }
    </Flex>
  );
};

export default AddressHeadingInfo;
