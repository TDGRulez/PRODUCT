import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';

const Y = '#F2C20A';
const BG = '#0D0D0D';
const CARD = '#1A1A1A';
const BORDER = '#2A2A2A';
const MUTED = '#888888';
const WHITE = '#FFFFFF';
const MATRITE_LIST = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
const LOGO_URI = 'data:image/png;base64,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';

export default function App() {
  const [pagina, setPagina] = useState('calculator');
  const [stocOre, setStocOre] = useState('');
  const [stocBuc, setStocBuc] = useState('');
  const [nrMatrite, setNrMatrite] = useState(0);
  const [consumMatrita, setConsumMatrita] = useState('');
  const [rataConf, setRataConf] = useState('');
  const [totalFabric, setTotalFabric] = useState('');
  const [ora, setOra] = useState('');
  const [min, setMin] = useState('');
  const [rez, setRez] = useState(null);
  const [istoric, setIstoric] = useState([]);

  const acum = () => {
    const d = new Date();
    setOra(String(d.getHours()).padStart(2, '0'));
    setMin(String(d.getMinutes()).padStart(2, '0'));
  };

  const fmt = (h) => {
    if (h < 0) h = 0;
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    if (mm === 0) return hh + 'h';
    return hh + 'h ' + mm + 'min';
  };

  const fmtData = () => {
    const d = new Date();
    return d.toLocaleDateString('ro-RO') + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  };

  const calc = () => {
    const vStocOre = parseFloat(stocOre);
    const vStocBuc = parseFloat(stocBuc);
    const vRataConf = parseFloat(rataConf);
    const vTotalFabric = parseFloat(totalFabric);
    const vConsumMatrita = parseFloat(consumMatrita) || 0;
    const vOra = parseInt(ora);
    const vMin = parseInt(min) || 0;

    if (isNaN(vStocOre) || isNaN(vStocBuc)) { Alert.alert('Atentie', 'Introduceti stocul in ore si in bucati.'); return; }
    if (vStocOre <= 0 || vStocBuc <= 0) { Alert.alert('Atentie', 'Stocul trebuie sa fie mai mare decat 0.'); return; }
    if (isNaN(vRataConf) || vRataConf <= 0) { Alert.alert('Atentie', 'Introduceti rata de fabricatie.'); return; }
    if (isNaN(vTotalFabric) || vTotalFabric <= 0) { Alert.alert('Atentie', 'Introduceti numarul de anvelope de fabricat.'); return; }
    if (isNaN(vOra) || ora === '') { Alert.alert('Atentie', 'Introduceti ora actuala.'); return; }
    if (vOra < 0 || vOra > 23 || vMin < 0 || vMin > 59) { Alert.alert('Eroare', 'Ora invalida.'); return; }

    const consumMatriteTotal = nrMatrite * vConsumMatrita;
    const consumTotal = consumMatriteTotal;
    const timpConf = vTotalFabric / vRataConf;
    const consumInTimpul = consumTotal * timpConf;
    const stocFinal = vStocBuc + vTotalFabric - consumInTimpul;
    const oreFinal = stocFinal / consumTotal;
    const minStart = vOra * 60 + vMin;
    const minSch = minStart + timpConf * 60;
    const oraSch = Math.floor(minSch / 60) % 24;
    const minSchimb = Math.floor(minSch % 60);

    const rezultat = {
      id: Date.now(),
      data: fmtData(),
      stocBuc: Math.round(vStocBuc),
      stocOre: vStocOre,
      nrMatrite,
      consumMatrita: vConsumMatrita,
      consumMatriteTotal,
      consumTotal,
      totalFabric: Math.round(vTotalFabric),
      timpConf,
      consumInTimpul,
      stocFinal: Math.round(stocFinal),
      oreFinal,
      oraSch: String(oraSch).padStart(2, '0'),
      minSchimb: String(minSchimb).padStart(2, '0'),
      ziuaUrm: minSch >= 1440,
    };

    setRez(rezultat);
    setIstoric(prev => [rezultat, ...prev]);
  };

  const reset = () => {
    setStocOre(''); setStocBuc(''); setNrMatrite(0);
    setConsumMatrita(''); setRataConf('');
    setTotalFabric(''); setOra(''); setMin(''); setRez(null);
  };

  const stergeIstoric = () => {
    Alert.alert('Confirmare', 'Stergi tot istoricul?', [
      { text: 'Anuleaza', style: 'cancel' },
      { text: 'Sterge', style: 'destructive', onPress: () => setIstoric([]) }
    ]);
  };

  const stergeInregistrare = (id) => {
    setIstoric(prev => prev.filter(i => i.id !== id));
  };

  const consumMatriteCalc = nrMatrite * (parseFloat(consumMatrita) || 0);
  const consumTotalCalc = consumMatriteCalc;

  return (
    <View style={st.cont}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <View style={st.tabBar}>
        <TouchableOpacity style={[st.tab, pagina === 'calculator' && st.tabActive]} onPress={() => setPagina('calculator')}>
          <Text style={[st.tabTxt, pagina === 'calculator' && st.tabTxtActive]}>CALCULATOR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[st.tab, pagina === 'istoric' && st.tabActive]} onPress={() => setPagina('istoric')}>
          <Text style={[st.tabTxt, pagina === 'istoric' && st.tabTxtActive]}>
            {'ISTORIC' + (istoric.length > 0 ? ' (' + istoric.length + ')' : '')}
          </Text>
        </TouchableOpacity>
      </View>

      {pagina === 'calculator' && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={st.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            <View style={st.header}>
              <Image source={{ uri: LOGO_URI }} style={st.logo} resizeMode="contain" />
              <View style={st.headerLine} />
            </View>

            <View style={st.sectionLabel}>
              <View style={st.sectionDot} />
              <Text style={st.sectionTxt}>RUBRICA 1 — VULCANIZARE</Text>
            </View>
            <View style={st.card}>
              <Text style={st.hint}>Acelasi stoc exprimat in 2 unitati</Text>
              <View style={st.twoCol}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={st.lbl}>STOC (ORE)</Text>
                  <TextInput style={st.inp} placeholder="ex: 24" placeholderTextColor={MUTED} keyboardType="numeric" value={stocOre} onChangeText={v => { setStocOre(v); setRez(null); }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.lbl}>STOC (BUC)</Text>
                  <TextInput style={st.inp} placeholder="ex: 100" placeholderTextColor={MUTED} keyboardType="numeric" value={stocBuc} onChangeText={v => { setStocBuc(v); setRez(null); }} />
                </View>
              </View>

              <View style={st.divider} />

              <Text style={st.lbl}>NR. MATRITE ACTIVE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                <TouchableOpacity style={[st.mBtn, nrMatrite === 0 && st.mBtnA]} onPress={() => { setNrMatrite(0); setRez(null); }}>
                  <Text style={[st.mTxt, nrMatrite === 0 && st.mTxtA]}>0</Text>
                </TouchableOpacity>
                {MATRITE_LIST.map(n => (
                  <TouchableOpacity key={n} style={[st.mBtn, nrMatrite === n && st.mBtnA]} onPress={() => { setNrMatrite(n); setRez(null); }}>
                    <Text style={[st.mTxt, nrMatrite === n && st.mTxtA]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {nrMatrite > 0 && (
                <>
                  <Text style={[st.lbl, { marginTop: 14 }]}>CONSUM PER MATRITA (BUC/ORA)</Text>
                  <TextInput style={st.inp} placeholder="ex: 4.17" placeholderTextColor={MUTED} keyboardType="numeric" value={consumMatrita} onChangeText={v => { setConsumMatrita(v); setRez(null); }} />
                </>
              )}

              {consumTotalCalc > 0 && (
                <View style={st.infoBox}>
                  <View style={st.infoRow}>
                    <Text style={st.infoTxt}>{nrMatrite} matrite × {parseFloat(consumMatrita)||0} buc/h:</Text>
                    <Text style={st.infoVal}>{consumTotalCalc.toFixed(2)} buc/ora</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={st.sectionLabel}>
              <View style={[st.sectionDot, { backgroundColor: WHITE }]} />
              <Text style={st.sectionTxt}>RUBRICA 2 — CONFECTIE</Text>
            </View>
            <View style={st.card}>
              <View style={st.twoCol}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={st.lbl}>RATA FABRICATIE (BUC/H)</Text>
                  <TextInput style={st.inp} placeholder="ex: 25" placeholderTextColor={MUTED} keyboardType="numeric" value={rataConf} onChangeText={v => { setRataConf(v); setRez(null); }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.lbl}>TOTAL DE FABRICAT (BUC)</Text>
                  <TextInput style={st.inp} placeholder="ex: 100" placeholderTextColor={MUTED} keyboardType="numeric" value={totalFabric} onChangeText={v => { setTotalFabric(v); setRez(null); }} />
                </View>
              </View>
            </View>

            <View style={st.card}>
              <View style={st.timeWrap}>
                <View style={{ flex: 1 }}>
                  <Text style={st.lbl}>ORA CURENTA</Text>
                  <View style={st.timeRow}>
                    <TextInput style={[st.inp, st.timeInp]} placeholder="HH" placeholderTextColor={MUTED} keyboardType="numeric" maxLength={2} value={ora} onChangeText={v => { setOra(v); setRez(null); }} />
                    <Text style={st.timeSep}>:</Text>
                    <TextInput style={[st.inp, st.timeInp]} placeholder="MM" placeholderTextColor={MUTED} keyboardType="numeric" maxLength={2} value={min} onChangeText={v => { setMin(v); setRez(null); }} />
                  </View>
                </View>
                <TouchableOpacity style={st.acumBtn} onPress={acum}>
                  <Text style={st.acumTxt}>{'ORA\nACUM'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={st.calcBtn} onPress={calc} activeOpacity={0.85}>
              <Text style={st.calcTxt}>CALCULEAZA</Text>
              <View style={st.calcArrow}><Text style={st.calcArrowTxt}>{'>'}</Text></View>
            </TouchableOpacity>

            {rez !== null && (
              <View style={{ gap: 10, marginBottom: 12 }}>
                <View style={st.sectionLabel}>
                  <View style={st.sectionDot} />
                  <Text style={st.sectionTxt}>RUBRICA 3 — CALCUL STOC</Text>
                </View>

                <View style={st.rezCard}>
                  <View style={st.rezRow}>
                    <View style={st.rezItem}>
                      <Text style={st.rezLbl}>STOC INITIAL</Text>
                      <Text style={st.rezVal}>{rez.stocBuc} buc</Text>
                      <Text style={st.rezSub}>{fmt(rez.stocOre)}</Text>
                    </View>
                    <Text style={st.rezPlus}>+</Text>
                    <View style={st.rezItem}>
                      <Text style={st.rezLbl}>FABRICATE</Text>
                      <Text style={st.rezVal}>{rez.totalFabric} buc</Text>
                      <Text style={st.rezSub}>{fmt(rez.timpConf)}</Text>
                    </View>
                    <Text style={st.rezPlus}>-</Text>
                    <View style={st.rezItem}>
                      <Text style={st.rezLbl}>CONSUM</Text>
                      <Text style={st.rezVal}>{Math.round(rez.consumInTimpul)} buc</Text>
                      <Text style={st.rezSub}>{rez.consumTotal.toFixed(1)}/h</Text>
                    </View>
                  </View>
                  <View style={st.totalBox}>
                    <View style={{ flex: 1 }}>
                      <Text style={st.totalLbl}>STOC FINAL</Text>
                      <Text style={st.totalVal}>{rez.stocFinal} buc</Text>
                    </View>
                    <View style={st.totalDivider} />
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text style={st.totalLbl}>DURATA STOC</Text>
                      <Text style={st.totalVal}>{fmt(rez.oreFinal)}</Text>
                    </View>
                  </View>
                </View>

                <View style={st.schCard}>
                  <Text style={st.schLabel}>SCHIMBARE MASINA CONFECTIE</Text>
                  <Text style={st.schOra}>{rez.oraSch}:{rez.minSchimb}</Text>
                  <Text style={st.schSub}>Timp fabricatie: {fmt(rez.timpConf)}</Text>
                  {rez.ziuaUrm && (
                    <View style={st.warn}>
                      <Text style={st.warnTxt}>Schimbarea va fi a doua zi</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <TouchableOpacity style={st.resetBtn} onPress={reset}>
              <Text style={st.resetTxt}>RESETEAZA</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {pagina === 'istoric' && (
        <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
          <View style={st.istoricHeader}>
            <Text style={st.istoricTitlu}>ISTORIC CALCULE</Text>
            {istoric.length > 0 && (
              <TouchableOpacity onPress={stergeIstoric} style={st.stergeAllBtn}>
                <Text style={st.stergeAllTxt}>STERGE TOT</Text>
              </TouchableOpacity>
            )}
          </View>

          {istoric.length === 0 && (
            <View style={st.goale}>
              <Text style={st.goaleTxt}>Niciun calcul salvat.</Text>
              <Text style={st.goaleSub}>Calculele apar automat dupa CALCULEAZA.</Text>
            </View>
          )}

          {istoric.map((item, index) => (
            <View key={item.id} style={st.istoricCard}>
              <View style={st.istoricCardHeader}>
                <View>
                  <Text style={st.istoricNr}>#{istoric.length - index}</Text>
                  <Text style={st.istoricData}>{item.data}</Text>
                </View>
                <TouchableOpacity onPress={() => stergeInregistrare(item.id)} style={st.stergeBtn}>
                  <Text style={st.stergeTxt}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={st.istoricRow}>
                <View style={st.istoricItem}>
                  <Text style={st.istoricLbl}>STOC INITIAL</Text>
                  <Text style={st.istoricVal}>{item.stocBuc} buc</Text>
                  <Text style={st.istoricSub}>{fmt(item.stocOre)}</Text>
                </View>
                {item.nrMatrite > 0 && (
                  <View style={st.istoricItem}>
                    <Text style={st.istoricLbl}>MATRITE</Text>
                    <Text style={st.istoricVal}>{item.nrMatrite}</Text>
                    <Text style={st.istoricSub}>{item.consumMatrita} buc/h</Text>
                  </View>
                )}
                <View style={st.istoricItem}>
                  <Text style={st.istoricLbl}>FABRICATE</Text>
                  <Text style={st.istoricVal}>{item.totalFabric} buc</Text>
                  <Text style={st.istoricSub}>{fmt(item.timpConf)}</Text>
                </View>
              </View>

              <View style={st.istoricRezBox}>
                <View style={{ flex: 1 }}>
                  <Text style={st.istoricRezLbl}>STOC FINAL</Text>
                  <Text style={st.istoricRezVal}>{item.stocFinal} buc = {fmt(item.oreFinal)}</Text>
                </View>
                <View style={st.istoricOraSch}>
                  <Text style={st.istoricRezLbl}>SCHIMBARE</Text>
                  <Text style={st.istoricOraVal}>{item.oraSch}:{item.minSchimb}</Text>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  cont: { flex: 1, backgroundColor: BG },
  tabBar: { flexDirection: 'row', backgroundColor: CARD, borderBottomWidth: 1, borderBottomColor: BORDER, paddingTop: Platform.OS === 'android' ? 36 : 54 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Y },
  tabTxt: { color: MUTED, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  tabTxtActive: { color: Y },
  scroll: { padding: 16, paddingTop: 20 },
  header: { marginBottom: 24, alignItems: 'center' },
  logo: { width: 240, height: 70 },
  headerLine: { width: '100%', height: 2, backgroundColor: Y, borderRadius: 2, marginTop: 12 },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 4 },
  sectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Y },
  sectionTxt: { color: Y, fontSize: 10, fontWeight: '800', letterSpacing: 3 },
  card: { backgroundColor: CARD, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: BORDER },
  hint: { color: MUTED, fontSize: 10, fontStyle: 'italic', marginBottom: 10 },
  twoCol: { flexDirection: 'row' },
  lbl: { color: Y, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  inp: { backgroundColor: BG, borderWidth: 1, borderColor: BORDER, borderRadius: 10, color: WHITE, fontSize: 18, fontWeight: '800', paddingHorizontal: 14, paddingVertical: 11 },
  divider: { height: 1, backgroundColor: BORDER, marginVertical: 14 },
  mBtn: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: BG, borderWidth: 1, borderColor: BORDER, marginRight: 6 },
  mBtnA: { backgroundColor: Y, borderColor: Y },
  mTxt: { color: MUTED, fontWeight: '800', fontSize: 14 },
  mTxtA: { color: BG },
  infoBox: { backgroundColor: BG, borderRadius: 10, padding: 12, marginTop: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  infoRowTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, borderTopWidth: 1, borderTopColor: BORDER, marginTop: 6, paddingTop: 8 },
  infoTxt: { color: MUTED, fontSize: 11 },
  infoVal: { color: Y, fontSize: 13, fontWeight: '800' },
  timeWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeInp: { flex: 1, textAlign: 'center', fontSize: 22 },
  timeSep: { color: WHITE, fontSize: 22, fontWeight: '900' },
  acumBtn: { backgroundColor: Y, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  acumTxt: { color: BG, fontSize: 9, fontWeight: '900', letterSpacing: 2, textAlign: 'center', lineHeight: 16 },
  calcBtn: { backgroundColor: Y, borderRadius: 14, paddingVertical: 18, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 4 },
  calcTxt: { color: BG, fontSize: 16, fontWeight: '900', letterSpacing: 3 },
  calcArrow: { backgroundColor: BG, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  calcArrowTxt: { color: Y, fontSize: 20, fontWeight: '900' },
  rezCard: { backgroundColor: CARD, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: BORDER },
  rezRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  rezItem: { flex: 1, backgroundColor: BG, borderRadius: 10, padding: 8, alignItems: 'center' },
  rezLbl: { color: Y, fontSize: 8, fontWeight: '700', letterSpacing: 1, marginBottom: 4, textAlign: 'center' },
  rezVal: { color: WHITE, fontSize: 12, fontWeight: '900', textAlign: 'center' },
  rezSub: { color: Y, fontSize: 9, marginTop: 2, textAlign: 'center' },
  rezPlus: { color: Y, fontSize: 16, fontWeight: '900', paddingHorizontal: 2 },
  totalBox: { backgroundColor: Y, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' },
  totalLbl: { color: BG, fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  totalVal: { color: BG, fontSize: 20, fontWeight: '900' },
  totalDivider: { width: 1, height: 40, backgroundColor: BG, opacity: 0.2, marginHorizontal: 16 },
  schCard: { backgroundColor: Y, borderRadius: 14, padding: 20, alignItems: 'center' },
  schLabel: { color: BG, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 8 },
  schOra: { color: BG, fontSize: 72, fontWeight: '900', letterSpacing: 4, lineHeight: 76 },
  schSub: { color: BG, fontSize: 12, fontWeight: '600', opacity: 0.7, marginTop: 6 },
  warn: { backgroundColor: BG, borderRadius: 8, padding: 10, marginTop: 12 },
  warnTxt: { color: Y, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  resetBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: BORDER },
  resetTxt: { color: Y, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  istoricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  istoricTitlu: { color: Y, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  stergeAllBtn: { backgroundColor: CARD, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: BORDER },
  stergeAllTxt: { color: MUTED, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  goale: { alignItems: 'center', paddingTop: 60 },
  goaleTxt: { color: MUTED, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  goaleSub: { color: BORDER, fontSize: 12, textAlign: 'center' },
  istoricCard: { backgroundColor: CARD, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: BORDER },
  istoricCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  istoricNr: { color: Y, fontSize: 14, fontWeight: '900' },
  istoricData: { color: MUTED, fontSize: 11, marginTop: 2 },
  stergeBtn: { backgroundColor: BG, borderRadius: 8, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  stergeTxt: { color: MUTED, fontSize: 14, fontWeight: '900' },
  istoricRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  istoricItem: { flex: 1, backgroundColor: BG, borderRadius: 10, padding: 10, alignItems: 'center' },
  istoricLbl: { color: MUTED, fontSize: 8, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  istoricVal: { color: WHITE, fontSize: 13, fontWeight: '900' },
  istoricSub: { color: Y, fontSize: 9, marginTop: 2 },
  istoricRezBox: { backgroundColor: Y, borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center' },
  istoricRezLbl: { color: BG, fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  istoricRezVal: { color: BG, fontSize: 13, fontWeight: '800' },
  istoricOraSch: { alignItems: 'flex-end' },
  istoricOraVal: { color: BG, fontSize: 28, fontWeight: '900', letterSpacing: 2 },
});
