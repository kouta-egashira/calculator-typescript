type HistoryDeletionProps = {
  handleHistoryClear: () => void,
  calculationHistory: CalculationHistoryItem[];
};

type CalculationHistoryItem = {
    expression: string;
    result: number | null;
}

export default function HistoryDeletion({handleHistoryClear, calculationHistory}: HistoryDeletionProps) {
  return (
    // データが存在しないときはボタンを非活性
    <button onClick={handleHistoryClear} disabled={calculationHistory.length === 0}> 
      履歴削除
    </button>
  );
};