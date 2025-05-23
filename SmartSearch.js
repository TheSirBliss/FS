// COMPONENTE RICERCA GIOCATORI INTELLIGENTE
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function SmartSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 2) {
        axios.get(`https://fantasense.onrender.com/search-player?query=${query}`)
          .then(res => setResults(res.data))
          .catch(() => setResults([]));
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        placeholder="Cerca un giocatore"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={results}
        keyExtractor={(item, i) => `${item.name}-${i}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item)}>
            <Text style={styles.result}>{item.name} ({item.team})</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6
  },
  result: {
    padding: 10,
    backgroundColor: '#1e1e1e',
    color: '#00ff88',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  }
});
