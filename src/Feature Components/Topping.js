import React, {memo} from "react";
import styles from "./Topping.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addTopping, removeTopping } from "../Redux/currentItemSlice";

function Topping({ name, price, id,totalTax, defaultPriceType}) {
    
      const dispatch = useDispatch();

      const handleClick = (id, name, price) => {
            dispatch(addTopping({ id, name, price }));
      };

      const topping = useSelector((state) => state.currentItem.toppings.find((topping) => id === topping.id));

      const priceWithTax = price*(1+totalTax/100)

      // let topping = currentToppings.find((topping) => id === topping.id);

      const remove = (id,price) => {
            dispatch(removeTopping({ id, price }));
      };
      return (
            <div className="p-0 position-relative">
                  <div className={styles.topping} onClick={() => handleClick(id, name, price)}>
                        <div>{name}</div>
                        <div>₹ {defaultPriceType==="with_tax" ? priceWithTax.toFixed(2) : price.toFixed(2)}</div>
                        {topping && <div className={styles.qty}>{topping.quantity}</div>}
                  </div>
                  {topping && (
                        <div className={styles.remove} onClick={() => remove(id,price)}>
                              -
                        </div>      
                  )}
            </div>
      );
}

export default  memo(Topping)
