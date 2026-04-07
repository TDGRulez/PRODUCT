import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Platform, KeyboardAvoidingView, Alert } from 'react-native';
export default function App() {
  const [stocOre, setStocOre] = useState('');
  const [stocAnvelope, setStocAnvelope] = useState('');
  const [productieExtra, setProductieExtra] = useState('');
  const [anvelopePerOra, setAnvelopePerOra] = useState('');
  const [oraActuala, setOraActuala] = useState('');
  const [minutActual, setMinutActual] = useState('');
  const [rezultat, setRezultat] = useState(null);
  const folosteOraAcum = () => { const acum = new Date(); setOraActuala(String(acum.getHours()).padStart(2,'0')); setMinutActual(String(acum.getMinutes()).padStart(2,'0')); };
  const formatDurata = (ore) => { const h = Math.floor(ore); const m = Math.round((ore-h)*60); if(m===0) return h+'h'; return h+'h '+m+'min'; };
  const calculeaza = () => {
    const sOre = parseFloat(stocOre)||0;
    const sAnvelope = parseFloat(stocAnvelope)||0;
    const extra = parseFloat(productieExtra)||0;
    const rata = parseFloat(anvelopePerOra);
    const ora = parseInt(oraActuala);
    const minut = parseInt(minutActual)||0;
    if(oraActuala===''||isNaN(ora)){Alert.alert('Atentie','Introduceti ora actuala.');return;}
    if(isNaN(rata)||rata<=0){Alert.alert('Atentie','Introduceti anvelope pe ora.');return;}
    if(ora<0||ora>23||minut<0||minut>59){Alert.alert('Eroare','Ora invalida.');return;}
    const oreExtraAnvelope=(sAnvelope+extra)/rata;
    const oreTotal=sOre+oreExtraAnvelope;
    const totalAnvelope=sAnvelope+extra;
    const minuteStart=ora*60+minut;
    const minuteSchimbare=minuteStart+oreTotal*60;
    const oraSchimbare=Math.floor(minuteSchimbare/60)%24;
    const minutSchimbare=Math.floor(minuteSchimbare%60);
    setRezultat({sOre,sAnvelope:Math.round(sAnvelope),extra:Math.round(extra),totalAnvelope:Math.round(totalAnvelope),oreTotal,oraSchimbare:String(oraSchimbare).padStart(2,'0'),minutSchimbare:String(minutSchimbare).padStart(2,'0'),trecePesteMiezulNoptii:minuteSchimbare>=1440});
  };
  const reseteaza = () => { setStocOre('');setStocAnvelope('');setProductieExtra('');setAnvelopePerOra('');setOraActuala('');setMinutActual('');setRezultat(null); };
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
          <View style={s.card}>
            <Text style={s.cardTitle}>STOC CURENT</Text>
            <Text style={s.label}>Stoc in ore</Text>
            <TextInput style={s.input} placeholder="ex: 5" placeholderTextColor="#2a3f55" keyboardType="numeric" value={stocOre} onChangeText={v=>{setStocOre(v);setRezultat(null);}}/>
            <Text style={s.label}>Stoc in anvelope (buc)</Text>
            <TextInput style={s.input} placeholder="ex: 500" placeholderTextColor="#2a3f55" keyboardType="numeric" value={stocAnvelope} onChangeText={v=>{setStocAnvelope(v);setRezultat(null);}}/>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>PRODUCTIE SUPLIMENTARA</Text>
            <Text style={s.label}>Anvelope produse extra (buc)</Text>
            <TextInput style={s.input} placeholder="ex: 100" placeholderTextColor="#2a3f55" keyboardType="numeric" value={productieExtra} onChangeText={v=>{setProductieExtra(v);setRezultat(null);}}/>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>RATA PRODUCTIE</Text>
            <Text style={s.label}>Anvelope produse pe ora (buc/h)</Text>
            <TextInput style={s.input} placeholder="ex: 100" placeholderTextColor="#2a3f55" keyboardType="numeric" value={anvelopePerOra} onChangeText={v=>{setAnvelopePerOra(v);setRezultat(null);}}/>
          </View>
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
              <View style={s.statRow}><Text style={s.statLabel}>Stoc in ore</Text><Text style={s.statValue}>{formatDurata(rezultat.sOre)}</Text></View>
              <View style={s.statRow}><Text style={s.statLabel}>Stoc in anvelope</Text><Text style={s.statValue}>{rezultat.sAnvelope.toLocaleString()} buc</Text></View>
              {rezultat.extra>0&&<View style={s.statRow}><Text style={s.statLabel}>+ Productie extra</Text><Text style={s.statValue}>{rezultat.extra.toLocaleString()} buc</Text></View>}
              <View style={s.divider}/>
              <View style={s.statRow}><Text style={[s.statLabel,{color:'#ccc'}]}>Total anvelope</Text><Text style={[s.statValue,{color:'#e8a020'}]}>{rezultat.totalAnvelope.toLocaleString()} buc</Text></View>
              <View style={s.statRow}><Text style={[s.statLabel,{color:'#ccc'}]}>Durata totala stoc</Text><Text style={[s.statValue,{color:'#e8a020'}]}>{formatDurata(rezultat.oreTotal)}</Text></View>
              <View style={s.divider}/>
              <Text style={s.schimbareLabel}>Schimbare dimensiune la ora:</Text>
              <Text style={s.schimbareOra}>{rezultat.oraSchimbare}:{rezultat.minutSchimbare}</Text>
              {rezultat.trecePesteMiezulNoptii&&<View style={s.warningBox}><Text style={s.warningText}>Schimbarea va fi a doua zi</Text></View>}
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
  header:{marginBottom:30},
  headerEyebrow:{color:'#e8a020',fontSize:10,fontWeight:'800',letterSpacing:4,marginBottom:6},
  headerTitle:{color:'#ffffff',fontSize:30,fontWeight:'900',lineHeight:36},
  headerAccent:{width:44,height:4,backgroundColor:'#e8a020',borderRadius:2,marginTop:12},
  card:{backgroundColor:'#111b24',borderRadius:16,padding:20,marginBottom:14,borderWidth:1,borderColor:'#1a2d3f'},
  cardTitle:{color:'#e8a020',fontSize:10,fontWeight:'800',letterSpacing:3,marginBottom:14},
  label:{color:'#4d7a99',fontSize:11,fontWeight:'600',marginBottom:8,marginTop:10},
  input:{backgroundColor:'#0a0f14',borderWidth:1,borderColor:'#1a2d3f',borderRadius:12,color:'#ffffff',fontSize:20,fontWeight:'700',paddingHorizontal:16,paddingVertical:13},
  timeRow:{flexDirection:'row',alignItems:'flex-end',gap:8},
  timeInputWrapper:{flex:1},
  timeInput:{textAlign:'center'},
  timeSep:{color:'#ffffff',fontSize:26,fontWeight:'800',marginBottom:13},
  nowBtn:{backgroundColor:'#0a0f14',borderRadius:12,paddingHorizontal:14,paddingVertical:14,alignSelf:'flex-end',borderWidth:1,borderColor:'#e8a020'},
  nowBtnText:{color:'#e8a020',fontWeight:'800',fontSize:10,letterSpacing:2},
  calcBtn:{backgroundColor:'#e8a020',borderRadius:14,paddingVertical:18,alignItems:'center',marginBottom:16,elevation:10},
  calcBtnText:{color:'#0a0f14',fontSize:14,fontWeight:'900',letterSpacing:4},
  rezultatCard:{backgroundColor:'#111b24',borderRadius:16,padding:24,marginBottom:16,borderWidth:2,borderColor:'#e8a020'},
  rezultatTitle:{color:'#e8a020',fontSize:10,fontWeight:'800',letterSpacing:4,marginBottom:18},
  statRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:7},
  statLabel:{color:'#4d7a99',fontSize:13,fontWeight:'500'},
  statValue:{color:'#ffffff',fontSize:15,fontWeight:'700'},
  divider:{height:1,backgroundColor:'#1a2d3f',marginVertical:14},
  schimbareLabel:{color:'#7a9bb5',fontSize:12,fontWeight:'600',textAlign:'center',marginBottom:6,marginTop:4},
  schimbareOra:{color:'#e8a020',fontSize:64,fontWeight:'900',textAlign:'center',letterSpacing:6},
  warningBox:{backgroundColor:'#1f1508',borderRadius:10,padding:12,marginTop:14,borderWidth:1,borderColor:'#e8a020'},
  warningText:{color:'#e8a020',fontSize:13,fontWeight:'600',textAlign:'center'},
  resetBtn:{borderRadius:14,paddingVertical:15,alignItems:'center',borderWidth:1,borderColor:'#1a2d3f'},
  resetBtnText:{color:'#2a3f55',fontSize:12,fontWeight:'700',letterSpacing:3},
});
