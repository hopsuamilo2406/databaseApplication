import { HomeFilled, ShoppingCartOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Table,
  Typography,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {checkOutCart, getAllCategories, getCart} from "../../API/utils";
import { AppContext } from "../../context/AppContext";

function AppHeader() {
  const navigate = useNavigate();

  const onMenuClick = (item) => {
    navigate(`/${item.key}`);
  };

  const [cateList, setCateList] = useState([]);

  useEffect(() => {
    getAllCategories()
      .then((c) => c.map((cate) => ({ label: cate.name, key: cate._id })))
      .then((c) => setCateList(c));
  }, []);

  return (
    <div className="appHeader">
      <Menu
        className="appMenu"
        onClick={onMenuClick}
        mode="horizontal"
        items={[
          {
            label: <HomeFilled />,
            key: "",
          },
          {
            label: "Category",
            key: "category",
            children: [...cateList],
          },
        ]}
      />
          
      <Typography.Title>Eleven App</Typography.Title>
      <Menu
        className="appMenu"
        onClick={onMenuClick}
        mode="horizontal"
        items={
          !localStorage.getItem("username")
            ? [
                {
                  label: "Login",
                  key: "login",
                },
                {
                  label: "Signup",
                  key: "signup",
                },
              ]
            : [
                {
                  label: "Hi " + localStorage.getItem("username"),
                  key: "",
                },
                {
                  label: "Logout",
                  key: "logout",
                },
                  {
                      label: "Orders",
                      key: "order",
                  },
              ]
        }
      />
      <AppCart />
    </div>
  );
}

function AppCart() {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
  const { totalCart, setTotalCart, isAuthen } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    token &&
      getCart().then((res) => {
        setCartItems(res.cart_items);

        setTotalCart(res.cart_items.length);
      });
  }, []);

  const onConfirmOrder = (values) => {
    console.log({ values });
      checkOutCart().then();
    setCartDrawerOpen(false);
    setCheckoutDrawerOpen(false);
    setTotalCart(0);
    message.success("Your order has been placed successfully.");
  };

  return (
    <div>
      <Badge
        onClick={async () => {
          const token = localStorage.getItem("accessToken");

          if (!token) {
            message.error("Please login to view your cart!");
            return;
          }
          const res = await getCart();

          setCartItems(res.cart_items);
          setTotalCart(res.cart_items.length);
          setCartDrawerOpen(true);
        }}
        count={totalCart}
        className="soppingCartIcon"
      >
        <ShoppingCartOutlined />
      </Badge>
      <Drawer
        open={cartDrawerOpen}
        onClose={async () => {
          setCartDrawerOpen(false);
        }}
        title="Your Cart"
        contentWrapperStyle={{ width: 500 }}
      >
        <Table
          pagination={false}
          columns={[
            {
              title: "Title",
              dataIndex: "itemDetail",
              render: (value) => {
                return <span>{value.title}</span>;
              },
            },
            {
              title: "Price",
              dataIndex: "itemDetail",
              render: (value) => {
                return <span>${value.price}</span>;
              },
            },
            {
              title: "Quantity",
              dataIndex: "quantity",
              render: (value, record) => {
                return (
                  <InputNumber
                    min={0}
                    defaultValue={value}
                    onChange={(value) => {
                      setQuantity(value);
                      setCartItems((pre) =>
                        pre.map((cart) => {
                          if (record.id === cart.id) {
                            cart.total = cart.price * value;
                          }
                          return cart;
                        })
                      );
                    }}
                  ></InputNumber>
                );
              },
            },
            {
              title: "Total",
              dataIndex: "itemDetail",
              render: (value) => {
                return <span>${value.price * quantity}</span>;
              },
            },
          ]}
          dataSource={cartItems}
          summary={(data) => {
            const total = data.reduce((pre, current) => {
              return pre + current.total;
            }, 0);
            return <span>Total: ${total}</span>;
          }}
        />
        <Button
          onClick={() => {
            setCheckoutDrawerOpen(true);
          }}
          type="primary"
        >
          Checkout Your Cart
        </Button>
      </Drawer>
      <Drawer
        open={checkoutDrawerOpen}
        onClose={() => {
          setCheckoutDrawerOpen(false);
        }}
        title="Confirm Order"
      >
        <Form onFinish={onConfirmOrder}>
          <Button type="primary" htmlType="submit">
            {" "}
            Confirm Order
          </Button>
        </Form>
      </Drawer>
    </div>
  );
}

export default AppHeader;
