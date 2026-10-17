import { runAllUnitTests } from '../src/services/unitTests';

console.log('====================================================');
console.log('Running eBay UK Business Seller Fee Engine Tests...');
console.log('====================================================\n');

const results = runAllUnitTests();
let passedCount = 0;
let failedCount = 0;

for (const t of results) {
  if (t.passed) {
    passedCount++;
    console.log(`✅ [PASS] Test ${t.id}: ${t.title}`);
    console.log(`   Expected: ${t.expected} | Actual: ${t.actual}`);
  } else {
    failedCount++;
    console.log(`❌ [FAIL] Test ${t.id}: ${t.title}`);
    console.log(`   Expected: ${t.expected} | Actual: ${t.actual}`);
    if (t.details) console.log(`   Details: ${t.details}`);
  }
}

console.log('\n====================================================');
console.log(`Summary: ${passedCount}/${results.length} passed (${failedCount} failed)`);
console.log('====================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('All 24 mandatory test cases passed successfully!\n');
}
