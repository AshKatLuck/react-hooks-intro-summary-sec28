import { useReducer, useCallback } from "react";

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        isLoading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...currentHttpState,
        isLoading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return { isLoading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...currentHttpState, error: null };
    default:
      throw new Error("It should not reach here");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null,
  });
  const sendRequest = useCallback(
    (url, method, body, reqextra, reqidentifier) => {
      dispatchHttp({
        type: "SEND",
        identifier: reqidentifier,
      });
      fetch(url, {
        method: method,
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          dispatchHttp({
            type: "RESPONSE",
            responseData: responseData,
            extra: reqextra,
          });
          // dispatch({ type: "DELETE", id: id });//this we will deal later
        })
        .catch((error) => {
          dispatchHttp({ type: "ERROR", errorMessage: error.message });
        });
    },
    []
  );
  return {
    isLoading: httpState.isLoading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqextra: httpState.extra,
    reqidentifier: httpState.identifier,
  };
};

export default useHttp;
