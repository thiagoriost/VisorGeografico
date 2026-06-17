import "./MobileWidgetsMenu.css";

import { useId } from "react";

/**
 * Funcionalidades disponibles dentro del menu movil.
 */
export type MobileWidgetId = "basemap" | "scaleBar" | "scaleControl" | "layerManager" | "mapStatusBar" | "" /* valor para ninguna funcionalidad activa */;

/**
 * Definicion de un item mostrable en el menu movil.
 */
type MobileWidgetOption = {
  /** Identificador unico de la funcionalidad. */
  id: MobileWidgetId;
  /** Etiqueta visible para el usuario. */
  label: string;
};

/**
 * Props del menu movil de funcionalidades.
 */
type MobileWidgetsMenuProps = {
  /** Funcionalidad actualmente activa; null cuando ninguna esta desplegada. */
  activeWidget: MobileWidgetId | null;
  /** Callback para cambiar la funcionalidad activa. */
  onSelectWidget: (widget: MobileWidgetId) => void;
  /** Determina si el menu se muestra expandido. */
  isExpanded: boolean;
  /** Callback para alternar estado expandido/colapsado. */
  onToggleMenu: () => void;
};

const MENU_OPTIONS: MobileWidgetOption[] = [
  { id: "basemap", label: "Mapas base" },
  { id: "scaleBar", label: "Barra escala" },
  { id: "scaleControl", label: "Escala" },
  { id: "layerManager", label: "Capas" },
  { id: "mapStatusBar", label: "Barra de estado" },
];

/**
 * Menu flotante para movil que controla que solo una funcionalidad este abierta a la vez.
 */
export default function MobileWidgetsMenu({
  activeWidget,
  onSelectWidget,
  isExpanded,
  onToggleMenu,
}: MobileWidgetsMenuProps) {
  const menuListId = useId();

  /**
   * Activa la herramienta elegida y vuelve el menu a modo boton flotante.
   */
  const handleSelectOption = (widget: MobileWidgetId) => {
    onSelectWidget(widget);
  };

  return (
    <section
      className={`mobile-widgets-menu${isExpanded ? " is-expanded" : ""}`}
      aria-label="Menu de funcionalidades del mapa"
    >
      <button
        type="button"
        className={`mobile-widgets-menu__toggle${isExpanded ? " is-expanded" : ""}`}
        aria-label={isExpanded ? "Cerrar menu de funcionalidades" : "Abrir menu de funcionalidades"}
        aria-expanded={isExpanded}
        aria-controls={menuListId}
        onClick={onToggleMenu}
      >
        <span className="mobile-widgets-menu__toggle-bar" aria-hidden="true" />
        <span className="mobile-widgets-menu__toggle-bar" aria-hidden="true" />
        <span className="mobile-widgets-menu__toggle-bar" aria-hidden="true" />
      </button>

      <div
        id={menuListId}
        className={`mobile-widgets-menu__content${isExpanded ? " is-visible" : ""}`}
      >
        <p className="mobile-widgets-menu__title">Menu</p>

        <div className="mobile-widgets-menu__list" role="tablist" aria-label="Herramientas disponibles">
        {MENU_OPTIONS.map((option) => {
          const isActive = activeWidget === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`mobile-widgets-menu__item${isActive ? " is-active" : ""}`}
              onClick={() => handleSelectOption(option.id)}
            >
              {option.label}
            </button>
          );
        })}
        </div>
      </div>
    </section>
  );
}
