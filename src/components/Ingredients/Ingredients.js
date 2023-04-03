import React, { useCallback, useMemo, useReducer } from "react";

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
  const { isLoading, data, error, sendRequest } = useHttp();

  const onAddIngredientHandler = useCallback((ingredient) => {
    // dispatchHttp({ type: "SEND" });
    // setTimeout(() => {
    //     fetch(
    //       "https://react-hooks-demo-91469-default-rtdb.firebaseio.com/ingredient.json",
    //       {
    //         method: "POST",
    //         body: JSON.stringify(ingredient),
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     )
    //       .then((response) => {
    //         dispatchHttp({ type: "RESPONSE" });
    //         return response.json();
    //       })
    //       .then((responseData) => {
    //         dispatch({
    //           type: "ADD",
    //           ingredient: { id: responseData.name, ...ingredient },
    //         });
    //       });
    //   }, 1500);
  }, []);

  const onRemoveIngredient = useCallback(
    (id) => {
      sendRequest(
        `https://react-hooks-demo-91469-default-rtdb.firebaseio.com/ingredient/${id}.json`,
        "DELETE"
      );
      // dispatchHttp({ type: "SEND" });
      // fetch(
      //   `https://react-hooks-demo-91469-default-rtdb.firebaseio.com/ingredient/${id}.json`,
      //   {
      //     method: "DELETE",
      //   }
      // )
      //   .then((response) => {
      //     dispatchHttp({ type: "RESPONSE" });
      //     dispatch({ type: "DELETE", id: id });
      //   })
      //   .catch((error) => {
      //     dispatchHttp({ type: "ERROR", errorMessage: error.message });
      //   });
    },
    [sendRequest]
  );

  const onLoadFilteredIngredients = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const clearErrorModal = useCallback(() => {
    // dispatchHttp({ type: "CLEAR" });
  }, []);

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
