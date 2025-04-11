import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface DigitBoxProps {
  onClick: () => void;
  type: "up" | "down";
}

function AdjustmentButton({ onClick, type }: DigitBoxProps) {
  return (
    <button
      type="button"
      className="text-xl font-bold text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-t-sm transition-colors"
      onClick={onClick}
      aria-label={`Adjust ${type}`}
    >
      <FontAwesomeIcon
        icon={type === "up" ? faChevronUp : faChevronDown}
        fixedWidth
        fontSize={24}
      />
    </button>
  );
}

interface DigitProps {
  digit: string;
  adjustment: number;
  onAdjustment: (adjustment: number) => void;
}

function Digit({ digit, adjustment, onAdjustment }: DigitProps) {
  return (
    <div className="flex flex-col items-center text-4xl">
      <AdjustmentButton type="up" onClick={() => onAdjustment(adjustment)} />
      {digit}
      <AdjustmentButton type="down" onClick={() => onAdjustment(-adjustment)} />
    </div>
  );
}

interface WeightInputProps {
  defaultValue: string;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export const WeightInput: React.FC<WeightInputProps> = ({ defaultValue }) => {
  const [_value, setValue] = useState("");
  const value = _value.replace(".", "").padStart(4, "0");

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const incrementDigit = (increment: number) => {
    const newValue = parseFloat(value) + increment;
    if (newValue > 9999 || newValue < 0) {
      return value;
    }
    setValue(newValue.toString());
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col items-center relative">
        <div className="flex gap-1">
          <Digit
            adjustment={1000}
            digit={value.replace(".", "")[0]}
            onAdjustment={incrementDigit}
          />
          <Digit
            adjustment={100}
            digit={value.replace(".", "")[1]}
            onAdjustment={incrementDigit}
          />
          <Digit
            adjustment={10}
            digit={value.replace(".", "")[2]}
            onAdjustment={incrementDigit}
          />
          <Digit
            adjustment={1}
            digit={value.replace(".", "")[3]}
            onAdjustment={incrementDigit}
          />
        </div>
        <span className="absolute top-[55%] leading-[0] left-3/4 text-[24px] select-none">
          .
        </span>
      </div>
    </div>
  );
};
