import { useState } from 'react'
import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function ManageResources({ context }: { context: ScreenContext }) {
  const [newResource, setNewResource] = useState({ title: '', description: '', type: 'article' as 'article' | 'video' | 'tool', url: '' })

  const handleAdd = async () => {
    if (newResource.title && newResource.description) {
      await context.onAddResource(newResource)
      setNewResource({ title: '', description: '', type: 'article', url: '' })
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeading}>Manage Resources</div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Title</label>
        <input className={styles.formInput} value={newResource.title} onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Description</label>
        <input className={styles.formInput} value={newResource.description} onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Type</label>
        <select className={styles.formSelect} value={newResource.type} onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value as any }))}>
          <option value="article">Article</option>
          <option value="video">Video</option>
          <option value="tool">Tool</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>URL (optional)</label>
        <input className={styles.formInput} value={newResource.url} onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))} />
      </div>
      <button type="button" className={styles.button} onClick={handleAdd}>
        Add Resource
      </button>
      <div className={styles.cardHeading} style={{ marginTop: '2rem' }}>Existing Resources</div>
      <div className={styles.smallList}>
        {context.resources.map(r => (
          <div key={r.id} className={styles.smallListItem}>
            <span>{r.title} ({r.type})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
