import {
  Button,
  Card,
  Image,
  List,
  notification,
  Select,
  Radio,
  Typography,
  Input,
  Slider,
} from "antd";
import { useContext, useEffect, useState } from "react";
import {
  addToCart,
  API_BASE_URL,
  getAllProducts,
  getAllProductsByCategory,
  getCart,
} from "../../API/utils";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
const { Search } = Input;

function Products() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('ASC');
  const { isAuthen, totalCart, setTotalCart } = useContext(AppContext);
  const param = useParams();

  useEffect(() => {
    setLoading(true);
    (param?.categoryId
      ? getAllProductsByCategory(param.categoryId)
      : getAllProducts(minPrice, maxPrice, sortBy, sortOrder)
    ).then((res) => {
        console.log(res.products)
      setItems(res.products);
      setLoading(false);
    });

    isAuthen &&
      getCart().then((res) => {
        setTotalCart(res.cart_items.length);
      });
  }, [minPrice, maxPrice, sortBy, sortOrder]);

  const handleSearch = async (value, _e, info) => {
    if (value) {
      try {
        const response = await axios.get(API_BASE_URL + "/products", {
          params: {
            keywords: value,
          },
        });
        setItems(response.data.products);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      getAllProducts().then((res) => {
        setItems(res.products);
      });
    }
  };

  return (
    <div className="productsContainer">
      <div>
        <Search
          placeholder="Search here..."
          size="large"
          onSearch={handleSearch}
        />
        <Typography.Text>View Items Sorted By: </Typography.Text>
        {/* Filter UI */}
        <div>
          <Slider
            range
            defaultValue={[1, 10]}
            max={1000000}
            onAfterChange={(values) => {
              setMinPrice(values[0]);
              setMaxPrice(values[1]);
            }}
          />
            <Typography.Text>Sort By: </Typography.Text>
            <Select
            defaultValue={sortBy}
            style={{ width: 120 }}
            onChange={(value) => setSortBy(value)}
            >
            <Select.Option value="price">Price</Select.Option>
            <Select.Option value="createdAt">CreatedAt</Select.Option>
            </Select>
          <Radio.Group
            defaultValue={sortOrder}
            buttonStyle="solid"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <Radio.Button value="DESC">Descending</Radio.Button>
            <Radio.Button value="ASC">Ascending</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <List
        loading={loading}
        grid={{ column: 3 }}
        renderItem={(product, index) => {
          return (
            <Card
              className="itemCard"
              title={product.title}
              key={index}
              cover={<Image className="itemCardImage" src={product.image} />}
              actions={[
                // <Rate allowHalf disabled value={product.rating}/>,
                <AddToCartButton
                  item={product}
                  setTotalCart={setTotalCart}
                  totalCart={totalCart}
                />,
              ]}
            >
              <Card.Meta
                title={
                  <Typography.Paragraph>
                    Price: ${product.price}{" "}
                    {/*<Typography.Text delete type="danger">
                                                $
                                                {parseFloat(
                                                    product.price +
                                                    (product.price * product.discountPercentage) / 100
                                                ).toFixed(2)}
                                            </Typography.Text>*/}
                  </Typography.Paragraph>
                }
                description={
                  <Typography.Paragraph
                    ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                  >
                    {product.description}
                  </Typography.Paragraph>
                }
              ></Card.Meta>
            </Card>
          );
        }}
        dataSource={items}
      ></List>
    </div>
  );
}

function AddToCartButton({ item, setTotalCart, totalCart }) {
  const [loading, setLoading] = useState(false);
  const addProductToCart = () => {
    setLoading(true);
    addToCart(item.id, item.title, item.price)
      .then((res) => {
        notification.success({
          message: "Eleven App",
          description: item.title + " added to cart successfully!",
        });
        setLoading(false);
        setTotalCart(totalCart + 1);
      })
      .catch((err) => {
        notification.error({
          message: "Eleven App",
          description: "Error: " + err.message,
        });
        setLoading(false);
      });
  };
  return (
    <Button
      type="link"
      onClick={() => {
        addProductToCart();
      }}
      loading={loading}
    >
      Add to Cart
    </Button>
  );
}

export default Products;
