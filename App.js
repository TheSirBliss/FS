
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import PlayerCard from './PlayerCard';
import FormaChart from './FormaChart';
import AISuggestion from './AISuggestion';
import ProModeStyles from './ProModeStyles';
import SmartSearch from './SmartSearch';
import Community from './Community';
import RicercaGiocatoreAI from './RicercaGiocatoreAI';
import rosaAI from './rosaAI';


export default function App() {
  const [tab, setTab] = useState('advice');
  const [playerName, setPlayerName] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState('');
  const [module, setModule] = useState('3-5-2');
  const [role, setRole] = useState('');
  const [count, setCount] = useState('');
  const [userId, setUserId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [auth, setAuth] = useState(false);
  const [serverId, setServerId] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [matchday, setMatchday] = useState('');
  const [premium, setPremium] = useState(false);
  const [myTeam, setMyTeam] = useState([]);
  const [selected, setSelected] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [classifica, setClassifica] = useState([]);
  const [marcatori, setMarcatori] = useState([]);
  const [partite, setPartite] = useState([]);
  const [golSubiti, setGolSubiti] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const baseAdvice = 'https://fantasense.onrender.com';
  const baseScore = 'https://fantasense.onrender.com';
  const baseLineup = 'https://fantasense.onrender.com';
  const baseTournaments = 'https://fantasense.onrender.com';
 
  useEffect(() => {
  if (tab === 'campionato') {
    axios.get("http://localhost:8010/classifica").then(res => setClassifica(res.data));
    axios.get("http://localhost:8010/marcatori").then(res => setMarcatori(res.data));
    axios.get("http://localhost:8010/partite").then(res => setPartite(res.data));
    axios.get("http://localhost:8010/gol_subiti").then(res => setGolSubiti(res.data));
  }
  if (!tab) return;
  loadRosa();
}, [tab]);

  const loadRosa = async () => {
    try {
      const json = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'rosa.json');
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed.my_team)) {
        setMyTeam(parsed.my_team);
      }
    } catch {
      setMyTeam([]);
    }
  };
  
  const getNotifications = async () => {
  const res = await axios.get(`${baseAdvice}/notifications`, {
    params: { user_team: myTeam }
  });
  alert(res.data.join('\\n'));
};
const getFormGraph = async (player) => {
  const res = await axios.get(`${baseAdvice}/player-form-graph?name=${player}`);
  alert(`Ultime giornate di ${player}:\n${res.data.labels.join(", ")}\nVoti: ${res.data.data.join(", ")}`);
};


  const callApi = async (url, params = {}, method = 'get') => {
    setResult('⏳ Attendi...');
    setLoading(true);
    try {
      const res = await axios[method](url, method === 'get' ? { params } : params);
      setResult(JSON.stringify(res.data, null, 2));
    } catch {
      setResult('❌ Errore nella richiesta');
    }
    setLoading(false);
  };

  const [aiVoteInput, setAiVoteInput] = useState({
    goals_per_game: 0,
    assists_per_game: 0,
    xG_per_game: 0,
    xA_per_game: 0,
    key_passes_per_game: 0,
    minutes_per_game: 90,
    price: 10
  });
  const predictVote = async () => {
    try {
      const res = await axios.post(`${baseAdvice}/predict-vote`, aiVoteInput);
      alert("Voto previsto: " + res.data.voto_predetto);
    } catch (err) {
      alert("Errore predizione voto");
    }
  };
  const loginAdmin = () => {
    if (adminCode === 'FANTASENSE_SECRET') {
      setAuth(true);
    } else {
      alert('Codice admin errato');
    }
  };

  const toggleSelection = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter(p => p !== name));
    } else {
      if (selected.length >= 11) {
        alert("Puoi selezionare solo 11 giocatori.");
        return;
      }
      setSelected([...selected, name]);
    }
  };

  const submitLineup = async () => {
    if (selected.length !== 11) {
      alert("Seleziona esattamente 11 giocatori.");
      return;
    }
    await callApi(`${baseLineup}/submit-lineup`, {
      userId, matchday: parseInt(matchday), teamName, lineup: selected
    }, 'post');
  };

  const generateLineup = async () => {
    if (!premium) {
      alert("Solo per utenti premium.");
      return;
    }
    await callApi(`${baseLineup}/autogenerate-lineup`, {
      userId, matchday: parseInt(matchday), team: myTeam, premium: true
    }, 'post');
  };

  const getMatchdayScores = async () => {
    await callApi(`${baseScore}/scoreboard/${matchday}`);
  };

  const getGlobalScores = async () => {
    try {
      const res = await axios.get(`${baseScore}/scoreboard/global`);
      setLeaderboard(res.data);
    } catch {
      setResult("Errore classifica globale");
    }
  };

  const [isPremium, setIsPremium] = useState(localStorage.getItem('isPremium') === 'true');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>FantaSense</Text>

      <View style={styles.navBar}>
        {[
            { label: '⭐', name: 'premium' },
            { label: '🧠', name: 'advice' },
            { label: '📝', name: 'signup' },
            { label: '👑', name: 'admin' },
            { label: '⚽', name: 'asta' },
            { label: '📋', name: 'formazione' },
            { label: '📊', name: 'classifica' },
            { label: '📈', name: 'campionato' }
          ].map(({ label, name }) => (
            <TouchableOpacity
              key={name}
              onPress={() => setTab(name)}
              style={[
                styles.navButton,
                tab === name && styles.activeTab
              ]}
            >
              <Text style={styles.navText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

      {tab === 'premium' && (
        <>
          <Text style={styles.title}>⭐ Premium</Text>
          <Text style={styles.result}>Sei {isPremium ? "utente Premium ✅" : "utente Standard 🔓"}</Text>
          <PlayerCard
          key={i}
          name={g.name}
          team={g.team}
          role={g.role}
          goals={g.goal}
          assists={g.assist}
          value={g.price}
          form={g.form}
          isOut={g.injury === true}
        />
          <Button
            title="⭐ Attiva Premium Manualmente (dev)"
            onPress={() => {
              setIsPremium(true);
              localStorage.setItem('isPremium', 'true');
            }}
          />
          <Button
            title="🧹 Disattiva Premium"
            onPress={() => {
              setIsPremium(false);
              localStorage.setItem('isPremium', 'false');
            }}
          />
          {<Button
             title="⭐ Abbonati Premium"
             onPress={async () => {
               const res = await axios.post(`${baseAdvice}/create-checkout-session`);
               const sessionId = res.data.id;
               window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
             }}
          />}
          
          <Button title="🔔 Notifiche AI Rosa" onPress={getNotifications} />
          <NotificheAI />
          <GraficiRendimento playerName={playerName} />
          <MatchupAnalysis />
        </>
      )} 

      {tab === 'advice' && (
        <>
          <Text style={styles.title}>🔍 Previsione Voto Giocatore (AI)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome giocatore"
            value={playerName}
            onChangeText={setPlayerName}
          />
          <SmartSearch onSelect={(player) => {
            alert(`Hai selezionato ${player.name}`);
          }} />
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
          <Community />
          <RicercaGiocatoreAI />
          
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
      )}

      {tab === 'signup' && (
        <>
          <TextInput style={styles.input} placeholder="Torneo" value={tournamentName} onChangeText={setTournamentName} />
          <TextInput style={styles.input} placeholder="User ID" value={userId} onChangeText={setUserId} />
          <TextInput style={styles.input} placeholder="Nome Squadra" value={teamName} onChangeText={setTeamName} />
          <Button title="Iscriviti" onPress={() => callApi(`${baseTournaments}/register-to-tournament`, { tournamentName, userId, teamName }, 'post')} />
          <Button
            title="💸 Paga con Stripe"
            onPress={async () => {
                const res = await axios.post(`${baseAdvice}/pay-tournament`)
                window.location.href = res.data.url;
            }}
          />
        </>
      )}

      {tab === 'admin' && (
        !auth ? (
          <>
            <TextInput style={styles.input} placeholder="Codice Admin" value={adminCode} onChangeText={setAdminCode} secureTextEntry />
            <Button title="Login Admin" onPress={loginAdmin} />
          </>
        ) : (
          <>
            <TextInput style={styles.input} placeholder="Torneo" value={tournamentName} onChangeText={setTournamentName} />
            <TextInput style={styles.input} placeholder="ID Server" value={serverId} onChangeText={setServerId} />
            <Button title="Crea Server" onPress={() => callApi(`${baseTournaments}/create-server`, { tournamentName, serverId, adminCode }, 'post')} />
          </>
        )
      )}

      {tab === 'asta' && (
        <>
          <TextInput style={styles.input} placeholder="User ID" value={userId} onChangeText={setUserId} />
          <TextInput style={styles.input} placeholder="Torneo" value={tournamentName} onChangeText={setTournamentName} />
          <TextInput style={styles.input} placeholder="Server ID" value={serverId} onChangeText={setServerId} />
          <Button title="Giocatori disponibili" onPress={() => callApi(`${baseTournaments}/available-players/${tournamentName}/${serverId}`)} />
          <TextInput style={styles.input} placeholder="Nome giocatore" value={playerName} onChangeText={setPlayerName} />
          <TextInput style={styles.input} placeholder="Offerta" value={budget} onChangeText={setBudget} keyboardType="numeric" />
          <Button title="Offri" onPress={() => callApi(`${baseTournaments}/bid-player`, { tournament: tournamentName, serverId, userId, player: playerName, offer: parseInt(budget) }, 'post')} />
        </>
      )}

      {tab === 'formazione' && (
        <>
          <TextInput style={styles.input} placeholder="User ID" value={userId} onChangeText={setUserId} />
          <TextInput style={styles.input} placeholder="Giornata" value={matchday} onChangeText={setMatchday} keyboardType="numeric" />
          {myTeam.map((name, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox value={selected.includes(name)} onValueChange={() => toggleSelection(name)} />
              <Text style={{ color: '#fff', marginLeft: 8 }}>{name}</Text>
            </View>
          ))}
          <Button title="Invia Formazione" onPress={submitLineup} />
          <Button title="🧠 Genera con AI (Premium)" onPress={generateLineup} />
          <Button title="🔔 Notifiche AI Rosa" onPress={getNotifications} />
        </>
      )}
      <AISuggestion name="Lautaro" predictedVote={7.1} />
      <FormaChart playerName="Lautaro" history={[6.5, 7.2, 6.8, 7.4, 7.1]} />
      {tab === 'classifica' && (
        <>
          <TextInput style={styles.input} placeholder="Giornata" value={matchday} onChangeText={setMatchday} keyboardType="numeric" />
          <Button title="Classifica Giornata" onPress={getMatchdayScores} />
          <Button title="Classifica Globale" onPress={getGlobalScores} />
          {leaderboard.length > 0 && leaderboard.map((item, i) => (
            <Text key={i} style={styles.result}>{i + 1}. {item.teamName || item._id} - {item.total || item.points}pt</Text>
          ))}
        </>
      )}
     
      {tab === 'campionato' && (
  <>
    <Text style={styles.title}>📊 Classifica</Text>
    {classifica.map((t, i) => (
      <TouchableOpacity key={i} onPress={() => setSelectedTeam(t.team)}>
        <Text style={styles.result}>
          {i + 1}. {t.team} - {t.points}pt
        </Text>
      </TouchableOpacity>
    ))}

    {selectedTeam !== '' && (
      <>
        <Text style={styles.section}>🧤 Dettagli squadra selezionata: {selectedTeam}</Text>
        {golSubiti
          .filter((g) => g.team === selectedTeam)
          .map((g, i) => (
            <Text key={i} style={styles.result}>{g.team} ha subito {g.conceded} gol</Text>
          ))}
      </>
    )}

    <Text style={styles.title}>⚽ Marcatori</Text>
    {marcatori.map((p, i) => (
      <TouchableOpacity key={i} onPress={() => alert(`${p.player} (${p.team}) - ${p.goals} gol`)}>
        <Text style={styles.result}>{p.player} ({p.team}) - {p.goals} gol</Text>
      </TouchableOpacity>
    ))}

    <Text style={styles.title}>🗓️ Prossime partite</Text>
    {partite.map((m, i) => (
      <Text key={i} style={styles.result}>
        {m.date} - {m.home} vs {m.away}
      </Text>
    ))}

    <Text style={styles.title}>🔁 Confronta due giocatori</Text>
    <TextInput
      style={styles.input}
      placeholder="Nome Giocatore 1"
      value={player1}
      onChangeText={setPlayer1}
    />
    <TextInput
      style={styles.input}
      placeholder="Nome Giocatore 2"
      value={player2}
      onChangeText={setPlayer2}
    />
    <Button
      title="Confronta"
      onPress={async () => {
        try {
          const res = await axios.post(`${baseAdvice}/compare-players`, {
            p1: {
              name: player1,
              goals_per_game: 0.5,
              assists_per_game: 0.3,
              xG_per_game: 0.45,
              xA_per_game: 0.2,
              key_passes_per_game: 1.8,
              minutes_per_game: 80,
              price: 12
            },
            p2: {
              name: player2,
              goals_per_game: 0.3,
              assists_per_game: 0.5,
              xG_per_game: 0.4,
              xA_per_game: 0.25,
              key_passes_per_game: 2.1,
              minutes_per_game: 85,
              price: 10
            }
          });
          alert(res.data.recommendation);
        } catch (e) {
          alert("Errore confronto AI");
        }
      }}
    />
    <Button
      title="Insight Giocatore"
      onPress={async () => {
        try {
          const fetchInsight = async (playerName) => {
            const res = await axios.get(`${baseAdvice}/insight-player?name=${playerName}`);
            alert(JSON.stringify(res.data));
         };
          alert(res.data.recommendation);
        } catch (e) {
          alert("Errore confronto AI");
        }
      }}
    />
    <Button
      title="Campionato"
      onPress={async () => {
        try {
          const matchup = async (home, away) => {
            const res = await axios.get(`${baseAdvice}/matchup-rating`, { params: { home, away } });
            alert(res.data.suggestion);
        };
         
          alert(res.data.recommendation);
        } catch (e) {
          alert("Errore confronto AI");
        }
      }}
    />
  </>
  )}

</ScrollView>
);
}

  const getNotifications = async () => {
  const res = await axios.get(`${baseAdvice}/notifications`, {
    params: { user_team: myTeam }
  });
  alert(res.data.join('\\n'));
};
  const styles = StyleSheet.create({
    ProModeStyles,
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  navButton: {
    padding: 10,
    borderRadius: 8,
    margin: 4,
    backgroundColor: '#222',
  },
  activeTab: {
    backgroundColor: '#00ff88',
  },
  navText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});