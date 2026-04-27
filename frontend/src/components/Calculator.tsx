import { useState } from 'react';

type Operation = '+' | '-' | '*' | '/';

export function Calculator() {
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [operation, setOperation] = useState<Operation>('+');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    // Validation
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
      setError('Veuillez entrer des nombres valides');
      setResult(null);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiUrl}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          operation,
          a: numA,
          b: numB,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du calcul');
      }

      setResult(data.result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculator">
      <h1>Calculatrice</h1>

      <div className="calculator-form">
        <div className="input-group">
          <label htmlFor="number-a">Nombre A</label>
          <input
            id="number-a"
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="Entrez un nombre"
          />
        </div>

        <div className="input-group">
          <label htmlFor="operation">Opération</label>
          <select
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value as Operation)}
          >
            <option value="+">Addition (+)</option>
            <option value="-">Soustraction (-)</option>
            <option value="*">Multiplication (*)</option>
            <option value="/">Division (/)</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="number-b">Nombre B</label>
          <input
            id="number-b"
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="Entrez un nombre"
          />
        </div>

        <button
          onClick={handleCalculate}
          disabled={loading}
          className="calculate-button"
        >
          {loading ? 'Calcul en cours...' : 'Calculer'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {result !== null && !error && (
        <div className="result">
          <h2>Résultat</h2>
          <div className="result-value">{result}</div>
        </div>
      )}
    </div>
  );
}