import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Input, Select, Switch, Button, Card, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import api from '../api'

const { TextArea } = Input

export default function PostEdit() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  useEffect(() => {
    loadOptions()
    if (isEdit) loadPost()
  }, [id])

  const loadOptions = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        api.get('/categories'),
        api.get('/tags'),
      ])
      setCategories(catRes.data || [])
      setTags(tagRes.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const loadPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`)
      const post = res.data
      form.setFieldsValue({
        ...post,
        category: post.category?._id,
        tags: post.tags?.map(t => t._id),
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      if (isEdit) {
        await api.put(`/posts/${id}`, values)
        message.success('更新成功')
      } else {
        await api.post('/posts', values)
        message.success('创建成功')
      }
      navigate('/posts')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1>{isEdit ? '编辑文章' : '新建文章'}</h1>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="请输入文章标题" />
        </Form.Item>
        
        <Form.Item name="coverImage" label="封面图片">
          <Input placeholder="图片 URL" />
        </Form.Item>

        <Form.Item name="category" label="分类">
          <Select placeholder="选择分类" allowClear>
            {categories.map(cat => (
              <Select.Option key={cat._id} value={cat._id}>{cat.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="标签">
          <Select mode="multiple" placeholder="选择标签" allowClear>
            {tags.map(tag => (
              <Select.Option key={tag._id} value={tag._id}>{tag.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="status" label="状态" initialValue="draft">
          <Select>
            <Select.Option value="draft">草稿</Select.Option>
            <Select.Option value="published">已发布</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="isSticky" label="置顶" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="excerpt" label="摘要">
          <TextArea rows={2} placeholder="可选" />
        </Form.Item>

        <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
          <TextArea rows={20} placeholder="支持 Markdown" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? '保存' : '发布'}
            </Button>
            <Button onClick={() => navigate('/posts')}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}
