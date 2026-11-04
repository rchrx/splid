/**
 * Precise arithmetic helper to avoid floating point anomalies (e.g. 0.1 + 0.2)
 */
export const roundToTwo = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Validates bill parameters and returns sanitized values and errors
 */
export const validateBillInput = ({
  billAmount,
  tipPercentage,
  numberOfPeople,
  taxPercentage = 0,
  additionalCharges = 0,
}) => {
  const errors = {};

  const cleanBill = Math.max(0, parseFloat(billAmount) || 0);
  if (billAmount < 0) {
    errors.billAmount = "Bill amount cannot be negative";
  }

  const cleanTip = Math.max(0, parseFloat(tipPercentage) || 0);
  if (tipPercentage < 0) {
    errors.tipPercentage = "Tip percentage cannot be negative";
  }

  const rawPeople = parseInt(numberOfPeople, 10);
  const cleanPeople = isNaN(rawPeople) || rawPeople < 1 ? 1 : Math.min(100, rawPeople);
  if (rawPeople < 1) {
    errors.numberOfPeople = "Number of people must be at least 1";
  }

  const cleanTax = Math.max(0, parseFloat(taxPercentage) || 0);
  const cleanCharges = Math.max(0, parseFloat(additionalCharges) || 0);

  return {
    cleanBill,
    cleanTip,
    cleanPeople,
    cleanTax,
    cleanCharges,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * Calculates primary split and tip figures
 */
export const calculateSplitBill = ({
  billAmount = 0,
  tipPercentage = 15,
  numberOfPeople = 1,
  includeTax = false,
  taxPercentage = 0,
  includeTip = true,
  additionalCharges = 0,
  roundUpOption = 'none', // 'none' | 'nearest-dollar' | 'nearest-five' | 'per-person-dollar'
}) => {
  const { cleanBill, cleanTip, cleanPeople, cleanTax, cleanCharges } = validateBillInput({
    billAmount,
    tipPercentage,
    numberOfPeople,
    taxPercentage,
    additionalCharges,
  });

  const subtotal = roundToTwo(cleanBill);
  
  // Tax calculation
  const taxAmount = includeTax && cleanTax > 0 
    ? roundToTwo((subtotal * cleanTax) / 100) 
    : 0;

  // Base for tip: standard tipping is typically on subtotal before tax, or after tax if toggled
  const tipBase = subtotal;
  const effectiveTipPercent = includeTip ? cleanTip : 0;
  let tipAmount = includeTip ? roundToTwo((tipBase * effectiveTipPercent) / 100) : 0;

  const charges = roundToTwo(cleanCharges);

  let rawTotal = roundToTwo(subtotal + taxAmount + tipAmount + charges);
  let finalTotal = rawTotal;
  let roundUpDifference = 0;

  // Apply round-up logic
  if (roundUpOption === 'nearest-dollar') {
    const rounded = Math.ceil(rawTotal);
    roundUpDifference = roundToTwo(rounded - rawTotal);
    finalTotal = rounded;
  } else if (roundUpOption === 'nearest-five') {
    const rounded = Math.ceil(rawTotal / 5) * 5;
    roundUpDifference = roundToTwo(rounded - rawTotal);
    finalTotal = rounded;
  } else if (roundUpOption === 'per-person-dollar') {
    const rawPerPerson = rawTotal / cleanPeople;
    const roundedPerPerson = Math.ceil(rawPerPerson);
    const roundedTotal = roundToTwo(roundedPerPerson * cleanPeople);
    roundUpDifference = roundToTwo(roundedTotal - rawTotal);
    finalTotal = roundedTotal;
  }

  // If rounded up, the extra change can be credited to the tip or roundUp buffer
  const effectiveTip = roundToTwo(tipAmount + (roundUpOption !== 'none' ? roundUpDifference : 0));

  const amountPerPerson = roundToTwo(finalTotal / cleanPeople);
  const tipPerPerson = roundToTwo(effectiveTip / cleanPeople);
  const subtotalPerPerson = roundToTwo(subtotal / cleanPeople);
  const taxPerPerson = roundToTwo(taxAmount / cleanPeople);
  const chargesPerPerson = roundToTwo(charges / cleanPeople);

  return {
    subtotal,
    taxAmount,
    tipPercentage: effectiveTipPercent,
    tipAmount: effectiveTip,
    baseTipAmount: tipAmount,
    additionalCharges: charges,
    roundUpDifference,
    roundUpOption,
    finalTotal,
    numberOfPeople: cleanPeople,
    amountPerPerson,
    tipPerPerson,
    subtotalPerPerson,
    taxPerPerson,
    chargesPerPerson,
  };
};

/**
 * Calculates unequal participant splits
 */
export const calculateUnequalSplit = ({
  participants = [],
  tipPercentage = 15,
  taxPercentage = 0,
  additionalCharges = 0,
  splitMode = 'exact', // 'exact' | 'percentage' | 'equal'
  totalBill = 0,
}) => {
  if (!participants.length) return { participants: [], totalAssigned: 0, remaining: 0, isBalanced: true };

  const totalBase = participants.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const bill = splitMode === 'percentage' || splitMode === 'equal' ? totalBill : totalBase;
  const taxTotal = (bill * (taxPercentage || 0)) / 100;
  const charges = parseFloat(additionalCharges) || 0;

  const results = participants.map((p, idx) => {
    let participantSubtotal = 0;

    if (splitMode === 'equal') {
      participantSubtotal = bill / participants.length;
    } else if (splitMode === 'percentage') {
      const pct = parseFloat(p.percentage) || 0;
      participantSubtotal = (bill * pct) / 100;
    } else {
      participantSubtotal = parseFloat(p.amount) || 0;
    }

    // Individual tip
    const personTipPct = p.customTip !== undefined && p.customTip !== null ? parseFloat(p.customTip) : tipPercentage;
    const personTipAmount = roundToTwo((participantSubtotal * personTipPct) / 100);

    // Individual share of tax & charges proportional to subtotal
    const proportion = bill > 0 ? participantSubtotal / bill : 1 / participants.length;
    const personTax = roundToTwo(taxTotal * proportion);
    const personCharges = roundToTwo(charges * proportion);

    const personTotal = roundToTwo(participantSubtotal + personTipAmount + personTax + personCharges);

    return {
      ...p,
      subtotal: roundToTwo(participantSubtotal),
      tipPercentage: personTipPct,
      tipAmount: personTipAmount,
      taxAmount: personTax,
      chargesAmount: personCharges,
      totalPayable: personTotal,
    };
  });

  const totalCalculated = results.reduce((sum, p) => sum + p.totalPayable, 0);
  const targetTotal = roundToTwo(bill + (bill * (tipPercentage || 0)) / 100 + taxTotal + charges);
  const remaining = roundToTwo(targetTotal - totalCalculated);

  return {
    participants: results,
    subtotal: roundToTwo(bill),
    taxTotal: roundToTwo(taxTotal),
    chargesTotal: roundToTwo(charges),
    totalCalculated: roundToTwo(totalCalculated),
    targetTotal,
    remaining,
    isBalanced: Math.abs(remaining) < 0.05,
  };
};

