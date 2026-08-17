import { describe, it, expect } from 'vitest'
import { resttyWsUrl, sidebarWsUrl } from '../src/client/api.ts'

describe('ws url builders', () => {
  it('resttyWsUrl builds the own-backend url with session/tab/cwd and ws scheme', () => {
    const url = resttyWsUrl({ sessionId: 's1', cwd: '/home/me' }, 't1')
    expect(url.startsWith('ws://')).toBe(true)
    expect(url).toContain('/powerdesk/ws/terminal')
    expect(url).toContain('sessionId=s1')
    expect(url).toContain('tab=t1')
    expect(url).toContain('cwd=')
  })

  it('resttyWsUrl omits cwd when absent', () => {
    const url = resttyWsUrl({ sessionId: 's1' }, 't1')
    expect(url).toContain('sessionId=s1')
    expect(url).toContain('tab=t1')
    expect(url).not.toContain('cwd=')
  })

  it('sidebarWsUrl targets dsh-better-sidebar\u2019s endpoint', () => {
    const url = sidebarWsUrl({ sessionId: 's1', cwd: '/c' }, 't1')
    expect(url.startsWith('ws://')).toBe(true)
    expect(url).toContain('/sidebar/ws/terminal')
    expect(url).toContain('sessionId=s1')
    expect(url).toContain('tab=t1')
  })
})
