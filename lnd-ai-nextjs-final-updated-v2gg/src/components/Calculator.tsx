"use client";
import React, { useState } from 'react';

interface HistoryItem {
  expression: string;
  result: number;
}

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const appendToDisplay = (value: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const calculateResult = () => {
    try {
      // Replace display symbols with JavaScript operators
      const jsExpression = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      // Using Function constructor for safer evaluation than eval()
      const result = Function('"use strict"; return (' + jsExpression + ')')();

      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation');
      }

      setHistory([{ expression: display, result }, ...history.slice(0, 9)]);
      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
    }
  };

  const clearCalculator = () => {
    setDisplay('0');
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Advanced Calculator</h3>
      <div className="calculator-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="calculator-display">
          <input type="text" id="calcDisplay" className="prompt-input" style={{ minHeight: 'auto', padding: '20px', fontSize: '1.5rem', textAlign: 'right', fontFamily: "'Courier New', monospace" }} value={display} readOnly />
        </div>
        <div className="calculator-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
          <button className="calc-btn" onClick={clearCalculator} style={{ background: 'rgba(220, 38, 38, 0.8)', gridColumn: 'span 2' }}>Clear</button>
          <button className="calc-btn" onClick={deleteLast}>⌫</button>
          <button className="calc-btn operator" onClick={() => appendToDisplay('/')}>÷</button>
          <button className="calc-btn" onClick={() => appendToDisplay('7')}>7</button>
          <button className="calc-btn" onClick={() => appendToDisplay('8')}>8</button>
          <button className="calc-btn" onClick={() => appendToDisplay('9')}>9</button>
          <button className="calc-btn operator" onClick={() => appendToDisplay('*')}>×</button>
          <button className="calc-btn" onClick={() => appendToDisplay('4')}>4</button>
          <button className="calc-btn" onClick={() => appendToDisplay('5')}>5</button>
          <button className="calc-btn" onClick={() => appendToDisplay('6')}>6</button>
          <button className="calc-btn operator" onClick={() => appendToDisplay('-')}>−</button>
          <button className="calc-btn" onClick={() => appendToDisplay('1')}>1</button>
          <button className="calc-btn" onClick={() => appendToDisplay('2')}>2</button>
          <button className="calc-btn" onClick={() => appendToDisplay('3')}>3</button>
          <button className="calc-btn operator" onClick={() => appendToDisplay('+')}>+</button>
          <button className="calc-btn" onClick={() => appendToDisplay('0')} style={{ gridColumn: 'span 2' }}>0</button>
          <button className="calc-btn" onClick={() => appendToDisplay('.')}>.</button>
          <button className="calc-btn operator" onClick={calculateResult} style={{ background: 'rgba(34, 197, 94, 0.8)' }}>=</button>
          <button className="calc-btn scientific" onClick={() => appendToDisplay('Math.sin(')}>sin</button>
          <button className="calc-btn scientific" onClick={() => appendToDisplay('Math.cos(')}>cos</button>
          <button className="calc-btn scientific" onClick={() => appendToDisplay('Math.tan(')}>tan</button>
          <button className="calc-btn scientific" onClick={() => appendToDisplay('Math.log(')}>ln</button>
          <button className="calc-btn scientific" onClick={() => appendToDisplay('Math.sqrt(')}>√</button>
          <button className="calc-btn scientific" onClick={() => appendToDisplay('**')}>x^y</button>
          <button className="calc-btn scientific" onClick={() => appendToDisplay('Math.PI')}>π</button>
          <button className="calc-btn scientific" onClick={() => appendToDisplay('Math.E')}>e</button>
        </div>
        <div className="calculator-history" style={{ marginTop: '20px' }}>
          <h4 style={{ color: 'var(--text-light)', marginBottom: '10px' }}>History</h4>
          <div id="calcHistory" style={{ maxHeight: '150px', overflowY: 'auto', background: 'rgba(0, 0, 0, 0.3)', padding: '10px', borderRadius: '8px', fontFamily: "'Courier New', monospace", fontSize: '0.9rem' }}>
            {history.map((item, index) => (
              <div key={index} className="history-item">
                <span className="history-expression">{item.expression}</span>
                <span className="history-result">= {item.result}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
