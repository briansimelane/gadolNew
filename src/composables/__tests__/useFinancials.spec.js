import { computeFinancials, DEFAULT_FINANCIALS_CONFIG } from '../useFinancials.js'

// Node assertion module test helper
import assert from 'assert'

// Fixture A (§8)
const fixtureA_Contract = {
  Ref: '1.1-C.W',
  Value: 21,
  Cash: 15,
  Debtors: 6,
  Production: 7,
  CostBlack: 4,
  CostYellow: 4,
  CostRed: 0,
  CostGreen: 0,
  CostPurple: 0
}

const fixtureA_Scores = {
  greenPerm: 3,
  yellowPerm: 3,
  redPerm: 2,
  purplePerm: 1,
  blackPerm: 2,
  production: 5,
  cash: 4,
  debtors: 0,
  greenTemp: 1,
  redTemp: 2,
  purpleTemp: 1,
  yellowTemp: 0,
  blackTemp: 0
}

export function runFinancialsEngineTests() {
  console.log('--- Running Financials Engine Unit Tests (Fixtures A-D) ---')

  // Test Fixture A (§8)
  const resA = computeFinancials({
    scores: fixtureA_Scores,
    contractsCompleted: [],
    reportingContract: fixtureA_Contract,
    alreadyRealised: false,
    config: DEFAULT_FINANCIALS_CONFIG
  })

  assert.strictEqual(resA.incomeStatement.revenue, 16.00, 'Fixture A: Revenue should be 16.00')
  assert.strictEqual(resA.incomeStatement.costOfSales, 8.00, 'Fixture A: Cost of Sales should be 8.00')
  assert.strictEqual(resA.incomeStatement.grossProfit, 8.00, 'Fixture A: Gross Profit should be 8.00')
  assert.strictEqual(resA.incomeStatement.totalOpex, 3.00, 'Fixture A: OpEx should be 3.00')
  assert.strictEqual(resA.incomeStatement.pbit, 5.00, 'Fixture A: PBIT should be 5.00')
  assert.strictEqual(resA.incomeStatement.interestExpense, 1.00, 'Fixture A: Interest Expense should be 1.00')
  assert.strictEqual(resA.incomeStatement.pbt, 4.00, 'Fixture A: PBT should be 4.00')
  assert.strictEqual(Number(resA.incomeStatement.taxation.toFixed(2)), 1.08, 'Fixture A: Taxation should be 1.08')
  assert.strictEqual(Number(resA.incomeStatement.netProfit.toFixed(2)), 2.92, 'Fixture A: Net Profit should be 2.92')

  assert.strictEqual(resA.balanceSheet.property, 3.00, 'Fixture A: Property should be 3.00')
  assert.strictEqual(resA.balanceSheet.equipment, 0.00, 'Fixture A: Equipment should be 0.00')
  assert.strictEqual(resA.balanceSheet.totalNonCurrentAssets, 3.00, 'Fixture A: Total NCA should be 3.00')
  assert.strictEqual(resA.balanceSheet.cash, 19.00, 'Fixture A: Cash should be 19.00')
  assert.strictEqual(resA.balanceSheet.debtors, 6.00, 'Fixture A: Debtors should be 6.00')
  assert.strictEqual(resA.balanceSheet.inventory, 0.00, 'Fixture A: Inventory should be 0.00')
  assert.strictEqual(resA.balanceSheet.totalCurrentAssets, 25.00, 'Fixture A: Total CA should be 25.00')
  assert.strictEqual(resA.balanceSheet.totalAssets, 28.00, 'Fixture A: Total Assets should be 28.00')
  assert.strictEqual(resA.balanceSheet.currentLiabilities, 4.00, 'Fixture A: Current Liabilities should be 4.00')
  assert.strictEqual(resA.balanceSheet.nonCurrentLiabilities, 5.00, 'Fixture A: Non-Current Liabilities should be 5.00')
  assert.strictEqual(resA.balanceSheet.totalLiabilities, 9.00, 'Fixture A: Total Liabilities should be 9.00')
  assert.strictEqual(resA.balanceSheet.equity, 19.00, 'Fixture A: Equity should be 19.00')

  assert.strictEqual(resA.balanceSheet.totalAssets, resA.balanceSheet.totalLiabilities + resA.balanceSheet.equity, 'Fixture A: Balance sheet must balance')

  // Test Fixture B (Completed market contracts aggregated)
  const completedMarketContract = {
    Ref: 'M1',
    Value: 10,
    CostRed: 2,
    CostGreen: 1,
    CostYellow: 1,
    CostPurple: 0,
    CostBlack: 0
  }
  const resB = computeFinancials({
    scores: fixtureA_Scores,
    contractsCompleted: [completedMarketContract],
    reportingContract: fixtureA_Contract,
    alreadyRealised: false,
    config: DEFAULT_FINANCIALS_CONFIG
  })

  assert.strictEqual(resB.incomeStatement.revenue, 26.00, 'Fixture B: Revenue should be 26.00 (16 + 10)')
  assert.strictEqual(resB.incomeStatement.costOfSales, 12.00, 'Fixture B: Cost of Sales should be 12.00 (8 + 4)')

  // Test Fixture C (alreadyRealised: true)
  const resC = computeFinancials({
    scores: { ...fixtureA_Scores, cash: 19, debtors: 6 },
    contractsCompleted: [],
    reportingContract: fixtureA_Contract,
    alreadyRealised: true,
    config: DEFAULT_FINANCIALS_CONFIG
  })

  assert.strictEqual(resC.incomeStatement.revenue, 21.00, 'Fixture C: Full revenue 21.00 when already realised')
  assert.strictEqual(resC.balanceSheet.cash, 19.00, 'Fixture C: Cash equals scores.cash (no double count)')
  assert.strictEqual(resC.workings.unmetCards, 0, 'Fixture C: Unmet cards should be 0')

  // Test Fixture D (Loss-making position with negative PBT)
  const resD_NoCredit = computeFinancials({
    scores: { ...fixtureA_Scores, greenPerm: 0, yellowPerm: 0, redPerm: 0, purplePerm: 0, blackPerm: 0 },
    contractsCompleted: [],
    reportingContract: { ...fixtureA_Contract, Value: 2 },
    alreadyRealised: false,
    config: { ...DEFAULT_FINANCIALS_CONFIG, taxLossPolicy: 'NO_CREDIT' }
  })
  assert.strictEqual(resD_NoCredit.incomeStatement.taxation, 0, 'Fixture D (NO_CREDIT): Taxation should be 0')

  const resD_Credit = computeFinancials({
    scores: { ...fixtureA_Scores, greenPerm: 0, yellowPerm: 0, redPerm: 0, purplePerm: 0, blackPerm: 0 },
    contractsCompleted: [],
    reportingContract: { ...fixtureA_Contract, Value: 2 },
    alreadyRealised: false,
    config: { ...DEFAULT_FINANCIALS_CONFIG, taxLossPolicy: 'CREDIT' }
  })
  assert.ok(resD_Credit.incomeStatement.taxation < 0, 'Fixture D (CREDIT): Taxation should be a negative tax credit')

  console.log('✅ ALL Financials Engine Unit Tests (Fixtures A-D) Passed Successfully!')
}

// Auto-run if executed directly
if (typeof process !== 'undefined' && process.argv[1]?.includes('useFinancials.spec.js')) {
  runFinancialsEngineTests()
}
