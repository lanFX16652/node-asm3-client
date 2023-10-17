import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { LocalStorageService } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../store/userSlice";
import { getCart, resetCart } from "../../store/cartSlice";
import { getOrder, resetOrder } from "../../store/orderSlice";
import { setChatId } from "../../store/chatSlice";

const AuthWrapper = () => {
  const userLocalStorage = LocalStorageService.load("user");
  const chatId = LocalStorageService.load("chatId");

  const userRedux = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setChatId(chatId));

    if (!userRedux) {
      dispatch(setUser(userLocalStorage));
    }

    if (userLocalStorage) {
      dispatch(getCart());
      dispatch(getOrder());
    } else {
      dispatch(resetCart());
      dispatch(resetOrder());
    }
  }, [userRedux, userLocalStorage, dispatch, chatId]);

  return <Outlet />;
};

export default AuthWrapper;
