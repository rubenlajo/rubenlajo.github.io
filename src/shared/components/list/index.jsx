import React, { Component } from "react";
import PropTypes from "prop-types";
import { T } from "amiga-core/components/i18n";
import CustomScroll from "./components/customscroll/";
import Sortable from "./components/sortable";
import "./styles.css";

/**
 *  Componente LIST
 *
 *  Componente que permite crear una lista de elementos y representarlos mediante un
 *  componente ListItem que se puede pasar como prop
 *
 *  Dependencias: Para poder utilizar las opciones de ordenación es necesario instalar
 *  las siguientes dependencias:
 *   - react-drag-and-drop
 *   - react-custom-scrollbars
 *
 *  Comando de instalación:
 *      ```
 *        npm install react-drag-and-drop react-custom-scrollbars --save
 *    	```
 */

const propTypes = {
  /**
   * Clase css adicional del componente
   */
  className: PropTypes.string,
  /**
   * Array de elementos a listar
   */
  children: PropTypes.any,
  /**
   * Componente react (o funcion) que se encargará de renderizar cada item de la lista. Si no
   * se pasa se utilizará uno por defecto que espera que los items del array sean un unico valor
   * plano. Por ejemplo: const items = ["Uno", "dos", "tres"]
   */
  ListItem: PropTypes.any,
  /**
   * Indentificador del elemento seleccionado (para que se represente seleccionado)
   */
  selected: PropTypes.number,
  /**
   * Función se llama con el identificador del elemento seleccionado cuando se selecciona uno
   */
  setSelected: PropTypes.func,

  /**
   * funcion que habilita la opción de eliminar un item del listado
   */
  onRemove: PropTypes.func,
  /**
   * Props adicionales para pasar a cada item de la lista
   */
  itemProps: PropTypes.object,
  /**
   * Array de cabeceras para que la lista tenga unas cabeceras al estilo tabla
   */
  header: PropTypes.array,
  /**
   *
   */
  columnConfig: PropTypes.array,
  /**
   * Numero de elementos a mostrar en la lista. Si el children.length es mayor, se
   * mostrará un botón de "Cargar más..." para hacer la petición de onLoadMore() cada vez
   * hasta llegar al total
   */
  numElms: PropTypes.number,
  /**
   * Nombre del campo identificador de cada elemento de la lista. Por defecto es "id"
   */
  identifier: PropTypes.string,
  /**
   * Booleano que indica que hay que ocultar la lista si no hay datos en vez de mostrar el mensaje
   * de "No hay elementos en la lista" o lo que esté configurado en la prop "emptyMessage"
   */
  hideIfEmpty: PropTypes.bool,
  /**
   * Función que se llamará si está activada la paginación con numElms y hay mas datos que los que se
   * muestran
   */
  onLoadMore: PropTypes.func,
  /**
   * Booleano que indica si se utiliza custom scroll o no
   */
  scrollable: PropTypes.bool,
  /**
   * Booleano que indica si se puede ordenar elementos con drag&drop
   */
  sortable: PropTypes.bool,
  /**
   * Función que es llamada cuando se hace una operación de ordenación. Recibe el listado ordenado
   */
  onSort: PropTypes.func,
  /**
   * Mensaje para cuando la prop children es un array vacío
   */
  emptyMessage: PropTypes.element,
};

/**
 * Componente que renderiza items simples
 * @param {} param0
 */
const SimpleListItem = ({ item, selected, setSelected, onRemove, identifier, ref }) => (
  <li ref={ref} selected={item[identifier || "id"] === selected} setSelected={setSelected}>
    {item}
    {typeof onRemove === "function" ? <span onClick={() => onRemove()}>eliminar</span> : null}
  </li>
);

SimpleListItem.propTypes = {
  item: PropTypes.element,
  index: PropTypes.number,
  selected: PropTypes.number,
  setSelected: PropTypes.func,
  onRemove: PropTypes.func,
  identifier: PropTypes.string,
  ref: PropTypes.string,
};

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: new Date().getTime(),
      showAll: typeof props.numElms === "undefined",
      offsetTop: 0,
    };

    this.firstLoad = true;

    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {
    this.firstLoad = true;
  }

  componentDidUpdate() {
    const { children, selected, identifier } = this.props;
    const { id } = this.state;

    if (this.firstLoad && children.length && selected) {
      const selectedItemIndex = children.findIndex((item) => item[identifier || "id"] === selected);
      // eslint-disable-next-line react/no-string-refs
      const itemRef = this.refs[`${id}-${selected}`];

      if (itemRef) {
        const itemHeight = itemRef.offsetHeight;
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ offsetTop: selectedItemIndex * itemHeight });
        this.firstLoad = false;
      }
    }
  }

  handleDrop(data, index) {
    const { children, onSort } = this.props;
    const jsonData = JSON.parse(data[`list-${this.state.id}`]);

    const postOrg = jsonData.index;
    const postDest = index;
    const origEl = children[postOrg];
    const destEl = children[postDest];
    const sortedList = [...children];
    sortedList[postDest] = origEl;
    sortedList[postOrg] = destEl;
    onSort(sortedList);
  }

  render() {
    const {
      ListItem,
      children,
      selected,
      setSelected,
      className,
      onRemove,
      itemProps,
      header,
      columnConfig,
      numElms,
      identifier,
      hideIfEmpty,
      onLoadMore,
      scrollable,
      sortable,
      emptyMessage,
    } = this.props;

    const { id, showAll } = this.state;

    let listItem = null;
    const listContent = (
      <ul className={`list-ul ${className || ""}`}>
        {header ? (
          <li className="header">
            {header.map((h, i) => (
              <span key={i} style={columnConfig ? columnConfig[i] : null}>
                {h}
              </span>
            ))}
          </li>
        ) : null}
        {children &&
          children
            .filter((el, i) => showAll || numElms > i)
            .map((item, i) => {
              const itemRefName = `${id}-${item[identifier || "id"]}`;
              if (ListItem) {
                listItem = (
                  <div ref={itemRefName}>
                    <ListItem
                      key={item[identifier || "id"] || `${i}`}
                      index={i}
                      item={item}
                      {...item}
                      {...itemProps}
                      columnConfig={columnConfig}
                      selected={selected ? item[identifier || "id"] === selected : false}
                      setSelected={() => setSelected(item)}
                      onRemove={onRemove ? () => onRemove(i) : null}
                    />
                  </div>
                );
              } else {
                listItem = (
                  <SimpleListItem
                    key={item[identifier || "id"] || `${i}`}
                    selected={selected ? item[identifier || "id"] === selected : false}
                    index={i}
                    item={item}
                    columnConfig={columnConfig}
                    setSelected={() => setSelected(item)}
                    onRemove={onRemove ? () => onRemove(i) : null}
                    ref={itemRefName}
                  />
                );
              }
              if (sortable) {
                const itemRefName = `${id}-${item[identifier || "id"]}`;
                return (
                  <Sortable
                    key={item[identifier || "id"] || `${i}`}
                    id={`${id}`}
                    onDrop={(data) => this.handleDrop(data, i)}
                    onSort={this.handleDrop}
                    index={i}
                    first={i === 0}
                    last={children.length - 1 === i}
                    ref={itemRefName}
                  >
                    {listItem}
                  </Sortable>
                );
              }
              return listItem;
            })}

        {children && children.length > 0 && typeof numElms !== "undefined" && !showAll ? (
          <li className="list-item show-previous">
            <a onClick={() => this.setState({ showAll: true })}>
              <T id="shared.list.show-previous-versions" />
            </a>
          </li>
        ) : null}
        {!children || (children && children.length === 0 && !hideIfEmpty) ? (
          <li className="no-items">{emptyMessage || <T id="shared.list.no-elements" />}</li>
        ) : null}
      </ul>
    );

    return scrollable ? (
      <CustomScroll offsetTop={this.state.offsetTop} scrollBottomTrigger={onLoadMore}>
        {listContent}
      </CustomScroll>
    ) : (
      listContent
    );
  }
}

List.propTypes = propTypes;

export default List;
