export const progressIncrementPlugin = (store) => {
  /*store.subscribeAction((action, state) => {
    const ignoredActions = [
      RootActions.LOAD_PROGRESS_INCREMENT,
      RootActions.LOAD_PROGRESS_DECREMENT,
      RootActions.LOAD_PROGRESS_COMPLETE,
      RootActions.LOAD_PROGRESS_RESET,
    ];

    if(ignoredActions.indexOf(action.type) === -1 && action.type.includes('LOAD')){
      store.dispatch(RootActions.LOAD_PROGRESS_INCREMENT);
    }
  });*/
};

export default progressIncrementPlugin;