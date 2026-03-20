import { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import api from '../api'

export default function Category() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const res = await api.get('/categories')
      setCategories(res.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, values)
        message.success('更新成功')
      } else {
        await api.post('/categories', values)
        message.success('创建成功')
      }
      setModalVisible(false)
      form.resetFields()
      setEditingId(null)
      loadCategories()
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = (record) => {
    setEditingId(record._id)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`)
      message.success('删除成功')
      loadCategories()
    } catch (error) {
      console.error(error)
    }
  }

  const flattenCategories = (cats, level = 0) => {
    let result = []
    cats.forEach(cat => {
      result.push({ ...cat, key: cat._id, level })
      if (cat.children?.length) {
        result = result.concat(flattenCategories(cat.children, level + 1))
      }
    })
    return result
  }

  const flatCats = flattenCategories(categories)

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span style={{ paddingLeft: record.level * 24 }}>{text}</span>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>分类管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setModalVisible(true); }}>
          新建分类
        </Button>
      </div>
      <Table columns={columns} dataSource={flatCats} loading={loading} pagination={false} />

      <Modal
        title={editingId ? '编辑分类' : '新建分类'}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); form.resetFields(); setEditingId(null); }}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input />
          </Form.Item>
          <Form.Item name="order" label="排序" initialValue={0}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
