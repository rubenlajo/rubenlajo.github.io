import React from "react";
import PropTypes from "prop-types";
import { Draggable, Droppable } from "react-drag-and-drop";
import SortButtons from "./sort-buttons";

const propTypes = {
  id: PropTypes.string,
  onDrop: PropTypes.func,
  onSort: PropTypes.func,
  data: PropTypes.string,
  index: PropTypes.number,
  first: PropTypes.bool,
  last: PropTypes.bool,
  ref: PropTypes.string,
};

const Sortable = props => (
  <Droppable types={[`list-${props.id}`]} onDrop={props.onDrop}>
    <Draggable className="draggable-element" type={`list-${props.id}`} data={JSON.stringify({ index: props.index })}>
      <SortButtons
        first={props.first}
        last={props.last}
        up={() => {
          const indexarr = [];
          indexarr[`list-${props.id}`] = JSON.stringify({ index: props.index });
          props.onSort(indexarr, props.index - 1);
        }}
        down={() => {
          const indexarr = [];
          indexarr[`list-${props.id}`] = JSON.stringify({ index: props.index });
          props.onSort(indexarr, props.index + 1);
        }}
      />
      <div ref={props.ref} className="sortable-content">
        {props.children}
      </div>
    </Draggable>
  </Droppable>
);

Sortable.propTypes = propTypes;

export default Sortable;
