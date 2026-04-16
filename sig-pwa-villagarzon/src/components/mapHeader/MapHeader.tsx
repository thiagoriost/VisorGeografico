import React from "react";

interface Props {
  title: string;
  subtitle?: string;
  logo?: string;
}

const MapHeader: React.FC<Props> = ({ title, subtitle, logo }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 14px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.4)"
      }}
    >
      {logo && (
        <img
          src={logo}
          alt="logo"
          style={{
            height: "38px",
            width: "auto"
          }}
        />
      )}

      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: "15px",
            color: "#1f2937",
            lineHeight: "18px"
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280"
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapHeader;