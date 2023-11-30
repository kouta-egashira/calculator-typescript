type ClearButtonProps = {
  leftOperand: String;
  rightOperand: string;
  operator: string;
  handleClear: () => void;
};

export default function ClearButton({leftOperand, rightOperand, operator, handleClear}: ClearButtonProps) {
  // 不等しい場合にtrueを返す
  const isDisabled: boolean = !(leftOperand !== '' || rightOperand !== '' || operator === '-' || operator === '*' || operator === '/');

  return (
    <button onClick={handleClear} disabled={isDisabled}>
      式クリア
    </button>
  );
}