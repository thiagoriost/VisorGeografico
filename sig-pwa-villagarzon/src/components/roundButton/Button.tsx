import React from "react";
import "./Button.css";

/**
 * Props del boton redondo reutilizable para controles de mapa.
 */
interface ButtonProps {
  /** Contenido visual del boton (normalmente un icono). */
  children: React.ReactNode;
  /** Texto auxiliar que se muestra como tooltip al interactuar. */
  tooltip: string;
  /** Handler de click del boton. */
  onClick: () => void;
  /** Estado deshabilitado del boton. */
  disabled?: boolean;
  /** Clase extra para el contenedor. */
  wrapperClassName?: string;
  /** Clase extra para el elemento button. */
  buttonClassName?: string;
  /** Clase extra para el tooltip. */
  tooltipClassName?: string;
}

/**
 * Boton con tooltip, desacoplado de estilos inline para consumir el preset global.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  tooltip,
  onClick,
  disabled = false,
  wrapperClassName,
  buttonClassName,
  tooltipClassName,
}) => {
  return (
    <div className={`round-button ${wrapperClassName ?? ""}`.trim()}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`round-button__btn ${buttonClassName ?? ""}`.trim()}
      >
        {children}
      </button>

      <div className={`round-button__tooltip ${tooltipClassName ?? ""}`.trim()}>
        {tooltip}
      </div>
    </div>
  );
};

export default Button;
