// Smart price formatting - removes unnecessary trailing zeros
export const formatPrice = (price) => {
  if (!price || price === 0) return '0';
  
  const priceNum = parseFloat(price);
  
  // For very small numbers (less than 0.01), show up to 8 decimals but remove trailing zeros
  if (priceNum < 0.01) {
    return priceNum.toFixed(8).replace(/\.?0+$/, '');
  }
  
  // For numbers between 0.01 and 1, show up to 4 decimals but remove trailing zeros
  if (priceNum < 1) {
    return priceNum.toFixed(4).replace(/\.?0+$/, '');
  }
  
  // For numbers between 1 and 100, show up to 2 decimals but remove trailing zeros
  if (priceNum < 100) {
    return priceNum.toFixed(2).replace(/\.?0+$/, '');
  }
  
  // For larger numbers, show 2 decimals but remove trailing zeros
  return priceNum.toFixed(2).replace(/\.?0+$/, '');
};

// Format price change with smart precision
export const formatPriceChange = (change) => {
  if (!change || change === 0) return '0';
  
  const changeNum = parseFloat(change);
  
  // For very small changes, show more precision
  if (Math.abs(changeNum) < 0.01) {
    return changeNum.toFixed(8).replace(/\.?0+$/, '');
  }
  
  // For normal changes, show reasonable precision
  if (Math.abs(changeNum) < 1) {
    return changeNum.toFixed(4).replace(/\.?0+$/, '');
  }
  
  return changeNum.toFixed(2).replace(/\.?0+$/, '');
};