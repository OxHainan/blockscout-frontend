import { Flex, Icon, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TxAction, TxActionGeneral } from 'types/api/txAction';

import config from 'configs/app';
import uniswapIcon from 'icons/uniswap.svg';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  action: TxAction;
}

function getActionText(actionType: TxActionGeneral['type']) {
  switch (actionType) {
    case 'mint': return [ 'Add', 'Liquidity to' ];
    case 'burn': return [ 'Remove', 'Liquidity from' ];
    case 'collect': return [ 'Collect', 'From' ];
    case 'swap': return [ 'Swap', 'On' ];
  }
}

const TxDetailsAction = ({ action }: Props) => {
  const { protocol, type, data } = action;

  if (protocol !== 'uniswap_v3') {
    return null;
  }

  switch (type) {
    case 'mint':
    case 'burn':
    case 'collect':
    case 'swap': {
      const amount0 = BigNumber(data.amount0).toFormat();
      const amount1 = BigNumber(data.amount1).toFormat();
      const [ text0, text1 ] = getActionText(type);
      const token0 = {
        address: data.symbol0 === 'Ether' ? '' : data.address0,
        name: data.symbol0 === 'Ether' ? config.chain.currency.symbol || null : data.symbol0,
        type: 'ERC-20',
        symbol: null,
        icon_url: null,
      };
      const token1 = {
        address: data.symbol1 === 'Ether' ? '' : data.address1,
        name: data.symbol1 === 'Ether' ? config.chain.currency.symbol || null : data.symbol1,
        type: 'ERC-20',
        symbol: null,
        icon_url: null,
      };

      return (
        <Flex flexWrap="wrap" columnGap={ 1 } rowGap={ 2 } alignItems="center">
          <chakra.span color="text_secondary">{ text0 }: </chakra.span>

          <chakra.span fontWeight={ 600 } mr={ 1 }>{ amount0 }</chakra.span>
          <TokenEntity
            token={ token0 }
            noLink={ data.symbol0 === 'Ether' }
            noCopy
            noSymbol
            w="auto"
            maxW="200px"
            flexShrink={ 0 }
          />

          <chakra.span color="text_secondary">{ type === 'swap' ? 'For' : 'And' }: </chakra.span>

          <chakra.span fontWeight={ 600 } mr={ 1 }>{ amount1 }</chakra.span>
          <TokenEntity
            token={ token1 }
            noLink={ data.symbol1 === 'Ether' }
            noCopy
            noSymbol
            w="auto"
            maxW="200px"
            flexShrink={ 0 }
          />

          <chakra.span color="text_secondary" mr={ 1 }>{ text1 }</chakra.span>
          <Flex columnGap={ 2 }>
            <Icon as={ uniswapIcon } boxSize={ 5 } color="white" bgColor="#ff007a" borderRadius="full" p="2px"/>
            <chakra.span color="text_secondary">Uniswap V3</chakra.span>
          </Flex>
        </Flex>
      );
    }

    case 'mint_nft' : {
      const token = {
        address: data.address,
        name: data.name,
        type: 'ERC-20',
        symbol: null,
        icon_url: null,
      };

      return (
        <div>
          <Flex rowGap={ 2 } flexWrap="wrap" alignItems="center" whiteSpace="pre-wrap">
            <chakra.span mr={ 2 }>Mint of</chakra.span>
            <TokenEntity
              token={ token }
              noCopy
              w="auto"
              rowGap={ 2 }
            />
            <chakra.span> to </chakra.span>
            <AddressEntity
              address={{ hash: data.to }}
              truncation="constant"
              noIcon
              noCopy
            />
          </Flex>

          <Flex columnGap={ 1 } rowGap={ 2 } pl={ 3 } flexDirection="column" mt={ 2 }>
            {
              data.ids.map((id: string) => {
                return (
                  <Flex key={ data.address + id } whiteSpace="pre-wrap">
                    <chakra.span flexShrink={ 0 }>1 of </chakra.span>
                    <chakra.span color="text_secondary" flexShrink={ 0 }>Token ID [</chakra.span>
                    <NftEntity hash={ data.address } id={ id } noIcon w="min-content"/>
                    <chakra.span color="text_secondary" flexShrink={ 0 }>]</chakra.span>
                  </Flex>
                );
              })
            }
          </Flex>
        </div>
      );
    }

    default:
      return null;
  }
};

export default React.memo(TxDetailsAction);
