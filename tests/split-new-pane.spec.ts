import { describe, it, expect } from 'vitest'
import {
  makeDefaultState,
  splitForNewPane,
  reorientSplit,
  closePane,
  allLeaves,
  treeOf,
  firstLeaf,
  type SidebarState,
  type SplitNode,
} from '../src/client/state.ts'

/** Find the `dir` of the split that DIRECTLY contains `leafId`, or undefined
 *  when the leaf is the tree root (no parent split). Mirrors the private
 *  `reorientParentSplit` walk so tests can assert which split got flipped. */
function parentSplitDirOf(node: SplitNode, leafId: string): 'row' | 'col' | undefined {
  if (node.kind === 'leaf') return undefined
  if (node.children.some(child => child.id === leafId)) return node.dir
  for (const child of node.children) {
    const found = parentSplitDirOf(child, leafId)
    if (found !== undefined) return found
  }
  return undefined
}

describe('splitForNewPane', () => {
  it('splits the pane in the right panel tree (splits) with dir=col and activates the fresh leaf', () => {
    const state = makeDefaultState()
    const before = firstLeaf(state.splits)
    const beforeCount = allLeaves(state.splits).length
    const next = splitForNewPane(state, before.id, 'col')

    // The right-panel tree grew by one leaf.
    expect(allLeaves(next.splits).length).toBe(beforeCount + 1)
    // The fresh leaf is the active pane.
    expect(next.activePane).toBeTruthy()
    const fresh = allLeaves(next.splits).find(leaf => leaf.id === next.activePane)
    expect(fresh).toBeDefined()
    // The fresh leaf is empty (it renders the empty-state card grid).
    expect(fresh!.tabs).toHaveLength(0)
    // The fresh leaf lives in the right-panel tree.
    expect(treeOf(next, fresh!.id)).toBe('splits')
  })

  it('splits a pane in the bottom panel tree (bottomSplits) and activates the fresh leaf', () => {
    const state = makeDefaultState()
    // Seed a pane in the bottom tree to split.
    const bottom = firstLeaf(state.bottomSplits)
    const beforeCount = allLeaves(state.bottomSplits).length
    const next = splitForNewPane(state, bottom.id, 'row')

    expect(allLeaves(next.bottomSplits).length).toBe(beforeCount + 1)
    expect(next.activePane).toBeTruthy()
    const fresh = allLeaves(next.bottomSplits).find(leaf => leaf.id === next.activePane)
    expect(fresh).toBeDefined()
    expect(fresh!.tabs).toHaveLength(0)
    // The fresh leaf lives in the bottom-panel tree, not the right.
    expect(treeOf(next, fresh!.id)).toBe('bottomSplits')
  })

  it('does not disturb tabs in the original pane', () => {
    const state = makeDefaultState()
    const before = firstLeaf(state.splits)
    const originalTabs = before.tabs.map(tab => tab.id)
    const next = splitForNewPane(state, before.id, 'col')

    // The original pane (by id) keeps its tabs; the split wraps it.
    const stillThere = allLeaves(next.splits).find(leaf => leaf.id === before.id)
    expect(stillThere).toBeDefined()
    expect(stillThere!.tabs.map(tab => tab.id)).toEqual(originalTabs)
  })

  it('is idempotent-ish: splitting again grows by one more leaf', () => {
    const state = makeDefaultState()
    const a = splitForNewPane(state, firstLeaf(state.splits).id, 'col')
    const countAfter1 = allLeaves(a.splits).length
    const b = splitForNewPane(a, a.activePane!, 'col')
    expect(allLeaves(b.splits).length).toBe(countAfter1 + 1)
  })

  it('returns a new state object (does not mutate input)', () => {
    const state: SidebarState = makeDefaultState()
    const before = firstLeaf(state.splits)
    const snapshot = JSON.stringify(state)
    splitForNewPane(state, before.id, 'col')
    expect(JSON.stringify(state)).toBe(snapshot)
  })
})

describe('reorientSplit', () => {
  it('flips the parent split col→row so the pane moves from below to beside', () => {
    const base = makeDefaultState()
    // + creates the new pane BELOW (col) in the right panel.
    const state = splitForNewPane(base, firstLeaf(base.splits).id, 'col')
    const fresh = allLeaves(state.splits).find(leaf => leaf.id === state.activePane)!
    expect(parentSplitDirOf(state.splits, fresh.id)).toBe('col')

    // Reorient to row: the new pane moves to the SIDE of its sibling.
    const next = reorientSplit(state, fresh.id, 'row')
    expect(parentSplitDirOf(next.splits, fresh.id)).toBe('row')
    // The leaf count is unchanged — only the layout axis flipped.
    expect(allLeaves(next.splits).length).toBe(allLeaves(state.splits).length)
  })

  it('flips the parent split row→col in the bottom panel tree', () => {
    const base = makeDefaultState()
    // + creates the new pane SIDE-BY-SIDE (row) in the bottom panel.
    const state = splitForNewPane(base, firstLeaf(base.bottomSplits).id, 'row')
    const fresh = allLeaves(state.bottomSplits).find(leaf => leaf.id === state.activePane)!
    expect(parentSplitDirOf(state.bottomSplits, fresh.id)).toBe('row')

    const next = reorientSplit(state, fresh.id, 'col')
    expect(parentSplitDirOf(next.bottomSplits, fresh.id)).toBe('col')
  })

  it('is a no-op (same state reference) when the split already has that dir', () => {
    const base = makeDefaultState()
    const state = splitForNewPane(base, firstLeaf(base.splits).id, 'col')
    const fresh = allLeaves(state.splits).find(leaf => leaf.id === state.activePane)!
    // Already 'col' — reorienting to 'col' changes nothing.
    expect(reorientSplit(state, fresh.id, 'col')).toBe(state)
  })

  it('is a no-op (same state reference) for a root leaf with no parent split', () => {
    const state = makeDefaultState()
    // The right panel's root IS a leaf (no parent split) — nothing to reorient.
    const root = firstLeaf(state.splits)
    expect(reorientSplit(state, root.id, 'row')).toBe(state)
  })

  it('preserves the split sizes (only the layout axis changes)', () => {
    const base = makeDefaultState()
    const state = splitForNewPane(base, firstLeaf(base.splits).id, 'col')
    const fresh = allLeaves(state.splits).find(leaf => leaf.id === state.activePane)!
    // splitForNewPane makes a 50/50 split.
    const before = JSON.stringify(state.splits)
    const sizesBefore = JSON.stringify(extractSizes(state.splits))
    const next = reorientSplit(state, fresh.id, 'row')
    // The leaf structure is unchanged; only the dir flipped.
    expect(extractSizes(next.splits)).toEqual(JSON.parse(sizesBefore))
    expect(JSON.stringify(state.splits)).toBe(before) // input not mutated
  })

  it('only reorients the IMMEDIATE parent split of a nested leaf', () => {
    const base = makeDefaultState()
    // First + : split A (col) wraps [orig, fresh1].
    let state = splitForNewPane(base, firstLeaf(base.splits).id, 'col')
    const fresh1 = state.activePane!
    // Second + on fresh1: split B (col) wraps [fresh1, fresh2] INSIDE A.
    state = splitForNewPane(state, fresh1, 'col')
    const fresh2 = state.activePane!
    // Both parents are 'col' so far.
    expect(parentSplitDirOf(state.splits, fresh2)).toBe('col')
    const outerLeaf = firstLeaf(base.splits)
    expect(parentSplitDirOf(state.splits, outerLeaf.id)).toBe('col')

    // Reorient ONLY the inner split (fresh2's parent B) to 'row'.
    const next = reorientSplit(state, fresh2, 'row')
    expect(parentSplitDirOf(next.splits, fresh2)).toBe('row')
    // The OUTER split A keeps its 'col' direction — only the immediate parent
    // of the reoriented leaf flips.
    expect(parentSplitDirOf(next.splits, outerLeaf.id)).toBe('col')
  })

  it('does not mutate the input state', () => {
    const base = makeDefaultState()
    const state = splitForNewPane(base, firstLeaf(base.splits).id, 'col')
    const fresh = allLeaves(state.splits).find(leaf => leaf.id === state.activePane)!
    const snapshot = JSON.stringify(state)
    reorientSplit(state, fresh.id, 'row')
    expect(JSON.stringify(state)).toBe(snapshot)
  })
})

describe('closePane', () => {
  it('removes the empty pane and promotes its sibling (undoes the + split)', () => {
    const base = makeDefaultState()
    const original = firstLeaf(base.splits)
    const beforeCount = allLeaves(base.splits).length
    // + splits; the fresh empty pane is active.
    const state = splitForNewPane(base, original.id, 'col')
    const fresh = allLeaves(state.splits).find(leaf => leaf.id === state.activePane)!
    expect(allLeaves(state.splits).length).toBe(beforeCount + 1)

    // Close the empty pane: the sibling (original) is promoted and the tree
    // shrinks back to its pre-split leaf count.
    const next = closePane(state, fresh.id)
    expect(allLeaves(next.splits).length).toBe(beforeCount)
    // The original pane is back as the root (its id survives).
    expect(firstLeaf(next.splits).id).toBe(original.id)
    // The closed pane id is gone from the tree.
    expect(allLeaves(next.splits).some(leaf => leaf.id === fresh.id)).toBe(false)
  })

  it('moves focus (activePane) to the surviving sibling pane', () => {
    const base = makeDefaultState()
    const original = firstLeaf(base.splits)
    const state = splitForNewPane(base, original.id, 'col')
    const fresh = allLeaves(state.splits).find(leaf => leaf.id === state.activePane)!

    const next = closePane(state, fresh.id)
    // activePane points at the surviving pane (the original), not the removed one.
    expect(next.activePane).toBe(original.id)
    expect(next.activePane).not.toBe(fresh.id)
  })

  it('works in the bottom panel tree too', () => {
    const base = makeDefaultState()
    const original = firstLeaf(base.bottomSplits)
    const beforeCount = allLeaves(base.bottomSplits).length
    const state = splitForNewPane(base, original.id, 'row')
    const fresh = allLeaves(state.bottomSplits).find(leaf => leaf.id === state.activePane)!

    const next = closePane(state, fresh.id)
    expect(allLeaves(next.bottomSplits).length).toBe(beforeCount)
    expect(firstLeaf(next.bottomSplits).id).toBe(original.id)
    expect(next.activePane).toBe(original.id)
  })

  it('is a no-op (same state reference) for a root leaf with no parent split', () => {
    const state = makeDefaultState()
    // The right panel's root IS a leaf (no parent) — not closeable.
    const root = firstLeaf(state.splits)
    expect(closePane(state, root.id)).toBe(state)
  })

  it('closes a NESTED empty pane, promoting its sibling but keeping the outer split', () => {
    const base = makeDefaultState()
    const outer = firstLeaf(base.splits)
    // First + : split A (col) wraps [outer, fresh1].
    let state = splitForNewPane(base, outer.id, 'col')
    const fresh1 = state.activePane!
    // Second + on fresh1: split B (col) wraps [fresh1, fresh2] INSIDE A.
    state = splitForNewPane(state, fresh1, 'col')
    const fresh2 = state.activePane!
    expect(allLeaves(state.splits).length).toBe(3)

    // Close the deepest empty pane (fresh2): its sibling fresh1 is promoted,
    // so split B collapses but the outer split A (with outer + fresh1) stays.
    const next = closePane(state, fresh2)
    expect(allLeaves(next.splits).length).toBe(2)
    expect(allLeaves(next.splits).map(leaf => leaf.id)).toContain(outer.id)
    expect(allLeaves(next.splits).map(leaf => leaf.id)).toContain(fresh1)
    expect(allLeaves(next.splits).some(leaf => leaf.id === fresh2)).toBe(false)
    // Focus moves to the promoted sibling (fresh1).
    expect(next.activePane).toBe(fresh1)
  })

  it('does not mutate the input state', () => {
    const base = makeDefaultState()
    const original = firstLeaf(base.splits)
    const state = splitForNewPane(base, original.id, 'col')
    const fresh = allLeaves(state.splits).find(leaf => leaf.id === state.activePane)!
    const snapshot = JSON.stringify(state)
    closePane(state, fresh.id)
    expect(JSON.stringify(state)).toBe(snapshot)
  })
})

/** Pull every split's sizes out of the tree in a stable order, for size
 *  preservation assertions (deep equality of the structure). */
function extractSizes(node: SplitNode): number[][] {
  if (node.kind === 'leaf') return []
  return [node.sizes, ...node.children.flatMap(extractSizes)]
}
