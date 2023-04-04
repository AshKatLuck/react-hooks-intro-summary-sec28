import React, { useCallback, useEffect, useMemo, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ig) => ig.id !== action.id);
    default:
      throw new Error("Should not get here");
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    data,
    error,
    sendRequest,
    reqextra,
    reqidentifier,
    clear,
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqidentifier === "DELETE_INGREDIENT") {
      dispatch({ type: "DELETE", id: reqextra });
    } else if (!isLoading && !error && reqidentifier === "ADD_INGREDIENT") {
      dispatch({
        type: "ADD",
        ingredient: { id: data.name, ...reqextra },
      });
    }
  }, [data, reqextra, reqidentifier, error, isLoading]);

  const onAddIngredientHandler = useCallback(
    (ingredient) => {
      // console.log(ingredient);
      sendRequest(
        "https://react-hooks-demo-91469-default-rtdb.firebaseio.com/ingredient.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const onRemoveIngredient = useCallback(
    (id) => {
      sendRequest(
        `https://react-hooks-demo-91469-default-rtdb.firebaseio.com/ingredient/${id}.json`,
        "DELETE",
        null,
        id,
        "DELETE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const onLoadFilteredIngredients = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const clearErrorModal = useCallback(() => {
    clear();
  }, [clear]);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={onRemoveIngredient}
      />
    );
  }, [userIngredients, onRemoveIngredient]);
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearErrorModal}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={onAddIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={onLoadFilteredIngredients} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
