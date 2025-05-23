// BLOCCO 8 - ANALISI MATCHUP CON AI
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function MatchupAnalysis() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [result, setResult] = useState('');

  const analyzeMatchup = async () => {
    try {
      const res = await axios.post('https://fantasense.onrender.com/matchup-analysis', {
        home: team1,
        away: team2
      });
      setResult(res.data.advice);
    } catch {
      setResult('Errore durante l'analisi del matchup');
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>📅 Analisi Matchup AI</Text>
      <TextInput
        style={styles.input}
        placeholder="Squadra Casa (es. Inter)"
        value={team1}
        onChangeText={setTeam1}
      />
      <TextInput
        style={styles.input}
        placeholder="Squadra Trasferta (es. Milan)"
        value={team2}
        onChangeText={setTeam2}
      />
      <Button title="Analizza Matchup" onPress={analyzeMatchup} />
      {result !== '' && <Text style={styles.result}>{result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: '#121212' },
  title: { fontSize: 20, color: '#00ff88', fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginBottom: 10 },
  result: { marginTop: 20, color: '#fff', backgroundColor: '#1e1e1e', padding: 10, borderRadius: 6 }
});
