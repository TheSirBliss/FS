// COMPONENTE AI SUGGERITORE VISIVO AUTOMATICO
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function AISuggestion({ name = "", predictedVote = 6.5 }) {
  const decision = predictedVote >= 6.8 ? "✅ Schieralo!" : predictedVote >= 6.3 ? "🤔 Solo se necessario" : "❌ Evita";
  const color = predictedVote >= 6.8 ? '#00ff88' : predictedVote >= 6.3 ? '#ffaa00' : '#ff4444';
  const icon = predictedVote >= 6.8 ? 'thumbs-up' : predictedVote >= 6.3 ? 'meh' : 'thumbs-down';

  return (
    <View style={styles.box}>
      <Text style={[styles.name, { color }]}>{name}</Text>
      <Text style={[styles.vote, { color }]}>Voto previsto: {predictedVote}</Text>
      <View style={styles.row}>
        <Icon name={icon} size={20} color={color} />
        <Text style={[styles.result, { color }]}>{`  ${decision}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#1e1e1e',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  vote: {
    fontSize: 16,
    marginVertical: 4
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  result: {
    fontSize: 16,
    fontWeight: '600'
  }
});
