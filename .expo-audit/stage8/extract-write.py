from pathlib import Path
p = Path('src/services/transaction.service.ts')
s = p.read_text(encoding='utf-8')
start = s.index('function createNextTransactionId()')
end = s.index('export function reverseTransaction', start)
block = s[start:end]
block = block.replace('function createNextTransactionId()', 'let nextTransactionNumber = 1;\n\nfunction createNextTransactionId()', 1)
block = block.replace("  return `tx-${String(\n    highestId + 1,\n  ).padStart(3, '0')}`;", "  nextTransactionNumber = Math.max(nextTransactionNumber, highestId + 1);\n  return `tx-${String(nextTransactionNumber++).padStart(3, '0')}`;")
block = block.replace('export function createTransaction(', 'export function createTransactionRecord(', 1)
block = block.replace('): TransactionRead {', '): Transaction {', 1)
block = block.replace('return enrichTransaction(transaction);', 'return { ...transaction, tags: [...transaction.tags] };')
header = "// Escrita compartilhada por transações e recorrências, sem ciclo entre services.\nimport { categoriesMock, subcategoriesMock } from '@/data/mocks/categories.mock';\nimport { mockScenario } from '@/data/mocks/scenario.mock';\nimport { transactionsMock } from '@/data/mocks/transactions.mock';\nimport type { CreateTransactionInput, Transaction } from '@/types/transaction';\nimport { isValidTime } from '@/utils/date';\n\n"
Path('src/services/transaction-write.service.ts').write_text(header + block, encoding='utf-8')
wrapper = "export function createTransaction(input: CreateTransactionInput): TransactionRead {\n  return enrichTransaction(createTransactionRecord(input));\n}\n\n"
s = s[:start] + wrapper + s[end:]
s = s.replace('formatTransactionDate, isValidTime', 'formatTransactionDate')
s = s.replace("import { processRecurrences }", "import { createTransactionRecord } from '@/services/transaction-write.service';\nimport { processRecurrences }", 1)
p.write_text(s, encoding='utf-8')
p = Path('src/services/recurrence.service.ts')
s = p.read_text(encoding='utf-8').replace("import { createTransaction } from '@/services/transaction.service';", "import { createTransactionRecord as createTransaction } from '@/services/transaction-write.service';")
p.write_text(s, encoding='utf-8')
