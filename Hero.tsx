import * as React from 'react';
import { Text, View, StyleSheet, Image, FlatList, Dimensions} from 'react-native';

export default () => {
    return (


      <View style={styles.container}>

       <View style={{flex: 1}}>
   <View style={{flex: 1}} >
   <Text style={styles.big}>Calculation of overturn moment due to horizontal wind force</Text>
   <Image style={styles.logo} source={require('./assets/diagram.png')} />
   <Text style={styles.desc}>This tool calculates the load at each guy to resist overturn due to horizontal wind force.</Text>
   <Image style={styles.logo} source={require('./assets/openClosedTents.png')} />
   <Image style={styles.logo} source={require('./assets/windTent.png')} />

   </View>

       </View>
      </View>
    );
  }
const win = Dimensions.get('window');
const styles = StyleSheet.create({

  container: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  backgroundColor: '#fff',
},
  paragraph: {

    marginTop: 0,
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'white'
  },
  logo: {
   maxWidth: win.width,
   marginTop: 10,
   alignSelf: "center",
   marginBottom: 10,
   alignSelf: 'stretch',
   width: '100%',
   maxHeight: 250,
   justifyContent: 'center',
   resizeMode: 'contain', //optional
 },
  big: {
    padding:5,
    fontWeight: 'bold',
    fontSize:20,
  },
  desc: {
    padding:5,
    fontSize:17,
  },
  item:{
    fontSize:17,
    padding:10,
  },
});
