import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlayerCard = ({ name, team, role, form, goals, assists, value, isOut }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        {isOut && <Text style={styles.outBadge}>OUT</Text>}
      </View>
      <Text style={styles.role}>🎯 {role} | 🏟 {team}</Text>
      <Text style={styles.stats}>⚽ {goals} | 🎯 {assists} | 💰 {value}M</Text>
      {form !== undefined && <Text style={styles.form}>📈 Forma: {form}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  outBadge: {
    backgroundColor: '#ff4444',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 'bold'
  },
  role: {
    color: '#ccc',
    marginTop: 4
  },
  stats: {
    color: '#aaa',
    marginTop: 4
  },
  form: {
    color: '#00ff88',
    marginTop: 6,
    fontWeight: '600'
  }
});

export default PlayerCard;