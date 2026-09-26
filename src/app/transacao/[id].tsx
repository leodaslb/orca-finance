import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconArrowLeft, IconCalendar, IconClock, IconCreditCard, IconHash, IconNotes, IconPencil, IconPhoto, IconShoppingCart, IconStar, IconBuildingStore, IconTag, IconWallet } from '@tabler/icons-react-native';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppCard } from '@/components/common/AppCard';
import { TransactionDetailRow } from '@/components/domain/TransactionDetailRow';
import { getTransactionById } from '@/services/transaction.service';
import type { Essentiality, PaymentMethod } from '@/types/transaction';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';
import { formatCurrency } from '@/utils/currency';
import { formatTransactionDate } from '@/utils/date';

const paymentLabels: Record<PaymentMethod, string> = {
  cash: 'Dinheiro', debit_card: 'Cartão de débito', credit_card: 'Cartão de crédito',
  pix: 'Pix', bank_transfer: 'Transferência bancária', other: 'Outro',
};
const essentialityLabels: Record<Essentiality, string> = {
  essential: 'Essencial', non_essential: 'Não essencial', unclassified: 'Não classificada',
};
const iconProps = { size: 20, color: colors.textSecondary, strokeWidth: 1.8 };

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const router = useRouter();
  const transaction = typeof id === 'string' ? getTransactionById(id) : undefined;
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/(tabs)/transacoes');
  const isExpense = transaction?.type === 'expense';
  const amountStyle = isExpense ? styles.expense : styles.income;
  const receiptUri = transaction?.receiptUri;
  // O dataset contém apenas uma URI mock, sem arquivo. Abertura externa é provisória.
  const canOpenReceipt = !!receiptUri && /^https?:\/\//i.test(receiptUri);
  const openReceipt = async () => {
    if (!receiptUri || !canOpenReceipt) return;
    try { await Linking.openURL(receiptUri); }
    catch { Alert.alert('Comprovante indisponível', 'Não foi possível abrir o comprovante.'); }
  };

  const rows = transaction ? [
    { label: 'Categoria', value: transaction.categoryName, icon: <IconTag {...iconProps} /> },
    ...(transaction.subcategoryName ? [{ label: 'Subcategoria', value: transaction.subcategoryName, icon: <IconBuildingStore {...iconProps} /> }] : []),
    { label: 'Data', value: formatTransactionDate(transaction.date), icon: <IconCalendar {...iconProps} /> },
    { label: 'Hora', value: transaction.time, icon: <IconClock {...iconProps} /> },
    ...(transaction.paymentMethod ? [{ label: 'Método de pagamento', value: paymentLabels[transaction.paymentMethod], icon: <IconCreditCard {...iconProps} /> }] : []),
    ...(transaction.tags.length ? [{ label: 'Tags', value: transaction.tags.map((tag) => tag.startsWith('#') ? tag : `#${tag}`).join(' '), icon: <IconHash {...iconProps} /> }] : []),
    ...(transaction.essentiality ? [{ label: 'Essencialidade', value: essentialityLabels[transaction.essentiality], icon: <IconStar {...iconProps} /> }] : []),
    ...(transaction.notes ? [{ label: 'Anotações', value: transaction.notes, icon: <IconNotes {...iconProps} /> }] : []),
  ] : [];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Voltar">
          <IconArrowLeft {...iconProps} />
        </Pressable>
        <Text style={styles.title}>Detalhes da transação</Text>
        {transaction && <Pressable disabled style={styles.iconButton} accessibilityRole="button"
          accessibilityLabel="Editar transação indisponível" accessibilityState={{ disabled: true }}>
          <IconPencil {...iconProps} color={colors.navInactive} />
        </Pressable>}
      </View>
      {!transaction ? <Text style={styles.empty}>Transação não encontrada</Text> : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.summary}>
            <Text style={[styles.amount, amountStyle]}>{isExpense ? '- ' : '+ '}{formatCurrency(transaction.amountCents)}</Text>
            <Text style={styles.description}>{transaction.description}</Text>
            <View style={styles.type}>
              {isExpense ? <IconShoppingCart size={18} color={colors.negative} /> : <IconWallet size={18} color={colors.positive} />}
              <Text style={[styles.body, amountStyle]}>{isExpense ? 'Despesa' : 'Receita'}</Text>
            </View>
            {transaction.status === 'scheduled' && <Text style={styles.secondary}>Prevista</Text>}
          </View>
          <AppCard style={styles.details}>
            {rows.map((row, index) => <TransactionDetailRow key={row.label} {...row} showDivider={index < rows.length - 1} />)}
          </AppCard>
          {!!receiptUri && <AppCard>
            <Text style={styles.secondary}>Comprovante</Text>
            <Pressable onPress={openReceipt} disabled={!canOpenReceipt} style={styles.receipt}
              accessibilityRole="button" accessibilityState={{ disabled: !canOpenReceipt }}>
              <IconPhoto {...iconProps} /><Text style={styles.body}>Ver recibo{!canOpenReceipt ? ' — indisponível' : ''}</Text>
            </Pressable>
            {!canOpenReceipt && <Text style={styles.secondary}>Comprovante sem arquivo disponível para visualização.</Text>}
          </AppCard>}
          {/* TXR-14/15: sem fonte de recorrência, estratégia de edição ou snapshot de auditoria. */}
          <Pressable disabled accessibilityRole="button" accessibilityState={{ disabled: true }} style={styles.edit}>
            <Text style={styles.editText}>Editar transação — indisponível</Text>
          </Pressable>
          <Pressable disabled accessibilityRole="button" accessibilityState={{ disabled: true }} style={styles.revert}>
            <Text style={[styles.body, styles.expense]}>Reverter transação — indisponível</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md },
  iconButton: { width: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontFamily: fontFamily.bold, fontSize: fontSize.title, color: colors.textPrimary },
  content: { padding: spacing.md, paddingBottom: 24, gap: spacing.lg },
  summary: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  amount: { fontFamily: fontFamily.bold, fontSize: fontSize.display },
  expense: { color: colors.negative },
  income: { color: colors.positive },
  description: { fontFamily: fontFamily.medium, fontSize: fontSize.title, color: colors.textPrimary, textAlign: 'center' },
  type: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', backgroundColor: colors.surface, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.pill },
  body: { fontFamily: fontFamily.regular, fontSize: fontSize.body, color: colors.textPrimary, flexShrink: 1 },
  secondary: { fontFamily: fontFamily.regular, fontSize: fontSize.caption, color: colors.textSecondary },
  details: { padding: 0, overflow: 'hidden' },
  receipt: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, minHeight: 44 },
  edit: { minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: radius.input, borderWidth: 0.5, borderColor: colors.primary, opacity: 0.5, padding: spacing.sm },
  editText: { fontFamily: fontFamily.medium, fontSize: fontSize.body, color: colors.primary, textAlign: 'center' },
  revert: { minHeight: 44, justifyContent: 'center', alignItems: 'center', opacity: 0.5 },
  empty: { padding: spacing.lg, fontFamily: fontFamily.regular, fontSize: fontSize.body, color: colors.textSecondary, textAlign: 'center' },
});
