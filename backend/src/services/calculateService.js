const calculate = (operation, a, b) => {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) {
        throw new Error('Division par zéro impossible');
      }
      return a / b;
    default:
      throw new Error(`Opération non supportée: ${operation}`);
  }
};

module.exports = { calculate };

