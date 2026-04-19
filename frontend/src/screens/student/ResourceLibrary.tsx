import { useEffect, useMemo, useRef, useState } from 'react'
import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

const PAGE_SIZE = 9

export default function ResourceLibrary({ context }: { context: ScreenContext }) {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const filteredResources = useMemo(
    () => context.resources.filter(resource =>
      resource.title.toLowerCase().includes(query.toLowerCase()) ||
      resource.description.toLowerCase().includes(query.toLowerCase()) ||
      resource.type.toLowerCase().includes(query.toLowerCase()),
    ),
    [context.resources, query],
  )

  const visibleResources = useMemo(
    () => filteredResources.slice(0, visibleCount),
    [filteredResources, visibleCount],
  )

  const hasMore = visibleCount < filteredResources.length

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [query])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredResources.length))
        }
      },
      { rootMargin: '120px 0px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, filteredResources.length])

  return (
    <div className={styles.card}>
      <div className={styles.searchRow}>
        <input
          className={styles.formInput}
          placeholder="Search resources…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="button" className={styles.buttonSecondary} onClick={() => {}}>
          Search
        </button>
      </div>
      {visibleResources.length === 0 && (
        <div className={styles.emptyState}>
          <h3>No resources yet</h3>
          <p>Resources added by an administrator will appear here.</p>
        </div>
      )}
      <div className={styles.grid3}>
        {visibleResources.map(resource => (
          <article key={resource.id} className={styles.resourceCard} onClick={() => resource.url && window.open(resource.url, '_blank')}>
            <span className={styles.resourceLabel}>{resource.type}</span>
            <h3 className={styles.resourceTitle}>{resource.title}</h3>
            <p className={styles.resourceText}>{resource.description}</p>
          </article>
        ))}
      </div>

      <p className={styles.sectionCopy} style={{ marginTop: '1rem', marginBottom: 0 }}>
        Showing {visibleResources.length} of {filteredResources.length} resources
      </p>

      {hasMore && (
        <button
          type="button"
          className={styles.buttonSecondary}
          onClick={() => setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredResources.length))}
        >
          Load More Resources
        </button>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  )
}
