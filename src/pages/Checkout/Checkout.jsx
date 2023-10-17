import React from "react";
import classes from "./Checkout.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { getCart, selectCart } from "../../store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { parseCurrency } from "../../services";
import { Button, Form, Input, notification } from "antd";
import { createOrder } from "../../store/orderSlice";

const Checkout = () => {
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalPrice = cart.reduce((total, item) => {
    return total + item.qty * item.product.price;
  }, 0);

  const [form] = Form.useForm();

  const orderSubmit = (values) => {
    dispatch(
      createOrder({
        fullname: values.fullname,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        cart: cart,
        totalPrice: totalPrice,
      })
    ).then(() => {
      dispatch(getCart());
      notification.open({
        type: "success",
        message: "Create order success",
      });
    });
    navigate("/history");
  };

  return (
    <>
      <div
        className={`d-flex justify-content-between align-items-center p-5 fst-italic ${classes.header}`}
      >
        <h1>CHECKOUT</h1>
        <div className={classes["breadcrum"]}>
          <NavLink to="/">HOME / </NavLink>
          <NavLink to="#">CART / </NavLink>
          <NavLink to="/checkout">CHECKOUT</NavLink>
        </div>
      </div>

      <div className="py-4 fst-italic container">
        <h3>BILLING DETAILS</h3>

        <Row>
          <Col xs={12} lg={8}>
            <Form
              form={form}
              onFinish={orderSubmit}
              size="middle"
              layout="vertical"
              name="fullname"
            >
              <Form.Item
                label="FULLNAME"
                name="fullname"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="EMAIL"
                name="email"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="PHONE NUMBER"
                name="phoneNumber"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="ADDRESS"
                name="address"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Button
                disabled={cart.length === 0}
                htmlType="submit"
                className={`${classes.button} mb-5`}
              >
                Place Order
              </Button>
            </Form>
          </Col>
          <Col xs={12} lg={4}>
            <div className={`p-4 fst-italic ${classes["order-content"]}`}>
              <h3>YOUR ORDER</h3>
              <Row>
                {cart.map((item) => (
                  <>
                    {" "}
                    <Col xs={6} className="fw-bold border-bottom py-1">
                      {item.product.name}
                    </Col>{" "}
                    <Col
                      xs={6}
                      className={`border-bottom py-1 ${classes.price}`}
                    >
                      {parseCurrency(item.product.price)} x {item.qty}
                    </Col>
                  </>
                ))}
                <Col xs={6}>TOTAL</Col>
                <Col xs={6}>{parseCurrency(totalPrice)}</Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Checkout;
