import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "./Button";
import { FiStar } from "react-icons/fi";
import { useCartStore } from "../zustand/cartStore";
import CardSkeleton from "./CardSkeleton";
import { FaCartShopping } from "react-icons/fa6";
import { FaCartPlus, FaRupeeSign } from "react-icons/fa";

interface CartProps {
  className?: string;
  item?: {
    id: number;
    slug?: string;
    name: string;
    price: number | string;
    image: string;
    rating?: number;
  };
}

function Card({ className = "", item, ...props }: CartProps) {
  const { addToCart, isInCart, getCartItems } = useCartStore((state) => state);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
  }, [getCartItems]);

  if (!item) {
    return <CardSkeleton />;
  }

  console.log(cartItems);

  const handleAddToCart = () => {
    if (item) {
      // Convert price to number if it's a string
      const priceAsNumber = typeof item.price === 'string' 
        ? parseFloat(item.price.replace('$', '')) 
        : item.price;
      
      addToCart({
        ...item,
        price: priceAsNumber,
        rating: item.rating || 0,
        slug: item.slug || `${item.name.toLowerCase().replace(/\s+/g, '-')}`
      });
    }
  };

  return (
    <div
      className={`w-full md:max-w-[260px]  max-w-[180px] 
                 
                  flex-shrink-0 
                  bg-white rounded-xl shadow-md overflow-hidden 
                  hover:shadow-xl transition-all duration-300 
                  ${className}`}
      {...props}>
      <div className="   overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={100}
          className="w-full md:h-[200px] h-[180px] object-cover transition-transform duration-500 hover:scale-102"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className=" text-sm md:text-xl font-bold text-gray-800 mb-2 ">
            {item.name}
          </h3>
          {item.rating && (
            <div className="flex items-center">
              <FiStar className="text-yellow-400 mr-1" />
              <span>{item.rating}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-red-600 font-bold flex items-center justify-center text-xs md:text-sm">
            <FaRupeeSign  />
            {typeof item.price === 'string' ? item.price : `${item.price.toFixed(2)}`}
          </span>
          <span>
      
          </span>
          <Button
            onClick={handleAddToCart}
            className={`text-xs md:text-sm ${
              isInCart(item.id)
                ? "bg-green-500! hover:bg-green-600"
                : "bg-yellow-500!"
            } text-white`}>
                 <span className="flex items-center justify-center gap-2"> {isInCart(item.id) ? <FaCartShopping/> : <FaCartPlus />}{isInCart(item.id) ? "Added"  : "Add to Cart"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Card;
