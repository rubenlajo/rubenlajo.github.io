import React, { useRef, useState, useEffect, Children, useReducer } from "react";

import { Icon } from "lib-frontsga";

import reducer from "./state/reducer";
import initialState from "./state/initial-state";
import actionTypes from "./state/actionTypes";
import Slide from "./components/slide";
import Pagination from "./components/pagination";
import Arrow from "./components/arrow";

import "./styles.css";

function Slider(props) {
  const { className, children, dots, arrows = false, initialSlide = 0, onSlide = () => {}, onClose } = props;

  const [state, dispatch] = useReducer(reducer, initialState);

  const [sliderStyle, setSliderStyle] = useState({overflowY: "auto"});

  const sliderRef = useRef(null);

  const numSlides = Children.count(children);

  const getWidth = () => sliderRef.current.clientWidth;

  useEffect(() => {
    const slideWidth = getWidth();
    dispatch({
      type: actionTypes.INIT,
      payload: {
        slideWidth: slideWidth,
        currentSlide: initialSlide,
        sliderListLeft: -1 * initialSlide * slideWidth,
        sliderListWidth: slideWidth * numSlides,
        numSlides: numSlides,
      },
    });
  }, []);

  useEffect(() => {
    onSlide(state.currentSlide);
  }, [state.currentSlide]);

  const getCoords = (e) => {
    if (e.type.includes("drag")) {
      return { x: e.clientX, y: e.clientY };
    }

    const touch = e.targetTouches[0];
    return { x: touch.clientX, y: touch.clientY };
  };

  const onTouchStart = (e) => {
    const coords = getCoords(e);
    dispatch({ type: actionTypes.START_DRAG, payload: coords });
  };

  const onTouchMove = (e) => {
    e.stopPropagation();
    const coords = getCoords(e);

    const varX = Math.abs(state.startDragPoint.x - coords.x);
    const varY = Math.abs(state.startDragPoint.y - coords.y);

    // Si nos estamos moviendo en horizontal, bloqueamos el scroll para que no haya efectos raros
    if (varX > varY) {
      setSliderStyle({overflowY : "hidden"});
      dispatch({ type: actionTypes.SET_DRAG, payload: coords });
    }
  };

  const onTouchEnd = () => {
    setSliderStyle({overflowY : "auto"});
    dispatch({ type: actionTypes.END_DRAG });
  };

  const sliderListStyles = {
    position: "absolute",
    left: `${state.sliderListLeft}px`,
    width: `${state.sliderListWidth}px`,
    height: "100%",
  };

  return (
    <div
      className={`slider-container ${className || ""} ${state.dragging ? "dragging" : "not-dragging"}`}
      ref={sliderRef}
    >
      {onClose && <Icon className="close-icon" icon="sga-icon-times" onClick={() => onClose()} />}
      <ul
        className="slider-list"
        style={sliderListStyles}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children.map((slide, slideIndex) => (
          <Slide key={slideIndex} active={state.currentSlide === slideIndex} sliderStyle={sliderStyle}>
            {slide}
          </Slide>
        ))}
      </ul>
      {dots && (
        <Pagination
          numSlides={state.numSlides}
          active={state.currentSlide}
          onGoSlide={(pos) => dispatch({ type: actionTypes.GO_TO_SLIDE, payload: pos })}
        />
      )}
      {arrows ? (
        <>
          <Arrow
            position="right"
            onClick={() => dispatch({ type: actionTypes.NEXT_SLIDE })}
            disabled={state.currentSlide === state.numSlides - 1}
          />
          <Arrow
            position="left"
            onClick={() => dispatch({ type: actionTypes.PREV_SLIDE })}
            disabled={state.currentSlide === 0}
          />
        </>
      ) : null}
    </div>
  );
}

export default Slider;
