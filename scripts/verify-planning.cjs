// Verificação técnica US05/US06/US29, sem dependência adicional.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();

function load(file) {
  const absolute = path.resolve(root, file);
  if (cache.has(absolute)) return cache.get(absolute).exports;
  const module = { exports: {} };
  cache.set(absolute, module);
  const source = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const localRequire = (specifier) => {
    const target = specifier.startsWith('@/')
      ? path.join(root, 'src', specifier.slice(2))
      : path.resolve(path.dirname(absolute), specifier);
    return load(fs.existsSync(`${target}.ts`) ? `${target}.ts` : path.join(target, 'index.ts'));
  };
  vm.runInThisContext(`(function(require, module, exports) {${source}\n})`, {
    filename: absolute,
  })(localRequire, module, module.exports);
  return module.exports;
}

const categoryService = load('src/services/category.service.ts');
const transactionService = load('src/services/transaction.service.ts');
const planningService = load('src/services/planning.service.ts');
const { getDashboardData } = load('src/services/dashboard.service.ts');
const { subcategoriesMock } = load('src/data/mocks/categories.mock.ts');

const subcategorySnapshot = JSON.stringify(subcategoriesMock);
try {
  const created = categoryService.createSubcategory({
    categoryId: 'category-food',
    name: '  Feira semanal  ',
  });
  assert.equal(created.id, 'subcategory-feira-semanal');
  assert.equal(created.name, 'Feira semanal');
  assert.ok(transactionService.getTransactionSubcategories('category-food')
    .some((item) => item.id === created.id));
  assert.throws(() => categoryService.createSubcategory({
    categoryId: 'category-food',
    name: 'feira semanal',
  }));
  assert.throws(() => categoryService.createSubcategory({
    categoryId: 'category-missing',
    name: 'Inválida',
  }));
} finally {
  subcategoriesMock.splice(0, subcategoriesMock.length, ...JSON.parse(subcategorySnapshot));
}
assert.equal(JSON.stringify(subcategoriesMock), subcategorySnapshot);

const planning = planningService.getMonthlyPlanningData();
assert.equal(planning.totalBudgetCents, 300000);
assert.equal(planning.totalSpentCents, 118000);
assert.equal(planning.availableCents, 182000);
assert.equal(planning.totalSpentCents, getDashboardData().currentMonthExpensesCents);
assert.equal(planning.categories.find((item) => item.categoryId === 'category-food').spentCents, 36000);
assert.equal(planningService.getBudgetVisualStatus(0.69), 'normal');
assert.equal(planningService.getBudgetVisualStatus(0.70), 'warning');
assert.equal(planningService.getBudgetVisualStatus(0.99), 'warning');
assert.equal(planningService.getBudgetVisualStatus(1), 'exceeded');

const daily = planningService.getDailySpendingData();
assert.equal(daily.date, '2026-09-13');
assert.equal(daily.spentCents, 30700);
assert.equal(daily.limitCents, 12000);

assert.deepEqual(planningService.getAvailablePlanningPeriods(), ['2026-09']);
const comparison = planningService.getPlannedVsActualData('2026-09');
assert.equal(comparison.totalBudgetCents, 300000);
assert.equal(comparison.totalSpentCents, 118000);
assert.equal(comparison.differenceCents, 182000);
assert.equal(comparison.categories.find((item) =>
  item.categoryId === 'category-food').differenceCents, -54000);

const originalAllowance = planningService.getFreeSpendingAllowance();
assert.equal(originalAllowance.limitCents, 40000);
assert.equal(originalAllowance.usedCents, null);
assert.equal(originalAllowance.remainingCents, null);
try {
  planningService.saveFreeSpendingAllowance(45000);
  assert.equal(planningService.getFreeSpendingAllowance().limitCents, 45000);
} finally {
  planningService.saveFreeSpendingAllowance(originalAllowance.limitCents);
}

const originalLimits = planningService.getSpendingLimitsConfiguration();
try {
  const changed = {
    ...originalLimits,
    dailyLimitCents: 15000,
    pushEnabled: false,
    categoryLimits: originalLimits.categoryLimits.map((item, index) => ({
      ...item,
      limitCents: index === 0 ? 71000 : item.limitCents,
    })),
  };
  planningService.saveSpendingLimitsConfiguration(changed);
  const saved = planningService.getSpendingLimitsConfiguration();
  assert.equal(saved.dailyLimitCents, 15000);
  assert.equal(saved.pushEnabled, false);
  assert.equal(saved.categoryLimits[0].limitCents, 71000);
  assert.equal(saved.categoryLimits[0].period, null);
  saved.categoryLimits[0].limitCents = 1;
  assert.equal(planningService.getSpendingLimitsConfiguration().categoryLimits[0].limitCents, 71000);
} finally {
  planningService.saveSpendingLimitsConfiguration(originalLimits);
}

console.log('PASS: subcategorias, orçamento, comparação, cota livre, thresholds e limites.');
