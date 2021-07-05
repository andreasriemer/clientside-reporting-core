const multiplyValues = (previousValue: number, currentValue: number) => {
  if (Number.isNaN(Number(currentValue))) {
    return previousValue;
  }
  return previousValue * currentValue;
};

export default multiplyValues;
