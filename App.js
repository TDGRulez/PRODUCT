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
    const totalDeProds = parseFloat(totalDeProodus)||0;
    const ora = parseInt(oraActuala);
    const minut = parseInt(minutActual)||0;
    if(oraActuala===''||isNaN(ora)){Alert.alert('Atentie','Introduceti ora actuala.');return;}
    if(isNaN(rata)||rata<=0){Alert.alert('Atentie','Introduceti rata de confectionare.');return;}
    if(ora<0||ora>23||minut<0||minut>59){Alert.alert('Eroare','Ora invalida.');return;}
    // Consum vulcanizare pe ora
    const consumVulcOra = matrite * CONSUM_PER_MATRITA_ORA;
    // Timp productie confectionare
    const oreConfectionare = totalDeProds / rata;
    // Stoc total anvelope = stoc vulcanizare + total produs confectionare
    const totalAnvelope = sAnvelope + totalDeProds;
    // Ore totale stoc = stoc initial ore + ore din anvelopele confectionate / consum vulcanizare
    const oreDinConfectionare = totalDeProds / consumVulcOra;
    const oreTotal = sOre + oreDinConfectionare;
    // Ora schimbarii
    const minuteStart = ora*60 + minut;
    const minuteSchimbare = minuteStart + oreTotal*60;
    const oraSchimbare = Math.floor(minuteSchimbare/60)%24;
    const minutSchimbare = Math.floor(minuteSchimbare%60);
    const zileExtra = Math.floor((minuteStart + oreTotal*60)/1440);
    setRezultat({
      sOre, sAnvelope:Math.round(sAnvelope),
      totalDeProds:Math.round(totalDeProds),
      totalAnvelope:Math.round(totalAnvelope),
      consumVulcOra, oreConfectionare,
      oreDinConfectionare, oreTotal,
      oraSchimbare:String(oraSchimbare).padStart(2,'0'),
      minutSchimbare:String(minutSchimbare).padStart(2,'0'),
      zileExtra
    });
  };
  const reseteaza = () => { setStocOre('');setStocAnvelope('');setMatrite(1);setRataConfectionare('');setTotalDeProodus('');setOraActuala('');setMinutActual('');setRezultat(null); };
  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f14"/>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.header}>
            <Text style={s.headerEyebrow}>FABRICA DE ANVELOPE</Text>
            <Text style={s.headerTitle}>Schimbare{'\n'}Dimensiune</Text>
            <View style={s.headerAccent}/>
          </View>

          {/* VULCANIZARE */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>VULCANIZARE</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>STOC CURENT</Text>
            <Text style={s.label}>Stoc in ore</Text>
            <TextInput style={s.input} placeholder="ex: 8" placeholderTextColor="#2a3f55" keyboardType="numeric" value={stocOre} onChangeText={v=>{setStocOre(v);setRezultat(null);}}/>
            <Text style={s.label}>Stoc in anvelope (buc)</Text>
            <TextInput style={s.input} placeholder="ex: 100" placeholderTextColor="#2a3f55" keyboardType="numeric" value={stocAnvelope} onChangeText={v=>{setStocAnvelope(v);setRezultat(null);}}/>
            <Text style={s.label}>Numar matrite active</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.matriteScroll}>
              {MATRITE_OPTIONS.map(n=>(
                <TouchableOpacity key={n} style={[s.matriteBtn, matrite===n&&s.matriteBtnActive]} onPress={()=>{setMatrite(n);setRezultat(null);}}>
                  <Text style={[s.matriteText, matrite===n&&s.matriteTextActive]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={s.hint}>Consum: {(matrite * CONSUM_PER_MATRITA_ORA).toFixed(1)} buc/ora ({matrite} matrite × 4.17)</Text>
          </View>

          {/* CONFECTIONARE */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>CONFECTIONARE</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>PRODUCTIE</Text>
            <Text style={s.label}>Anvelope produse pe ora (buc/h)</Text>
            <TextInput style={s.input} placeholder="ex: 25" placeholderTextColor="#2a3f55" keyboardType="numeric" value={rataConfectionare} onChangeText={v=>{setRataConfectionare(v);setRezultat(null);}}/>
            <Text style={s.label}>Total anvelope de produs pana la schimbare (buc)</Text>
            <TextInput style={s.input} placeholder="ex: 100" placeholderTextColor="#2a3f55" keyboardType="numeric" value={totalDeProodus} onChangeText={v=>{setTotalDeProodus(v);setRezultat(null);}}/>
          </View>

          {/* ORA */}
          <View style={s.card}>
            <Text style={s.cardTitle}>ORA ACTUALA</Text>
            <View style={s.timeRow}>
              <View style={s.timeInputWrapper}>
                <Text style={s.label}>Ore</Text>
                <TextInput style={[s.input,s.timeInput]} placeholder="HH" placeholderTextColor="#2a3f55" keyboardType="numeric" maxLength={2} value={oraActuala} onChangeText={v=>{setOraActuala(v);setRezultat(null);}}/>
              </View>
              <Text style={s.timeSep}>:</Text>
              <View style={s.timeInputWrapper}>
                <Text style={s.label}>Minute</Text>
                <TextInput style={[s.input,s.timeInput]} placeholder="MM" placeholderTextColor="#2a3f55" keyboardType="numeric" maxLength={2} value={minutActual} onChangeText={v=>{setMinutActual(v);setRezultat(null);}}/>
              </View>
              <TouchableOpacity style={s.nowBtn} onPress={folosteOraAcum}>
                <Text style={s.nowBtnText}>ACUM</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={s.calcBtn} onPress={calculeaza}>
            <Text style={s.calcBtnText}>CALCULEAZA</Text>
          </TouchableOpacity>

          {rezultat&&(
            <View style={s.rezultatCard}>
              <Text style={s.rezultatTitle}>REZULTAT</Text>

              <Text style={s.sectiune}>STOC VULCANIZARE</Text>
              <View style={s.statRow}>
                <Text style={s.statLabel}>Stoc initial</Text>
                <Text style={s.statValue}>{rezultat.sAnvelope} buc = {formatDurata(rezultat.sOre)}</Text>
              </View>
              <View style={s.statRow}>
                <Text style={s.statLabel}>Consum matrite</Text>
                <Text style={s.statValue}>{rezultat.consumVulcOra.toFixed(1)} buc/ora</Text>
              </View>

              <View style={s.divider}/>

              <Text style={s.sectiune}>CONFECTIONARE</Text>
              <View style={s.statRow}>
                <Text style={s.statLabel}>Anvelope de produs</Text>
                <Text style={s.statValue}>{rezultat.totalDeProds} buc</Text>
              </View>
              <View style={s.statRow}>
                <Text style={s.statLabel}>Timp confectionare</Text>
                <Text style={s.statValue}>{formatDurata(rezultat.oreConfectionare)}</Text>
              </View>
              <View style={s.statRow}>
                <Text style={s.statLabel}>Ore stoc din productie</Text>
                <Text style={s.statValue}>{formatDurata(rezultat.oreDinConfectionare)}</Text>
              </View>

              <View style={s.divider}/>

              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Stoc total</Text>
                <Text style={s.totalValue}>{rezultat.totalAnvelope} buc = {formatDurata(rezultat.oreTotal)}</Text>
              </View>

              <View style={s.divider}/>

              <Text style={s.schimbareLabel}>Schimbare dimensiune la ora:</Text>
              <Text style={s.schimbareOra}>{rezultat.oraSchimbare}:{rezultat.minutSchimbare}</Text>
              {rezultat.zileExtra>0&&(
                <View style={s.warningBox}>
                  <Text style={s.warningText}>⚠️ Schimbarea va fi peste {rezultat.zileExtra} {rezultat.zileExtra===1?'zi':'zile'}</Text>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={s.resetBtn} onPress={reseteaza}>
            <Text style={s.resetBtnText}>RESETEAZA</Text>
          </TouchableOpacity>
          <View style={{height:50}}/>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#0a0f14'},
  scroll:{padding:20,paddingTop:50},
  header:{marginBottom:24},
  headerEyebrow:{color:'#e8a020',fontSize:10,fontWeight:'800',letterSpacing:4,marginBottom:6},
  headerTitle:{color:'#ffffff',fontSize:30,fontWeight:'900',lineHeight:36},
  headerAccent:{width:44,height:4,backgroundColor:'#e8a020',borderRadius:2,marginTop:12},
  sectionHeader:{backgroundColor:'#1a2d3f',borderRadius:10,paddingVertical:8,paddingHorizontal:14,marginBottom:10},
  sectionTitle:{color:'#7ab8d4',fontSize:11,fontWeight:'800',letterSpacing:4},
  card:{backgroundColor:'#111b24',borderRadius:16,padding:20,marginBottom:14,borderWidth:1,borderColor:'#1a2d3f'},
  cardTitle:{color:'#e8a020',fontSize:10,fontWeight:'800',letterSpacing:3,marginBottom:4},
  hint:{color:'#2a4a5f',fontSize:11,fontStyle:'italic',marginTop:8},
  label:{color:'#4d7a99',fontSize:11,fontWeight:'600',marginBottom:8,marginTop:10},
  input:{backgroundColor:'#0a0f14',borderWidth:1,borderColor:'#1a2d3f',borderRadius:12,color:'#ffffff',fontSize:20,fontWeight:'700',paddingHorizontal:16,paddingVertical:13},
  matriteScroll:{marginTop:10,marginBottom:4},
  matriteBtn:{width:44,height:44,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:'#0a0f14',borderWidth:1,borderColor:'#1a2d3f',marginRight:8},
  matriteBtnActive:{backgroundColor:'#e8a020',borderColor:'#e8a020'},
  matriteText:{color:'#3d5a73',fontWeight:'700',fontSize:15},
  matriteTextActive:{color:'#0a0f14'},
  timeRow:{flexDirection:'row',alignItems:'flex-end',gap:8},
  timeInputWrapper:{flex:1},
  timeInput:{textAlign:'center'},
  timeSep:{color:'#ffffff',fontSize:26,fontWeight:'800',marginBottom:13},
  nowBtn:{backgroundColor:'#0a0f14',borderRadius:12,paddingHorizontal:14,paddingVertical:14,alignSelf:'flex-end',borderWidth:1,borderColor:'#e8a020'},
  nowBtnText:{color:'#e8a020',fontWeight:'800',fontSize:10,letterSpacing:2},
  calcBtn:{backgroundColor:'#e8a020',borderRadius:14,paddingVertical:18,alignItems:'center',marginBottom:16,elevation:10},
  calcBtnText:{color:'#0a0f14',fontSize:14,fontWeight:'900',letterSpacing:4},
  rezultatCard:{backgroundColor:'#111b24',borderRadius:16,padding:24,marginBottom:16,borderWidth:2,borderColor:'#e8a020'},
  rezultatTitle:{color:'#e8a020',fontSize:10,fontWeight:'800',letterSpacing:4,marginBottom:16},
  sectiune:{color:'#4d7a99',fontSize:10,fontWeight:'700',letterSpacing:2,marginBottom:8,marginTop:4},
  statRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:6},
  statLabel:{color:'#4d7a99',fontSize:13,fontWeight:'500'},
  statValue:{color:'#ffffff',fontSize:14,fontWeight:'700'},
  totalRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,backgroundColor:'#0a0f14',borderRadius:10,paddingHorizontal:12},
  totalLabel:{color:'#ffffff',fontSize:13,fontWeight:'700'},
  totalValue:{color:'#e8a020',fontSize:14,fontWeight:'800'},
  divider:{height:1,backgroundColor:'#1a2d3f',marginVertical:14},
  schimbareLabel:{color:'#7a9bb5',fontSize:12,fontWeight:'600',textAlign:'center',marginBottom:6,marginTop:8},
  schimbareOra:{color:'#e8a020',fontSize:64,fontWeight:'900',textAlign:'center',letterSpacing:6},
  warningBox:{backgroundColor:'#1f1508',borderRadius:10,padding:12,marginTop:14,borderWidth:1,borderColor:'#e8a020'},
  warningText:{color:'#e8a020',fontSize:13,fontWeight:'600',textAlign:'center'},
  resetBtn:{borderRadius:14,paddingVertical:15,alignItems:'center',borderWidth:1,borderColor:'#1a2d3f'},
  resetBtnText:{color:'#2a3f55',fontSize:12,fontWeight:'700',letterSpacing:3},
});