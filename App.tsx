/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {Wormhole} from '@wormhole-foundation/connect-sdk';
import {EvmPlatform} from '@wormhole-foundation/connect-sdk-evm';
import {SolanaPlatform} from '@wormhole-foundation/connect-sdk-solana';
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {getStuff} from './helpers';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button
            title="Test ezmode"
            onPress={() => {
              (async function () {
                const wh = new Wormhole('Testnet', [
                  EvmPlatform,
                  SolanaPlatform,
                ]);

                // Get signers
                const {signer: fromSigner, address: fromAddress} =
                  await getStuff(wh.getChain('Avalanche'));
                const {signer: toSigner, address: toAddress} = await getStuff(
                  wh.getChain('Solana'),
                );

                // Make (manual) a token transfer
                const xfer = await wh.tokenTransfer(
                  'native',
                  1_000_000_000_000n,
                  fromAddress,
                  toAddress,
                  false,
                );

                const srcTxIds = await xfer.initiateTransfer(fromSigner);
                console.log('Initiated transfer with txids: ', srcTxIds);

                const attestation = await xfer.fetchAttestation();
                console.log('Got attestation: ', attestation);

                const dstTxIds = await xfer.completeTransfer(toSigner);
                console.log('Completed transfer with txids: ', dstTxIds);
              })();
            }}
          />
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
