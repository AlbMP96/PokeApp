import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, Image, Pressable, Modal} from "react-native";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [dex, setDex] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [desc, setDesc] = useState([]);

  {/* get pokedex */}
  const getPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokedex/2/');
      const dexJson = await response.json();
      setDex(dexJson.pokemon_entries);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  {/* get english description from red game */}
  const getDescription = async (props) => {
    try {
      var response = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + props);
      var spc = await response.json();
      var descriptions = spc.flavor_text_entries;
      for (var i = 0; i < descriptions.length; i++) {
        if (descriptions[i].language.name == "en" && descriptions[i].version.name == "red") {
          setDesc(spc.flavor_text_entries[i].flavor_text);
        }
      }
    } catch {
      console.error(error);
    }
  }

  useEffect (() => {
    getPokemons();
  }, []);

  return (
    <View style={styles.main}>
      {/* Pokedex description */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.desc}>
          <Text style={styles.text}>{desc}</Text>
        </View>  
      </Modal>
      {/* Pokedex */}
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
            horizontal = {false}
            numColumns={3}
            data={dex}
            keyExtractor={({ entry_number }, index) => entry_number}
            renderItem={({ item }) => (
                <Pressable style={styles.content}
                onPress={() => {setModalVisible(true); getDescription(item.entry_number)}}
                >
                  <Image
                      style={styles.logo}
                      source={{
                        uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + item.entry_number +  '.png', 
                      }}
                  />
                  <Text style={styles.text}>{item.pokemon_species.name}</Text>
                </Pressable>
            )}
        /> 
      )}
    </View>
  )
};


const styles = StyleSheet.create({
    main: { 
      backgroundColor: '#c9e15c',
      flex: 1, 
      alignItems: 'center',
      justifyContent: 'center', 
    },
    content: {
      borderRadius: 20,
      backgroundColor: '#f1f1f1',
      margin: 5,
      justifyContent: 'center', 
      alignItems: 'center',
      width: 120, 
      height: 120
    },
    logo: {
      width: 80,
      height: 80,
    },
    text: {
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
    },
    desc: {
      borderRadius: 20,
      borderWidth: 5,
      borderColor: 'black',
      backgroundColor: 'rgba(241, 241, 241, 0.9)',
      justifyContent: 'center', 
      alignItems: 'center',
      width: 200, 
      height: 400,
      position: 'absolute',
      top: '25%',
      left: '25%',
    },
});