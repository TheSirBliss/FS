// BLOCCO 7 - COMPONENTE COMMUNITY + SONDAGGI
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Community() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [polls, setPolls] = useState([]);

  const fetchPolls = async () => {
    const res = await axios.get('https://fantasense.onrender.com/community');
    setPolls(res.data);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const createPoll = async () => {
    await axios.post('https://fantasense.onrender.com/create-poll', {
      question,
      options: options.filter((o) => o.trim() !== '')
    });
    setQuestion('');
    setOptions(['', '', '']);
    fetchPolls();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Community FantaSense</Text>

      <Text style={styles.label}>Domanda:</Text>
      <TextInput style={styles.input} value={question} onChangeText={setQuestion} placeholder="Chi è il miglior centrocampista?" />

      {options.map((opt, i) => (
        <TextInput
          key={i}
          style={styles.input}
          value={opt}
          placeholder={`Opzione ${i + 1}`}
          onChangeText={(text) => {
            const newOpts = [...options];
            newOpts[i] = text;
            setOptions(newOpts);
          }}
        />
      ))}

      <Button title="Crea sondaggio" onPress={createPoll} />

      <Text style={styles.subtitle}>📊 Sondaggi Attivi:</Text>
      <FlatList
        data={polls}
        keyExtractor={(item, i) => `${item.question}-${i}`}
        renderItem={({ item }) => (
          <View style={styles.poll}>
            <Text style={styles.pollQ}>{item.question}</Text>
            {item.options.map((opt, j) => (
              <Text key={j} style={styles.pollOpt}>• {opt}</Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#121212' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#00ff88', marginBottom: 12 },
  label: { color: '#fff' },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginVertical: 6 },
  subtitle: { fontSize: 18, color: '#00ff88', marginTop: 20, marginBottom: 8 },
  poll: { backgroundColor: '#1e1e1e', padding: 10, borderRadius: 8, marginBottom: 12 },
  pollQ: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  pollOpt: { color: '#ccc', marginTop: 4 }
});
