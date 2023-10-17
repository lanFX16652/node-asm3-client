import React from "react";
import { useGetProducts } from "../../apis/product";
import { Card, Col, Row, Spin, Typography } from "antd";
import { parseCurrency } from "../../services";
import classes from "./Shop.module.css";
import Container from "react-bootstrap/esm/Container";
import { useNavigate } from "react-router-dom";
const Shop = () => {
  const [products, isLoading] = useGetProducts();
  const navigate = useNavigate();

  const detailNavigateHandler = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <Spin spinning={isLoading}>
      <Container style={{ marginBottom: "20px" }}>
        <Typography.Title level={1}>Shop</Typography.Title>
        <Row gutter={[12, 24]}>
          {products.map((product) => {
            return (
              <Col key={product._id} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={product.img1}
                      style={{ minHeight: 316 }}
                    />
                  }
                  onClick={() => {
                    detailNavigateHandler(product._id);
                  }}
                >
                  <Card.Meta
                    title={
                      <p style={{ textAlign: "center" }}>{product.name}</p>
                    }
                    description={
                      <p className={classes.price}>
                        {" "}
                        {parseCurrency(product.price)}
                      </p>
                    }
                  ></Card.Meta>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </Spin>
  );
};

export default Shop;
