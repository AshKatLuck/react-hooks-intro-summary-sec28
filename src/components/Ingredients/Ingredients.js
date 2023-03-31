import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    console.log("rendering");
  }, [ingredients]);

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
  };

  const onRemoveIngredient = (id) => {
    console.log(ingredients);
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== id)
    );
  };

  const onLoadFilteredIngredients = useCallback(
    (filteredIngredients) => {
      setIngredients(filteredIngredients);
    },
    [setIngredients]
  );
  return (
    <div className="App">
      <IngredientForm onAddIngredient={onAddIngredientHandler} />

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
