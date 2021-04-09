import React, { useState, useEffect } from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { StyleSheet, View, FlatList, Text, ActivityIndicator, AsyncStorage } from 'react-native';

const App = () => {
  const [requestData, setRequestData] = useState([]);
  const [requestInMotion, setRequestInMotion] = useState(false)
  const [renderOnFlatList, setRenderOnFlatList] = useState();

  const errorHandler = (err) => {
    console.error(err);
  }

  useEffect(() => {
    setRequestInMotion(false);
    setRenderOnFlatList(false);

    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);
  });

  const onRemoteNotification = async () => {
    setRequestInMotion(true);
    let result, resultData;

    try {
      result = await fetch('http://localhost:3000/getData/?numberOfRecords=50');
      resultData = await result.json();
    } catch (err) {
      return errorHandler(err);
    }

    _storeData(resultData);
  }
  
  const _storeData = async (resultData) => {
    for (const item in resultData) {
      try {
        await AsyncStorage.setItem(resultData[item].index.toString(), JSON.stringify(resultData[item]));
      } catch (err) {
        return errorHandler(err);
      }
    }

    _retrieveData(resultData.length);
  }

  const _retrieveData = async (dataLength) => {
    for (let i = 0; i <= dataLength; i++) {
      try {
        const item = JSON.parse(await AsyncStorage.getItem(i.toString()));
        if (item) {
          setRequestData((currentData) => [...currentData, item]);
        }
      } catch (err) {
          return errorHandler(err)
        }
      }

      setRenderOnFlatList(true);
      setRequestInMotion(false);
    }

    return(
      <View style={styles.container}>
        <Text>Drop APNS file here.</Text>
        {requestInMotion ? <ActivityIndicator size={"small"}/> : null}
        {renderOnFlatList ? 
        <FlatList 
          keyExtractor={element => element.index}
          data={requestData}
          renderItem={dataObject => (
            <View>
              <View style={styles.dataObject}>
                <Text>
                  <Text style={styles.dataHeader}>Index:&nbsp;</Text>{dataObject.item.index}&nbsp;|&nbsp;
                  <Text style={styles.dataHeader}>Timestamp:&nbsp;</Text>{dataObject.item.timestamp}
                </Text>
              </View>
            </View>
          )}
        /> : null}
      </View>
    )
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
  dataObject: {
    marginVertical: 8,
  },
})

export default App;
