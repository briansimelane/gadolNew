export const DEFAULT_FINANCIALS_CONFIG = {
  interestRate: 0.20,
  taxRate: 0.27,
  longTermDebt: 5,
  taxLossPolicy: 'NO_CREDIT', // 'NO_CREDIT' | 'CREDIT'
  periodDays: 365
}

function capitalise(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Pure function computing financial statements (Income Statement, Balance Sheet, Ratios, Workings)
 * for a given team state and reporting contract.
 */
export function computeFinancials({
  scores = {},
  contractsCompleted = [],
  reportingContract = null,
  alreadyRealised = false,
  config = {}
}) {
  const cfg = { ...DEFAULT_FINANCIALS_CONFIG, ...(config || {}) }
  const colors = ['green', 'yellow', 'red', 'purple', 'black']

  // Workings calculation
  const required = {}
  const held = {}
  const allocated = {}
  const free = {}
  const unmet = {}

  let unmetCardsSum = 0
  let unmetProduction = 0
  let contractCash = 0
  let contractDebtors = 0
  let inventoryBase = 0

  colors.forEach(c => {
    held[c] = scores[`${c}Perm`] || 0
  })

  if (alreadyRealised || !reportingContract) {
    colors.forEach(c => {
      required[c] = 0
      allocated[c] = 0
      free[c] = held[c]
      unmet[c] = 0
    })
    unmetCardsSum = 0
    unmetProduction = 0
    contractCash = 0
    contractDebtors = 0
    inventoryBase = Math.max(0, scores.production || 0)
  } else {
    colors.forEach(c => {
      const capC = capitalise(c)
      required[c] = reportingContract[`Cost${capC}`] || 0
      allocated[c] = Math.min(held[c], required[c])
      free[c] = Math.max(0, held[c] - allocated[c])
      unmet[c] = Math.max(0, required[c] - held[c])
      unmetCardsSum += unmet[c]
    })

    const reqProd = reportingContract.Production || 0
    unmetProduction = Math.max(0, reqProd - (scores.production || 0))
    contractCash = reportingContract.Cash || 0
    contractDebtors = reportingContract.Debtors || 0
    inventoryBase = Math.max(0, (scores.production || 0) - reqProd)
  }

  // Income Statement
  const completedValue = (contractsCompleted || []).reduce((sum, c) => sum + (c.Value || 0), 0)
  const repVal = reportingContract ? (reportingContract.Value || 0) : 0
  const reportingRevenue = reportingContract ? (repVal - unmetCardsSum - unmetProduction) : 0
  const revenue = completedValue + reportingRevenue

  const completedCoS = (contractsCompleted || []).reduce((sum, c) => {
    return sum + (c.CostRed || 0) + (c.CostGreen || 0) + (c.CostYellow || 0) + (c.CostPurple || 0) + (c.CostBlack || 0)
  }, 0)
  const reportingCoS = reportingContract ? (
    (reportingContract.CostRed || 0) +
    (reportingContract.CostGreen || 0) +
    (reportingContract.CostYellow || 0) +
    (reportingContract.CostPurple || 0) +
    (reportingContract.CostBlack || 0)
  ) : 0
  const costOfSales = completedCoS + reportingCoS

  const grossProfit = revenue - costOfSales

  const peopleCosts = free.red || 0
  const operationsCosts = free.purple || 0
  const outsourcedCosts = free.black || 0
  const totalOpex = peopleCosts + operationsCosts + outsourcedCosts

  const pbit = grossProfit - totalOpex
  const interestExpense = (cfg.longTermDebt || 0) * (cfg.interestRate || 0)
  const pbt = pbit - interestExpense

  let taxation = 0
  if (cfg.taxLossPolicy === 'NO_CREDIT') {
    taxation = Math.max(pbt, 0) * (cfg.taxRate || 0)
  } else {
    taxation = pbt * (cfg.taxRate || 0)
  }
  const netProfit = pbt - taxation

  const incomeStatement = {
    revenue,
    completedValue,
    reportingRevenue,
    unmetCards: unmetCardsSum,
    unmetProduction,
    costOfSales,
    grossProfit,
    peopleCosts,
    operationsCosts,
    outsourcedCosts,
    totalOpex,
    pbit,
    interestExpense,
    pbt,
    taxation,
    netProfit
  }

  // Balance Sheet
  const property = free.green || 0
  const equipment = free.yellow || 0
  const totalNonCurrentAssets = property + equipment

  const cash = (scores.cash || 0) + contractCash
  const debtors = (scores.debtors || 0) + contractDebtors
  const inventory = inventoryBase
  const totalCurrentAssets = cash + debtors + inventory

  const totalAssets = totalNonCurrentAssets + totalCurrentAssets

  const currentLiabilities = (scores.greenTemp || 0) + (scores.yellowTemp || 0) + (scores.redTemp || 0) + (scores.purpleTemp || 0) + (scores.blackTemp || 0)
  const nonCurrentLiabilities = cfg.longTermDebt || 0
  const totalLiabilities = currentLiabilities + nonCurrentLiabilities

  const equity = totalAssets - totalLiabilities

  const balanceSheet = {
    property,
    equipment,
    totalNonCurrentAssets,
    cash,
    debtors,
    inventory,
    totalCurrentAssets,
    totalAssets,
    currentLiabilities,
    nonCurrentLiabilities,
    totalLiabilities,
    equity
  }

  // Safe division helper
  const safeDiv = (num, den) => {
    if (den === 0 || den === null || den === undefined || isNaN(den) || isNaN(num)) return null
    return num / den
  }

  const workingCapital = totalCurrentAssets - currentLiabilities
  const capitalEmployed = equity + nonCurrentLiabilities

  const profitability = {
    grossProfitMargin: safeDiv(grossProfit, revenue),
    operatingMargin: safeDiv(pbit, revenue),
    netProfitMargin: safeDiv(netProfit, revenue),
    roa: safeDiv(netProfit, totalAssets),
    roe: safeDiv(netProfit, equity),
    roce: safeDiv(pbit, capitalEmployed)
  }

  const liquidity = {
    currentRatio: safeDiv(totalCurrentAssets, currentLiabilities),
    quickRatio: safeDiv(totalCurrentAssets - inventory, currentLiabilities),
    cashRatio: safeDiv(cash, currentLiabilities),
    workingCapital
  }

  const solvency = {
    debtToEquity: equity <= 0 ? null : safeDiv(totalLiabilities, equity),
    debtToAssets: safeDiv(totalLiabilities, totalAssets),
    gearing: safeDiv(nonCurrentLiabilities, capitalEmployed),
    interestCover: safeDiv(pbit, interestExpense),
    equityRatio: safeDiv(equity, totalAssets)
  }

  const efficiency = {
    assetTurnover: safeDiv(revenue, totalAssets),
    inventoryTurnover: safeDiv(costOfSales, inventory),
    debtorsDays: (debtors === 0 || revenue === 0) ? null : safeDiv(debtors * (cfg.periodDays || 365), revenue),
    workingCapitalTurnover: safeDiv(revenue, workingCapital)
  }

  const ratios = {
    profitability,
    liquidity,
    solvency,
    efficiency
  }

  const workings = {
    required,
    held,
    allocated,
    free,
    unmet,
    unmetCards: unmetCardsSum,
    unmetProduction,
    alreadyRealised
  }

  return {
    incomeStatement,
    balanceSheet,
    ratios,
    workings
  }
}
