import * as FileSystem from 'expo-file-system';

const rosaAI = {
  userId: "utente123",
  matchday: 37,
  formation: [
    "Maignan",
    "Di Lorenzo",
    "Bastoni",
    "Calabria",
    "Barella",
    "Milinkovic-Savic",
    "Pellegrini",
    "Kvaratskhelia",
    "Lautaro Martinez",
    "Osimhen",
    "Chiesa"
  ]
};

const saveRosaAI = async () => {
  const path = FileSystem.documentDirectory + 'rosaAI.json';
  await FileSystem.writeAsStringAsync(path, JSON.stringify(rosaAI));
  alert("✅ Rosa AI salvata localmente");
};