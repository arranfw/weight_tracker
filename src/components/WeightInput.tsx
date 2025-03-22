import {
  faCaretDown,
  faCaretUp,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import VerificationInput from "react-verification-input";

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

interface WeightInputProps {
  defaultValue: string;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export const WeightInput: React.FC<WeightInputProps> = ({
  defaultValue,
  placeholder,
  className,
  ariaLabel,
}) => {
  const [_value, setValue] = useState("");
  const value = _value.replace(".", "").padStart(4, "0");
  const numericValue = Number.parseFloat(Number.parseFloat(_value).toFixed(1));

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
          <AdjustmentButton type="up" onClick={() => incrementDigit(1000)} />
          <AdjustmentButton type="up" onClick={() => incrementDigit(100)} />
          <AdjustmentButton type="up" onClick={() => incrementDigit(10)} />
          <AdjustmentButton type="up" onClick={() => incrementDigit(1)} />
        </div>
        <span className="absolute top-[55%] leading-[0] left-3/4 text-[24px] select-none">
          .
        </span>
        <VerificationInput
          autoFocus
          length={4}
          value={value.replace(".", "")}
          onChange={setValue}
          validChars="0123456789"
          classNames={{
            container: "border w-full! rounded",
            character: "border-none! bg-transparent!",
          }}
          inputProps={{
            name: "weight",
          }}
        />

        <div className="flex gap-1">
          <AdjustmentButton type="down" onClick={() => incrementDigit(-1000)} />
          <AdjustmentButton type="down" onClick={() => incrementDigit(-100)} />
          <AdjustmentButton type="down" onClick={() => incrementDigit(-10)} />
          <AdjustmentButton type="down" onClick={() => incrementDigit(-1)} />
        </div>
      </div>
    </div>
  );
};
