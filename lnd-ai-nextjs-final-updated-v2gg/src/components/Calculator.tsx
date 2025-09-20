"use client";
import { useEffect } from "react";
import React, { useState, useEffect } from 'react';

interface CalculatorHistory {
  expression: string;
  result: string;
  timestamp: number;
}

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<CalculatorHistory[]>([]);
  const [isScientific, setIsScientific] = useState(false);
  const [memory, setMemory] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const buttons = [
    { text: 'C', type: 'clear', className: 'btn-secondary col-span-2' },
    { text: 'Â±', type: 'operator', className: 'btn-secondary' },
    { text: 'Ã·', type: 'operator', className: 'btn-accent' },
    { text: '7', type: 'number', className: 'btn-number' },
    { text: '8', type: 'number', className: 'btn-number' },
    { text: '9', type: 'number', className: 'btn-number' },
    { text: 'Ã—', type: 'operator', className: 'btn-accent' },
    { text: '4', type: 'number', className: 'btn-number' },
    { text: '5', type: 'number', className: 'btn-number' },
    { text: '6', type: 'number', className: 'btn-number' },
    { text: 'âˆ’', type: 'operator', className: 'btn-accent' },
    { text: '1', type: 'number', className: 'btn-number' },
    { text: '2', type: 'number', className: 'btn-number' },
    { text: '3', type: 'number', className: 'btn-number' },
    { text: '+', type: 'operator', className: 'btn-accent' },
    { text: '0', type: 'number', className: 'btn-number col-span-2' },
    { text: '.', type: 'operator', className: 'btn-number' },
    { text: '=', type: 'equals', className: 'btn-primary' },
  ];

  const scientificButtons = [
    { text: 'sin', type: 'function', className: 'btn-secondary text-xs' },
    { text: 'cos', type: 'function', className: 'btn-secondary text-xs' },
    { text: 'tan', type: 'function', className: 'btn-secondary text-xs' },
    { text: 'log', type: 'function', className: 'btn-secondary text-xs' },
    { text: 'ln', type: 'function', className: 'btn-secondary text-xs' },
    { text: 'xÂ²', type: 'function', className: 'btn-secondary text-xs' },
    { text: 'âˆš', type: 'function', className: 'btn-secondary text-xs' },
    { text: 'Ï€', type: 'constant', className: 'btn-secondary text-xs' },
  ];

  const handleButtonClick = (button: { text: string; type: string }) => {
    switch (button.type) {
      case 'clear':
        setDisplay('0');
        setExpression('');
        break;
      case 'number':
        if (display === '0') {
          setDisplay(button.text);
          setExpression(button.text);
        } else {
          setDisplay(prev => prev + button.text);
          setExpression(prev => prev + button.text);
        }
        break;
      case 'operator':
        if (button.text === 'Â±') {
          const newValue = parseFloat(display) * -1;
          setDisplay(newValue.toString());
          setExpression(prev => prev.replace(/[^+\-Ã—Ã·]*$/, newValue.toString()));
        } else {
          setDisplay('0');
          setExpression(prev => prev + ` ${button.text} `);
        }
        break;
      case 'function':
        handleFunction(button.text);
        break;
      case 'constant':
        if (button.text === 'Ï€') {
          setDisplay(Math.PI.toString());
          setExpression(prev => prev + Math.PI.toString());
        }
        break;
      case 'equals':
        calculate();
        break;
    }
  };

  const handleFunction = (func: string) => {
    const value = parseFloat(display);
    let result = 0;

    switch (func) {
      case 'sin':
        result = Math.sin(value * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(value * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'xÂ²':
        result = value * value;
        break;
      case 'âˆš':
        result = Math.sqrt(value);
        break;
    }

    setDisplay(result.toString());
    setExpression(prev => `${func}(${value}) = ${result}`);
  };

  const calculate = () => {
    try {
      // Replace symbols for calculation
      let calcExpression = expression
        .replace(/Ã—/g, '*')
        .replace(/Ã·/g, '/')
        .replace(/âˆ’/g, '-');

      // Simple evaluation (in production, use a proper math parser)
      const result = Function(`"use strict"; return (${calcExpression})`)();
      
      const historyItem: CalculatorHistory = {
        expression: expression,
        result: result.toString(),
        timestamp: Date.now()
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 19)]); // Keep last 20
      setDisplay(result.toString());
      setExpression(result.toString());
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    const key = e.key;
    if (/[0-9]/.test(key)) {
      handleButtonClick({ text: key, type: 'number' });
    } else if (['+', '-', '*', '/'].includes(key)) {
      const symbol = key === '*' ? 'Ã—' : key === '/' ? 'Ã·' : key === '-' ? 'âˆ’' : key;
      handleButtonClick({ text: symbol, type: 'operator' });
    } else if (key === 'Enter' || key === '=') {
      handleButtonClick({ text: '=', type: 'equals' });
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      handleButtonClick({ text: 'C', type: 'clear' });
    } else if (key === '.') {
      handleButtonClick({ text: '.', type: 'operator' });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">ðŸ”¢ Smart Calculator</h1>
          <p className="text-xl text-gray-400">
            Advanced calculator with scientific functions and calculation history
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="card p-6">
            {/* Mode Toggle */}
            <div className="flex mb-6">
              <button
                onClick={() => setIsScientific(false)}
                className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-all duration-300 ${
                  !isScientific ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setIsScientific(true)}
                className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-all duration-300 ${
                  isScientific ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                Scientific
              </button>
            </div>

            {/* Display */}
            <div className="bg-black/30 rounded-xl p-6 mb-6">
              <div className="text-right">
                <div className="text-sm text-gray-500 h-5 overflow-hidden">
                  {expression}
                </div>
                <div className="text-3xl font-mono font-bold text-white mt-2 break-all">
                  {display}
                </div>
              </div>
            </div>

            {/* Scientific Functions */}
            {isScientific && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {scientificButtons.map((button) => (
                  <button
                    key={button.text}
                    onClick={() => handleButtonClick(button)}
                    className={`${button.className} h-12 text-white font-medium hover:scale-105 transition-all duration-200`}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
            )}

            {/* Main Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {buttons.map((button, index) => (
                <button
                  key={`${button.text}-${index}`}
                  onClick={() => handleButtonClick(button)}
                  className={`${button.className} h-14 text-white font-semibold text-lg hover:scale-105 transition-all duration-200 ${
                    button.text === '0' ? 'col-span-2' : ''
                  } ${button.text === 'C' ? 'col-span-2' : ''}`}
                >
                  {button.text}
                </button>
              ))}
            </div>

            {/* Memory & History Controls */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setMemory(parseFloat(display))}
                className="btn-secondary text-sm flex-1"
                title="Memory Store"
              >
                MS
              </button>
              <button
                onClick={() => {
                  setDisplay(memory.toString());
                  setExpression(memory.toString());
                }}
                className="btn-secondary text-sm flex-1"
                title="Memory Recall"
              >
                MR
              </button>
              <button
                onClick={() => setMemory(0)}
                className="btn-secondary text-sm flex-1"
                title="Memory Clear"
              >
                MC
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="btn-secondary text-sm flex-1"
                title="Show History"
              >
                ðŸ“œ
              </button>
            </div>
          </div>

          {/* History Panel */}
          {showHistory && history.length > 0 && (
            <div className="card p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Calculation History</h3>
                <button
                  onClick={() => setHistory([])}
                  className="btn-secondary text-sm"
                >
                  Clear History
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                    onClick={() => {
                      setDisplay(item.result);
                      setExpression(item.result);
                    }}
                  >
                    <div className="text-sm">
                      <div className="text-gray-400">{item.expression}</div>
                      <div className="text-white font-semibold">= {item.result}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;