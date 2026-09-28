import { TransactionFiltersSheet } from '@/components/domain/TransactionFiltersSheet';
import { TransactionItem } from '@/components/domain/TransactionItem';
import { getTransactionSections } from '@/services/transaction.service';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';
import { IconAdjustmentsHorizontal, IconCalendar, IconCategory, IconPlayerPause, IconSearch, IconTag, IconX } from '@tabler/icons-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Keyboard, Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransacoesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dataRevision, setDataRevision] = useState(0);
  const closeFilters = () => setFiltersOpen(false);
  const openFilters = () => { Keyboard.dismiss(); setFiltersOpen(true); };

  useFocusEffect(
    useCallback(() => {
      setDataRevision((current) => current + 1);
    }, []),
  );

  const sections = useMemo(
    () => getTransactionSections(query),
    [dataRevision, query],
  );
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Transações</Text>
              <Pressable onPress={() => router.push('/categorias')} style={styles.categoriesButton}
                accessibilityRole="button" accessibilityLabel="Gerenciar categorias e subcategorias">
                <IconCategory size={18} color={colors.primary} />
                <Text style={styles.categoriesText}>Categorias</Text>
              </Pressable>
            </View>
            <View style={styles.search}>
              <IconSearch size={20} color={colors.navInactive} />
              <TextInput style={styles.input} value={query} onChangeText={setQuery}
                placeholder="Buscar transações" placeholderTextColor={colors.navInactive}
                accessibilityLabel="Buscar transações por descrição" autoCorrect={false} returnKeyType="search" />
              {query.length > 0 && <Pressable onPress={() => setQuery('')} style={styles.clear}
                accessibilityRole="button" accessibilityLabel="Limpar busca">
                <IconX size={18} color={colors.textSecondary} />
              </Pressable>}
            </View>
            <View style={styles.filters}>
              <Pressable onPress={() => router.push('/reflexao/index')} style={styles.chip} accessibilityRole="button" accessibilityLabel="Abrir itens em reflexão">
                <IconPlayerPause size={18} color={colors.primary} /><Text style={styles.chipText}>Em reflexão</Text>
              </Pressable>
              <Pressable onPress={openFilters} style={styles.chip} accessibilityRole="button" accessibilityLabel="Abrir filtros por data">
                <IconCalendar size={18} color={colors.primary} /><Text style={styles.chipText}>Data</Text>
              </Pressable>
              <Pressable onPress={openFilters} style={styles.chip} accessibilityRole="button" accessibilityLabel="Abrir filtros por categoria">
                <IconTag size={18} color={colors.primary} /><Text style={styles.chipText}>Categoria</Text>
              </Pressable>
              <Pressable onPress={openFilters} style={styles.chip} accessibilityRole="button" accessibilityLabel="Abrir todos os filtros">
                <IconAdjustmentsHorizontal size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title.toLocaleUpperCase('pt-BR')}</Text>}
        renderItem={({ item }) => <TransactionItem {...item} variant="list"
          onPress={() => router.push({ pathname: '/transacao/[id]', params: { id: item.id } })} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação encontrada.</Text>}
      />
      <TransactionFiltersSheet visible={filtersOpen} onCancel={closeFilters}
        onApply={closeFilters} onClear={closeFilters} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: 24 },
  header: { gap: spacing.lg },
  title: { fontFamily: fontFamily.bold, fontSize: fontSize.title, color: colors.textPrimary },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoriesButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center',
    gap: spacing.xs, paddingHorizontal: spacing.md },
  categoriesText: { fontFamily: fontFamily.bold, fontSize: fontSize.label, color: colors.primary },
  search: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.input, backgroundColor: colors.surface },
  input: { flex: 1, minHeight: 48, padding: spacing.md, fontFamily: fontFamily.regular, fontSize: fontSize.body, color: colors.textPrimary },
  clear: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  filters: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  chip: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, backgroundColor: colors.primaryTint, borderRadius: radius.pill },
  chipText: { fontFamily: fontFamily.medium, fontSize: fontSize.body, color: colors.primary },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm, fontFamily: fontFamily.medium, fontSize: fontSize.caption, color: colors.textSecondary },
  empty: { paddingVertical: spacing.lg, fontFamily: fontFamily.regular, fontSize: fontSize.body, color: colors.textSecondary },
});
