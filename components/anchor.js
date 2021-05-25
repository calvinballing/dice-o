import React from 'react';
import {colors} from '../styles/styles'

import {Text} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
//https://www.jsparling.com/setting-up-privacy-policy-and-terms-and-conditions-for-react-native-apps/

const handlePress = (href) => {
  WebBrowser.openBrowserAsync(href);
}

export const Anchor = (props) => (
  <Text {...props} style={{color: colors.linkBlue}} onPress={() => handlePress(props.href)}>
    {props.children}
  </Text>
)

export default Anchor