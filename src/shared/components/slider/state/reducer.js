import actionTypes from "./actionTypes";

function reducer(state, { type, payload }) {
  switch (type) {
    case actionTypes.INIT:
      return {
        ...state,
        slideWidth: payload.slideWidth,
        currentSlide: payload.currentSlide,
        sliderListLeft: payload.sliderListLeft,
        sliderListWidth: payload.sliderListWidth,
        numSlides: payload.numSlides,
      };

    case actionTypes.GO_TO_SLIDE:
      return {
        ...state,
        currentSlide: payload,
        sliderListLeft: -1 * payload * state.slideWidth,
      };

    case actionTypes.START_DRAG:
      return {
        ...state,
        // dragging: true,
        startDragPoint: payload,
        initialDragPoint: payload,
      };

    case actionTypes.SET_DRAG: {
      const diference = payload.x - state.startDragPoint.x;

      const left = state.sliderListLeft + diference;

      return {
        ...state,
        x: payload.x,
        sliderListLeft: left,
        startDragPoint: payload,
        dragging: true,
        draggingDirection: diference > 0 ? "right" : "left",
      };
    }

    case actionTypes.END_DRAG: {
      const diference = state.dragging ? state.initialDragPoint.x - state.x : 0;

      let activeSlide = state.currentSlide;
      if (diference > 0 && Math.abs(diference) > state.slideWidth / 5 && state.currentSlide < state.numSlides - 1) {
        activeSlide += 1;
      } else if (diference < 0 && Math.abs(diference) > state.slideWidth / 5 && state.currentSlide > 0) {
        activeSlide -= 1;
      }

      return {
        ...state,
        dragging: false,
        sliderListLeft: activeSlide * state.slideWidth * -1,
        currentSlide: activeSlide,
        x: 0,
        startDragPoint: 0,
        endDragPoint: 0,
        draggingDirection: "",
      };
    }

    case actionTypes.NEXT_SLIDE:
      return {
        ...state,
        currentSlide: state.currentSlide + 1,
        sliderListLeft: -1 * (state.currentSlide + 1) * state.slideWidth,
      };

    case actionTypes.PREV_SLIDE:
      return {
        ...state,
        currentSlide: state.currentSlide - 1,
        sliderListLeft: -1 * (state.currentSlide - 1) * state.slideWidth,
      };

    default:
      throw new Error("Unknown action");
  }
}

export default reducer;
