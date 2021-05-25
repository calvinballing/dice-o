import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import React, { Component } from 'react';


import { ControlLogged } from './screens/controlLogged'
import { CourseType } from './screens/courseType'
import { Disclaimer } from './screens/disclaimer'
import { ExportQR } from './screens/exportQR'
import { Game } from './screens/game'
import { GameExplainer } from './screens/gameExplainer'
import { GameSettings } from './screens/gameSettings'
import { ImportQR } from './screens/importQR'
import { Results } from './screens/results'
import { SetCourse } from './screens/setCourse'
import { SetCourseExplainer } from './screens/setCourseExplainer'
import { SetBoundary } from './screens/setBoundary'
import { SetBoundaryExplainer } from './screens/setBoundaryExplainer'
import { SetFinish } from './screens/setFinish'
import { SetFinishExplainer } from './screens/setFinishExplainer'
import { SetStart } from './screens/setStart'
import { SetStartExplainer } from './screens/setStartExplainer'
import { Settings } from './screens/settings'
import { Splash } from './screens/splash'
import { strings } from './strings';
import SettingsContext from './context';

const MainStack = createStackNavigator()
const RootStack = createStackNavigator()

if(Platform.OS === 'android') { // only android needs polyfill
  require('intl'); // import intl object
  require('intl/locale-data/jsonp/en-US'); // load the required locale details
}

function MainStackScreen() {
  return (

    <MainStack.Navigator
    screenOptions = {{
      headerTitleAlign: "center",
    }}
    >
      <MainStack.Screen name={strings.header.home} options={{ headerShown: false }} component={Splash} />
      <MainStack.Screen name={strings.header.disclaimer}
        options={{
          headerTitleAlign: "center",
        }}
        component={Disclaimer} />
      <MainStack.Screen 
       name="CourseType"
      options={{
          title: strings.header.courseType,
        }}
      component={CourseType} />
      <MainStack.Screen 
       name="Settings"
      options={{
          title: strings.header.settings,
          gestureEnabled: false,
        }}
      component={Settings} />
      <MainStack.Screen
        name="SetBoundary"
        options={{
          title: strings.header.setBoundary,
          headerBackTitle: strings.header.settingsShort,
          gestureEnabled: false,
        }}
        component={SetBoundary}
      />
      <MainStack.Screen
        name="SetCourse"
        options={{
          title: strings.header.setCourse,
          headerBackTitle: strings.header.setFinishShort,
          gestureEnabled: false,
        }}
        component={SetCourse}
      />
      <MainStack.Screen
        name="SetStart"
        options={{
          title: strings.header.setStart,
          headerBackTitle: strings.header.setBoundaryShort,
        }}
        component={SetStart}
      />
      <MainStack.Screen
        name="SetFinish"
        options={{
          title: strings.header.setFinish,
          headerBackTitle: strings.header.setStartShort,
        }}
        component={SetFinish}
      />
      <MainStack.Screen
        name="Game"
        options={{
          title: strings.header.game,
          headerBackTitle: strings.header.gameExit,
          gestureEnabled: false,
        }}
        component={Game} />
      <MainStack.Screen
        name="ControlLogged"
        options={{
          title: strings.header.controlLogged,
        }}
        component={ControlLogged} />
      <MainStack.Screen
        name="Results"
        options={{
          title: strings.header.results,
          headerLeft:null,
          gestureEnabled: false,
          //TODO: Still need to investigate blocking going back on the results screen with the native android back button
          //https://reactnavigation.org/docs/preventing-going-back
        }}
        component={Results} />
    </MainStack.Navigator>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {

    //TODO, ensure we are correctly handling Status Bar Color changes

    return (
      <SettingsContext>
        <NavigationContainer>
          <RootStack.Navigator mode="modal"
          screenOptions = {{
            headerTitleAlign: "center",
            headerBackTitle: strings.header.back,
          }
          }
          >
            <RootStack.Screen
              name={strings.header.back}
              component={MainStackScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="SetBoundaryExplainer"
              options={{ title: strings.header.setBoundaryExplainer,}}
              component={SetBoundaryExplainer}
            />
            <RootStack.Screen
              name="SetStartExplainer"
              options={{title: strings.header.setStartExplainer,}}
              component={SetStartExplainer}
            />
            <RootStack.Screen
              name="SetFinishExplainer"
              options={{title: strings.header.setFinishExplainer,}}
              component={SetFinishExplainer}
            />
            <RootStack.Screen
              name="SetCourseExplainer"
              options={{title: strings.header.setCourseExplainer,}}
              component={SetCourseExplainer}
            />
            <RootStack.Screen
              name="ExportQR"
              options={{title: strings.header.exportQR,}}
              component={ExportQR}
            />
            <RootStack.Screen
              name="ImportQR"
              options={{title: strings.header.importQR,}}
              component={ImportQR}
            />
            <RootStack.Screen
              name="GameExplainer"
              options={{title: strings.header.gameExplainer,}}
              component={GameExplainer}
            />
            <RootStack.Screen
              name="GameSettings"
              options={{title: strings.header.gameSettings,}}
              component={GameSettings}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </SettingsContext>
    )
  }
}

export default App;

/*
// <Text>{JSON.stringify({ this.state.location })}{JSON.stringify({ this.state.heading })}</Text>
*/