// JS-OPT: оптимизация обработки данных
// Меняйте только функции с суффиксом Optimised. Остальной код проверяет результаты и измеряет время

const PRODUCT_COUNT = 12000;
const STATUSES = ['new', 'processing', 'shipped', 'cancelled'];
const CATEGORIES = Array.from({ length: 12 }, (_, index) => 'category-' + index);

const products = Array.from({ length: PRODUCT_COUNT }, (_, index) => ({
  id: index + 1,
  category: 'category-' + (index % CATEGORIES.length),
  price: 100 + ((index * 17) % 10000),
  title: 'Product ' + (index + 1)
}));

// Два товара имеют одинаковую максимальную цену. При равенстве нужно вернуть первый
products[119].price = 99999;
products[899].price = 99999;

// В списке есть повторяющиеся и отсутствующие ID
const selectedIds = Array.from({ length: 650 }, (_, index) =>
  1 + ((index * 37) % 4200)
);
selectedIds.push(...selectedIds.slice(0, 80), PRODUCT_COUNT + 1, PRODUCT_COUNT + 999);

// Есть повторные запросы и ID, которых нет в products
const idsToLookup = Array.from({ length: 700 }, (_, index) =>
  index % 11 === 0
    ? PRODUCT_COUNT + 500 + index
    : 1 + ((index * 41) % PRODUCT_COUNT)
);
idsToLookup[30] = idsToLookup[1];
idsToLookup[90] = idsToLookup[4];

// Большое количество повторов, но порядок первого появления должен сохраниться
const codes = Array.from({ length: 8000 }, (_, index) => 'code-' + ((index * 17) % 700));
codes[5] = 'Ab-12';
codes[15] = 'ab-12';
codes[25] = 'Ab-12';

// В заказах встречаются и неизвестные статусы. Они не должны попадать в сводку известных статусов
const orders = Array.from({ length: 40000 }, (_, index) => ({
  id: index + 1,
  status: index % 101 === 0 ? 'returned' : STATUSES[index % STATUSES.length],
  amount: 100 + ((index * 13) % 900)
}));

function findProductByIdSlow(items, targetId) {
  return items.filter(item => item.id === targetId)[0];
}
function findProductByIdOptimised(items, targetId) {
  return items.find(item => item.id === targetId);
}

function filterSelectedProductsSlow(items, ids) {
  return items.filter(item => ids.includes(item.id));
}
function filterSelectedProductsOptimised(items, ids) {
  const selected = new Set(ids);
  return items.filter(item => selected.has(item.id));
}

function uniqueCodesSlow(values) {
  const result = [];
  for (const value of values) {
    if (!result.includes(value)) result.push(value);
  }
  return result;
}
function uniqueCodesOptimised(values) {
  return [...new Set(values)];
}

function lookupProductsSlow(items, ids) {
  return ids.map(id => items.find(item => item.id === id));
}
function lookupProductsOptimised(items, ids) {
  const productsById = new Map(items.map(item => [item.id, item]));
  return ids.map(id => productsById.get(id));
}

function countByStatusSlow(items) {
  return STATUSES.map(status => {
    const group = items.filter(item => item.status === status);
    return {
      status,
      count: group.length,
      totalAmount: group.reduce((sum, item) => sum + item.amount, 0)
    };
  });
}
function countByStatusOptimised(items) {
  const counts = new Map(STATUSES.map(status => [status, { count: 0, totalAmount: 0 }]));
  for (const item of items) {
    const stats = counts.get(item.status);
    if (stats) {
      stats.count++;
      stats.totalAmount += item.amount;
    }
  }
  return STATUSES.map(status => ({
    status,
    count: counts.get(status).count,
    totalAmount: counts.get(status).totalAmount
  }));
}

function mostExpensiveProductSlow(items) {
  return items.slice().sort((a, b) => b.price - a.price)[0];
}
function mostExpensiveProductOptimised(items) {
  if (items.length === 0) return undefined;
  let mostExpensive = items[0];
  for (let index = 1; index < items.length; index++) {
    if (items[index].price > mostExpensive.price) mostExpensive = items[index];
  }
  return mostExpensive;
}

function categorySummarySlow(items) {
  return CATEGORIES.map(category => {
    const group = items.filter(item => item.category === category);
    const totalPrice = group.reduce((sum, item) => sum + item.price, 0);
    const minPrice = group.reduce((min, item) => Math.min(min, item.price), Infinity);
    const maxPrice = group.reduce((max, item) => Math.max(max, item.price), -Infinity);
    return {
      category,
      count: group.length,
      totalPrice,
      averagePrice: group.length ? totalPrice / group.length : 0,
      minPrice: group.length ? minPrice : 0,
      maxPrice: group.length ? maxPrice : 0
    };
  });
}
function categorySummaryOptimised(items) {
  const summary = new Map(CATEGORIES.map(category => [category, {
    count: 0, totalPrice: 0, minPrice: Infinity, maxPrice: -Infinity
  }]));
  for (const item of items) {
    const stats = summary.get(item.category);
    if (!stats) continue;
    stats.count++;
    stats.totalPrice += item.price;
    if (item.price < stats.minPrice) stats.minPrice = item.price;
    if (item.price > stats.maxPrice) stats.maxPrice = item.price;
  }
  return CATEGORIES.map(category => {
    const stats = summary.get(category);
    return {
      category,
      count: stats.count,
      totalPrice: stats.totalPrice,
      averagePrice: stats.count ? stats.totalPrice / stats.count : 0,
      minPrice: stats.count ? stats.minPrice : 0,
      maxPrice: stats.count ? stats.maxPrice : 0
    };
  });
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}
function assertSame(expected, actual, description) {
  if (!deepEqual(expected, actual)) throw new Error('Результаты отличаются: ' + description);
}
function median(numbers) {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}
function benchmark(fn, args, repetitions) {
  for (let index = 0; index < repetitions; index++) fn(...args);
  const times = [];
  for (let round = 0; round < 5; round++) {
    const start = Date.now();
    for (let index = 0; index < repetitions; index++) fn(...args);
    const elapsed = Date.now() - start;
    times.push(elapsed / repetitions);
  }
  return { times, median: median(times) };
}
function compareTask(title, slowFn, optimisedFn, args, repetitions, edgeCases = []) {
  console.log('\n' + '='.repeat(66));
  console.log(title);
  const expected = slowFn(...args);
  const actual = optimisedFn(...args);
  assertSame(expected, actual, title);
  for (let index = 0; index < edgeCases.length; index++) {
    const caseArgs = edgeCases[index];
    assertSame(slowFn(...caseArgs), optimisedFn(...caseArgs), title + ', проверка ' + (index + 1));
  }
  console.log('Проверка результатов: OK (основной пример и дополнительные случаи: ' + edgeCases.length + ')');
  const slow = benchmark(slowFn, args, repetitions);
  const optimised = benchmark(optimisedFn, args, repetitions);
  console.log('Исходный вариант, замеры в мс на вызов: ' + slow.times.map(value => value.toFixed(3)).join(', '));
  console.log('Новый вариант, замеры в мс на вызов:     ' + optimised.times.map(value => value.toFixed(3)).join(', '));
  console.log('Медиана: исходный ' + slow.median.toFixed(3) + ' мс; новый ' + optimised.median.toFixed(3) + ' мс');
  if (optimised.median > 0) {
    const ratio = slow.median / optimised.median;
    console.log('Отношение времени исходного варианта к новому: ' + ratio.toFixed(2) + 'x');
  } else {
    console.log('Новый вариант слишком быстр для точного сравнения с текущей серией измерений.');
  }
}

console.log('JS-OPT: оптимизация обработки данных');
console.log('Для каждого задания сравниваются пять серий измерений; быстрые функции запускаются повторно в каждой серии.');

compareTask('1. Поиск товара по ID', findProductByIdSlow, findProductByIdOptimised,
  [products, 2500], 80,
  [[products, 1], [products, PRODUCT_COUNT], [products, PRODUCT_COUNT + 100]]);
compareTask('2. Фильтрация товаров по списку ID', filterSelectedProductsSlow,
  filterSelectedProductsOptimised, [products, selectedIds], 2);
compareTask('3. Удаление повторяющихся кодов', uniqueCodesSlow, uniqueCodesOptimised, [codes], 1);
compareTask('4. Многократный поиск товаров по ID', lookupProductsSlow, lookupProductsOptimised,
  [products, idsToLookup], 1,
  [[products, [1, 1, PRODUCT_COUNT + 5, 500, 500]]]);
compareTask('5. Статистика заказов по статусам', countByStatusSlow, countByStatusOptimised, [orders], 3);
compareTask('6. Поиск самого дорогого товара (дополнительно)', mostExpensiveProductSlow,
  mostExpensiveProductOptimised, [products], 2);
compareTask('7. Сводка по категориям (дополнительно)', categorySummarySlow,
  categorySummaryOptimised, [products], 2);

console.log('\nВсе проверки завершены. Запишите медианы и объясните результат каждого выполненного задания');
