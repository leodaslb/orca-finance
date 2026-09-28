function parseLocalDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function removeDateConnectors(value: string): string {
  return value
    .replace(/ de /g, ' ')
    .replace(/\./g, '');
}

export function formatDashboardDate(date: string): string {
  const parsedDate = parseLocalDate(date);

  const weekday = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
  }).format(parsedDate);

  const dayAndMonth = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(parsedDate);

  return `${weekday}, ${removeDateConnectors(dayAndMonth)}`;
}

export function formatTransactionDateTime(
  date: string,
  time: string,
  referenceDate: string
): string {
  if (date === referenceDate) {
    return `Hoje, ${time}`;
  }

  const parsedDate = parseLocalDate(date);

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);

  return removeDateConnectors(formattedDate);
}

export function formatTransactionDate(date: string): string {
  return removeDateConnectors(new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(parseLocalDate(date)));
}
export function parseBrazilianDateToISO(
  value: string
): string | null {
  const match = value.match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  );

  if (!match) {
    return null;
  }

  const [, dayText, monthText, yearText] = match;

  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);

  const date = new Date(
    year,
    month - 1,
    day
  );

  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValid) {
    return null;
  }

  return `${yearText}-${monthText}-${dayText}`;
}

export function isValidTime(
  value: string
): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}