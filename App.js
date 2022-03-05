import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, Image, Pressable, Modal, useWindowDimensions, } from "react-native";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [descIsLoading, setDescLoading] = useState(true);
  const [dex, setDex] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [desc, setDesc] = useState([]);
  const [pokeNumber, setPokeNumber] = useState([]);
  const window = useWindowDimensions();


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
      setDesc('No description available');
      console.error(error);
    } finally {
      setDescLoading(false);
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
        {descIsLoading ? <ActivityIndicator/> : (
          <Pressable style={styles.popup} onPress={() => {setModalVisible(false);}}>
            <View style={{
                borderRadius: 20,
                borderWidth: 5,
                borderColor: 'black',
                backgroundColor: 'rgba(241, 241, 241, 0.9)',
                justifyContent: 'center', 
                alignItems: 'center',
                width: (window.width * 0.7),
                height: (window.height * 0.7),
              }}
            >
              <Image
                style={{
                  width: 150,
                  height: 150,
                }}
                  source={{
                    uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + pokeNumber +  '.png', 
                }}
              />
              <Text style={styles.text}>{desc}</Text>
            </View>
          </Pressable>
        )}
      </Modal>
      {/* Pokedex */}
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
            horizontal = {false}
            numColumns={3}
            data={dex}
            keyExtractor={({ entry_number }, index) => entry_number}
            renderItem={({ item }) => (
                <Pressable style={{borderRadius: 20,
                  backgroundColor: '#f1f1f1',
                  margin: 5,
                  justifyContent: 'center', 
                  alignItems: 'center',
                  width: (window.width * 0.3),
                  height: (window.width * 0.3),
                }}
                onPress={() => {setModalVisible(true); setDesc(''); setPokeNumber(item.entry_number); getDescription(item.entry_number);}}
                >
                  <Image
                    style={{
                      width: (window.width * 0.2),
                      height: (window.width * 0.2),
                    }}
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
    text: {
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
    },
    popup: {
      justifyContent: 'center', 
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    }
});