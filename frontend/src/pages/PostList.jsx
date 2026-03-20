import { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Modal, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import dayjs from 'dayjs'

export default function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({ status: '', keyword: '' })
  const navigate = useNavigate()

  useEffect(() => {
    loadPosts()
  }, [pagination.current, filters])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, limit: pagination.pageSize, ...filters }
      const res = await api.get('/posts', { params })
      setPosts(res.data)
      setPagination(prev => ({ ...prev, total: res.meta.total }))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`)
      message.success('删除成功')
      loadPosts()
    } catch (error) {
      console.error(error)
    }
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          {record.isSticky && <Tag color="red">置顶</Tag>}
          <a onClick={() => navigate(`/posts/edit/${record._id}`)}>{text}</a>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: ['category', 'name'],
      key: 'category',
      render: (text) => text || '-',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => tags?.map(t => t.name).join(', ') || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '阅读量',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => navigate(`/posts/edit/${record._id}`)}>
            编辑
          </Button>
          <Popconfirm title="确定删除这篇文章?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>文章管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/posts/new')}>
          新建文章
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={posts}
        loading={loading}
        rowKey="_id"
        pagination={{
          ...pagination,
          onChange: (page) => setPagination(prev => ({ ...prev, current: page })),
        }}
      />
    </div>
  )
}
