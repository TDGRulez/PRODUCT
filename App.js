import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const MATRITE = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
const CPM = 100/24;

export default function App() {
  const [sOre, setSore] = useState('');
  const [sAnv, setSanv] = useState('');
  const [mat, setMat] = useState(1);
  const [rata, setRata] = useState('');
  const [extra, setExtra] = useState('');
  const [ora, setOra] = useState('');
  const [min, setMin] = useState('');
  const [rez, setRez] = useState(null);

  const acum = () => {
    const d = new Date();
    setOra(String(d.getHours()).padStart(2,'0'));
    setMin(String(d.getMinutes()).padStart(2,'0'));
  };

  const fmt = (h) => {
    const hh = Math.floor(h);
    const mm = Math.round((h-hh)*60);
    return mm === 0 ? hh+'h' : hh+'h '+mm+'min';
  };

  const calc = () => {
    const vSore = parseFloat(sOre)||0;
    const vSanv = parseFloat(sAnv)||0;
    const vRata = parseFloat(rata);
    const vExtra = parseFloat(extra)||0;
    const vOra = parseInt(ora);
    const vMin = parseInt(min)||0;
    if (isNaN(vOra)||ora==='') { Alert.alert('Atentie','Introduceti ora actuala.'); return; }
    if (isNaN(vRata)||vRata<=0) { Alert.alert('Atentie','Introduceti rata de confectionare.'); return; }
    if (vOra<0||vOra>23||vMin<0||vMin>59) { Alert.alert('Eroare','Ora invalida.'); return; }
    const consum = mat * CPM;
    const totalAnv = vSanv + vExtra;
    const oreStoc = totalAnv / consum;
    const oreSchimbare = vExtra / vRata;
    const minStart = vOra*60 + vMin;
    const minSch = minStart + oreSchimbare*60;
    const oraSch = Math.floor(minSch/60)%24;
    const minSchimb = Math.floor(minSch%60);
    const ziuaUrm = minSch >= 1440;
    setRez({ vSore, vSanv:Math.round(vSanv), vExtra:Math.round(vExtra), totalAnv:Math.round(totalAnv), consum, oreStoc, oreSchimbare, oraSch:String(oraSch).padStart(2,'0'), minSchimb:String(minSchimb).padStart(2,'0'), ziuaUrm });
  };

  const reset = () => { setSore(''); setSanv(''); setMat(1); setRata(''); setExtra(''); setOra(''); setMin(''); setRez(null); };

  return (
    <View style={st.cont}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f14" />
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
        <ScrollView contentContainerStyle={st.scroll} keyboardShouldPersistTaps="handled">

          <View style={st.header}>
            <Text style={st.eyebrow}>FABRICA DE ANVELOPE</Text>
            <Text style={st.title}>Schimbare Dimensiune</Text>
            <View style={st.accent} />
          </View>

          <View style={st.secBar}>
            <Text style={st.secTxt}>VULCANIZARE</Text>
          </View>

          <View style={st.card}>
            <Text style={st.cardTit}>STOC CURENT</Text>
            <Text style={st.lbl}>Stoc in ore</Text>
            <TextInput style={st.inp} placeholder="ex: 8" placeholderTextColor="#2a3f55" keyboardType="numeric" value={sOre} onChangeText={v=>{setSore(v);setRez(null);}} />
            <Text style={st.lbl}>Stoc in anvelope (buc)</Text>
            <TextInput style={st.inp} placeholder="ex: 100" placeholderTextColor="#2a3f55" keyboardType="numeric" value={sAnv} onChangeText={v=>{setSanv(v);setRez(null);}} />
            <Text style={st.lbl}>Numar matrite active</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:10,marginBottom:4}}>
              {MATRITE.map(n => (
                <TouchableOpacity key={n} style={[st.mBtn, mat===n && st.mBtnA]} onPress={()=>{setMat(n);setRez(null);}}>
                  <Text style={[st.mTxt, mat===n && st.mTxtA]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={st.hint}>Consum: {(mat*CPM).toFixed(1)} buc/ora ({mat} matrite x 4.17)</Text>
          </View>

          <View style={st.secBar}>
            <Text style={st.secTxt}>CONFECTIONARE</Text>
          </View>

          <View style={st.card}>
            <Text style={st.cardTit}>PRODUCTIE EXTRA</Text>
            <Text style={st.lbl}>Anvelope produse pe ora (buc/h)</Text>
            <TextInput style={st.inp} placeholder="ex: 25" placeholderTextColor="#2a3f55" keyboardType="numeric" value={rata} onChangeText={v=>{setRata(v);setRez(null);}} />
            <Text style={st.lbl}>Total anvelope de produs (buc)</Text>
            <TextInput style={st.inp} placeholder="ex: 100" placeholderTextColor="#2a3f55" keyboardType="numeric" value={extra} onChangeText={v=>{setExtra(v);setRez(null);}} />
          </View>

          <View style={st.card}>
            <Text style={st.cardTit}>ORA ACTUALA</Text>
            <View style={st.tRow}>
              <View style={{flex:1}}>
                <Text style={st.lbl}>Ore</Text>
                <TextInput style={[st.inp,{textAlign:'center'}]} placeholder="HH" placeholderTextColor="#2a3f55" keyboardType="numeric" maxLength={2} value={ora} onChangeText={v=>{setOra(v);setRez(null);}} />
              </View>
              <Text style={st.tSep}>:</Text>
              <View style={{flex:1}}>
                <Text style={st.lbl}>Minute</Text>
                <TextInput style={[st.inp,{textAlign:'center'}]} placeholder="MM" placeholderTextColor="#2a3f55" keyboardType="numeric" maxLength={2} value={min} onChangeText={v=>{setMin(v);setRez(null);}} />
              </View>
              <TouchableOpacity style={st.nowBtn} onPress={acum}>
                <Text style={st.nowTxt}>ACUM</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={st.calcBtn} onPress={calc}>
            <Text style={st.calcTxt}>CALCULEAZA</Text>
          </TouchableOpacity>

          {rez && (
            <View style={st.rezCard}>
              <Text style={st.rezTit}>REZULTAT</Text>

              <Text style={st.sec}>STOC VULCANIZARE</Text>
              <View style={st.row}><Text style={st.rLbl}>Stoc initial</Text><Text style={st.rVal}>{rez.vSanv} buc / {fmt(rez.vSore)}</Text></View>
              <View style={st.row}><Text style={st.rLbl}>+ Productie extra</Text><Text style={st.rVal}>{rez.vExtra} buc</Text></View>
              <View style={st.row}><Text style={st.rLbl}>Consum matrite</Text><Text style={st.rVal}>{rez.consum.toFixed(1)} buc/ora</Text></View>
              <View style={st.totRow}>
                <Text style={st.totLbl}>Stoc total</Text>
                <Text style={st.totVal}>{rez.totalAnv} buc = {fmt(rez.oreStoc)}</Text>
              </View>

              <View style={st.div} />

              <Text style={st.sec}>SCHIMBARE CONFECTIONARE</Text>
              <View style={st.row}><Text style={st.rLbl}>Timp productie extra</Text><Text style={st.rVal}>{fmt(rez.oreSchimbare)}</Text></View>
              <Text style={st.schLbl}>Schimbare dimensiune la ora:</Text>
              <Text style={st.schOra}>{rez.oraSch}:{rez.minSchimb}</Text>
              {rez.ziuaUrm && (
                <View style={st.warn}>
                  <Text style={st.warnTxt}>Schimbarea va fi a doua zi</Text>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={st.resetBtn} onPress={reset}>
            <Text style={st.resetTxt}>RESETEAZA</Text>
          </TouchableOpacity>

          <View style={{height:50}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const st = StyleSheet.create({
  cont:{flex:1,backgroundColor:'#0a0f14'},
  scroll:{padding:20,paddingTop:50},
  header:{marginBottom:24},
  eyebrow:{color:'#e8a020',fontSize:10,fontWeight:'800',letterSpacing:4,marginBottom:6},
  title:{color:'#fff',fontSize:28,fontWeight:'900'},
  accent:{width:44,height:4,backgroundColor:'#e8a020',borderRadius:2,marginTop:12},
  secBar:{backgroundColor:'#1a2d3f',borderRadius:10,paddingVertical:8,paddingHorizontal:14,marginBottom:10},
  secTxt:{color:'#7ab8d4',fontSize:11,fontWeight:'800',letterSpacing:4},
  card:{backgroundColor:'#111b24',borderRadius:16,padding:20,marginBottom:14,borderWidth:1,borderColor:'#1a2d3f'},
  cardTit:{color:'#e8a020',fontSize:10,fontWeight:'800',letterSpacing:3,marginBottom:4},
  hint:{color:'#2a4a5f',fontSize:11,fontStyle:'italic',marginTop:8},
  lbl:{color:'#4d7a99',fontSize:11,fontWeight:'600',marginBottom:8,marginTop:10},
  inp:{backgroundColor:'#0a0f14',borderWidth:1,borderColor:'#1a2d3f',borderRadius:12,color:'#fff',fontSize:20,fontWeight:'700',paddingHorizontal:16,paddingVertical:13},
  mBtn:{width:44,height:44,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:'#0a0f14',borderWidth:1,borderColor:'#1a2d3f',marginRight:8},
  mBtnA:{backgroundColor:'#e8a020',borderColor:'#e8a020'},
  mTxt:{color:'#3d5a73',fontWeight:'700',fontSize:15},
  mTxtA:{color:'#0a0f14'},
  tRow:{flexDirection:'row',alignItems:'flex-end',gap:8},
  tSep:{color:'#fff',fontSize:26,fontWeight:'800',marginBottom:13},
  nowBtn:{backgroundColor:'#0a0f14',borderRadius:12,paddingHorizontal:14,paddingVertical:14,alignSelf:'flex-end',borderWidth:1,borderColor:'#e8a020'},
  nowTxt:{color:'#e8a020',fontWeight:'800',fontSize:10,letterSpacing:2},
  calcBtn:{backgroundColor:'#e8a020',borderRadius:14,paddingVertical:18,alignItems:'center',marginBottom:16,elevation:10},
  calcTxt:{color:'#0a0f14',fontSize:14,fontWeight:'900',letterSpacing:4},
  rezCard:{backgroundColor:'#111b24',borderRadius:16,padding:24,marginBottom:16,borderWidth:2,borderColor:'#e8a020'},
  rezTit:{color:'#e8a020',fontSize:10,fontWeight:'800',letterSpacing:4,marginBottom:16},
  sec:{color:'#4d7a99',fontSize:10,fontWeight:'700',letterSpacing:2,marginBottom:8,marginTop:4},
  row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:6},
  rLbl:{color:'#4d7a99',fontSize:13,fontWeight:'500'},
  rVal:{color:'#fff',fontSize:14,fontWeight:'700'},
  totRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,marginTop:8,backgroundColor:'#0a0f14',borderRadius:10,paddingHorizontal:12},
  totLbl:{color:'#fff',fontSize:13,fontWeight:'700'},
  totVal:{color:'#e8a020',fontSize:14,fontWeight:'800'},
  div:{height:1,backgroundColor:'#1a2d3f',marginVertical:14},
  schLbl:{color:'#7a9bb5',fontSize:12,fontWeight:'600',textAlign:'center',marginBottom:6,marginTop:8},
  schOra:{color:'#e8a020',fontSize:64,fontWeight:'900',textAlign:'center',letterSpacing:6},
  warn:{backgroundColor:'#1f1508',borderRadius:10,padding:12,marginTop:14,borderWidth:1,borderColor:'#e8a020'},
  warnTxt:{color:'#e8a020',fontSize:13,fontWeight:'600',textAlign:'center'},
  resetBtn:{borderRadius:14,paddingVertical:15,alignItems:'center',borderWidth:1,borderColor:'#1a2d3f'},
  resetTxt:{color:'#2a3f55',fontSize:12,fontWeight:'700',letterSpacing:3},
});