import React, { useEffect } from "react";
import classes from "./Login.module.css";
import { Button, Form, Input, Space, Typography } from "antd";
import background from "../../assets/images/banner1.jpg";
import { useLogin } from "../../apis/login";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { setUser } from "../../store/userSlice";
import { LocalStorageService } from "../../services";

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentUser, fetchUseLogin, isLoading] = useLogin();
  const submitForm = (values) => {
    fetchUseLogin(values.email, values.password);
  };

  useEffect(() => {
    if (currentUser) {
      dispatch(setUser(currentUser));
      LocalStorageService.store("user", currentUser);
      navigate("/");
    }
  }, [currentUser, dispatch, navigate]);

  return (
    <div className={classes.wrapper}>
      <img src={background} alt="background" className={classes.img} />
      <Form
        className={classes.form}
        form={form}
        size="middle"
        layout="vertical"
        name="login"
        onFinish={submitForm}
      >
        <Typography.Title level={2}>Login</Typography.Title>

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

        <Form.Item>
          <Button loading={isLoading} htmlType="submit" type="primary">
            Login
          </Button>
        </Form.Item>
        <Space size="small">
          <Typography.Text>Create an acount?</Typography.Text>
          <NavLink to="/signup">
            <Typography.Text>Click</Typography.Text>
          </NavLink>
        </Space>
      </Form>
    </div>
  );
};

export default Login;
