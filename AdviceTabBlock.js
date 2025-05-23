
// Blocca completo per tab === 'advice' (in App.js)
<>
  <Text style={styles.title}>🔍 Previsione Voto Giocatore (AI)</Text>
  <TextInput
    style={styles.input}
    placeholder="Nome giocatore"
    value={playerName}
    onChangeText={setPlayerName}
  />
  <Button
    title="Prevedi voto"
    onPress={() =>
      callApi(`${baseAdvice}/predict-player`, { name: playerName })
    }
  />

  <Text style={styles.title}>🧱 Crea Rosa con AI</Text>
  <TextInput
    style={styles.input}
    placeholder="Modulo (es. 3-5-2)"
    value={module}
    onChangeText={setModule}
  />
  <TextInput
    style={styles.input}
    placeholder="Budget Totale"
    value={budget}
    onChangeText={setBudget}
    keyboardType="numeric"
  />
  <Button
    title="Suggerisci Rosa"
    onPress={() =>
      callApi(`${baseAdvice}/suggest-initial-squad`, {
        modulo: module,
        budget: parseInt(budget),
      })
    }
  />

  <Text style={styles.title}>🎯 Suggerisci Giocatori per Ruolo</Text>
  <TextInput
    style={styles.input}
    placeholder="Ruolo (P, D, C, A)"
    value={role}
    onChangeText={setRole}
  />
  <TextInput
    style={styles.input}
    placeholder="Numero Giocatori"
    value={count}
    onChangeText={setCount}
    keyboardType="numeric"
  />
  <TextInput
    style={styles.input}
    placeholder="Budget"
    value={budget}
    onChangeText={setBudget}
    keyboardType="numeric"
  />
  <Button
    title="Suggerisci Giocatori"
    onPress={() =>
      callApi(`${baseAdvice}/suggest-players`, {
        role,
        count: parseInt(count),
        budget: parseInt(budget),
      })
    }
  />

  <Text style={styles.title}>🧠 Voto AI Premium (test manuale)</Text>
  {Object.keys(aiVoteInput).map((key, i) => (
    <TextInput
      key={i}
      style={styles.input}
      placeholder={key}
      keyboardType="numeric"
      value={aiVoteInput[key].toString()}
      onChangeText={(text) =>
        setAiVoteInput({
          ...aiVoteInput,
          [key]: parseFloat(text) || 0,
        })
      }
    />
  ))}
  <Button title="Calcola voto con AI" onPress={predictVote} />
</>
