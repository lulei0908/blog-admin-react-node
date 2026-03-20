import { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Input, message, Popconfirm } from 'antd'
import { CheckOutlined, CloseOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons'
import api from '../api'
import dayjs from 'dayjs'

export default function Comment() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [replyModalVisible, setReplyModalVisible] = useState(false)
  const [replyingId, setReplyingId] = useState(null)
  const [replyForm] = Form.useForm()

  useEffect(() => {
    loadComments()
  }, [pagination.current])

  const loadComments = async () => {
    setLoading(true)
    try {
      const res = await api.get('/comments', { params: { page: pagination.current, limit: pagination.pageSize } })
      setComments(res.data || [])
      setPagination(prev => ({ ...prev, total: res.meta.total }))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id, status) => {
    try {
      await api.put(`/comments/${id}/review`, { status })
      message.success(status === 'approved' ? '已通过' : '已拒绝')
      loadComments()
    } catch (error) {
      console.error(error)
    }
  }

  const handleReply = async (values) => {
    try {
      await api.post(`/comments/${replyingId}/reply`, values)
      message.success('回复成功')
      setReplyModalVisible(false)
      replyForm.resetFields()
      loadComments()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/comments/${id}`)
      message.success('删除成功')
      loadComments()
    } catch (error) {
      console.error(error)
    }
  }

  const openReplyModal = (record) => {
    setReplyingId(record._id)
    replyForm.setFieldsValue({ reply: record.reply || '' })
    setReplyModalVisible(true)
  }

  const columns = [
    {
      title: '评论者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '文章',
      dataIndex: ['postId', 'title'],
      key: 'post',
      render: (text) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'orange'}>
          {status === 'approved' ? '已通过' : status === 'rejected' ? '已拒绝' : '待审核'}
        </Tag>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button type="link" icon={<CheckOutlined />} onClick={() => handleReview(record._id, 'approved')}>通过</Button>
              <Button type="link" danger icon={<CloseOutlined />} onClick={() => handleReview(record._id, 'rejected')}>拒绝</Button>
            </>
          )}
          <Button type="link" icon={<MessageOutlined />} onClick={() => openReplyModal(record)}>回复</Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record._id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1>评论管理</h1>
      </div>
      <Table
        columns={columns}
        dataSource={comments}
        loading={loading}
        rowKey="_id"
        pagination={{
          ...pagination,
          onChange: (page) => setPagination(prev => ({ ...prev, current: page })),
        }}
      />

      <Modal
        title="回复评论"
        open={replyModalVisible}
        onCancel={() => { setReplyModalVisible(false); replyForm.resetFields(); }}
        onOk={replyForm.submit}
      >
        <Form form={replyForm} layout="vertical" onFinish={handleReply}>
          <Form.Item name="reply" label="回复内容" rules={[{ required: true, message: '请输入回复内容' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
