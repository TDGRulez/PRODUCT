import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, Platform, KeyboardAvoidingView, Alert
} from 'react-native';

export default function App() {
  const [modStoc, setModStoc] = useState('bucati'); // 'bucati' sau 'ore'
  const [stocBucati, setStocBucati] = useState('');
  const [stocOre, setStocOre] = useState('');
  const [productieExtra, setProductieExtra] = useState('');
  const [produsePerOra, setProdusePerOra] = useState('');
  const [oraActuala, setOraActuala] = useState('');
  const [minutActual, setMinutActual] = useState('');
  const [rezultat, setRezultat] = useState(null);

  const folosteOraAcum = () => {
    const acum = new Date();
    setOraActuala(String(acum.getHours()).padStart(2, '0'));
    setMinutActual(String(acum.getMinutes()).padStart(2, '0'));
  };

  const formatDurata = (ore) => {
    const h = Math.floor(ore);
    const m = Math.round((ore - h) * 60);
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  };

  const calculeaza = () => {
    const extra = parseFloat(productieExtra) || 0;
    const rataPerOra = parseFloat(produsePerOra);
    const ora = parseInt(oraActuala);
    const minut = parseInt(minutActual) || 0;

    if (oraActuala === '' || isNaN(ora)) {
      Alert.alert('Atenție', 'Te rog introduceți ora actuală.');
      return;
    }
    if (isNaN(rataPerOra) || rataPerOra <= 0) {
      Alert.alert('Atenție', 'Te rog introduceți rata de consum (buc/oră).');
      return;
    }
    if (ora < 0 || ora > 23 || minut < 0 || minut > 59) {
      Alert.alert('Eroare', 'Ora sau minutul nu sunt valide.');
      return;
    }

    let oreStocInitial = 0;
    let bucatiInitiale = 0;

    if (modStoc === 'bucati') {
      bucatiInitiale = parseFloat(stocBucati);
      if (isNaN(bucatiInitiale) || bucatiInitiale < 0) {
        Alert.alert('Atenție', 'Te rog introduceți stocul inițial în bucăți.');
        return;
      }
      oreStocInitial = bucatiInitiale / rataPerOra;
    } else {
      oreStocInitial = parseFloat(stocOre);
      if (isNaN(oreStocInitial) || oreStocInitial < 0) {
        Alert.alert('Atenție', 'Te rog introduceți stocul inițial în ore.');
        return;
      }
      bucatiInitiale = oreStocInitial * rataPerOra;
    }

    const totalBucati = bucatiInitiale + extra;
    const oreTotal = totalBucati / rataPerOra;
    const oreExtra = extra / rataPerOra;

    const minuteStart = ora * 60 + minut;
    const minuteSchimbare = minuteStart + oreTotal * 60;
    const oraSchimbare = Math.floor(minuteSchimbare / 60) % 24;
    const minutSchimbare = Math.floor(minuteSchimbare % 60);

    setRezultat({
      bucatiInitiale: Math.round(bucatiInitiale),
      extra: Math.round(extra),
      totalBucati: Math.round(totalBucati),
      oreStocInitial,
      oreExtra,
      oreTotal,
      oraSchimbare: String(oraSchimbare).padStart(2, '0'),
      minutSchimbare: String(minutSchimbare).padStart(2, '0'),
      trecePesteMiezulNoptii: minuteSchimbare >= 1440,
    });
  };

  const reseteaza = () => {
    setStocBucati('');
    setStocOre('');
    setProductieExtra('');
    setProdusePerOra('');
    setOraActuala('');
    setMinutActual('');
    setRezultat(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f14" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerEyebrow}>PLANIFICARE PRODUCȚIE</Text>
            <Text style={styles.headerTitle}>Schimbare{'\n'}Produs</Text>
            <View style={styles.headerAccent} />
          </View>

          {/* STOC INITIAL */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>① STOC INIȚIAL</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, modStoc === 'bucati' && styles.toggleBtnActive]}
                onPress={() => { setModStoc('bucati'); setRezultat(null); }}
              >
                <Text style={[styles.toggleText, modStoc === 'bucati' && styles.toggleTextActive]}>Bucăți</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, modStoc === 'ore' && styles.toggleBtnActive]}
                onPress={() => { setModStoc('ore'); setRezultat(null); }}
              >
                <Text style={[styles.toggleText, modStoc === 'ore' && styles.toggleTextActive]}>Ore</Text>
              </TouchableOpacity>
            </View>

            {modStoc === 'bucati' ? (
              <>
                <Text style={styles.label}>Stoc inițial (buc)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ex: 500"
                  placeholderTextColor="#2a3f55"
                  keyboardType="numeric"
                  value={stocBucati}
                  onChangeText={v => { setStocBucati(v); setRezultat(null); }}
                />
              </>
            ) : (
              <>
                <Text style={styles.label}>Stoc inițial (ore)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ex: 5"
                  placeholderTextColor="#2a3f55"
                  keyboardType="numeric"
                  value={stocOre}
                  onChangeText={v => { setStocOre(v); setRezultat(null); }}
                />
              </>
            )}
          </View>

          {/* PRODUCTIE EXTRA */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>② PRODUCȚIE SUPLIMENTARĂ</Text>
            <Text style={styles.label}>Bucăți fabricate extra (opțional)</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: 100"
              placeholderTextColor="#2a3f55"
              keyboardType="numeric"
              value={productieExtra}
              onChangeText={v => { setProductieExtra(v); setRezultat(null); }}
            />
          </View>

          {/* RATA CONSUM */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>③ RATĂ CONSUM</Text>
            <Text style={styles.label}>Produse consumate pe oră (buc/h)</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: 100"
              placeholderTextColor="#2a3f55"
              keyboardType="numeric"
              value={produsePerOra}
              onChangeText={v => { setProdusePerOra(v); setRezultat(null); }}
            />
          </View>

          {/* ORA ACTUALA */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>④ ORA ACTUALĂ</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeInputWrapper}>
                <Text style={styles.label}>Ore</Text>
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  placeholder="HH"
                  placeholderTextColor="#2a3f55"
                  keyboardType="numeric"
                  maxLength={2}
                  value={oraActuala}
                  onChangeText={v => { setOraActuala(v); setRezultat(null); }}
                />
              </View>
              <Text style={styles.timeSep}>:</Text>
              <View style={styles.timeInputWrapper}>
                <Text style={styles.label}>Minute</Text>
                <TextInput
                  style={[styles.input, styles.timeInput]}
                  placeholder="MM"
                  placeholderTextColor="#2a3f55"
                  keyboardType="numeric"
                  maxLength={2}
                  value={minutActual}
                  onChangeText={v => { setMinutActual(v); setRezultat(null); }}
                />
              </View>
              <TouchableOpacity style={styles.nowBtn} onPress={folosteOraAcum}>
                <Text style={styles.nowBtnText}>ACUM</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BUTON CALCUL */}
          <TouchableOpacity style={styles.calcBtn} onPress={calculeaza}>
            <Text style={styles.calcBtnText}>CALCULEAZĂ</Text>
          </TouchableOpacity>

          {/* REZULTAT */}
          {rezultat && (
            <View style={styles.rezultatCard}>
              <Text style={styles.rezultatTitle}>REZULTAT</Text>

              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Stoc inițial</Text>
                <Text style={styles.statValue}>
                  {rezultat.bucatiInitiale.toLocaleString()} buc{' '}
                  <Text style={styles.statSub}>({formatDurata(rezultat.oreStocInitial)})</Text>
                </Text>
              </View>

              {rezultat.extra > 0 && (
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>+ Producție extra</Text>
                  <Text style={styles.statValue}>
                    {rezultat.extra.toLocaleString()} buc{' '}
                    <Text style={styles.statSub}>(+{formatDurata(rezultat.oreExtra)})</Text>
                  </Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: '#ccc' }]}>Total stoc</Text>
                <Text style={[styles.statValue, { color: '#e8a020' }]}>
                  {rezultat.totalBucati.toLocaleString()} buc
                </Text>
              </View>

              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: '#ccc' }]}>Durată totală stoc</Text>
                <Text style={[styles.statValue, { color: '#e8a020' }]}>
                  {formatDurata(rezultat.oreTotal)}
                </Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.schimbareLabel}>Schimbare de produs la ora:</Text>
              <Text style={styles.schimbareOra}>
                {rezultat.oraSchimbare}:{rezultat.minutSchimbare}
              </Text>

              {rezultat.trecePesteMiezulNoptii && (
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>⚠️ Schimbarea va fi a doua zi</Text>
                </View>
              )}
            </View>
          )}

          {/* RESET */}
          <TouchableOpacity style={styles.resetBtn} onPress={reseteaza}>
            <Text style={styles.resetBtnText}>RESETEAZĂ</Text>
          </TouchableOpacity>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f14' },
  scroll: { padding: 20, paddingTop: Platform.OS === 'android' ? 44 : 64 },

  header: { marginBottom: 30 },
  headerEyebrow: { color: '#e8a020', fontSize: 10, fontWeight: '800', letterSpacing: 4, marginBottom: 6 },
  headerTitle: { color: '#ffffff', fontSize: 34, fontWeight: '900', lineHeight: 40 },
  headerAccent: { width: 44, height: 4, backgroundColor: '#e8a020', borderRadius: 2, marginTop: 12 },

  card: {
    backgroundColor: '#111b24', borderRadius: 16, padding: 20,
    marginBottom: 14, borderWidth: 1, borderColor: '#1a2d3f',
  },
  cardTitle: { color: '#e8a020', fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 14 },

  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  toggleBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
    backgroundColor: '#0a0f14', borderWidth: 1, borderColor: '#1a2d3f',
  },
  toggleBtnActive: { backgroundColor: '#e8a020', borderColor: '#e8a020' },
  toggleText: { color: '#3d5a73', fontWeight: '700', fontSize: 13 },
  toggleTextActive: { color: '#0a0f14' },

  label: { color: '#4d7a99', fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginBottom: 8, marginTop: 10 },
  input: {
    backgroundColor: '#0a0f14', borderWidth: 1, borderColor: '#1a2d3f',
    borderRadius: 12, color: '#ffffff', fontSize: 20,
    fontWeight: '700', paddingHorizontal: 16, paddingVertical: 13,
  },

  timeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  timeInputWrapper: { flex: 1 },
  timeInput: { textAlign: 'center' },
  timeSep: { color: '#ffffff', fontSize: 26, fontWeight: '800', marginBottom: 13, paddingHorizontal: 2 },
  nowBtn: {
    backgroundColor: '#0a0f14', borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 14, alignSelf: 'flex-end', borderWidth: 1, borderColor: '#e8a020',
  },
  nowBtnText: { color: '#e8a020', fontWeight: '800', fontSize: 10, letterSpacing: 2 },

  calcBtn: {
    backgroundColor: '#e8a020', borderRadius: 14, paddingVertical: 18,
    alignItems: 'center', marginBottom: 16,
    shadowColor: '#e8a020', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 10,
  },
  calcBtnText: { color: '#0a0f14', fontSize: 14, fontWeight: '900', letterSpacing: 4 },

  rezultatCard: {
    backgroundColor: '#111b24', borderRadius: 16, padding: 24,
    marginBottom: 16, borderWidth: 2, borderColor: '#e8a020',
  },
  rezultatTitle: { color: '#e8a020', fontSize: 10, fontWeight: '800', letterSpacing: 4, marginBottom: 18 },

  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 },
  statLabel: { color: '#4d7a99', fontSize: 13, fontWeight: '500' },
  statValue: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  statSub: { color: '#4d7a99', fontSize: 12, fontWeight: '400' },
  divider: { height: 1, backgroundColor: '#1a2d3f', marginVertical: 14 },

  schimbareLabel: { color: '#7a9bb5', fontSize: 12, fontWeight: '600', letterSpacing: 1, textAlign: 'center', marginBottom: 6, marginTop: 4 },
  schimbareOra: { color: '#e8a020', fontSize: 64, fontWeight: '900', textAlign: 'center', letterSpacing: 6 },

  warningBox: { backgroundColor: '#1f1508', borderRadius: 10, padding: 12, marginTop: 14, borderWidth: 1, borderColor: '#e8a020' },
  warningText: { color: '#e8a020', fontSize: 13, fontWeight: '600', textAlign: 'center' },

  resetBtn: { borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: '#1a2d3f' },
  resetBtnText: { color: '#2a3f55', fontSize: 12, fontWeight: '700', letterSpacing: 3 },
});
