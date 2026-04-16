import React, { useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  btnStyle: React.CSSProperties;
  hoverStyle: React.CSSProperties;
  disabledStyle: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  tooltip,
  onClick,
  disabled = false,
  btnStyle,
  hoverStyle,
  disabledStyle,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          ...btnStyle,
          ...(hover ? hoverStyle : {}),
          ...(disabled ? disabledStyle : {}),
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </button>

      {hover && (
        <div
          style={{
            position: "absolute",
            left: 50,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "4px 8px",
            fontSize: "11px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default Button;
