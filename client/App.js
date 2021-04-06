import React, {useState} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {StyleSheet, View, Button, FlatList, Text, AsyncStorage} from 'react-native';

const App = () => {
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState({});

  // useEffect(() => {
  //   PushNotificationIOS.addEventListener('notification', onRemoteNotification);
  // });

  // const onRemoteNotification = (notification) => {
  //   const isClicked = notification.getData().userInteraction === 1;

  //   if (isClicked) {
  //     // Navigate user to another screen
  //   } else {
  //     // Do something else with push notification
  //   }
  // };

  const fetchDataHandler = async () => {
    if (data.length === 0) {
      const result = await fetch('http://localhost:3000/getData');
      const resultData = await result.json();

      _storeData(resultData);
    }
  };

  const clearDataHandler = () => {
    _deleteData();
  };

  const _storeData = async (resultData) => {
    for (const item in resultData) {
      try {
        await AsyncStorage.setItem(
          resultData[item].index.toString(),
          JSON.stringify(resultData[item])
        );
      } catch (e) {
        throw e;
      }
    }
    _retrieveData(resultData);
  };

  const _retrieveData = async (resultData) => {
    for (let i = 0; i <= resultData.length; i++) {
      try {
        const value = JSON.parse(await AsyncStorage.getItem(i.toString()));
        if (value) {
          setData((currentData) => [...currentData, value]);
        }
      } catch (e) {
        throw e;
      }
    }
    console.log(data);
  };

  const _deleteData = async () => {
    for (const item in data) {
      try {
        await AsyncStorage.removeItem(data[item].index.toString());
        console.log('Data Removed')
      } catch(e) {
        console.log(e)
        throw e;
      }
    }
    setData([]);
  }

  return (
    <View style={styles.container}>
      <Button title="GET" color={'green'} onPress={fetchDataHandler} />
      <Button title="CLEAR" color={'red'} onPress={clearDataHandler}/>
      <FlatList
        data={data}
        keyExtractor={dataObj => dataObj.index}
          renderItem={dataObj => (
            <View>
              <View style={styles.dataObject}>
                <Text>
                  <Text style={styles.dataHeader}>Index:&nbsp;</Text>{dataObj.item.index}&nbsp;|&nbsp;
                  <Text style={styles.dataHeader}>Timestamp:&nbsp;</Text>{dataObj.item.timestamp}
                </Text>
              </View>
            </View>
          )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataObject: {
    marginVertical: 8,
  },
  dataHeader: {
    fontWeight: 'bold',
  },
});

export default App;


