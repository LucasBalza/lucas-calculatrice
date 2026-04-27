const { calculate } = require('../services/calculateService');

describe('calculateService', () => {
  test('addition: 5 + 3 = 8', () => {
    expect(calculate('+', 5, 3)).toBe(8);
  });

  test('soustraction: 10 - 4 = 6', () => {
    expect(calculate('-', 10, 4)).toBe(6);
  });

  test('multiplication: 3 * 4 = 12', () => {
    expect(calculate('*', 3, 4)).toBe(12);
  });

  test('division: 15 / 3 = 5', () => {
    expect(calculate('/', 15, 3)).toBe(5);
  });

  test('division par zéro doit lever une erreur', () => {
    expect(() => calculate('/', 10, 0)).toThrow('Division par zéro impossible');
  });

  test('opération invalide doit lever une erreur', () => {
    expect(() => calculate('%', 10, 5)).toThrow('Opération non supportée');
  });
});

