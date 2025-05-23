// BLOCCO 9 - GRAFICI DINAMICI AI (PREMIUM)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

export default function GraficiRendimento({ playerName }) {
  const [dati, setDati] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://fantasense.onrender.com/rendimento-player?name=${playerName}`)
      .then(res => {
        setDati(res.data.performance);
        setLoading(false);
      })
      .catch(() => setDati([]));
  }, [playerName]);

  const labels = dati.map((_, i) => `G${i + 1}`);
  const votes = dati.map(p => p.vote);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>📈 Rendimento AI: {playerName}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff88" />
      ) : (
        <LineChart
          data={{
            labels: labels,
            datasets: [{ data: votes }]
          }}
          width={320}
          height={220}
          yAxisSuffix="pt"
          chartConfig={{
            backgroundColor: '#121212',
            backgroundGradientFrom: '#121212',
            backgroundGradientTo: '#1e1e1e',
            color: () => `#00ff88`,
            labelColor: () => `#ccc`
          }}
          style={styles.chart}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 20, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#00ff88', marginBottom: 10 },
  chart: { borderRadius: 12 }
});
