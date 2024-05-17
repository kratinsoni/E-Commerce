import React, { useEffect, useState } from "react";
import Card from "./Card";

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);

  const getCartItems = async () => {
    try {
      const response = await fetch("/api/v1/products/get-cart-products");
      const data = await response.json();
      console.log(data);
      setCartItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <div className="px-12 py-12 grid grid-flow-col grid-cols-2 grid-rows-2 items-center place-items-center space-y-8">
      {cartItems.map((product) => (
        <Card
          key={product._id}
          id={product._id}
          name={product.name}
          price={product.price}
          rating={product.rating}
          description={product.description}
          countInStock={product.countInStock}
          category={product.category}
        />
      ))}
    </div>
  );
};

export default CartItems;
