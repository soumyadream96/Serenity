import React, { useRef } from 'react';
import { ScrollView } from 'react-native';

import { useScrollToTop } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { NetNotify } from '../../components/NetNotify';
import { RecentContainer } from '../../containers/RecentContainer';
import { MostPlayedContainer } from '../../containers/MostPlayedContainer';
import OnlineContainer from '../../containers/OnlineContainer';
import { Screen } from '../../components/Screen';
import { ShortCutContainer } from '../../containers/ShortcutContainer';
import OnlineSongsContainer from '../../containers/OnlineSongsContainer';
import YoutubeSongsContainer from '../../containers/YoutubeSongsContainer';

export const MainScreen = () => {
  const ref = useRef();
  const { skipLoginState } = useSelector(state => state.user);
  console.log('skip login', skipLoginState);
  useScrollToTop(ref);
  return (
    <Screen>
      <ScrollView ref={ref}>
        <NetNotify />
        <ShortCutContainer />
        <OnlineContainer />
        <RecentContainer />
        <MostPlayedContainer />
        <OnlineSongsContainer />
        {!skipLoginState && <YoutubeSongsContainer />}
      </ScrollView>
    </Screen>
  );
};
