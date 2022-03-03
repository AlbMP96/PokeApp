import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, ScrollView, SafeAreaView, Image} from "react-native";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokedex/2/');
      const json = await response.json();
      setData(json.pokemon_entries);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect (() => {
    getPokemons();
  }, []);

  return (
    <View style={styles.main}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
            horizontal = {false}
            numColumns={3}
            data={data}
            keyExtractor={({ entry_number }, index) => entry_number}
            renderItem={({ item }) => (
                <View style={styles.content}>
                    <Image
                        style={styles.logo}
                        source={{
                            uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + item.entry_number +  '.png', 
                        }}
                    />
                <Text style={styles.text}>{item.pokemon_species.name}</Text>
                </View>
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
        alignItems: 'center'
    },
    content: {
        borderRadius: 20,
        backgroundColor: '#b5b5b5',
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
        color: 'black'
    },
});