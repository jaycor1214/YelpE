import React, { useState } from "react";

//Initial state of global statae
//Add things here first when adding
const initialState = {
  Login: [],
  Role: -1,
  SearchRequest: [],
  SearchIsLoading: false,
  Search: [],
  CurrentBusiness: [],
  ReviewsIsLoading: false,
  Reviews: [],
};

//Setup context to be used
export const stateContext = React.createContext();

const GlobalState = ({ children }) => {
  const [globalState, setglobalState] = useState(initialState);

  return (
    <stateContext.Provider value={[globalState, setglobalState]}>
      {children}
    </stateContext.Provider>
  );
};

export default GlobalState;
