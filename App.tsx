import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  TouchableHighlight,
  Alert,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FloatingAction } from "react-native-floating-action";
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import Constants from 'expo-constants';
import { useForm } from 'react-hook-form';
import { FAB } from 'react-native-paper';
// You can import from local files
import Input from './components/Input';
import Form from './components/Form';
import validation from './validation';
import Hero from './Hero';

import Icon from 'react-native-vector-icons/AntDesign';
function Calculate(data: FormData) {
  //console.log(data);
	const V = parseInt(data.windSpeed); // Wind Speed
	const WF	= parseInt(data.windSpeed);//Wind flow (1 = clear, 2 = partially obstructed, 3 = obstructed) is used in method 1-C
	const B = parseInt(data.windSpeed);//Tent width
	const L = parseInt(data.windSpeed);//Tent length
	const H = parseInt(data.windSpeed);//Eave height
	const Hp = parseInt(data.windSpeed);//Band height
	const RT = parseInt(data.windSpeed);//Roof type (1 = Gable, 2 = Hip, 3 = Pyramid)
	const RH =parseInt(data.windSpeed); //Roof height
	const RL = parseInt(data.windSpeed);//Ridge length (only if hip roof)
	const NB = parseInt(data.windSpeed);//Number of posts in width (including corner posts)
	const NL = parseInt(data.windSpeed);//Number of posts in length (including corner posts)
	const NI = parseInt(data.windSpeed);//Number of ballasts per intermediate post
	const NC = parseInt(data.windSpeed);//Number of ballasts per corner post

  // Intermediate variables (calculated using user input variables):
  const	wp = 0.00256*V^2 //= wind pressure
  //
  // Output variables:
   	var M1 = 0//overturn moment when wind perpendicular to length
   	var M2 = 0//overturn moment when wind perpendicular to width
   	var U = 0//Vertical uplift force per guy line
   	var BW = 0//Ballast weight per guy line
  //
  // Gable roof
  // 	Wind perpendicular to length
  // 		Open
  			M1 = wp*(L*Hp*(H-Hp/2)+L*RH*(H+RH/2));
  // 		Partially enclosed
  			M1 = wp*(L*H*H/2+L*RH*(H+RH/2))+L*RH*(H+RH/2);
  // 		Enclosed
  			M1 = wp*(L*H*H/2+L*RH*(H+RH/2));
  // 	Wind perpendicular to width
  // 		Enclosed
  			M2 = wp*(B*H*H/2+B*(RH/2)*(H+RH/3));
  // 		Partially enclosed
  			M2 = wp*(L*H*H/2+L*RH*(H+RH/2))+L*RH*(H+RH/2);
  // 		Open
  			M2 = wp*(B*Hp*(H-Hp/2)+B*(RH/2)*(H+RH/3));
  // Hip roof
  // 	Wind perpendicular to length
  // 		Enclosed
  			M1 = wp*(L*H*H/2+RL*RH*(H+RH/2)+(L-RL)*RH*(H+RH/3)/2);
  // 		Partially enclosed
  			M1 = wp*(L*H*H/2+L*RH*(H+RH/2))+L*RH*(H+RH/2);
  // 		Open
  			M1 = wp*(L*Hp*(H-Hp/2)+RL*RH*(H+RH/2)+(L-RL)*RH*(H+RH/3)/2);
  // 	Wind perpendicular to width
  // 		Enclosed
  			M2 = wp*(B*H*H/2+B*(RH/2)*(H+RH/3));
  // 		Partially enclosed
  			M2 = wp*(L*H*H/2+L*RH*(H+RH/2))+L*RH*(H+RH/2);
  // 		Open
  			M2 = wp*(B*Hp*(H-Hp/2)+B*(RH/2)*(H+RH/3));
  //
  // Pyramid roof
  // 	Wind perpendicular to length
  // 		Enclosed
  			M1 = wp*(L*H*H/2+RL*RH*(H+RH/2)+(L-RL)*RH*(H+RH/3)/2);
  // 		Partially enclosed
  			M1 = wp*(L*H*H/2+L*RH*(H+RH/2))+L*RH*(H+RH/2);
  // 		Open
  			M1 = wp*(L*Hp*(H-Hp/2)+RL*RH*(H+RH/2)+(L-RL)*RH*(H+RH/3)/2);
  // 	Wind perpendicular to width
  // 		Enclosed
  			M2 = wp*(B*H*H/2+B*(RH/2)*(H+RH/3));
  // 		Partially enclosed
  			M2 = wp*(L*H*H/2+L*RH*(H+RH/2))+L*RH*(H+RH/2);
  // 		Open
  			M2 = wp*(B*Hp*(H-Hp/2)+B*(RH/2)*(H+RH/3));
  //
  // Vertical uplift force per guy line:
  	U = Math.max(M1/B/((NL-2)*NI+2*NC), M2/L/((NB-2)*NI+2*NC));
    Alert.alert('data', U.toString());
    //console.log(data);
};

type FormData = {
  windSpeed: string;
  windFlow: string;
  tentWidth: string;
  tentLength: string;
  eaveHeight: string;
  bandHeight: string;
  roofType: string;
  ridgeLength: string;
  roofHeight: string;
  pw: string;
  pl: string;
  bip: string;
  bcp: string;
};


export default () => {
  const { handleSubmit, register, setValue, errors } = useForm<FormData>();
  const sheetRef = React.useRef(null);

  const onSubmit = (data: FormData) => {

    Alert.alert('data', JSON.stringify(data));
    Calculate(data);
  };

  const renderContent = () => (
    <View
      style={{
        padding: 20,
        paddingBottom:0,
        alignItems: 'center',
        justifyContent: 'center',
        height: 560,
        backgroundColor:'white',
        zIndex: 999999,
      }}
    >
    <Text style={[styles.red, styles.big]}>Assumptions</Text>
    <FlatList
    data={[
      {key: '(1)	Wind pressure is applied on the windward wall (if side is present) and on the roof profile vertical projection.'},
      {key: '(2)	Wind pressure is calculated from the wind speed using p = 0.00256 V2, where V is the wind speed in miles per hour (mph) and p is the pressure in pound per square foot (psf). For instance, if V = 70 mph, p = 12.5 psf.'},
      {key: '(3)	Vertical wind load (uplift) is not considered as it is a different mode of failure.'},
      {key: '(4)	The ground friction at the footings of all leeward posts is sufficiently large to prevent sliding of the whole tent.'},
      {key: '(5)	The frame is sufficiently rigid to overturn as a whole without collapsing at the onset of overturn.'},
      {key: '(6)	The number of ballasts per post along the width and the length are the same.'},
      {key: '(7)	The number of ballasts per corner post is the same for the four corners.'},
    ]}         renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>} />
    </View>
  );

  const drawer = true;
  function drawerToggle() {
    if(drawer){
        sheetRef.current.snapTo(0)
    }else {
      sheetRef.current.snapTo(1)
    }
  };
  return (
    <>
    <SafeAreaView style={styles.container}>
    <FAB
    accessible={true}
      visible={true}
      style={styles.fab}
      small
      icon="information-outline"
      onPress={() => drawerToggle()}
    />
    <FAB
      accessible={true}
        visible={true}
      style={styles.fabCheck}
      icon="check"
      onPress={() => handleSubmit(onSubmit)}
    />
    <KeyboardAwareScrollView
      contentContainerStyle={styles.containers}
      style={{ backgroundColor: 'white'}}>
      <Hero />
      <View style={styles.formContainer}>
      <Text style={styles.big}>Calculate</Text>
        <Form {...{ register, setValue, validation, errors }} >
          <Input  name="windSpeed" label="Wind Speed (MPH)" />
          <Input name="windFlow" label="Wind Flow (1 = clear, 2 = semi-obstructed,  3 = obstructed)"/>
          <Input name="tentWidth" label="Tent Width (ft)" />
          <Input name="tentLength" label="Tent Length (ft)" />
          <Input name="eaveHeight" label="Eave Height, Enter or select value (ft)" />
          <Input name="bandHeight" label="Band Height, Enter or select value (ft)" />
          <Input name="roofType" label="Roof type (1 = Gable, 2 = Hip, 3 = Pyramid)" />
          <Input name="ridgeLength" label="Ridge Length (ft)" />
          <Input name="roofHeight" label="Roof Height (ft)" />
          <Input name="pw" label="Number of Posts per width (Include corner posts)" />
          <Input name="pl" label="Number of Posts per length (Including corner posts)" />
          <Input name="bip" label="Ballasts per intermediate post (All but corner posts) " />
          <Input name="bcp"  label="Ballasts per Corner Post (open/enclosed) " />
        </Form>
      </View>
    </KeyboardAwareScrollView>
    </SafeAreaView>
    <BottomSheet
ref={sheetRef}
snapPoints={[600, 350, 0]}
enabledInnerScrolling={true}
initialSnap={2}
borderRadius={20}
enabledBottomInitialAnimation={true}
renderContent={renderContent}
/>
    </>
  );
};

const styles = StyleSheet.create({
  containers: {
    padding:15,
    marginTop:30,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  formContainer: {
    flex:1,
    padding: 8,
    paddingBottom:70,
  },
  button: {
    backgroundColor: 'white',
    height: 100,
    margin:10,
  },
  fab: {
  position: 'absolute',
  zIndex: 999998,
  backgroundColor: 'yellow',
  color:'black',
  margin: 10,
  right: 15,
  top: 20,
},
fabCheck: {
position: 'absolute',
zIndex: 999998,
backgroundColor: 'blue',
color:'white',
margin: 10,
right: 15,
bottom: 20,
},
big: {
  fontWeight: 'bold',
  fontSize:25,
  textAlign:"center",
},
item:{
  fontSize:17,
  padding:10,
},
});
