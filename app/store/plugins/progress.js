import store from "@/store";

export const progressIncrementPlugin = (store) => {
  store.subscribeAction((action, state) => {
    if(action.type.includes('load')){
      store.dispatch("progressEvent");
    }
  });
};

export default progressIncrementPlugin;