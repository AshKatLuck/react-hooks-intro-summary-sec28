import React, { useCallback, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { isLoading: true, error: null };
    case "RESPONSE":
      return { ...currentHttpState, isLoading: false };
    case "ERROR":
      return { isLoading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...currentHttpState, error: null };
    default:
      throw new Error("It should not reach here");
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
  });

  const onAddIngredientHandler = (ingredient) => {
    dispatchHttp({ type: "SEND" });
    setTimeout(() => {
      fetch(
        "https://react-hooks-demo-91469-default-rtdb.firebaseio.com/ingredient.json",
        {
          method: "POST",
          body: JSON.stringify(ingredient),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          dispatchHttp({ type: "RESPONSE" });
          return response.json();
        })
        .then((responseData) => {
          dispatch({
            type: "ADD",
            ingredient: { id: responseData.name, ...ingredient },
          });
        });
    }, 1500);
  };

  const onRemoveIngredient = (id) => {
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://react-hooks-demo-91469-default-rtdb.firebaseio.com/ingredient/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        dispatch({ type: "DELETE", id: id });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", errorMessage: error.message });
      });
  };

  const onLoadFilteredIngredients = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const clearErrorModal = () => {
    dispatchHttp({ type: "CLEAR" });
  };
  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearErrorModal}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={onAddIngredientHandler}
        loading={httpState.isLoading}
      />

      <section>
        <Search onLoadIngredients={onLoadFilteredIngredients} />
        {console.log(userIngredients)}
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={onRemoveIngredient}
        />
      </section>
    </div>
  );
}

export default Ingredients;
