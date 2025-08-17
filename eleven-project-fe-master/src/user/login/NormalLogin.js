import React, { useContext } from "react";
import { Button, Card, Form, Input, notification, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  ACCESS_TOKEN,
  EMAIL,
  login,
  USER_ID,
  USER_ROLE,
  USERNAME,
} from "../../API/utils";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LoginForm = () => {
  const { setUserInfo, setIsAuthen } = useContext(AppContext);
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    const loginRequest = Object.assign({}, values);
    login(loginRequest)
      .then((response) => {
        // console.log("response: " + response.accessToken);
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        localStorage.setItem(EMAIL, response.email);
        localStorage.setItem(USERNAME, response.username);
        localStorage.setItem(USER_ID, response.id);
        localStorage.setItem(USER_ROLE, response.role);

        setIsAuthen(true);
        setUserInfo({ username: response.username, email: response.email });

        notification.info({
          message: "Eleven App",
          description: "Login successful!",
        });
        if (response.role === "ADMIN") {
          navigate("/admin/warehouse");
        } else if (response.role === "SELLER") {
          navigate("/seller/products");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          notification.error({
            message: "Eleven App",
            description:
              "Your Username or Password is incorrect. Please try again!",
          });
        } else {
          notification.error({
            message: "Eleven App",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        }
      });

    if (values.remember) {
      localStorage.setItem("username", values.username);
      localStorage.setItem("password", values.password);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Handle registration logic here");
    navigate("/signup")
  };

  return (
    <div
      style={{
        // display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "100vh",
      }}
    >
      <Card style={{ width: 500 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Title level={2}>Login </Title>
        </div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
            >
              Log in
            </Button>
            Don't have an account{" "}
            <a href="" onClick={handleRegister}>
              sign up
            </a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
