import React from "react";
import background from "../../assets/images/banner1.jpg";
import classes from "./SignUp.module.css";
import { useSignup } from "../../apis/login";
import { Button, Form, Input, InputNumber, Typography } from "antd";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [user, fetchUseSignup, isLoading] = useSignup();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const handleSubmit = (values) => {
    fetchUseSignup(
      values.fullname,
      values.email,
      values.password,
      values.phone
    );
  };

  if (user) {
    dispatch(setUser(user));
    navigate("/");
  }

  return (
    <div className={classes.wrapper}>
      <img src={background} alt="banner" className={classes.img} />
      <Form
        className={classes.form}
        form={form}
        size="middle"
        layout="vertical"
        name="login"
        onFinish={(values) => handleSubmit(values)}
      >
        <Typography.Title level={2}>SignUp</Typography.Title>
        <Form.Item
          label="fullname"
          name="fullname"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="email"
          name="email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="phone"
          name="phone"
          rules={[{ required: true }, { type: "number" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button loading={isLoading} htmlType="submit" type="primary">
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;
