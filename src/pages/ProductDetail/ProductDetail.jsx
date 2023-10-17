import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./ProductDetail.module.css";
import { useGetProduct, useGetRelatedProducts } from "../../apis/product";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import InputGroup from "react-bootstrap/InputGroup";
import { parseCurrency } from "../../services";
import CaretLeftOutlined from "@ant-design/icons/CaretLeftOutlined";
import CaretRightOutlined from "@ant-design/icons/CaretRightOutlined";
import Card from "react-bootstrap/Card";
import { notification, Button } from "antd";
import { selectUser } from "../../store/userSlice";
import { postAddItem, selectCartLoading } from "../../store/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const [product] = useGetProduct(id);
  const [relatedProducts, fetchRelateProduct] = useGetRelatedProducts();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoadingCart = useSelector(selectCartLoading);

  const [quantity, setQuantity] = useState(0);
  const [imgActive, setImageActive] = useState();

  const increaseHandler = () => {
    setQuantity(quantity + 1);
  };
  const decreaseHandler = () => {
    if (quantity === 0) {
      setQuantity(0);
    } else {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    if (product) {
      setImageActive(product.img1);
      fetchRelateProduct(product.id, product.category);
    }
  }, [product]);

  const descritions = product?.long_desc.includes("-")
    ? product?.long_desc.split("-")
    : product?.long_desc.split("•");

  const addToCartHandler = () => {
    if (user) {
      dispatch(
        postAddItem({
          productId: id,
          qty: quantity,
        })
      ).then(() => {
        notification.open({
          type: "success",
          message: "Add To Cart Success",
        });
      });
    } else {
      notification.open({
        type: "error",
        message: "Please login!",
      });
    }
  };

  const outOfStock = product?.stock === 0 || quantity === product?.stock;

  return (
    <div>
      <Container>
        <Row>
          <Col xs={2} lg={1}>
            {[...Array(4).keys()].map((index) => {
              const src = product ? product[`img${index + 1}`] : "";

              if (!src) return <></>;

              return (
                <img
                  onClick={() => setImageActive(src)}
                  className={
                    src === imgActive
                      ? `${classes.img}  ${classes.active}`
                      : `${classes.img}`
                  }
                  src={src}
                  key={src}
                  alt={product?.name}
                ></img>
              );
            })}
          </Col>
          <Col xs={10} lg={5}>
            <img className={classes.img} alt="product" src={imgActive}></img>
          </Col>
          <Col lg={6}>
            <h1>{product?.name}</h1>
            <h6>{parseCurrency(product?.price)}</h6>
            <p>{product?.short_desc}</p>
            <h6>CATEGORY: {product?.category}</h6>
            <h6>STOCK: {product?.stock}</h6>
            <InputGroup className="mb-3 position-relative">
              <Form.Control placeholder="QUANTITY" disabled />
              <Button
                disabled={quantity === 0}
                loading={isLoadingCart}
                onClick={addToCartHandler}
                className={classes.button}
              >
                Add To Cart
              </Button>
              <div className={classes["qty-group"]}>
                <Button
                  disabled={quantity === 0}
                  onClick={decreaseHandler}
                  type="ghost"
                  className={`p-0 d-flex align-items-center justify-content-center mx-1 ${
                    quantity === 0 ? "opacity-25" : ""
                  }`}
                >
                  <CaretLeftOutlined />
                </Button>
                <span className={classes.quantity}>{quantity}</span>
                <Button
                  disabled={outOfStock}
                  onClick={increaseHandler}
                  type="ghost"
                  className={`p-0 d-flex align-items-center justify-content-center mx-1 ${
                    outOfStock ? "opacity-25" : ""
                  }`}
                >
                  <CaretRightOutlined />
                </Button>
              </div>
            </InputGroup>
            {product?.stock === 0 && (
              <p style={{ color: "red" }}>Sản phẩm hết hàng</p>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>PRODUCT DESCRIPTION</h4>
            {descritions?.map((content, index) => {
              if (index === 0) return <h6>{content}</h6>;
              return <p key={content}>-{content}</p>;
            })}
          </Col>
        </Row>
        <h4>RELATED PRODUCTS</h4>
        <Row className="mb-5 flex-nowrap overflow-auto">
          {relatedProducts?.map((product) => {
            return (
              <Col key={product._id} xs={6} lg={2} className={classes["item"]}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={product.img1}
                    style={{ height: 195 }}
                  />
                  <Card.Body>
                    <Card.Title className={classes["card-title"]}>
                      {product.name}
                    </Card.Title>
                    <Card.Text className={classes["card-price"]}>
                      {parseCurrency(product.price)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetail;
