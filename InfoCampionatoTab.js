
import React, { useState } from 'react';
import { View, Text, StyleSheet, Picker, ScrollView } from 'react-native';
import data from './campionato_data.json';

export default function InfoCampionatoTab() {
  const [league, setLeague] = useState('Serie A');

  const legaData = data[league];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📈 Info Campionato: {league}</Text>

      <Picker
        selectedValue={league}
        style={styles.picker}
        onValueChange={(itemValue) => setLeague(itemValue)}
      >
        {Object.keys(data).map((lg, i) => (
          <Picker.Item key={i} label={lg} value={lg} />
        ))}
      </Picker>

      <Text style={styles.section}>📊 Classifica:</Text>
      {legaData.classifica.map((team, i) => (
        <Text key={i} style={styles.item}>
          {i + 1}. {team.name} - {team.points}pt ({team.gf}:{team.gs})
        </Text>
      ))}

      <Text style={styles.section}>⚽ Marcatori:</Text>
      {legaData.marcatori.map((p, i) => (
        <Text key={i} style={styles.item}>
          {p.name} ({p.team}) - {p.goals} gol
        </Text>
      ))}

      <Text style={styles.section}>🗓️ Prossime partite:</Text>
      {legaData.partite.map((match, i) => (
        <Text key={i} style={styles.item}>
          {match.date} - {match.home} vs {match.away}
        </Text>
      ))}

      <Text style={styles.section}>🧤 Gol subiti per squadra:</Text>
      {legaData.gol_subiti.map((team, i) => (
        <Text key={i} style={styles.item}>
          {team.name} - {team.conceded} gol
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#121212' },
  title: { color: '#00ff88', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  section: { color: '#fff', fontSize: 18, marginTop: 20, marginBottom: 5 },
  item: { color: '#ccc', fontSize: 16, marginVertical: 2 },
  picker: { backgroundColor: '#fff', color: '#000' }
});
