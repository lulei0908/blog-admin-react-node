import { useState, useEffect } from 'react'
import { Card, Upload, message, Button, Image, Popconfirm } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import api from '../api'

export default function Media() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    setLoading(true)
    try {
      const res = await api.get('/media')
      setFiles(res.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async ({ file }) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      message.success('上传成功')
      loadMedia()
    } catch (error) {
      message.error('上传失败')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/media/${id}`)
      message.success('删除成功')
      loadMedia()
    } catch (error) {
      console.error(error)
    }
  }

  const uploadProps = {
    customRequest: handleUpload,
    showUploadList: false,
    accept: 'image/*',
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>媒体管理</h1>
        <Upload {...uploadProps}>
          <Button type="primary" icon={<UploadOutlined />} loading={uploading}>上传图片</Button>
        </Upload>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {files.map(file => (
          <Card
            key={file._id}
            cover={<Image src={file.url} alt={file.originalName} style={{ height: 150, objectFit: 'cover' }} />}
            actions={[
              <Popconfirm title="确定删除?" onConfirm={() => handleDelete(file._id)}>
                <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>,
            ]}
          >
            <Card.Meta
              title={file.originalName}
              description={`${(file.size / 1024).toFixed(1)} KB`}
            />
          </Card>
        ))}
      </div>

      {files.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 64, color: '#888' }}>暂无图片</div>
      )}
    </div>
  )
}
