import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Platform, KeyboardAvoidingView, Alert } from 'react-native';
const MATRITE_OPTIONS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
const CONSUM_PER_MATRITA_ORA = 100/24;
export default function App() {
  const [stocOre, setStocOre] = useState('');
  const [stocAnvelope, setStocAnvelope] = useState('');
  const [matrite, setMatrite] = useState(1);
  const [rataConfectionare, setRataConfectionare] = useState('');
  const [totalDeProodus, setTotalDeProodus] = useState('');
  const [oraActuala, setOraActuala] = useState('');
  const [minutActual, setMinutActual] = useState('');
  const [rezultat, setRezultat] = useState(null);
  const folosteOraAcum = () => { const acum = new Date(); setOraActuala(String(acum.getHours()).padStart(2,'0')); setMinutActual(String(acum.getMinutes()).padStart(2,'0')); };
  const formatDurata = (ore) => { const h = Math.floor(ore); const m = Math.round((ore-h)*60); if(m===0) return h+'h'; return h+'h '+m+'min'; };
  const calculeaza = () => {
    const sOre = parseFloat(stocOre)||0;
    const sAnvelope = parseFloat(stocAnvelope)||0;
    const rata = parseFloat(rataConfectionare);
    const totalExtra = parseFloat(totalDeProodus)||0;
    const ora = parseInt(oraActuala);
    const minut = parseInt(minutActual)||0;
    if(oraActuala===''||isNaN(ora)){Alert.alert('Atentie','Introduceti ora actuala.');return;}
    if(isNaN(rata)||rata<=0){Alert.alert('Atentie','Introduceti rata de confectionare.');return;}
    if(ora<0||ora>23||minut<0||minut>59){Alert.alert('Eroare','Ora invalida.');return;}
    // Consum vulcanizare pe ora
    const consumVulcOra = matrite * CONSUM_PER_MATRITA_ORA;
    // Stoc total anvelope = stoc initial + productie extra
    const totalAnvelope = sAnvelope + totalExtra;
    // Ore stoc total = total anvelope / consum vulcanizare pe ora
    const oreStocTotal = totalAnvelope / consumVulcOra;
    // Ora schimbarii = ora actuala + (productie extra / rata confectionare)
    const oreSchimbare = totalExtra / rata;
    const minuteStart = ora*60 + minut;
    const minuteSchimbare = minuteStart + oreSchimbare*60;
    const oraSchimbare = Math.floor(minuteSchimbare/60)%24;
    const minutSchimbare = Math.floor(minuteSchimbare%60);
    const zileExtra = Math.floor(minuteSchimbare/1440);
    setRezultat({sOre,sAnvelope:Math.round(sAnvelope),totalExtra:Math.round(totalExtra),totalAnvelope:Math.round(totalAnvelope),consumVulcOra,oreStocTotal,oreSchimbare,oraSchimbare:String(oraSchimbare).padStart(2,'0'),minutSchimbare:String(minutSchimbare).padStart(2,'0'),zileExtra});
  };
  const reseteaza = () => { setStocOre('');setStocAnvelope('');setMatrite(1);setRataConfectionare('');setTotalDeProodus('');setOraActuala('');setMinutActual('');setRezultat(null); };
  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f14"/>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.header}>