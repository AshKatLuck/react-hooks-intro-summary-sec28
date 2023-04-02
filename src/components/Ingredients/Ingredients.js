import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // useEffect(() => {
  //   console.log("rendering");
  // }, [ingredients]);

  useEffect(() => {
    fetch(
      "https://react-hooks-demo-91469-default-rtdb.firebaseio.com/ingredient.json"
    )
      .then((response) => response.json())
      .then((responseData) => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: responseData[key].name,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
          setIngredients(loadedIngredients);
        }
      });
  }, []);

  const onAddIngredientHandler = (ingredient) => {
    setIsLoading(true);
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
          return response.json();
        })
        .then((responseData) => {
          setIngredients((prevIngredients) => [
            ...prevIngredients,
            { id: responseData.name, ...ingredient },
          ]);
        });
      setIsLoading(false);
    }, 1500);
  };

  const onRemoveIngredient = (id) => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-demo-91469-default-rtdb.firebaseio.com/ingredient/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        console.log(response);
        setIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient.id !== id)
        );
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
    setIsLoading(false);
  };

  const onLoadFilteredIngredients = useCallback((filteredIngredients) => {
    setIngredients(filteredIngredients);
  }, []);

  const clearErrorModal = () => {
    setError(null);
  };
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearErrorModal}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={onAddIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={onLoadFilteredIngredients} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={onRemoveIngredient}
        />
      </section>
    </div>
  );
}

export default Ingredients;
