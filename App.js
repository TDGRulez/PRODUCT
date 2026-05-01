import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const MATRITE = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
const CPM = 100/24;

const Y = '#FFD100';
const BG = '#0D0D0D';
const CARD = '#1A1A1A';
const BORDER = '#2A2A2A';
const MUTED = '#555';
const WHITE = '#FFFFFF';

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
    setRez({ vSore, vSanv:Math.round(vSanv), vExtra:Math.round(vExtra), totalAnv:Math.round(totalAnv), consum, oreStoc, oreSchimbare, oraSch:String(oraSch).padStart(2,'0'), minSchimb:String(minSchimb).padStart(2,'0'), ziuaUrm: minSch>=1440 });
  };

  const reset = () => { setSore(''); setSanv(''); setMat(1); setRata(''); setExtra(''); setOra(''); setMin(''); setRez(null); };

  return (
    <View style={st.cont}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
        <ScrollView contentContainerStyle={st.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={st.header}>
            <View style={st.headerTop}>
              <View style={st.badge}><Text style={st.badgeTxt}>MICHELIN</Text></View>
              <Text style={st.headerSub}>Planificare Productie</Text>
            </View>

          {/* VULCANIZARE */}
          <View style={st.sectionLabel}>
            <View style={st.sectionDot} />
            <Text style={st.sectionTxt}>VULCANIZARE</Text>
          </View>

          <View style={st.card}>
            {/* Row: Stoc ore + Stoc anvelope */}
            <View style={st.twoCol}>
              <View style={{flex:1, marginRight:8}}>
                <Text style={st.lbl}>Stoc (ore)</Text>
                <TextInput style={st.inp} placeholder="ex: 8" placeholderTextColor={MUTED} keyboardType="numeric" value={sOre} onChangeText={v=>{setSore(v);setRez(null);}} />
              </View>
              <View style={{flex:1}}>
                <Text style={st.lbl}>Stoc (buc)</Text>
                <TextInput style={st.inp} placeholder="ex: 100" placeholderTextColor={MUTED} keyboardType="numeric" value={sAnv} onChangeText={v=>{setSanv(v);setRez(null);}} />
              </View>
            </View>

            <View style={st.divider} />

            {/* Matrite */}
            <Text style={st.lbl}>Matrite active</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:8}}>
              {MATRITE.map(n => (
                <TouchableOpacity key={n} style={[st.mBtn, mat===n && st.mBtnA]} onPress={()=>{setMat(n);setRez(null);}}>
                  <Text style={[st.mTxt, mat===n && st.mTxtA]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={st.infoRow}>
              <Text style={st.infoTxt}>Consum:</Text>
              <Text style={st.infoVal}>{(mat*CPM).toFixed(1)} buc/ora</Text>
              <Text style={st.infoTxt}>({mat} x 4.17)</Text>
            </View>
          </View>

          {/* CONFECTIONARE */}
          <View style={st.sectionLabel}>
            <View style={[st.sectionDot, {backgroundColor:'#FFF'}]} />
            <Text style={st.sectionTxt}>CONFECTIE</Text>
          </View>

          <View style={st.card}>
            <View style={st.twoCol}>
              <View style={{flex:1, marginRight:8}}>
                <Text style={st.lbl}>Rata (buc/h)</Text>
                <TextInput style={st.inp} placeholder="ex: 25" placeholderTextColor={MUTED} keyboardType="numeric" value={rata} onChangeText={v=>{setRata(v);setRez(null);}} />
              </View>
              <View style={{flex:1}}>
                <Text style={st.lbl}>Total de produs</Text>
                <TextInput style={st.inp} placeholder="ex: 100" placeholderTextColor={MUTED} keyboardType="numeric" value={extra} onChangeText={v=>{setExtra(v);setRez(null);}} />
              </View>
            </View>
          </View>

          {/* ORA */}
          <View style={st.card}>
            <View style={st.timeWrap}>
              <View style={{flex:1}}>
                <Text style={st.lbl}>Ora curenta</Text>
                <View style={st.timeRow}>
                  <TextInput style={[st.inp, st.timeInp]} placeholder="HH" placeholderTextColor={MUTED} keyboardType="numeric" maxLength={2} value={ora} onChangeText={v=>{setOra(v);setRez(null);}} />
                  <Text style={st.timeSep}>:</Text>
                  <TextInput style={[st.inp, st.timeInp]} placeholder="MM" placeholderTextColor={MUTED} keyboardType="numeric" maxLength={2} value={min} onChangeText={v=>{setMin(v);setRez(null);}} />
                </View>
              </View>
              <TouchableOpacity style={st.acumBtn} onPress={acum}>
                <Text style={st.acumLine1}>ORA</Text>
                <Text style={st.acumLine2}>ACUM</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BUTON CALCUL */}
          <TouchableOpacity style={st.calcBtn} onPress={calc} activeOpacity={0.85}>
            <Text style={st.calcTxt}>CALCULEAZA</Text>
            <View style={st.calcArrow}><Text style={st.calcArrowTxt}>→</Text></View>
          </TouchableOpacity>

          {/* REZULTAT */}
          {rez && (
            <View style={st.rezWrap}>
              {/* Stoc vulcanizare */}
              <View style={st.rezCard}>
                <Text style={st.rezSec}>STOC VULCANIZARE</Text>
                <View style={st.rezRow}>
                  <View style={st.rezItem}>
                    <Text style={st.rezItemLbl}>Initial</Text>
                    <Text style={st.rezItemVal}>{rez.vSanv}<Text style={st.rezItemUnit}> buc</Text></Text>
                    <Text style={st.rezItemSub}>{fmt(rez.vSore)}</Text>
                  </View>
                  <View style={st.rezPlus}><Text style={st.rezPlusTxt}>+</Text></View>
                  <View style={st.rezItem}>
                    <Text style={st.rezItemLbl}>Extra</Text>
                    <Text style={st.rezItemVal}>{rez.vExtra}<Text style={st.rezItemUnit}> buc</Text></Text>
                    <Text style={st.rezItemSub}>{fmt(rez.oreSchimbare)}</Text>
                  </View>
                  <View style={st.rezPlus}><Text style={st.rezPlusTxt}>=</Text></View>
                  <View style={[st.rezItem, st.rezItemHL]}>
                    <Text style={[st.rezItemLbl, {color:BG}]}>Total</Text>
                    <Text style={[st.rezItemVal, {color:BG}]}>{rez.totalAnv}<Text style={[st.rezItemUnit, {color:BG}]}> buc</Text></Text>
                    <Text style={[st.rezItemSub, {color:BG, fontWeight:'700'}]}>{fmt(rez.oreStoc)}</Text>
                  </View>
                </View>
                <View style={st.consumBar}>
                  <Text style={st.consumTxt}>Consum matrite: {rez.consum.toFixed(1)} buc/ora</Text>
                </View>
              </View>

              {/* Ora schimbarii */}
              <View style={st.schCard}>
                <Text style={st.schLabel}>SCHIMBARE DIMENSIUNE</Text>
                <Text style={st.schOra}>{rez.oraSch}:{rez.minSchimb}</Text>
                <Text style={st.schSub}>Timp productie extra: {fmt(rez.oreSchimbare)}</Text>
                {rez.ziuaUrm && (
                  <View style={st.warn}>
                    <Text style={st.warnTxt}>⚠ Schimbarea va fi a doua zi</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <TouchableOpacity style={st.resetBtn} onPress={reset}>
            <Text style={st.resetTxt}>↺  RESETEAZA</Text>
          </TouchableOpacity>

          <View style={{height:40}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const st = StyleSheet.create({
  cont: { flex:1, backgroundColor:BG },
  scroll: { padding:16, paddingTop:Platform.OS==='android'?44:64 },

  header: { marginBottom:24 },
  headerTop: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:12 },
  badge: { backgroundColor:Y, paddingHorizontal:10, paddingVertical:4, borderRadius:4 },
  badgeTxt: { color:BG, fontWeight:'900', fontSize:10, letterSpacing:2 },
  headerSub: { color:MUTED, fontSize:12, fontWeight:'500' },
  headerTitle: { color:WHITE, fontSize:36, fontWeight:'900', lineHeight:40, letterSpacing:-0.5 },
  headerLine: { width:60, height:3, backgroundColor:Y, borderRadius:2, marginTop:14 },

  sectionLabel: { flexDirection:'row', alignItems:'center', gap:8, marginBottom:8, marginTop:4 },
  sectionDot: { width:8, height:8, borderRadius:4, backgroundColor:Y },
  sectionTxt: { color:MUTED, fontSize:10, fontWeight:'800', letterSpacing:3 },

  card: { backgroundColor:CARD, borderRadius:14, padding:16, marginBottom:10, borderWidth:1, borderColor:BORDER },

  twoCol: { flexDirection:'row' },
  lbl: { color:MUTED, fontSize:10, fontWeight:'700', letterSpacing:1, marginBottom:6 },
  inp: { backgroundColor:BG, borderWidth:1, borderColor:BORDER, borderRadius:10, color:WHITE, fontSize:18, fontWeight:'800', paddingHorizontal:14, paddingVertical:11 },
  divider: { height:1, backgroundColor:BORDER, marginVertical:14 },

  mBtn: { width:40, height:40, borderRadius:8, alignItems:'center', justifyContent:'center', backgroundColor:BG, borderWidth:1, borderColor:BORDER, marginRight:6 },
  mBtnA: { backgroundColor:Y, borderColor:Y },
  mTxt: { color:MUTED, fontWeight:'800', fontSize:14 },
  mTxtA: { color:BG },

  infoRow: { flexDirection:'row', alignItems:'center', gap:6, marginTop:10 },
  infoTxt: { color:MUTED, fontSize:11 },
  infoVal: { color:Y, fontSize:12, fontWeight:'800' },

  timeWrap: { flexDirection:'row', alignItems:'flex-end', gap:12 },
  timeRow: { flexDirection:'row', alignItems:'center', gap:6 },
  timeInp: { flex:1, textAlign:'center', fontSize:22 },
  timeSep: { color:WHITE, fontSize:22, fontWeight:'900' },
  acumBtn: { backgroundColor:Y, borderRadius:10, paddingHorizontal:16, paddingVertical:12, alignItems:'center', marginBottom:0 },
  acumLine1: { color:BG, fontSize:9, fontWeight:'900', letterSpacing:2 },
  acumLine2: { color:BG, fontSize:9, fontWeight:'900', letterSpacing:2 },

  calcBtn: { backgroundColor:Y, borderRadius:14, paddingVertical:18, paddingHorizontal:24, flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:12, marginTop:4 },
  calcTxt: { color:BG, fontSize:16, fontWeight:'900', letterSpacing:3 },
  calcArrow: { backgroundColor:BG, width:36, height:36, borderRadius:18, alignItems:'center', justifyContent:'center' },
  calcArrowTxt: { color:Y, fontSize:18, fontWeight:'900' },

  rezWrap: { gap:10, marginBottom:12 },

  rezCard: { backgroundColor:CARD, borderRadius:14, padding:16, borderWidth:1, borderColor:BORDER },
  rezSec: { color:MUTED, fontSize:10, fontWeight:'800', letterSpacing:3, marginBottom:14 },
  rezRow: { flexDirection:'row', alignItems:'center', gap:4 },
  rezItem: { flex:1, backgroundColor:BG, borderRadius:10, padding:10, alignItems:'center' },
  rezItemHL: { backgroundColor:Y },
  rezItemLbl: { color:MUTED, fontSize:9, fontWeight:'700', letterSpacing:1, marginBottom:4 },
  rezItemVal: { color:WHITE, fontSize:16, fontWeight:'900' },
  rezItemUnit: { fontSize:10, fontWeight:'500' },
  rezItemSub: { color:MUTED, fontSize:10, marginTop:2 },
  rezPlus: { alignItems:'center', justifyContent:'center', paddingHorizontal:2 },
  rezPlusTxt: { color:MUTED, fontSize:18, fontWeight:'900' },
  consumBar: { backgroundColor:BG, borderRadius:8, padding:8, marginTop:12, alignItems:'center' },
  consumTxt: { color:MUTED, fontSize:11, fontWeight:'600' },

  schCard: { backgroundColor:Y, borderRadius:14, padding:20, alignItems:'center' },
  schLabel: { color:BG, fontSize:10, fontWeight:'800', letterSpacing:3, marginBottom:8 },
  schOra: { color:BG, fontSize:72, fontWeight:'900', letterSpacing:4, lineHeight:76 },
  schSub: { color:BG, fontSize:12, fontWeight:'600', opacity:0.7, marginTop:6 },
  warn: { backgroundColor:BG, borderRadius:8, padding:10, marginTop:12 },
  warnTxt: { color:Y, fontSize:12, fontWeight:'700', textAlign:'center' },

  resetBtn: { borderRadius:14, paddingVertical:14, alignItems:'center', borderWidth:1, borderColor:BORDER },
  resetTxt: { color:MUTED, fontSize:12, fontWeight:'700', letterSpacing:2 },
});
