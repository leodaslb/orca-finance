import { getDashboardData } from './dashboard.service';

const data = getDashboardData();

console.log({
  balanceCents: data.balanceCents,
  currentMonthExpensesCents: data.currentMonthExpensesCents,
  previousMonthExpensesCents: data.previousMonthExpensesCents,
  monthComparisonCents: data.monthComparisonCents,
  goalCurrentCents: data.goal.currentCents,
  goalProgress: data.goal.progress,
});