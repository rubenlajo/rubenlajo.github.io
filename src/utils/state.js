const cloneState = (state) => {
  return { ...state };
};
const extendState = (state, extend) => {
  return { ...state, ...extend };
};

const composeState = (baseState, extension, pipes = []) => {
  let composedState = cloneState(baseState);

  pipes.forEach((pipe) => {
    composedState = pipe(composedState);
  });

  return extendState(composedState, extension);
};

export { composeState };
