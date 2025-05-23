// GRAFICO DINAMICO FORMA E RENDIMENTO per ogni giocatore
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export default function FormaChart({ history = [], playerName = "Giocatore" }) {
  if (history.length === 0) return <Text style={styles.placeholder}>Nessun dato di rendimento</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Forma di {playerName}</Text>
      <LineChart
        data={{
          labels: history.map((_, i) => `G${i + 1}`),
          datasets: [{
            data: history,
            strokeWidth: 2
          }]
        }}
        width={screenWidth - 40}
        height={180}
        chartConfig={{
          backgroundColor: '#121212',
          backgroundGradientFrom: '#1e1e1e',
          backgroundGradientTo: '#1e1e1e',
          decimalPlaces: 1,
          color: () => `#00ff88`,
          labelColor: () => '#fff',
          propsForDots: { r: '3', strokeWidth: '1', stroke: '#00ff88' }
        }}
        style={{ borderRadius: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 10
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  placeholder: {
    color: '#aaa',
    fontStyle: 'italic'
  }
});
