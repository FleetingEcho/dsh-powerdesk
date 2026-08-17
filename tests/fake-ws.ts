/** A minimal WebSocket double for the transport specs. open() is fired on a
 *  microtask so the transport can attach its listeners synchronously after
 *  `new WebSocket(url)`, mirroring the real event ordering. */
export class FakeWS {
  static OPEN = 1
  static last: FakeWS | null = null
  static reset(): void { FakeWS.last = null }

  binaryType = 'blob'
  readyState = 0
  url: string
  sent: unknown[] = []
  private listeners: Record<string, ((e: unknown) => void)[]> = {}

  constructor(url: string) {
    this.url = url
    FakeWS.last = this
    queueMicrotask(() => {
      this.readyState = FakeWS.OPEN
      this.fire('open', {})
    })
  }

  addEventListener(ev: string, cb: (e: unknown) => void): void {
    (this.listeners[ev] ??= []).push(cb)
  }

  fire(ev: string, e: unknown): void {
    for (const cb of this.listeners[ev] ?? []) cb(e)
  }

  send(data: unknown): void { this.sent.push(data) }

  close(code = 1000, reason = ''): void {
    this.readyState = 3
    this.fire('close', { code, reason })
  }
}
