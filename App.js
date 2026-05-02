import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const Y = '#FFD100';
const BG = '#0D0D0D';
const CARD = '#1A1A1A';
const BORDER = '#2A2A2A';
const MUTED = '#555555';
const WHITE = '#FFFFFF';

export default function App() {
  const [stocOre, setStocOre] = useState('');
  const [stocBuc, setStocBuc] = useState('');
  const [rataConf, setRataConf] = useState('');
  const [totalFabric, setTotalFabric] = useState('');
  const [ora, setOra] = useState('');
  const [min, setMin] = useState('');
  const [rez, setRez] = useState(null);

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

  const calc = () => {
    const vStocOre = parseFloat(stocOre);
    const vStocBuc = parseFloat(stocBuc);
    const vRataConf = parseFloat(rataConf);
    const vTotalFabric = parseFloat(totalFabric);
    const vOra = parseInt(ora);
    const vMin = parseInt(min) || 0;

    if (isNaN(vStocOre) || isNaN(vStocBuc)) {
      Alert.alert('Atentie', 'Introduceti stocul in ore si in bucati.');
      return;
    }
    if (vStocOre <= 0 || vStocBuc <= 0) {
      Alert.alert('Atentie', 'Stocul trebuie sa fie mai mare decat 0.');
      return;
    }
    if (isNaN(vRataConf) || vRataConf <= 0) {
      Alert.alert('Atentie', 'Introduceti rata de fabricatie.');
      return;
    }
    if (isNaN(vTotalFabric) || vTotalFabric <= 0) {
      Alert.alert('Atentie', 'Introduceti numarul de anvelope de fabricat.');
      return;
    }
    if (isNaN(vOra) || ora === '') {
      Alert.alert('Atentie', 'Introduceti ora actuala.');
      return;
    }
    if (vOra < 0 || vOra > 23 || vMin < 0 || vMin > 59) {
      Alert.alert('Eroare', 'Ora invalida.');
      return;
    }

    // Rata consum vulcanizare calculata automat
    const rataConsum = vStocBuc / vStocOre;

    // Timp productie confectie
    const timpConf = vTotalFabric / vRataConf;

    // Consum vulcanizare in timpul productiei
    const consumInTimpul = rataConsum * timpConf;

    // Stoc total = stoc initial + fabricate - consum vulcanizare
    const stocFinal = vStocBuc + vTotalFabric - consumInTimpul;
    const oreFinal = stocFinal / rataConsum;

    // Ora schimbarii
    const minStart = vOra * 60 + vMin;
    const minSch = minStart + timpConf * 60;
    const oraSch = Math.floor(minSch / 60) % 24;
    const minSchimb = Math.floor(minSch % 60);

    setRez({
      rataConsum,
      timpConf,
      consumInTimpul,
      stocFinal: Math.round(stocFinal),
      oreFinal,
      vTotalFabric: Math.round(vTotalFabric),
      oraSch: String(oraSch).padStart(2, '0'),
      minSchimb: String(minSchimb).padStart(2, '0'),
      ziuaUrm: minSch >= 1440,
    });
  };

  const reset = () => {
    setStocOre('');
    setStocBuc('');
    setRataConf('');
    setTotalFabric('');
    setOra('');
    setMin('');
    setRez(null);
  };

  const rataCalculata = (parseFloat(stocBuc) > 0 && parseFloat(stocOre) > 0)
    ? (parseFloat(stocBuc) / parseFloat(stocOre)).toFixed(1)
    : null;

  return (
    <View style={st.cont}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={st.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <View style={st.header}>
            <View style={st.headerTop}>
              <View style={st.badge}>
                <Text style={st.badgeTxt}>MICHELIN</Text>
              </View>
              <Text style={st.headerSub}>Planificare Productie</Text>
            </View>
            <Text style={st.headerTitle}>{'Schimbare\nDimensiune'}</Text>
            <View style={st.headerLine} />
          </View>

          {/* RUBRICA 1 - VULCANIZARE */}
          <View style={st.sectionLabel}>
            <View style={st.sectionDot} />
            <Text style={st.sectionTxt}>RUBRICA 1 — VULCANIZARE</Text>
          </View>

          <View style={st.card}>
            <View style={st.twoCol}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={st.lbl}>STOC INITIAL (ORE)</Text>
                <TextInput
                  style={st.inp}
                  placeholder="ex: 24"
                  placeholderTextColor={MUTED}
                  keyboardType="numeric"
                  value={stocOre}
                  onChangeText={v => { setStocOre(v); setRez(null); }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={st.lbl}>STOC INITIAL (BUC)</Text>
                <TextInput
                  style={st.inp}
                  placeholder="ex: 100"
                  placeholderTextColor={MUTED}
                  keyboardType="numeric"
                  value={stocBuc}
                  onChangeText={v => { setStocBuc(v); setRez(null); }}
                />
              </View>
            </View>
            {rataCalculata && (
              <View style={st.infoRow}>
                <Text style={st.infoTxt}>Rata consum vulcanizare:</Text>
                <Text style={st.infoVal}>{rataCalculata} buc/ora</Text>
              </View>
            )}
          </View>

          {/* RUBRICA 2 - CONFECTIE */}
          <View style={st.sectionLabel}>
            <View style={[st.sectionDot, { backgroundColor: WHITE }]} />
            <Text style={st.sectionTxt}>RUBRICA 2 — CONFECTIE</Text>
          </View>

          <View style={st.card}>
            <View style={st.twoCol}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={st.lbl}>RATA FABRICATIE (BUC/H)</Text>
                <TextInput
                  style={st.inp}
                  placeholder="ex: 25"
                  placeholderTextColor={MUTED}
                  keyboardType="numeric"
                  value={rataConf}
                  onChangeText={v => { setRataConf(v); setRez(null); }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={st.lbl}>TOTAL DE FABRICAT (BUC)</Text>
                <TextInput
                  style={st.inp}
                  placeholder="ex: 100"
                  placeholderTextColor={MUTED}
                  keyboardType="numeric"
                  value={totalFabric}
                  onChangeText={v => { setTotalFabric(v); setRez(null); }}
                />
              </View>
            </View>
          </View>

          {/* ORA ACTUALA */}
          <View style={st.card}>
            <View style={st.timeWrap}>
              <View style={{ flex: 1 }}>
                <Text style={st.lbl}>ORA CURENTA</Text>
                <View style={st.timeRow}>
                  <TextInput
                    style={[st.inp, st.timeInp]}
                    placeholder="HH"
                    placeholderTextColor={MUTED}
                    keyboardType="numeric"
                    maxLength={2}
                    value={ora}
                    onChangeText={v => { setOra(v); setRez(null); }}
                  />
                  <Text style={st.timeSep}>:</Text>
                  <TextInput
                    style={[st.inp, st.timeInp]}
                    placeholder="MM"
                    placeholderTextColor={MUTED}
                    keyboardType="numeric"
                    maxLength={2}
                    value={min}
                    onChangeText={v => { setMin(v); setRez(null); }}
                  />
                </View>
              </View>
              <TouchableOpacity style={st.acumBtn} onPress={acum}>
                <Text style={st.acumTxt}>{'ORA\nACUM'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={st.calcBtn} onPress={calc} activeOpacity={0.85}>
            <Text style={st.calcTxt}>CALCULEAZA</Text>
            <View style={st.calcArrow}>
              <Text style={st.calcArrowTxt}>{'>'}</Text>
            </View>
          </TouchableOpacity>

          {/* RUBRICA 3 - REZULTAT */}
          {rez !== null && (
            <View style={{ gap: 10, marginBottom: 12 }}>

              <View style={st.sectionLabel}>
                <View style={[st.sectionDot, { backgroundColor: Y }]} />
                <Text style={st.sectionTxt}>RUBRICA 3 — CALCUL STOC</Text>
              </View>

              <View style={st.rezCard}>
                <View style={st.rezRow}>
                  <View style={st.rezItem}>
                    <Text style={st.rezLbl}>STOC INITIAL</Text>
                    <Text style={st.rezVal}>{parseFloat(stocBuc)} buc</Text>
                    <Text style={st.rezSub}>{fmt(parseFloat(stocOre))}</Text>
                  </View>
                  <Text style={st.rezPlus}>+</Text>
                  <View style={st.rezItem}>
                    <Text style={st.rezLbl}>FABRICATE</Text>
                    <Text style={st.rezVal}>{rez.vTotalFabric} buc</Text>
                    <Text style={st.rezSub}>{fmt(rez.timpConf)}</Text>
                  </View>
                  <Text style={st.rezPlus}>-</Text>
                  <View style={st.rezItem}>
                    <Text style={st.rezLbl}>CONSUM VULC.</Text>
                    <Text style={st.rezVal}>{Math.round(rez.consumInTimpul)} buc</Text>
                    <Text style={st.rezSub}>{rez.rataConsum.toFixed(1)} buc/h</Text>
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
    </View>
  );
}

const st = StyleSheet.create({
  cont: { flex: 1, backgroundColor: BG },
  scroll: { padding: 16, paddingTop: Platform.OS === 'android' ? 44 : 64 },
  header: { marginBottom: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  badge: { backgroundColor: Y, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  badgeTxt: { color: BG, fontWeight: '900', fontSize: 10, letterSpacing: 2 },
  headerSub: { color: MUTED, fontSize: 12, fontWeight: '500' },
  headerTitle: { color: WHITE, fontSize: 36, fontWeight: '900', lineHeight: 40 },
  headerLine: { width: 60, height: 3, backgroundColor: Y, borderRadius: 2, marginTop: 14 },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 4 },
  sectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Y },
  sectionTxt: { color: MUTED, fontSize: 10, fontWeight: '800', letterSpacing: 3 },
  card: { backgroundColor: CARD, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: BORDER },
  twoCol: { flexDirection: 'row' },
  lbl: { color: MUTED, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  inp: { backgroundColor: BG, borderWidth: 1, borderColor: BORDER, borderRadius: 10, color: WHITE, fontSize: 18, fontWeight: '800', paddingHorizontal: 14, paddingVertical: 11 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, backgroundColor: BG, borderRadius: 8, padding: 10 },
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
  rezLbl: { color: MUTED, fontSize: 8, fontWeight: '700', letterSpacing: 1, marginBottom: 4, textAlign: 'center' },
  rezVal: { color: WHITE, fontSize: 12, fontWeight: '900', textAlign: 'center' },
  rezSub: { color: MUTED, fontSize: 9, marginTop: 2, textAlign: 'center' },
  rezPlus: { color: MUTED, fontSize: 16, fontWeight: '900', paddingHorizontal: 2 },
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
  resetTxt: { color: MUTED, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
});
