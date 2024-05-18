import React, { useEffect, useState } from "react";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { BASE_URL } from "../constants.js";

function HomePage() {
  const [products, setProducts] = useState([]);

  const Navigate = useNavigate();

  const handleCartItems = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/products/get-cart-products`);
      const data = await response.json();
      console.log(data);
      Navigate("/cart");
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/products/get-products`);
      const data = await response.json();
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <nav>
        <div className="flex justify-around bg-blue-500 p-4">
          <div className="flex space-x-10">
            <a href="/" className="text-white font-semibold text-xl">
              Home
            </a>
            <a href="/about" className="text-white font-semibold text-xl">
              About
            </a>
            <a href="/contact" className="text-white font-semibold text-xl">
              Contact
            </a>
          </div>
          <div className="flex space-x-10">
            <Logout />
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => Navigate("/register")}
            >
              Register
            </button>
            <button
              className="text-white text-xl font-semibold"
              onClick={handleCartItems}
            >
              Cart
            </button>
          </div>
        </div>
      </nav>
      <div className="px-12 py-12 grid grid-flow-col grid-cols-2 grid-rows-2 items-center place-items-center space-y-8">
        {products.map((product) => (
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
    </div>
  );
}

export default HomePage;
