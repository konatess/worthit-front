const getNumber = (text) => {
    let trimmed = text.trim();
    let num = parseFloat(trimmed);
    return isNaN(num) ? 0 : num
};
const shortenNumber = (num) => {
    return parseFloat(num.toFixed(10))
};
const limitDecimal = (num, decimalLength) => {
    let limiter = decimalLength > 0 ? Math.pow(10, decimalLength) : 0
    return limiter > 0 ? Math.round(num * limiter)/limiter : Math.round(num);
};
const calculateIngredientsCost = (ingredients, allIngredients) => {
    let cost = 0;
    for (const id in ingredients) {
        cost += ingredients[id] * allIngredients[id].cost
    }
    return cost
};
const calculateWagePerItem = (wage, hour, minute, amountPerTime) => {
    return ((wage * hour) + (wage * minute / 60)) / amountPerTime
};
const calculateTotalCost = (wagePerItem, ingCost) => {
    return wagePerItem + ingCost
};
const calculatePriceByAmount = (totalCost, profitAmount) => {
    return totalCost + profitAmount
};
const calculatePriceByPercent = (totalCost, profitPercent) => {
    return totalCost * (profitPercent/100 + 1)
};


export default {
    getNum: getNumber,
    shortenNum: shortenNumber,
    limitDec: limitDecimal,
    ingredientCost: calculateIngredientsCost,
    wagePerItem: calculateWagePerItem,
    totalCost: calculateTotalCost,
    priceByAmount: calculatePriceByAmount,
    priceByPercent: calculatePriceByPercent,
}