import { NavLink, useNavigate } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import React from "react";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/esm/Container";
import { selectUser } from "../../store/userSlice";
import { Menu, Popover, Space, Button, Badge, Spin } from "antd";
import { useLogout } from "../../apis/logout";
import { ShoppingCartOutlined, UserOutlined, CaretDownOutlined } from '@ant-design/icons'
import { selectCartLoading, selectQtyCartItem } from "../../store/cartSlice";

function MainNavigation() {

  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const qtyCartItem = useSelector(selectQtyCartItem);
  const isLoadingCart = useSelector(selectCartLoading);
  const [logout] = useLogout()

  return (
    <Container>
      <nav className={classes.navbar}>
        <ul>
          <li>
            <NavLink
              onClick={() => navigate("/")}
              to='/'
              className={(navData) => {
                return (navData.isActive ? classes.active : "")
              }}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/shoppage'
              className={(navData) => {
                return (navData.isActive ? classes.active : "")
              }}
            >
              Shop
            </NavLink>
          </li>
        </ul>

        <h1>BOUTIQUE</h1>

        <Space >
          <NavLink
            to='/checkout'
            className={(navData) => {

              return (navData.isActive ? classes.active : "")
            }}
          >
            <Badge count={isLoadingCart ? <Spin></Spin> : qtyCartItem}>
              <Button type="text" icon={<ShoppingCartOutlined />} >
                Cart
              </Button>
            </Badge>
          </NavLink>
          {
            user ? (
              <Popover trigger='click' content={
                < Menu items={
                  [
                    {
                      label: 'History',
                      onClick: () => navigate('/history')
                    },
                    {
                      label: 'Log out',
                      onClick: logout
                    },
                  ]} />
              } >
                <Button type="text" icon={<UserOutlined />}>

                  {user.fullname}
                  <CaretDownOutlined />
                </Button>
              </Popover>
            ) : (
              <NavLink
                to='/login'
                className={(navData) => {
                  return (navData.isActive ? classes.active : "")
                }}
              >
                Login
              </NavLink>
            )}
        </Space>
      </nav>
    </Container >
  );
}
export default MainNavigation;


