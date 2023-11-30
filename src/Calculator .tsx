import React, { useState } from 'react';
import './App.css';
import ClearButton from './components/ClearButton';
import HistoryDeletion from './components/HistoryDeletion';

// 型定義
type CalculationHistoryItem = {
  expression: string;
  result: number | null;
}

export default function CalculatorApp() {
  const [leftOperand, setLeftOperand] = useState<string>(''); // 左辺
  const [rightOperand, setRightOperand] = useState<string>(''); // 右辺
  const [operator, setOperator] = useState<string>(''); // 演算子
  const [result, setResult] = useState<number | null>(null); // 計算結果
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistoryItem[]> ([]); // 計算履歴
  const [saveHistory, setSaveHistory] = useState<boolean>(false); // 計算履歴を保存するかしないかのチェックボックス
  const [editingOperand, setEditingOperand] = useState<'left' | 'right'>('left'); // 左右入力で選択箇所の状態更新

  // 左辺・右辺の数値が変更されたとき、useStateフックを使用して更新
  const handleOperandChange = (side: 'left' | 'right', value: string) => {
    // 空の場合：左辺に新しい数字を追加
    if (side === 'left') {
      setLeftOperand(value);
    } else {
      setRightOperand(value);
    }
  };

  // 演算子が変更されると、それに応じて演算子がuseStateのフックを使用して更新
  const handleOperatorChange = (value: string) => {
    setOperator(value);
  };

  // 数字ボタンをクリックで左辺または右辺のオペランドに追加され、画面に入力された数式が更新
  const handleNumberClick = (value: string) => {
    // 左辺に現在の値に新しい数字を追加したものを設定
    if (editingOperand === 'left') {
      setLeftOperand((prev) => prev + value);
      // 右辺に現在の値に新しい数字を追加したものを設定
    } else {
      setRightOperand((prev) => prev + value);
    }
  };

  // = ボタンを押したときに呼び出され、入力された数式を計算して結果を表示
  const handleCalculate = () => {
    try {
      const left = parseFloat(leftOperand);
      const right = parseFloat(rightOperand);

      // 左辺・右辺の値が未入力の場合、エラーメッセージを表示
      if (leftOperand === '' || rightOperand === '') {
        setResult(null);
        alert('値を入力してください。');
      }
      // 左辺・右辺の値が数値ではない場合、エラーメッセージの表示
      if(isNaN(left) || isNaN(right)) {
        alert('数値を入力してください');
      }

      // 左辺右辺の値を数値に変換
      if (!isNaN(left) && !isNaN(right)) {
        let calculatedResult: number | null = null;

        // デフォルトの演算子を'+'に設定（初期状態で+が選択されている状態でも=を押すと答えが表示）
        let currentOperator = operator;
        if (operator === '') {
          currentOperator = '+';
        }

        switch (currentOperator) {
          case '+':
            calculatedResult = left + right;
            break;
          case '-':
            calculatedResult = left - right;
            break;
          case '*':
            calculatedResult = left * right;
            break;
          case '/':
            calculatedResult = left / right;
            break;
          default:
            calculatedResult = null;
        }
        setResult(calculatedResult);
        
        // 計算履歴
        if (saveHistory) {
          setCalculationHistory((prevHistory) => [
            ...prevHistory,
            { expression: `${left} ${currentOperator} ${right}`, result: calculatedResult },
          ]);
        }
      } else {
        setResult(null);
      }
      // エラー発生時、null
    } catch (error) {
      setResult(null);
    }
  };

  // 入力された四則演算の計算式のリセット
  const handleClear = () => {
    setLeftOperand('');
    setRightOperand('');
    setOperator('');
    setResult(null);
  };

  // 計算履歴削除
  const handleHistoryClear = () => {
    setCalculationHistory([]);
  }

  // 計算履歴の個別削除
  const handleDeleteHistoryIndividual = (index: number) => {
    const newHistory = [...calculationHistory];
    newHistory.splice(index, 1);
    setCalculationHistory(newHistory);
  }

  // 計算履歴を保存するかどうかを示すチェックボックス
  const handleCheckBoxChange = () => {
    setSaveHistory(!saveHistory);
  }

  return (
    <div className="calculator">
      <div className="container">
        <div className="calculator-buttons">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
            <button key={num} onClick={() => handleNumberClick(num.toString())}>
              {num}
            </button>
          ))}
          <button className='equal' onClick={handleCalculate}>=</button>
        </div>
        {/* 履歴有無チェックボックス */}
        <div className='check-box'>
          <input type="checkbox" checked={saveHistory} onChange={handleCheckBoxChange} />
          履歴登録
        </div>
      </div>

      <div className='computation-container'>
        <div className='flex_computation-item'>
          式
          <input
            className='left-text'
            type="text"
            value={leftOperand}
            onChange={(e) => handleOperandChange('left', e.target.value)}
            onFocus={() => setEditingOperand('left')}
          />
          <select className='operator' value={operator} onChange={(e) => handleOperatorChange(e.target.value)}>
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
          </select>
          <input
            className='right-text'
            type="text"
            value={rightOperand}
            onChange={(e) => handleOperandChange('right', e.target.value)}
            onFocus={() => setEditingOperand('right')}
          />
        </div>
        {/* 計算結果値 */}
        <div className='flex_computation-answer'>
          答え{result !== null && <span>  {result}</span>}
        </div>
      </div>
      <div className='clear-button'>
        {/* 式クリアボタンコンポーネント */}
        <ClearButton
          leftOperand={leftOperand}
          rightOperand={rightOperand}
          operator={operator}
          handleClear={handleClear}
        />
      </div>
      {/* 計算履歴 */}
      <div className="history">
        <p>計算履歴</p>
        <table className='history-table'>
          <thead>
            <tr>
              <th>式</th>
              <th>答え</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {calculationHistory.map((item, index) => (
              <tr key={index}>
                <td>{item.expression}</td>
                <td>{item.result !== null ? item.result : 'Error'}</td>
                <td><button onClick={() => handleDeleteHistoryIndividual(index)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='history-delete'>
          {/* 計算履歴削除ボタンコンポーネント */}
          <HistoryDeletion 
            handleHistoryClear={handleHistoryClear} 
            calculationHistory={calculationHistory} 
          />
        </div>
      </div>
    </div>
  );
};
