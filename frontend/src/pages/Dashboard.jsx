import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { FileTextOutlined, MessageOutlined, EyeOutlined, FolderOutlined, TagsOutlined } from '@ant-design/icons'
import api from '../api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await api.get('/stats/dashboard')
      setStats(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!stats) return <div>加载中...</div>

  const { overview } = stats

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="文章总数" value={overview.totalPosts} prefix={<FileTextOutlined />} />
            <div style={{ marginTop: 8, color: '#888' }}>
              已发布: {overview.publishedPosts} | 草稿: {overview.draftPosts}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="评论总数" value={overview.totalComments} prefix={<MessageOutlined />} />
            <div style={{ marginTop: 8, color: '#888' }}>待审核: {overview.pendingComments}</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="总阅读量" value={overview.totalViews} prefix={<EyeOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="分类" value={overview.totalCategories} prefix={<FolderOutlined />} />
              </Col>
              <Col span={12}>
                <Statistic title="标签" value={overview.totalTags} prefix={<TagsOutlined />} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="今日数据">
            <p>今日新增文章: <strong>{overview.todayPosts}</strong></p>
            <p>今日新增评论: <strong>{overview.todayComments}</strong></p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
