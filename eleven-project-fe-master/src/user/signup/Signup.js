import React from "react";
import {Button, Card, Form, Input, notification, Typography} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {signup,} from "../../API/utils";
import {useNavigate} from "react-router-dom";

const {Title} = Typography;

const Signup = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log("Received values of form: ", values);

        const signupRequest = Object.assign({}, values);
        signup(signupRequest)
            .then((response) => {
                console.log("signup response: " + response);
                notification.info({
                    message: "Eleven App",
                    description: "Signup successful!",
                });
                navigate("/login");
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

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Handle login logic here");
        navigate("/login")
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
            <Card style={{width: 500}}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Title level={2}>Register </Title>
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: "Please input your Username!"}]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon"/>}
                            placeholder="Username"
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[{required: true, message: "Please input your email!"}]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon"/>}
                            placeholder="email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: "Please input your Password!"}]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
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
                            Signup
                        </Button>
                        Don't have an account{" "}
                        <a href="" onClick={handleLogin}>
                            Login
                        </a>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Signup;
