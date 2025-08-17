import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../API/utils';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Form, Input, List, Row, Space, Table, Typography, notification} from 'antd';
import TextArea from 'antd/es/input/TextArea';

const API_URL = `${API_BASE_URL}/products`

const ProductManage = () => {
  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [editFormData, setEditFormData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if(role !== 'SELLER') {
      navigate('/');
    }
    fetchAll();
  }, []);
  
  const handleEditClick = (item) => {
    setEditFormData(item);
    setSelectedCategory(item);
    console.log(item);
    form.resetFields();
    form.setFieldValue('title', item.title);
    form.setFieldValue('description', item.description);
    form.setFieldValue('price', item.price);
    form.setFieldValue('quantityNumber', item.quantityNumber);
    form.setFieldValue('dimension', item.dimension);
    form.setFieldValue('image', item.image);
    form.setFieldValue('additional_attributes', JSON.stringify(item.additional_attributes));
    form.setFieldValue('categoryId', item.categoryId);
    form.setFieldValue('warehouseId', item.warehouseId);
  };

  const handleCancelEdit = () => {
    setEditFormData(null);
  };

  const handleEditSubmit = async (data) => {
    const token = localStorage.getItem('accessToken');

    try {
      const submitData = {
        title: data.title,
        description: data.description,
        price: data.price,
        quantityNumber: data.quantityNumber,
        dimension: data.dimension,
        image: data.image,
        additional_attributes: JSON.parse(data.additional_attributes),
        categoryId: data.categoryId,
        warehouseId: data.warehouseId
      }
      await axios.put(`${API_URL}/${editFormData.id}`, submitData, {
        headers: { 'x-access-token': `${token}` }
      });
      setEditFormData(null);
      notification.success({
        message: `Category ${editFormData.title} has been updated`,
      });
      await fetchAll();
    } catch (error) {
      error.response.data.message && notification.error({
        message: `Error updating category ${editFormData.title}: ` + error.response.data.message,
      });
      console.log(error.message)
    }
  };
  
  const fetchAll = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.get(API_URL  + "?page=0&size=100", {
        headers: { 'x-access-token': `${token}` }
      });
      console.log('Data fetched:', response.data.products)
      setData(response.data.products);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { 'x-access-token': `${token}` }
      });
      await fetchAll();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem('accessToken');
    try {
      const submitData = {
        title: data.title,
        description: data.description,
        price: data.price,
        quantityNumber: data.quantityNumber,
        dimension: data.dimension,
        image: data.image,
        additional_attributes: data.additional_attributes && JSON.parse(data.additional_attributes),
        categoryId: data.categoryId,
        warehouseId: data.warehouseId
      }
      console.log(submitData)
      await axios.post(API_URL, submitData, {
        headers: { 'x-access-token': `${token}` }
      });
      notification.success({
        message: `Product ${data.title} has been added`,
      });
      await fetchAll();
    } catch (error) {
      error.response.data.message && notification.error({
        message: `Error adding product ${data.title}: ` + error.response.data.message,
      });
      console.error('Error adding item:', error);
    }
  }

  const columns = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantityNumber',
      key: 'quantityNumber',
    },
    {
      title: 'Dimension',
      dataIndex: 'dimension',
      key: 'dimension',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
    },
    {
      title: 'Additional Attributes',
      dataIndex: 'additional_attributes',
      key: 'additional_attributes',
    },
    {
      title: 'Category Id',
      dataIndex: 'categoryId',
      key: 'categoryId',
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'updatedAt',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
    },
    {
      title: 'Warehouse Id',
      dataIndex: 'warehouseId',
      key: 'warehouseId'
    }, 
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleEditClick(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
];

  return (
    <Row justify="center">
    <Form onFinish={onSubmit} >
    <Typography.Title level={2}>Add new product</Typography.Title>

            <Form.Item label="Title" name="title" rules={[
              {
                required: true,
                message: 'Please input category name!',
              },
            ]}>
              <Input  />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input  />
            </Form.Item>
            <Form.Item label="Price" name="price">
              <Input  />
            </Form.Item>
            <Form.Item label="Quantity" name="quantityNumber">
              <Input  />

            </Form.Item>  
            <Form.Item label="Dimension" name="dimension">
              <Input  />
            </Form.Item>
            <Form.Item label="Image" name="image">
              <Input  />
            </Form.Item>
            <Form.Item label="Additional Attributes" name="additional_attributes">
              <TextArea placeholder="{ 'color' : 12321 }" />
            </Form.Item>
            <Form.Item label="Category Id" name="categoryId" rules={[
              {
                required: true,
                message: 'Please input category id!',
              },
            ]}>
              <Input  />
            </Form.Item>
            <Form.Item label="Warehouse Id" name="warehouseId" rules={[
              {
                required: true,
                message: 'Please input warehouse id!',
              },
            ]}>
              <Input  />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>

    {editFormData ? <EditForm form={form} handleEditSubmit={handleEditSubmit} handleCancelEdit={handleCancelEdit} /> : (<Table columns={columns} dataSource={data}>
      <Table.Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Button onClick={() => handleEditClick(record)}>Edit</Button>
              <Button onClick={() => handleDelete(record._id)}>Delete</Button>
            </Space>
          )}
        />
    </Table>)
    } 
   </Row>
  );
};

const EditForm = ({form, handleEditSubmit, data, selectedCategory, handleCancelEdit }) => {
  return (
    <>
    <Typography.Title level={3}>Edit Categories</Typography.Title>
    <Form
      form={form}
      onFinish={handleEditSubmit}
    >
    <Form.Item label="Title" name="title">
    <Input />
  </Form.Item>
  <Form.Item label="Description" name="description">
    <Input />
  </Form.Item>
  <Form.Item label="Price" name="price">
    <Input />
  </Form.Item>
  <Form.Item label="Quantity" name="quantityNumber">
    <Input />
  </Form.Item>
  <Form.Item label="Dimension" name="dimension">
    <Input />
  </Form.Item>
  <Form.Item label="Image" name="image">
    <Input />
  </Form.Item>
  <Form.Item label="Additional Attributes" name="additional_attributes">
    <TextArea placeholder="{ 'color' : 12321 }" />
  </Form.Item>
  <Form.Item label="Category Id" name="categoryId">
    <Input />
  </Form.Item>
  <Form.Item label="Warehouse Id" name="warehouseId">
    <Input />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">Submit</Button>
  </Form.Item>
  <Button onClick={handleCancelEdit}>Cancel</Button>

  </Form>
    </>
    
  );
}


export default ProductManage;
