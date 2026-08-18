window.__ModuleLoader__.load({
	id: "dsh-powerdesk",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_dom_client = require("react-dom/client");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		/** Fallback prefs used whenever the settings document is unreachable or malformed. */
		const SIDEBAR_PREFS_DEFAULTS = {
			openByDefault: true,
			defaultWidthPercent: 30,
			autoOpenSubagent: true,
			autoOpenJobs: true,
			agentTerminalTools: false,
			bottomPanelAutoTerminal: true,
			terminalFontFamily: "",
			terminalFontSize: 13,
			interceptOpenPath: true,
			titleBarCompat: false,
			titleBarStripPx: 40,
			htmlViewerNoSandbox: false,
			htmlViewerDefaultUnsafe: false,
			browserNoSandbox: false,
			browserInterceptLinks: true,
			browserInterceptHttp: true,
			browserInterceptHttps: false,
			tabsEnabled: {},
			viewersEnabled: {},
			pluginSettings: {}
		};
		/** Whether a viewport width is narrow (mobile). */
		function isNarrowWidth(width) {
			return width < 768;
		}
		let nextIdCounter = 0;
		/** Unique pane/tab id within one state instance. */
		function uid(prefix) {
			nextIdCounter += 1;
			return `${prefix}:${nextIdCounter}`;
		}
		/**
		* The largest numeric suffix across a raw persisted state's counter ids
		* (`pane:N` / `tab:N` / `split:N`). The uid counter is module-global and
		* resets on every reload, so a split minted AFTER a reload would collide
		* with the persisted ids (a fresh "pane:1" beside the persisted "pane:1");
		* mapLeaf would then visit BOTH leaves and every open would land in both
		* panes of the split. Seeding the counter past the persisted ids keeps
		* fresh ids disjoint.
		*/
		function maxCounterId(parsed) {
			let max = 0;
			const consider = (id) => {
				if (typeof id !== "string") return;
				const match = /^(?:pane|tab|split):(\d+)$/.exec(id);
				if (match !== null) max = Math.max(max, Number(match[1]));
			};
			const walk = (node) => {
				if (node === null || typeof node !== "object") return;
				const record = node;
				consider(record.id);
				if (Array.isArray(record.tabs)) {
					for (const tab of record.tabs) if (tab !== null && typeof tab === "object") consider(tab.id);
				}
				if (Array.isArray(record.children)) for (const child of record.children) walk(child);
			};
			walk(parsed?.splits);
			walk(parsed?.bottomSplits);
			return max;
		}
		/** A fresh default state: one explorer tab in one pane, open per the caller's
		* preference. `width` is the caller's preferred panel width (default
		* PANEL_DEFAULT) and `panelOpen` whether the panel starts expanded (default
		* true); the store seeds new sessions from the user's side card prefs.
		* `seedExplorer` places the default explorer tab — the store passes false
		* when the user disabled the explorer tab type in settings, so a fresh
		* session starts with an empty pane instead of a tab they turned off. */
		function makeDefaultState(width = 400, panelOpen = true, seedExplorer = true) {
			const leaf = {
				kind: "leaf",
				id: uid("pane"),
				tabs: [],
				active: null
			};
			if (seedExplorer) {
				leaf.tabs = [{
					id: uid("tab"),
					type: "explorer",
					title: "Explorer"
				}];
				leaf.active = leaf.tabs[0].id;
			}
			const bottomLeaf = {
				kind: "leaf",
				id: uid("pane"),
				tabs: [],
				active: null
			};
			return {
				panelOpen,
				width,
				activePane: leaf.id,
				nextTerminal: 1,
				nextBrowser: 1,
				expanded: [],
				splits: leaf,
				bottomOpen: false,
				bottomHeight: 220,
				bottomOpenedOnce: false,
				bottomSplits: bottomLeaf
			};
		}
		/** Whether a tree node (or any descendant) carries the given pane/split id. */
		function treeHasId(node, id) {
			if (node.id === id) return true;
			if (node.kind === "split") return node.children.some((child) => treeHasId(child, id));
			return false;
		}
		/** Which tree owns a pane/split id: 'bottomSplits' when the id lives in the
		*  bottom panel's tree, else 'splits' (the right panel's tree). Ids are
		*  globally unique (the shared uid counter), so an id in neither tree falls
		*  back to the right tree, where tree operations no-op on a missing node —
		*  the pre-bottom-panel behavior. */
		function treeOf(state, id) {
			return treeHasId(state.bottomSplits, id) ? "bottomSplits" : "splits";
		}
		/** Walk the tree and apply `visit` to the leaf with the given id. */
		function mapLeaf(node, paneId, visit) {
			if (node.kind === "leaf") {
				if (node.id === paneId) {
					const copy = {
						...node,
						tabs: [...node.tabs]
					};
					visit(copy);
					return copy;
				}
				return node;
			}
			const split = node;
			return {
				...split,
				sizes: [...split.sizes],
				children: split.children.map((child) => mapLeaf(child, paneId, visit))
			};
		}
		/** The first leaf of the tree (fallback pane when activePane is gone). */
		function firstLeaf(node) {
			if (node.kind === "leaf") return node;
			return firstLeaf(node.children[0]);
		}
		/** Find the leaf containing a tab id, if any. */
		function leafWithTab(node, tabId) {
			if (node.kind === "leaf") return node.tabs.some((tab) => tab.id === tabId) ? node : void 0;
			for (const child of node.children) {
				const found = leafWithTab(child, tabId);
				if (found !== void 0) return found;
			}
		}
		/** All leaves of the tree, depth-first. */
		function allLeaves(node) {
			if (node.kind === "leaf") return [node];
			return node.children.flatMap(allLeaves);
		}
		/** Whether a tab exists anywhere in a state (either tree, any pane). */
		function tabOpenIn(state, tabId) {
			return allLeaves(state.splits).some((leaf) => leaf.tabs.some((tab) => tab.id === tabId)) || allLeaves(state.bottomSplits).some((leaf) => leaf.tabs.some((tab) => tab.id === tabId));
		}
		/** Replace a leaf with a split of it plus a fresh empty leaf. */
		function splitLeafAt(node, paneId, dir) {
			const fresh = {
				kind: "leaf",
				id: uid("pane"),
				tabs: [],
				active: null
			};
			return mapLeaf(node, paneId, (leaf) => {
				const target = { ...leaf };
				const split = {
					kind: "split",
					id: uid("split"),
					dir,
					sizes: [.5, .5],
					children: [target, fresh]
				};
				Object.assign(leaf, split);
			});
		}
		/**
		* The "+" button's "open a new page" action: split the leaf that owns
		* `paneId` (in whichever tree — right panel `splits` or bottom panel
		* `bottomSplits`, resolved via {@link treeOf}) and activate the fresh empty
		* leaf it creates. The fresh leaf is empty, so it renders the empty-state
		* card grid (explorer / notes / terminal / browser) — the user then picks a
		* card to open that tab type in the new pane. This replaces the old "+"
		* dropdown menu: the "+" always opens a new pane showing the cards.
		*
		* `dir` is the split direction: 'col' (stack) for the narrow right sidebar,
		* 'row' (side-by-side) for the wide bottom panel — passed by the caller per
		* panel so the new pane gets usable space.
		* @returns the new state with the fresh leaf split in and activated.
		*/
		function splitForNewPane(state, paneId, dir) {
			const key = treeOf(state, paneId);
			const before = new Set(allLeaves(state[key]).map((leaf) => leaf.id));
			const splits = splitLeafAt(state[key], paneId, dir);
			const fresh = allLeaves(splits).find((leaf) => !before.has(leaf.id));
			return {
				...state,
				[key]: splits,
				activePane: fresh?.id ?? state.activePane
			};
		}
		/**
		* Reorient the split that DIRECTLY contains `leafId` as a child: set its
		* `dir` to `dir` (row ↔ col) so the leaf moves from beside its sibling to
		* below it (or vice versa). Sizes are preserved — only the layout axis
		* changes, so a pane the user resized keeps its proportion after a flip.
		*
		* This is the empty-state card page's horizontal/vertical radio: the "+"
		* button splits the pane in the panel's default direction (col for the
		* narrow right sidebar → the new pane lands below; row for the wide
		* bottom panel → side-by-side), then the radio lets the user reorient that
		* split so the new pane lands where they actually want it BEFORE picking a
		* card. No-op (returns the same state reference) when `leafId` is the root
		* (no parent split — e.g. the sole pane of a panel after every tab was
		* closed) or when the split already has the requested direction.
		*/
		function reorientSplit(state, leafId, dir) {
			const key = treeOf(state, leafId);
			const splits = reorientParentSplit(state[key], leafId, dir);
			if (splits === state[key]) return state;
			return {
				...state,
				[key]: splits
			};
		}
		/** Find the split whose DIRECT child is `leafId` and return a copy with its
		*  `dir` set to `dir` (or the same node if already that direction / not
		*  found). Walks the tree; only the immediate parent split of the leaf is
		*  reoriented — deeper splits are left untouched. */
		function reorientParentSplit(node, leafId, dir) {
			if (node.kind === "leaf") return node;
			const split = node;
			if (split.children.some((child) => child.id === leafId)) return split.dir === dir ? node : {
				...split,
				dir
			};
			const children = split.children.map((child) => reorientParentSplit(child, leafId, dir));
			if (children.every((child, i) => child === split.children[i])) return node;
			return {
				...split,
				children
			};
		}
		/**
		* Close (dismiss) an empty pane created by the "+" button's split, undoing
		* the split: remove the leaf via {@link removeLeafAt} (which promotes its
		* lone sibling when the parent split is left with one child, collapsing the
		* split so the surviving pane reclaims the full width/height) and move the
		* active focus to that surviving pane so the user is never left staring at
		* a stale/disappeared pane id.
		*
		* Only meaningful when the leaf has a parent split (i.e. it was created by
		* a split, not the tree root): the empty-state card page's close button is
		* hidden for a root leaf (see SplitPane.tsx — same gate as the orientation
		* radio), so this is never called on a root from the UI. As a guard, a root
		* leaf (no sibling found) is a no-op: the welcome pane is not closeable —
		* closing it would empty the panel's only pane for no benefit.
		* @returns the new state, or the SAME state reference when the leaf is the
		*          root (no parent to collapse) — so callers can skip persist/notify.
		*/
		function closePane(state, paneId) {
			const key = treeOf(state, paneId);
			const sibling = siblingFirstLeafId(state[key], paneId);
			if (sibling === void 0) return state;
			const splits = removeLeafAt(state[key], paneId);
			return {
				...state,
				[key]: splits,
				activePane: sibling
			};
		}
		/** The id of the first leaf of the SUBTREE that is the sibling of `leafId`
		*  in its immediate parent split — the pane that survives and reclaims the
		*  space when `leafId` is removed (and the natural focus target). Returns
		*  undefined when `leafId` is the tree root (no parent split) or when the
		*  leaf cannot be found. */
		function siblingFirstLeafId(node, leafId) {
			if (node.kind === "leaf") return void 0;
			const split = node;
			if (split.children.some((child) => child.id === leafId)) {
				const sibling = split.children.find((child) => child.id !== leafId);
				return sibling === void 0 ? void 0 : firstLeaf(sibling).id;
			}
			for (const child of split.children) {
				const found = siblingFirstLeafId(child, leafId);
				if (found !== void 0) return found;
			}
		}
		/**
		* Split a leaf by inserting a fresh leaf holding `tab` beside it — the
		* VSCode drag-to-edge gesture. `dir` is the split direction ('row' for
		* left/right, 'col' for up/down); `front` places the new leaf first (left/
		* up) or second (right/down).
		* @returns the new tree plus the fresh leaf's id (the drop's active pane).
		*/
		function insertLeafAt(node, paneId, dir, tab, front) {
			const fresh = {
				kind: "leaf",
				id: uid("pane"),
				tabs: [tab],
				active: tab.id
			};
			const leafId = fresh.id;
			return {
				node: mapLeaf(node, paneId, (leaf) => {
					const target = { ...leaf };
					const split = {
						kind: "split",
						id: uid("split"),
						dir,
						sizes: [.5, .5],
						children: front ? [fresh, target] : [target, fresh]
					};
					Object.assign(leaf, split);
				}),
				leafId
			};
		}
		/**
		* The VSCode drag gesture: move a tab out of its pane and either merge it
		* into the target pane (center) or split the target pane with the tab in a
		* fresh leaf (edge). The source pane collapses when it empties.
		*
		* The panes may live in DIFFERENT trees (dragging a tab between the two
		* panels): the tab then leaves its own tree and lands in the other one.
		*/
		function moveTabToEdge(state, fromPane, tabId, toPane, zone) {
			if (fromPane === toPane && zone === "center") return moveTab(state, fromPane, tabId, toPane, -1);
			const key = treeOf(state, fromPane);
			const toKey = treeOf(state, toPane);
			if (key !== toKey) {
				const source = leafWithTab(state[key], tabId);
				if (source === void 0) return state;
				const tab = source.tabs.find((candidate) => candidate.id === tabId);
				let emptied = false;
				let sourceNode = mapLeaf(state[key], source.id, (leaf) => {
					leaf.tabs = leaf.tabs.filter((candidate) => candidate.id !== tabId);
					if (leaf.active === tabId) leaf.active = leaf.tabs[leaf.tabs.length - 1]?.id ?? null;
					if (leaf.tabs.length === 0) emptied = true;
				});
				if (emptied) sourceNode = removeLeafAt(sourceNode, source.id);
				let targetNode = state[toKey];
				let activePane;
				if (zone === "center") {
					targetNode = mapLeaf(targetNode, toPane, (leaf) => {
						leaf.tabs = [...leaf.tabs, tab];
						leaf.active = tab.id;
					});
					activePane = toPane;
				} else {
					const result = insertLeafAt(targetNode, toPane, zone === "left" || zone === "right" ? "row" : "col", tab, zone === "left" || zone === "up");
					targetNode = result.node;
					activePane = result.leafId;
				}
				return {
					...state,
					[key]: sourceNode,
					[toKey]: targetNode,
					activePane
				};
			}
			const node = state[key];
			const source = leafWithTab(node, tabId);
			if (source === void 0) return state;
			const tab = source.tabs.find((candidate) => candidate.id === tabId);
			let emptied = false;
			let splits = mapLeaf(node, source.id, (leaf) => {
				leaf.tabs = leaf.tabs.filter((candidate) => candidate.id !== tabId);
				if (leaf.active === tabId) leaf.active = leaf.tabs[leaf.tabs.length - 1]?.id ?? null;
				if (leaf.tabs.length === 0) emptied = true;
			});
			if (emptied) splits = removeLeafAt(splits, source.id);
			if (zone === "center") {
				splits = mapLeaf(splits, toPane, (leaf) => {
					leaf.tabs = [...leaf.tabs, tab];
					leaf.active = tab.id;
				});
				return {
					...state,
					[key]: splits,
					activePane: toPane
				};
			}
			const result = insertLeafAt(splits, toPane, zone === "left" || zone === "right" ? "row" : "col", tab, zone === "left" || zone === "up");
			return {
				...state,
				[key]: result.node,
				activePane: result.leafId
			};
		}
		/**
		* Remove a leaf from the tree. A split left with one child promotes that
		* child; removing the last leaf yields an empty leaf.
		*/
		function removeLeafAt(node, paneId) {
			if (node.kind === "leaf") return node.id === paneId ? {
				...node,
				tabs: [],
				active: null
			} : node;
			const children = node.children.filter((child) => !(child.kind === "leaf" && child.id === paneId));
			if (children.length === node.children.length) return {
				...node,
				sizes: [...node.sizes],
				children: node.children.map((child) => removeLeafAt(child, paneId))
			};
			if (children.length === 1) return children[0];
			return {
				...node,
				sizes: [...node.sizes],
				children
			};
		}
		/** Close a tab; an emptied leaf is removed (unless it is the only pane). */
		function closeTab(state, paneId, tabId) {
			const key = treeOf(state, paneId);
			let emptied = false;
			const splits = mapLeaf(state[key], paneId, (leaf) => {
				leaf.tabs = leaf.tabs.filter((tab) => tab.id !== tabId);
				if (leaf.active === tabId) leaf.active = leaf.tabs[leaf.tabs.length - 1]?.id ?? null;
				if (leaf.tabs.length === 0) emptied = true;
			});
			return {
				...state,
				[key]: emptied ? removeLeafAt(splits, paneId) : splits
			};
		}
		/** Activate a tab in its pane (the pane's own tree). */
		function activateTab(state, paneId, tabId) {
			const key = treeOf(state, paneId);
			return {
				...state,
				activePane: paneId,
				[key]: mapLeaf(state[key], paneId, (leaf) => {
					if (leaf.tabs.some((tab) => tab.id === tabId)) leaf.active = tabId;
				})
			};
		}
		/** Update the display fields of one open tab (title / path / meta) without
		*  re-opening it. The browser tab persists its current URL and hostname
		*  title through this reducer so a reload restores the visited page. A
		*  missing tab id is a no-op. The tab may live in either tree. */
		function patchTab(state, tabId, patch) {
			let changed = false;
			const walk = (node) => {
				if (node.kind === "leaf") {
					const tabs = node.tabs.map((tab) => {
						if (tab.id !== tabId) return tab;
						changed = true;
						return {
							...tab,
							...patch.title !== void 0 ? { title: patch.title } : {},
							...patch.path !== void 0 ? { path: patch.path } : {},
							...patch.meta !== void 0 ? { meta: patch.meta } : {}
						};
					});
					return tabs === node.tabs ? node : {
						...node,
						tabs
					};
				}
				const children = node.children.map(walk);
				return children === node.children ? node : {
					...node,
					children
				};
			};
			const splits = walk(state.splits);
			const bottomSplits = walk(state.bottomSplits);
			return changed ? {
				...state,
				splits,
				bottomSplits
			} : state;
		}
		/**
		* Land a tab in the active pane (or focus its existing instance by id).
		* Dedup strategies (single-instance, per-path, per-change) are owned by the
		* tab descriptor through {@link PowerdeskSidebarService.openTab} / `dedupeKey`;
		* this reducer only handles the id-based safety net (reconcile and
		* openDiffTab already check existence before calling) and the landing
		* itself — the service's dedupe path delegates here after its dedupeKey
		* check misses.
		*
		* The active pane may live in EITHER tree (pane ids are globally unique):
		* a stale id that survives in neither tree falls back to the right tree's
		* first pane instead of swallowing the open.
		*/
		function openTabInActivePane(state, tab) {
			let targetId = state.activePane ?? firstLeaf(state.splits).id;
			if (!allLeaves(state[treeOf(state, targetId)]).some((leaf) => leaf.id === targetId)) targetId = firstLeaf(state.splits).id;
			const targetKey = treeOf(state, targetId);
			for (const leaf of allLeaves(state.splits).concat(allLeaves(state.bottomSplits))) {
				const existing = leaf.tabs.find((candidate) => candidate.id === tab.id);
				if (existing !== void 0) return activateTab(state, leaf.id, existing.id);
			}
			return {
				...state,
				activePane: targetId,
				[targetKey]: mapLeaf(state[targetKey], targetId, (leaf) => {
					leaf.tabs = [...leaf.tabs, tab];
					leaf.active = tab.id;
				})
			};
		}
		/** Move a tab from one pane to another (insert at index; -1 appends).
		*  The panes may live in DIFFERENT trees — dragging a tab between the two
		*  panels removes it from its own tree and lands it in the other one. */
		function moveTab(state, fromPane, tabId, toPane, index = -1) {
			const fromKey = treeOf(state, fromPane);
			const toKey = treeOf(state, toPane);
			if (fromKey !== toKey) {
				let moved;
				let emptied = false;
				const source = mapLeaf(state[fromKey], fromPane, (leaf) => {
					const found = leaf.tabs.find((tab) => tab.id === tabId);
					if (found === void 0) return;
					moved = found;
					leaf.tabs = leaf.tabs.filter((tab) => tab.id !== tabId);
					if (leaf.active === tabId) leaf.active = leaf.tabs[leaf.tabs.length - 1]?.id ?? null;
					if (leaf.tabs.length === 0) emptied = true;
				});
				if (moved === void 0) return state;
				const target = mapLeaf(state[toKey], toPane, (leaf) => {
					const insertAt = index >= 0 && index <= leaf.tabs.length ? index : leaf.tabs.length;
					leaf.tabs = [
						...leaf.tabs.slice(0, insertAt),
						moved,
						...leaf.tabs.slice(insertAt)
					];
					leaf.active = moved.id;
				});
				return {
					...state,
					[fromKey]: emptied ? removeLeafAt(source, fromPane) : source,
					[toKey]: target,
					activePane: toPane
				};
			}
			let moved;
			let emptied = false;
			let splits = mapLeaf(state[fromKey], fromPane, (leaf) => {
				const found = leaf.tabs.find((tab) => tab.id === tabId);
				if (found === void 0) return;
				moved = found;
				leaf.tabs = leaf.tabs.filter((tab) => tab.id !== tabId);
				if (leaf.active === tabId) leaf.active = leaf.tabs[leaf.tabs.length - 1]?.id ?? null;
				if (leaf.tabs.length === 0) emptied = true;
			});
			if (moved === void 0) return state;
			if (emptied) splits = removeLeafAt(splits, fromPane);
			splits = mapLeaf(splits, toPane, (leaf) => {
				const insertAt = index >= 0 && index <= leaf.tabs.length ? index : leaf.tabs.length;
				leaf.tabs = [
					...leaf.tabs.slice(0, insertAt),
					moved,
					...leaf.tabs.slice(insertAt)
				];
				leaf.active = moved.id;
			});
			return {
				...state,
				[fromKey]: splits,
				activePane: toPane
			};
		}
		/** Toggle the panel open/closed (opening restores the previous layout). */
		function togglePanel(state) {
			return {
				...state,
				panelOpen: !state.panelOpen
			};
		}
		/** Toggle the bottom panel open/closed (independent of the right panel). */
		function toggleBottomPanel(state) {
			return {
				...state,
				bottomOpen: !state.bottomOpen
			};
		}
		/** Set the panel width (clamped to the contract range; the upper bound is
		* the viewport so the fullscreen expansion can fill the window). */
		function setWidth(state, width) {
			const max = typeof window !== "undefined" ? Math.max(280, window.innerWidth) : 640;
			return {
				...state,
				width: Math.min(max, Math.max(280, Math.round(width)))
			};
		}
		/** Set the bottom panel height (clamped to the contract range). The upper
		* bound leaves the center column (the agent output area) at least PANEL_MIN
		* tall — without the cap the bottom panel could swallow the whole viewport
		* and squeeze the conversation to zero height. */
		function setBottomHeight(state, height) {
			const viewport = typeof window !== "undefined" ? window.innerHeight : Infinity;
			const max = Math.max(120, viewport - 280);
			return {
				...state,
				bottomHeight: Math.min(max, Math.max(120, Math.round(height)))
			};
		}
		/** Toggle a directory in the explorer expansion set. */
		function toggleExpanded(state, path) {
			const expanded = state.expanded.includes(path) ? state.expanded.filter((item) => item !== path) : [...state.expanded, path];
			return {
				...state,
				expanded
			};
		}
		/** Adjust one split divider: `i` is the left/top child index, delta in fractions. */
		function resizeSplit(node, splitId, index, delta) {
			if (node.kind === "leaf") return node;
			if (node.id === splitId) {
				const sizes = [...node.sizes];
				const left = Math.min(.92, Math.max(.08, sizes[index] + delta));
				const right = Math.min(.92, Math.max(.08, sizes[index + 1] - delta));
				sizes[index] = left;
				sizes[index + 1] = right;
				return {
					...node,
					sizes
				};
			}
			return {
				...node,
				sizes: [...node.sizes],
				children: node.children.map((child) => resizeSplit(child, splitId, index, delta))
			};
		}
		/** State-level {@link resizeSplit} route: the divider may live in either
		*  tree (split ids are globally unique). */
		function resizeSplitIn(state, splitId, index, delta) {
			const key = treeOf(state, splitId);
			return {
				...state,
				[key]: resizeSplit(state[key], splitId, index, delta)
			};
		}
		/** The Explorer tab's id (also its type — `single: true` means one instance).
		*  Shared between index.tsx (registers the descriptor) and SplitPane.tsx
		*  (opening a file splits the explorer's pane instead of stacking the file
		*  on top of it) — defined here, the lowest shared module, to avoid a
		*  index.tsx <-> SplitPane.tsx import cycle (index.tsx -> SidebarShell.tsx
		*  -> SplitPane.tsx). */
		const EXPLORER_TAB_ID = "dsh-powerdesk:explorer";
		const STORAGE_PREFIX = "dsh-sidebar:v1";
		/** Default panel width for one viewport: the prefs percent of the window,
		* clamped to the panel floor (a tiny percent must stay usable) and to the
		* viewport (a large one must never cover the whole window). */
		function defaultWidthFor(viewport, percent) {
			return Math.min(viewport, Math.max(280, Math.round(viewport * percent / 100)));
		}
		function loadState(sessionId, prefs) {
			try {
				const raw = localStorage.getItem(`${STORAGE_PREFIX}:${sessionId}`);
				if (raw !== null) {
					const parsed = JSON.parse(raw);
					nextIdCounter = maxCounterId(parsed);
					const sanitized = sanitizeState(parsed);
					if (sanitized !== void 0) return sanitized;
				}
			} catch {}
			const viewport = typeof window !== "undefined" ? window.innerWidth : void 0;
			return makeDefaultState(viewport === void 0 ? 400 : defaultWidthFor(viewport, prefs.defaultWidthPercent), prefs.openByDefault && (viewport === void 0 || !isNarrowWidth(viewport)), false);
		}
		/**
		* Structural validation of one persisted state. A malformed or stale shape
		* (older layouts, hand-edited storage) must fall back to the default instead
		* of crashing the panel on every reload; the restored width is also clamped
		* to the current viewport so a stale fullscreen width can never crush the
		* app shell (margin-right larger than the window) or cover the whole screen.
		* @returns a clean state, or undefined to fall back to the default.
		*/
		function sanitizeState(parsed) {
			if (parsed === null || typeof parsed !== "object") return void 0;
			const record = parsed;
			if (typeof record.panelOpen !== "boolean") return void 0;
			if (typeof record.width !== "number" || !Number.isFinite(record.width)) return void 0;
			if (typeof record.nextTerminal !== "number" || !Number.isInteger(record.nextTerminal) || record.nextTerminal < 1) return;
			const nextBrowser = typeof record.nextBrowser === "number" && Number.isInteger(record.nextBrowser) && record.nextBrowser >= 1 ? record.nextBrowser : 1;
			if (typeof record.activePane !== "string" && record.activePane !== null) return void 0;
			if (!Array.isArray(record.expanded) || record.expanded.some((item) => typeof item !== "string")) return void 0;
			const seen = /* @__PURE__ */ new Set();
			const reid = /* @__PURE__ */ new Map();
			const splits = sanitizeNode(record.splits, seen, reid);
			if (splits === void 0) return void 0;
			const bottomOpen = record.bottomOpen === true;
			const maxHeight = typeof window !== "undefined" ? window.innerHeight : Infinity;
			const bottomCap = Math.max(120, maxHeight - 280);
			const rawHeight = typeof record.bottomHeight === "number" && Number.isFinite(record.bottomHeight) ? record.bottomHeight : 220;
			const bottomHeight = Math.min(bottomCap, Math.max(120, Math.round(rawHeight)));
			const bottomSplits = sanitizeNode(record.bottomSplits, seen, reid) ?? {
				kind: "leaf",
				id: uid("pane"),
				tabs: [],
				active: null
			};
			const maxWidth = typeof window !== "undefined" ? window.innerWidth : Infinity;
			return {
				panelOpen: record.panelOpen,
				width: Math.max(280, Math.min(record.width, maxWidth)),
				activePane: typeof record.activePane === "string" ? reid.get(record.activePane) ?? record.activePane : null,
				nextTerminal: record.nextTerminal,
				nextBrowser,
				expanded: record.expanded,
				splits,
				bottomOpen,
				bottomHeight,
				bottomOpenedOnce: record.bottomOpenedOnce === true,
				bottomSplits
			};
		}
		/**
		* One tree node id, deduplicated against the ids already seen in this
		* state. Duplicates are exactly the pre-seeding counter-reset corruption
		* (a "pane:1"/"split:1" minted after a reload beside the persisted ones):
		* keeping both would make mapLeaf visit two leaves at once and every open
		* would land in both panes, so the repeat gets a fresh id.
		* @returns the id to use (the original, or a fresh uid for repeats).
		*/
		function uniqueNodeId(id, seen, reid) {
			if (!seen.has(id)) {
				seen.add(id);
				return id;
			}
			const fresh = uid(/^split:\d+$/.test(id) ? "split" : "pane");
			seen.add(fresh);
			reid.set(id, fresh);
			return fresh;
		}
		/** Validate one split-tree node (leaf or split) and rebuild it cleanly. */
		function sanitizeNode(node, seen, reid) {
			if (node === null || typeof node !== "object") return void 0;
			const record = node;
			if (record.kind === "leaf") {
				if (typeof record.id !== "string" || !Array.isArray(record.tabs)) return void 0;
				const tabs = [];
				let droppedDiff = false;
				for (const tab of record.tabs) {
					if (tab === null || typeof tab !== "object") return void 0;
					const candidate = tab;
					if (typeof candidate.id !== "string" || typeof candidate.title !== "string") return void 0;
					if (candidate.type === "diff") {
						droppedDiff = true;
						continue;
					}
					if (typeof candidate.type !== "string") return void 0;
					tabs.push({
						id: candidate.id,
						type: candidate.type,
						title: candidate.title,
						...typeof candidate.path === "string" ? { path: candidate.path } : {},
						...candidate.meta !== void 0 ? { meta: candidate.meta } : {}
					});
				}
				const active = typeof record.active === "string" ? record.active : null;
				if (active !== null && !tabs.some((tab) => tab.id === active) && !droppedDiff) return void 0;
				return {
					kind: "leaf",
					id: uniqueNodeId(record.id, seen, reid),
					tabs,
					active: active !== null && tabs.some((tab) => tab.id === active) ? active : null
				};
			}
			if (record.kind === "split") {
				if (typeof record.id !== "string" || record.dir !== "row" && record.dir !== "col") return void 0;
				if (!Array.isArray(record.children) || !Array.isArray(record.sizes)) return void 0;
				const children = [];
				for (const child of record.children) {
					const clean = sanitizeNode(child, seen, reid);
					if (clean === void 0) return void 0;
					children.push(clean);
				}
				if (children.length < 2) return void 0;
				if (record.sizes.length !== children.length || record.sizes.some((size) => typeof size !== "number" || !Number.isFinite(size) || size <= 0)) return;
				return {
					kind: "split",
					id: uniqueNodeId(record.id, seen, reid),
					dir: record.dir,
					sizes: record.sizes,
					children
				};
			}
		}
		/** The session-scoped store: one state per conversation, localStorage-backed. */
		var SidebarStore = class {
			bySession = /* @__PURE__ */ new Map();
			snapshot = {
				sessionId: void 0,
				state: void 0,
				prefs: { ...SIDEBAR_PREFS_DEFAULTS }
			};
			listeners = /* @__PURE__ */ new Set();
			/** Per-session persist debounce timers (v0.12.0+: one per session, so a
			*  targeted open never cancels another session's pending write). */
			persistTimers = /* @__PURE__ */ new Map();
			/** User-facing side card prefs seeding brand-new session states (defaults until the settings RPC resolves). */
			prefs = { ...SIDEBAR_PREFS_DEFAULTS };
			/**
			* Replace the side card prefs (the settings RPC result / settings page
			* write). Notifies like any store change: the snapshot carries the prefs,
			* so consumers that gate on enable switches (the + menu, derived flows)
			* re-render with the new values immediately.
			*/
			setPrefs(prefs) {
				this.prefs = { ...prefs };
				this.snapshot = {
					...this.snapshot,
					prefs: this.prefs
				};
				this.notify();
			}
			/** The current side card prefs (seeds new sessions; persisted states win). */
			getPrefs() {
				return { ...this.prefs };
			}
			/** Select a session (or none); loads its persisted state. */
			setSession(sessionId) {
				if (this.snapshot.sessionId === sessionId) return;
				if (sessionId === void 0) this.snapshot = {
					sessionId: void 0,
					state: void 0,
					prefs: this.prefs
				};
				else {
					let state = this.bySession.get(sessionId);
					if (state === void 0) {
						state = loadState(sessionId, this.prefs);
						this.bySession.set(sessionId, state);
					} else nextIdCounter = maxCounterId(state);
					this.snapshot = {
						sessionId,
						state,
						prefs: this.prefs
					};
				}
				this.notify();
			}
			subscribe(listener) {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			}
			getSnapshot() {
				return this.snapshot;
			}
			/** Mutate the current session's state (no-op without a session). */
			update(mutator) {
				const sessionId = this.snapshot.sessionId;
				const state = this.snapshot.state;
				if (sessionId === void 0 || state === void 0) return;
				const draft = structuredClone(state);
				mutator(draft);
				this.bySession.set(sessionId, draft);
				this.snapshot = {
					sessionId,
					state: draft,
					prefs: this.prefs
				};
				this.schedulePersist(sessionId, draft);
				this.notify();
			}
			/**
			* Whether a tab still exists in its session's state. Views use this on
			* unmount to tell "the tab was closed" (release the terminal now) from
			* "the tree re-rendered / the conversation switched" (the tab is still
			* open — keep the terminal alive through the host's reconnect grace).
			* Checks the session's own map entry (the current snapshot may already
			* point at another session when a conversation switch unmounts the old
			* one's tabs).
			*/
			tabOpen(sessionId, tabId) {
				const state = this.bySession.get(sessionId) ?? (this.snapshot.sessionId === sessionId ? this.snapshot.state : void 0);
				return state !== void 0 && tabOpenIn(state, tabId);
			}
			/** Apply a pure reducer (returns the next state). */
			reduce(reducer) {
				const sessionId = this.snapshot.sessionId;
				const state = this.snapshot.state;
				if (sessionId === void 0 || state === void 0) return;
				const next = reducer(state);
				if (next === state) return;
				this.bySession.set(sessionId, next);
				this.snapshot = {
					sessionId,
					state: next,
					prefs: this.prefs
				};
				this.schedulePersist(sessionId, next);
				this.notify();
			}
			/**
			* Apply a pure reducer to a TARGET session's state (not the active one),
			* loading it on demand and persisting the result — WITHOUT switching the
			* active snapshot or notifying (the UI must not follow along). Used by the
			* service's targeted `openTab(seed, scope)`: the open lands in the target
			* session's layout and is visible whenever the user switches to it.
			*/
			reduceFor(sessionId, reducer) {
				const counterBefore = nextIdCounter;
				let state = this.bySession.get(sessionId);
				if (state === void 0) {
					state = loadState(sessionId, this.prefs);
					this.bySession.set(sessionId, state);
				} else nextIdCounter = maxCounterId(state);
				const next = reducer(state);
				nextIdCounter = Math.max(nextIdCounter, counterBefore);
				if (next === state) return;
				this.bySession.set(sessionId, next);
				this.schedulePersist(sessionId, next);
			}
			schedulePersist(sessionId, state) {
				const existing = this.persistTimers.get(sessionId);
				if (existing !== void 0) window.clearTimeout(existing);
				const timer = window.setTimeout(() => {
					this.persistTimers.delete(sessionId);
					try {
						localStorage.setItem(`${STORAGE_PREFIX}:${sessionId}`, JSON.stringify(state));
					} catch {}
				}, 200);
				this.persistTimers.set(sessionId, timer);
			}
			notify() {
				for (const listener of [...this.listeners]) listener();
			}
		};
		/**
		* Create one sidebar store instance. Production code calls this only from
		* the client plugin's `apply` (the instance is handed to components as a
		* prop); tests call it directly. No module-level singleton: the store's
		* lifetime belongs to the plugin activation, exactly like the official
		* `createXXXStore()` factory rule.
		*/
		function createSidebarStore() {
			return new SidebarStore();
		}
		//#endregion
		//#region src/client/service.ts
		/** Extract the lowercase extension without leading dot from a path. */
		function extOfPath(path) {
			const at = path.lastIndexOf(".");
			if (at === -1) return "";
			const base = path.slice(at + 1).toLowerCase();
			return base.includes("/") || base.includes("\\") ? "" : base;
		}
		/** The file name of a path (both separators). */
		function baseNameOf(path) {
			const at = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
			return at === -1 ? path : path.slice(at + 1);
		}
		/**
		* The plugin version this service instance reports. Keep in lockstep with
		* `package.json`'s version — `tests/service.spec.ts` asserts the pair.
		*/
		const SIDEBAR_SERVICE_VERSION = "0.12.3";
		/**
		* Monotonic capability list consumers use to gate new API usage (features
		* are never removed). Each string names a v0.12.0+ capability:
		* - 'badge': TabDescriptor.badge
		* - 'tabLifecycle': TabDescriptor.onOpen/onActivate/onClose
		* - 'updateTab': PowerdeskSidebarService.updateTab
		* - 'openFile': PowerdeskSidebarService.openFile
		* - 'targetedOpen': PowerdeskSidebarService.openTab(seed, scope?)
		* - 'stateSubscription': getSnapshot/subscribeState
		* - 'tabMeta': SidebarTab.meta (seeds, createTab, updateTab, persistence)
		* - 'pluginSettings': SidebarSettingsDeclaration.pluginToggles/render
		* - 'urlTarget' (v0.13.0): TabDescriptor.urlTarget (external-link claims)
		* - 'openFileAtLine' (v0.14.0): PowerdeskSidebarService.openFileAtLine
		*/
		const SIDEBAR_FEATURES = [
			"badge",
			"tabLifecycle",
			"updateTab",
			"openFile",
			"targetedOpen",
			"stateSubscription",
			"tabMeta",
			"pluginSettings",
			"urlTarget",
			"openFileAtLine"
		];
		/** Run one plugin callback; a throw is logged and never breaks the caller. */
		function safeCall(fn) {
			try {
				fn();
			} catch (error) {
				console.error("[dsh-powerdesk] plugin callback error:", error);
			}
		}
		/** localStorage key for {@link PowerdeskSidebarService.setTabEnabled}'s persistence. */
		const TABS_ENABLED_STORAGE_KEY = "dsh-powerdesk:tabs-enabled";
		function readPersistedTabsEnabled() {
			if (typeof localStorage === "undefined") return {};
			try {
				const raw = localStorage.getItem(TABS_ENABLED_STORAGE_KEY);
				if (raw === null) return {};
				const parsed = JSON.parse(raw);
				if (typeof parsed !== "object" || parsed === null) return {};
				const result = {};
				for (const [key, value] of Object.entries(parsed)) if (typeof value === "boolean") result[key] = value;
				return result;
			} catch {
				return {};
			}
		}
		function writePersistedTabsEnabled(map) {
			if (typeof localStorage === "undefined") return;
			try {
				localStorage.setItem(TABS_ENABLED_STORAGE_KEY, JSON.stringify(map));
			} catch {}
		}
		/**
		* Create one BetterSidebar service bound to a store. The service owns the
		* tab/viewer registries (Map + listener set) and proxies openTab/closeTab
		* to the store's reducer. One instance per client plugin activation.
		*/
		function createPowerdeskSidebarService(store) {
			const tabs = /* @__PURE__ */ new Map();
			const viewers = /* @__PURE__ */ new Map();
			const listeners = /* @__PURE__ */ new Set();
			const notify = () => {
				for (const fn of [...listeners]) fn();
			};
			const subscribe = (listener) => {
				listeners.add(listener);
				return () => {
					listeners.delete(listener);
				};
			};
			const registerTab = (descriptor) => {
				if (tabs.has(descriptor.id)) throw new Error(`[dsh-powerdesk] tab type "${descriptor.id}" already registered`);
				tabs.set(descriptor.id, descriptor);
				notify();
				return () => {
					if (tabs.get(descriptor.id) === descriptor) {
						tabs.delete(descriptor.id);
						notify();
					}
				};
			};
			const registerFileViewer = (descriptor) => {
				if (viewers.has(descriptor.id)) throw new Error(`[dsh-powerdesk] file viewer "${descriptor.id}" already registered`);
				viewers.set(descriptor.id, descriptor);
				notify();
				return () => {
					if (viewers.get(descriptor.id) === descriptor) {
						viewers.delete(descriptor.id);
						notify();
					}
				};
			};
			const getTabs = () => Array.from(tabs.values());
			const getFileViewers = () => Array.from(viewers.values());
			const getTab = (id) => tabs.get(id);
			let tabsEnabled = readPersistedTabsEnabled();
			const isTabEnabled = (id) => tabsEnabled[id] !== false;
			const setTabEnabled = (id, enabled) => {
				const next = { ...tabsEnabled };
				if (enabled) delete next[id];
				else next[id] = false;
				tabsEnabled = next;
				writePersistedTabsEnabled(next);
				notify();
			};
			const isViewerEnabled = (id) => store.getPrefs().viewersEnabled[id] !== false;
			const matchFileViewer = (path, head) => {
				const ext = extOfPath(path);
				for (const v of Array.from(viewers.values()).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))) {
					if (!isViewerEnabled(v.id)) continue;
					if (head !== void 0 && v.detect !== void 0) {
						if (v.detect(path, head)) return v;
						if (v.exts.length === 0) continue;
					} else if (v.exts.length === 0) {
						if (v.detect === void 0) return v;
						continue;
					}
					if (v.exts.includes(ext)) return v;
				}
			};
			const openTab = (seed, scope) => {
				if (!isTabEnabled(seed.type)) {
					console.warn(`[dsh-powerdesk] tab type "${seed.type}" is disabled in the side card settings`);
					return;
				}
				const descriptor = tabs.get(seed.type);
				if (descriptor === void 0) return;
				const targetSessionId = scope?.sessionId ?? store.getSnapshot().sessionId;
				if (targetSessionId === void 0) return;
				const callbackScope = scope ?? { sessionId: targetSessionId };
				const activeSessionId = store.getSnapshot().sessionId;
				const targetsInactiveSession = scope !== void 0 && scope.sessionId !== activeSessionId;
				let created;
				let activated;
				const reducer = (state) => {
					let tab;
					let next;
					if (descriptor.createTab !== void 0) {
						const result = descriptor.createTab(state);
						if (result === null) return state;
						tab = result.tab;
						next = applyDedupe(state, result.tab, descriptor);
						if (result.patch !== void 0) next = {
							...next,
							...result.patch
						};
					} else {
						tab = {
							id: seed.id ?? seed.type,
							type: seed.type,
							title: seed.title ?? (typeof descriptor.title === "function" ? descriptor.title() : descriptor.title),
							...seed.path !== void 0 ? { path: seed.path } : {},
							...seed.diff !== void 0 ? { diff: seed.diff } : {},
							...seed.meta !== void 0 ? { meta: seed.meta } : {}
						};
						next = applyDedupe(state, tab, descriptor);
					}
					const dedupeKey = descriptor.dedupeKey ?? (descriptor.single === true ? () => descriptor.id : void 0);
					const key = dedupeKey?.(tab);
					const inputTabs = allLeaves(state.splits).concat(allLeaves(state.bottomSplits)).flatMap((leaf) => leaf.tabs);
					const existedByKey = key !== void 0 && inputTabs.some((candidate) => candidate.type === tab.type && dedupeKey(candidate) === key);
					const existedById = tabOpenIn(state, tab.id);
					const isCreation = !existedByKey && !existedById;
					let landed = next;
					if (seed.url !== void 0 && isCreation) landed = patchTab(next, tab.id, {
						path: seed.url,
						...seed.title !== void 0 ? { title: seed.title } : {}
					});
					if (isCreation) created = allLeaves(landed.splits).concat(allLeaves(landed.bottomSplits)).flatMap((leaf) => leaf.tabs).find((candidate) => candidate.id === tab.id) ?? tab;
					else {
						const candidates = allLeaves(landed.splits).concat(allLeaves(landed.bottomSplits)).flatMap((leaf) => leaf.tabs);
						activated = key !== void 0 ? candidates.find((candidate) => candidate.type === tab.type && dedupeKey(candidate) === key) : candidates.find((candidate) => candidate.id === tab.id);
						activated ??= tab;
					}
					if (!targetsInactiveSession && typeof window !== "undefined" && (seed.path !== void 0 || seed.url !== void 0)) {
						if (isNarrowWidth(window.innerWidth)) {
							if (!landed.panelOpen) return togglePanel(landed);
						} else if (treeOf(landed, landed.activePane ?? "") === "bottomSplits") {
							if (!landed.bottomOpen) return {
								...landed,
								bottomOpen: true
							};
						} else if (!landed.panelOpen) return togglePanel(landed);
					}
					return landed;
				};
				if (targetsInactiveSession) store.reduceFor(scope.sessionId, reducer);
				else store.reduce(reducer);
				if (created !== void 0) safeCall(() => descriptor.onOpen?.(created, callbackScope));
				else if (activated !== void 0) safeCall(() => descriptor.onActivate?.(activated, callbackScope));
			};
			const closeTab$1 = (tabId, scope) => {
				let closed;
				store.reduce((state) => {
					if (!tabOpenIn(state, tabId)) return state;
					const paneId = findPaneIdOf(state, tabId);
					closed = leafWithTab(state[treeOf(state, paneId)], tabId)?.tabs.find((tab) => tab.id === tabId);
					return closeTab(state, paneId, tabId);
				});
				if (closed !== void 0) {
					const sessionId = scope?.sessionId ?? store.getSnapshot().sessionId;
					if (sessionId !== void 0) {
						const descriptor = tabs.get(closed.type);
						safeCall(() => descriptor?.onClose?.(closed, scope ?? { sessionId }));
					}
				}
			};
			/** The snapshot the store publishes (state/prefs carry the active session). */
			const getSnapshot = () => store.getSnapshot();
			/** Store changes: session switch, state mutations, prefs writes. */
			const subscribeState = (listener) => store.subscribe(listener);
			/** Patch an open tab's display fields (a missing tab id is a no-op). */
			const updateTab = (tabId, patch) => {
				store.reduce((state) => patchTab(state, tabId, {
					...patch.title !== void 0 ? { title: patch.title } : {},
					...patch.path !== void 0 ? { path: patch.path } : {},
					...patch.meta !== void 0 ? { meta: patch.meta } : {}
				}));
			};
			/** Activate an open tab (the tab-bar activation path; fires onActivate). */
			const activateTab$1 = (tabId, scope) => {
				let activated;
				store.reduce((state) => {
					if (!tabOpenIn(state, tabId)) return state;
					const paneId = findPaneIdOf(state, tabId);
					activated = leafWithTab(state[treeOf(state, paneId)], tabId)?.tabs.find((tab) => tab.id === tabId);
					return activateTab(state, paneId, tabId);
				});
				if (activated !== void 0) {
					const sessionId = scope?.sessionId ?? store.getSnapshot().sessionId;
					if (sessionId !== void 0) {
						const descriptor = tabs.get(activated.type);
						safeCall(() => descriptor?.onActivate?.(activated, scope ?? { sessionId }));
					}
				}
			};
			/** Open a file in the sidebar editor of `scope`'s session (title defaults
			*  to the file name; the tab id is path-derived, like the internal
			*  open-path interception, so distinct files open side by side). */
			const openFile = (scope, path, title) => {
				openTab({
					type: "editor",
					title: title ?? baseNameOf(path),
					path,
					id: `editor:${path}`
				}, scope);
			};
			/** Open a file and scroll it to `line` (Search tab result clicks). Reuses
			*  `openFile`'s mint-or-focus path, then unconditionally patches the
			*  editor tab's `meta` — `openTab`'s dedupe only applies a URL seed's path
			*  on CREATION, never on a focus of an already-open tab, so a second click
			*  on a different match in the same file would otherwise never move the
			*  cursor. `updateTab` patches by id regardless of creation/focus, so this
			*  works either way; the id is deterministic (`editor:<path>`, set above). */
			const openFileAtLine = (scope, path, line, title) => {
				openFile(scope, path, title);
				updateTab(`editor:${path}`, { meta: { line } });
			};
			return {
				registerTab,
				registerFileViewer,
				getTabs,
				getFileViewers,
				getTab,
				isTabEnabled,
				setTabEnabled,
				isViewerEnabled,
				matchFileViewer,
				openTab,
				closeTab: closeTab$1,
				subscribe,
				version: SIDEBAR_SERVICE_VERSION,
				features: SIDEBAR_FEATURES,
				getSnapshot,
				subscribeState,
				updateTab,
				activateTab: activateTab$1,
				openFile,
				openFileAtLine
			};
		}
		/**
		* Apply dedup: if a tab whose `dedupeKey` matches an existing tab of the
		* same type exists, focus it; otherwise land the tab through
		* `openTabInActivePane` (the id safety net + active-pane landing are that
		* reducer's job — not re-implemented here).
		* `single: true` resolves to the id-key sugar when no explicit key is given.
		*/
		function applyDedupe(state, tab, descriptor) {
			const dedupeKey = descriptor.dedupeKey ?? (descriptor.single === true ? () => descriptor.id : void 0);
			const key = dedupeKey?.(tab);
			if (key !== void 0) for (const leaf of allLeaves(state.splits).concat(allLeaves(state.bottomSplits))) {
				const existing = leaf.tabs.find((t) => t.type === tab.type && dedupeKey(t) === key);
				if (existing !== void 0) return activateTab(state, leaf.id, existing.id);
			}
			return openTabInActivePane(state, tab);
		}
		/** Find which pane hosts a tab id ('' if none). Either tree is searched. */
		function findPaneIdOf(state, tabId) {
			for (const leaf of allLeaves(state.splits).concat(allLeaves(state.bottomSplits))) if (leaf.tabs.some((t) => t.id === tabId)) return leaf.id;
			return state.activePane ?? "";
		}
		//#endregion
		//#region src/client/locales.ts
		/** The locale namespace this plugin registers its dictionaries under. */
		const LOCALE_NS = "powerdesk";
		const en = {
			tabTitle: "Terminal",
			terminal: "Terminal",
			loading: "Loading…",
			disconnected: "Disconnected. Reconnecting…",
			terminalError: "Terminal error",
			terminalRetry: "Retry",
			terminalConnectFailed: "Could not connect to the terminal",
			terminalDepsFailed: "Native PTY unavailable",
			terminalDepsHint: "The Rust PTY native module failed to load. Run the repair command where your DSH profile lives, then retry:",
			terminalDepsProfile: " (profile: {profile})",
			copy: "Copy",
			copied: "Copied",
			standaloneToggle: "Toggle terminal",
			close: "Close",
			newTab: "New tab",
			newPane: "New page",
			newPaneHeading: "Start a new page",
			newPaneSubheading: "Pick a tool to open in this pane",
			cardTerminalDesc: "Run commands in an embedded terminal",
			cardExplorerDesc: "Browse and open files in the workspace",
			cardNotesDesc: "Write and keep scratch notes",
			cardBrowserDesc: "Open a web page in a preview browser",
			cardLayoutLabel: "Layout",
			layoutHorizontal: "Side by side (horizontal split)",
			layoutVertical: "Stacked (vertical split)",
			closePane: "Close pane",
			searchTabTitle: "Search",
			searchPlaceholder: "Search",
			searchNoResults: "No results",
			searchNoQuery: "Type to search file contents",
			searchResultsSummary: "{matches} results in {files} files",
			searchTruncated: " (showing the first {matches})",
			searchDepsFailed: "ripgrep unavailable",
			searchDepsHint: "ripgrep could not be located. Run the repair command where your DSH profile lives, then retry:",
			calendarTabTitle: "Calendar",
			calendarDepsFailed: "SQLite unavailable",
			calendarDepsHint: "The Rust SQLite native module failed to load. Run the repair command where your DSH profile lives, then retry:",
			calendarUntitledEvent: "Untitled event",
			calendarDeleteConfirm: "Delete \"{title}\"?",
			calendarEventModalTitle: "New event",
			calendarEventTitleLabel: "Title",
			calendarEventTitlePlaceholder: "Untitled event",
			calendarEventStartLabel: "Starts",
			calendarEventEndLabel: "Ends",
			calendarEventLocationLabel: "Location",
			calendarEventLocationPlaceholder: "Add a location",
			calendarEventDescriptionLabel: "Description",
			calendarEventDescriptionPlaceholder: "Add a description",
			calendarEventCreate: "Create",
			searchMatchCase: "Match Case",
			searchWholeWord: "Match Whole Word",
			searchUseRegex: "Use Regular Expression",
			collapse: "Collapse sidebar",
			expand: "Expand sidebar",
			collapseBottom: "Collapse bottom panel",
			expandBottom: "Expand bottom panel",
			standaloneNoSession: "No active session. Open a conversation to use the terminal.",
			settingsFontFamilyTitle: "Font family",
			settingsFontFamilyDesc: "Custom font for the terminal (empty = theme code font)",
			settingsFontFamilyPlaceholder: "e.g. \"JetBrains Mono\", monospace",
			settingsFontSizeTitle: "Font size",
			settingsFontSizeDesc: "Terminal font size in pixels",
			settingsBackendTitle: "PTY backend",
			settingsBackendDesc: "own = the Rust /powerdesk/ws/terminal; better-sidebar = reuse dsh-better-sidebar's terminal backend",
			settingsThemeTitle: "Theme",
			settingsThemeDesc: "Builtin restty theme name (empty = follow the app scheme)",
			browser: "Browser",
			browserTabTitle: "Browser",
			browserPlaceholder: "Enter a URL, e.g. example.com",
			browserGo: "Go",
			browserBack: "Back",
			browserForward: "Forward",
			refresh: "Refresh",
			browserStart: "Enter a URL to start browsing (sandbox mode)",
			browserChecking: "Checking if this site can be embedded…",
			browserBlockedScheme: "Blocked: only http/https URLs are allowed",
			browserBlockedLoopback: "Blocked: local and internal addresses cannot be browsed here",
			browserInvalid: "Invalid URL",
			browserOpenExternal: "Open in browser",
			browserNoSandboxWarning: "Sandbox off: the current page runs with full GUI privileges (re-enable in settings)",
			browserEmbedBlocked: "{host} refused to be embedded",
			browserEmbedBlockedDesc: "This site forbids being displayed inside other pages (X-Frame-Options / frame-ancestors), so it cannot load in the sidebar. Open it in your browser instead.",
			browserEmbedAnyway: "Load anyway",
			sandboxStatusOn: "Sandbox on: pages cannot access the GUI's data or local files; logins and third-party cookies may not work",
			sandboxUnlock: "Unlock (unsafe)",
			sandboxRestore: "Restore sandbox",
			standaloneToggleBrowser: "Toggle browser",
			standaloneSurfaceTerminal: "Terminal",
			standaloneSurfaceBrowser: "Browser",
			settingsNav: "Powerdesk",
			settingsIntro: "A GPU-accelerated terminal and a sandboxed browser for DSH, surfaced as tabs in the Powerdesk sidebar.",
			settingsOpenTerminal: "Open Terminal",
			settingsOpenBrowser: "Open Browser",
			settingsSidebarMissing: "The Powerdesk sidebar is available via the toggle at the top-right corner of the window.",
			settingsOpenedHint: "Opened in the sidebar.",
			settingsEnableTab: "Enable this tab",
			settingsDisableTab: "Disable this tab",
			extHeading: "Extensions",
			extIntro: "Install your own React components as sidebar tabs. Upload a .tgz containing powerdesk.json and bundle.js, or a single bundle script.",
			extDisabled: "Extensions are turned off. Set \"extensionsEnabled\": true in the dsh-powerdesk plugin config to enable them.",
			extStaleHost: "The running DSH server does not have the extensions API. Its host half predates this feature — restart DSH (the client half updates on refresh, but the server keeps the old code in memory until it restarts).",
			extUnreachable: "Could not reach the extensions API: {error}",
			extWarning: "An extension runs with the same privileges as this page — full access to the DOM, your session, and the network. Only install extensions you trust.",
			extEmpty: "No extensions installed yet.",
			extUpload: "Upload extension…",
			extInstalling: "Installing…",
			extRemove: "Remove",
			extRemoveConfirm: "Remove this extension? Its files are deleted from disk.",
			extReload: "Reload",
			extBroken: "Failed to load",
			extInstalled: "Installed {when}",
			extSource: "from {file}",
			extDir: "Location",
			extIdLabel: "Extension id",
			extIdPlaceholder: "my-extension",
			extTitleLabel: "Display name",
			extTitlePlaceholder: "My Extension",
			extBareHint: "This file is a single script with no powerdesk.json. Give it an id and a name.",
			extConfirmInstall: "Install",
			extCancel: "Cancel",
			extInstalledOk: "Installed \"{title}\". Open it from the sidebar + menu.",
			appearanceHeading: "Appearance",
			appearanceIntro: "Pick a font, weight, size, and themes for the terminal and the code editor. Terminal changes apply immediately to any open terminal (a brief reconnect, same session); the editor theme applies to any open editor.",
			appearanceFontFamily: "Font",
			appearanceFontFamilyAuto: "System default",
			appearanceFontFamilyManual: "Type a font name…",
			appearanceFontsLoading: "Loading fonts…",
			appearanceFontWeight: "Weight",
			appearanceFontSize: "Size",
			appearanceTheme: "Terminal theme",
			appearanceEditorTheme: "Codemirror theme",
			appearanceFontHint: "Lists your installed system fonts (incl. Nerd Fonts). On browsers without the Local Font Access API (Firefox/Safari), type the family name instead.",
			appearanceThemeHint: "“System default” follows light/dark.",
			themeAuto: "System default",
			themeTokyoNight: "Tokyo Night",
			themeTokyoNightStorm: "Tokyo Night Storm",
			themeTokyoNightMoon: "Tokyo Night Moon",
			themeDracula: "Dracula",
			themeDraculaPlus: "Dracula+",
			themeHighContrast: "High contrast",
			themeNord: "Nord",
			themeGruvbox: "Gruvbox",
			themeCatppuccinMocha: "Catppuccin Mocha",
			themeGithubDark: "GitHub Dark",
			themeGithubLight: "GitHub Light",
			themeOneDark: "One Dark",
			themeSolarizedDark: "Solarized Dark",
			themeSolarizedLight: "Solarized Light",
			themeRosePine: "Rosé Pine",
			explorerTabTitle: "Explorer",
			explorerAddFolder: "Add folder",
			explorerRemoveFolder: "Remove",
			explorerEmptyDir: "Empty folder",
			explorerCopyRelative: "Copy relative path",
			explorerCopyAbsolute: "Copy absolute path",
			explorerCopied: "Copied",
			editorTabTitle: "Editor",
			editorUnsaved: "Unsaved",
			notesTabTitle: "Notes",
			notesBindPrompt: "Bind a local folder to browse and edit its markdown notes.",
			notesBindButton: "Bind folder",
			notesRebindHint: "{folder} — click to choose a different folder",
			notesNewNote: "New note",
			notesNewFolder: "New folder",
			notesNewNotePrompt: "Note name (.md added automatically)",
			notesNewFolderPrompt: "Folder name",
			notesRenamePrompt: "New name",
			notesRename: "Rename",
			notesDelete: "Delete",
			notesDeleteConfirm: "Delete \"{name}\"? This cannot be undone.",
			notesEmptyFolder: "No markdown files in this folder yet — create one with \"New note\".",
			notesSelectFile: "Select a note to view or edit it.",
			cancel: "Cancel",
			folderPickerTitle: "Choose a folder",
			folderPickerSelect: "Select this folder",
			folderPickerUp: "Up",
			folderPickerEmpty: "No subfolders here"
		};
		const zh = {
			tabTitle: "终端",
			terminal: "终端",
			loading: "加载中…",
			disconnected: "已断开，正在重连…",
			terminalError: "终端错误",
			terminalRetry: "重试",
			terminalConnectFailed: "无法连接到终端",
			terminalDepsFailed: "原生 PTY 不可用",
			terminalDepsHint: "Rust PTY 原生模块加载失败。请在 DSH profile 所在环境运行修复命令，然后重试：",
			terminalDepsProfile: "（profile：{profile}）",
			copy: "复制",
			copied: "已复制",
			standaloneToggle: "切换终端",
			close: "关闭",
			newTab: "新建标签页",
			newPane: "新建页面",
			newPaneHeading: "开启新页面",
			newPaneSubheading: "选择要在该面板打开的工具",
			cardTerminalDesc: "在嵌入式终端中运行命令",
			cardExplorerDesc: "浏览并打开工作区文件",
			cardNotesDesc: "撰写和保存随手笔记",
			cardBrowserDesc: "在预览浏览器中打开网页",
			cardLayoutLabel: "布局",
			layoutHorizontal: "并排显示（水平分割）",
			layoutVertical: "上下堆叠（垂直分割）",
			closePane: "关闭面板",
			searchTabTitle: "搜索",
			searchPlaceholder: "搜索",
			searchNoResults: "无结果",
			searchNoQuery: "输入以搜索文件内容",
			searchResultsSummary: "在 {files} 个文件中找到 {matches} 处结果",
			searchTruncated: "（仅显示前 {matches} 处）",
			searchDepsFailed: "ripgrep 不可用",
			searchDepsHint: "未能找到 ripgrep。请在 DSH profile 所在环境运行修复命令，然后重试：",
			calendarTabTitle: "日历",
			calendarDepsFailed: "SQLite 不可用",
			calendarDepsHint: "Rust SQLite 原生模块加载失败。请在 DSH profile 所在环境运行修复命令，然后重试：",
			calendarUntitledEvent: "未命名事件",
			calendarDeleteConfirm: "删除「{title}」？",
			calendarEventModalTitle: "新建事件",
			calendarEventTitleLabel: "标题",
			calendarEventTitlePlaceholder: "未命名事件",
			calendarEventStartLabel: "开始时间",
			calendarEventEndLabel: "结束时间",
			calendarEventLocationLabel: "地点",
			calendarEventLocationPlaceholder: "添加地点",
			calendarEventDescriptionLabel: "描述",
			calendarEventDescriptionPlaceholder: "添加描述",
			calendarEventCreate: "创建",
			searchMatchCase: "区分大小写",
			searchWholeWord: "全字匹配",
			searchUseRegex: "使用正则表达式",
			collapse: "收起侧边栏",
			expand: "展开侧边栏",
			collapseBottom: "收起底部面板",
			expandBottom: "展开底部面板",
			standaloneNoSession: "没有活动会话。请先打开一个对话再使用终端。",
			settingsFontFamilyTitle: "字体",
			settingsFontFamilyDesc: "终端自定义字体（留空 = 主题代码字体）",
			settingsFontFamilyPlaceholder: "例如 \"JetBrains Mono\", monospace",
			settingsFontSizeTitle: "字号",
			settingsFontSizeDesc: "终端字号（像素）",
			settingsBackendTitle: "PTY 后端",
			settingsBackendDesc: "own = Rust /powerdesk/ws/terminal；better-sidebar = 复用 dsh-better-sidebar 终端后端",
			settingsThemeTitle: "主题",
			settingsThemeDesc: "内置 restty 主题名（留空 = 跟随应用明暗）",
			browser: "浏览器",
			browserTabTitle: "浏览器",
			browserPlaceholder: "输入网址，例如 example.com",
			browserGo: "前往",
			browserBack: "后退",
			browserForward: "前进",
			refresh: "刷新",
			browserStart: "输入网址开始浏览（沙箱模式）",
			browserChecking: "正在检查该站点是否可嵌入…",
			browserBlockedScheme: "已阻止：仅支持 http/https 链接",
			browserBlockedLoopback: "已阻止：不允许在浏览器中访问本机或内部地址",
			browserInvalid: "无效的网址",
			browserOpenExternal: "在浏览器中打开",
			browserNoSandboxWarning: "沙箱已关闭：当前页面与界面同源，拥有完整会话权限（可在设置中恢复）",
			browserEmbedBlocked: "{host} 拒绝了嵌入请求",
			browserEmbedBlockedDesc: "该站点通过 X-Frame-Options / frame-ancestors 禁止在其它页面中显示，无法在侧边栏内加载。可在浏览器中直接打开",
			browserEmbedAnyway: "仍然加载",
			sandboxStatusOn: "沙箱模式：已启用 · 页面无法访问界面数据与本地文件，登录态与第三方 Cookie 可能不可用",
			sandboxUnlock: "临时解锁（不安全）",
			sandboxRestore: "恢复沙箱",
			standaloneToggleBrowser: "切换浏览器",
			standaloneSurfaceTerminal: "终端",
			standaloneSurfaceBrowser: "浏览器",
			settingsNav: "Powerdesk",
			settingsIntro: "面向 DSH 的 GPU 加速终端与沙箱浏览器，以标签页形式在 Powerdesk 侧边栏中打开。",
			settingsOpenTerminal: "打开终端",
			settingsOpenBrowser: "打开浏览器",
			settingsSidebarMissing: "Powerdesk 侧边栏可通过窗口右上角的切换按钮打开。",
			settingsOpenedHint: "已在侧边栏打开。",
			settingsEnableTab: "启用此标签页",
			settingsDisableTab: "禁用此标签页",
			extHeading: "扩展",
			extIntro: "将你自己的 React 组件安装为侧边栏标签页。上传包含 powerdesk.json 与 bundle.js 的 .tgz，或单个打包脚本。",
			extDisabled: "扩展功能已关闭。在 dsh-powerdesk 插件配置中设置 \"extensionsEnabled\": true 以启用。",
			extStaleHost: "当前运行的 DSH 服务没有扩展 API，其宿主端代码早于此功能——请重启 DSH（客户端会在刷新时更新，但服务端在重启前仍保留旧代码）。",
			extUnreachable: "无法访问扩展 API：{error}",
			extWarning: "扩展与本页面拥有相同权限——可完全访问 DOM、你的会话与网络。请只安装你信任的扩展。",
			extEmpty: "尚未安装任何扩展。",
			extUpload: "上传扩展…",
			extInstalling: "正在安装…",
			extRemove: "移除",
			extRemoveConfirm: "确定移除此扩展？其文件将从磁盘删除。",
			extReload: "重新加载",
			extBroken: "加载失败",
			extInstalled: "安装于 {when}",
			extSource: "来源 {file}",
			extDir: "位置",
			extIdLabel: "扩展 ID",
			extIdPlaceholder: "my-extension",
			extTitleLabel: "显示名称",
			extTitlePlaceholder: "我的扩展",
			extBareHint: "此文件是单个脚本，不含 powerdesk.json。请为其指定 ID 与名称。",
			extConfirmInstall: "安装",
			extCancel: "取消",
			extInstalledOk: "已安装“{title}”。可从侧边栏 + 菜单打开。",
			appearanceHeading: "外观",
			appearanceIntro: "选择终端与代码编辑器的字体、字重、字号与主题。终端更改会立即应用到已打开的终端（短暂重连，同一会话）；编辑器主题更改会立即应用到已打开的编辑器。",
			appearanceFontFamily: "字体",
			appearanceFontFamilyAuto: "系统默认",
			appearanceFontFamilyManual: "输入字体名…",
			appearanceFontsLoading: "正在加载字体…",
			appearanceFontWeight: "字重",
			appearanceFontSize: "字号",
			appearanceTheme: "终端主题",
			appearanceEditorTheme: "Codemirror 主题",
			appearanceFontHint: "列出你系统中已安装的字体（含 Nerd Fonts）。在不支持本地字体访问 API 的浏览器（Firefox/Safari）上，请改为手动输入字体名。",
			appearanceThemeHint: "“系统默认”跟随明暗模式。",
			themeAuto: "系统默认",
			themeTokyoNight: "Tokyo Night",
			themeTokyoNightStorm: "Tokyo Night Storm",
			themeTokyoNightMoon: "Tokyo Night Moon",
			themeDracula: "Dracula",
			themeDraculaPlus: "Dracula+",
			themeHighContrast: "高对比度",
			themeNord: "Nord",
			themeGruvbox: "Gruvbox",
			themeCatppuccinMocha: "Catppuccin Mocha",
			themeGithubDark: "GitHub Dark",
			themeGithubLight: "GitHub Light",
			themeOneDark: "One Dark",
			themeSolarizedDark: "Solarized Dark",
			themeSolarizedLight: "Solarized Light",
			themeRosePine: "Rosé Pine",
			explorerTabTitle: "文件",
			explorerAddFolder: "添加文件夹",
			explorerRemoveFolder: "移除",
			explorerEmptyDir: "空文件夹",
			explorerCopyRelative: "复制相对路径",
			explorerCopyAbsolute: "复制绝对路径",
			explorerCopied: "已复制",
			editorTabTitle: "编辑器",
			editorUnsaved: "未保存",
			notesTabTitle: "笔记",
			notesBindPrompt: "绑定一个本地文件夹，浏览和编辑其中的 markdown 笔记。",
			notesBindButton: "绑定文件夹",
			notesRebindHint: "{folder} — 点击选择其他文件夹",
			notesNewNote: "新建笔记",
			notesNewFolder: "新建文件夹",
			notesNewNotePrompt: "笔记名称（自动加 .md 后缀）",
			notesNewFolderPrompt: "文件夹名称",
			notesRenamePrompt: "新名称",
			notesRename: "重命名",
			notesDelete: "删除",
			notesDeleteConfirm: "删除 \"{name}\"？此操作不可撤销。",
			notesEmptyFolder: "此文件夹里还没有 markdown 文件——点\"新建笔记\"创建一个。",
			notesSelectFile: "选择一篇笔记查看或编辑。",
			cancel: "取消",
			folderPickerTitle: "选择文件夹",
			folderPickerSelect: "选择这个文件夹",
			folderPickerUp: "上一级",
			folderPickerEmpty: "没有子文件夹"
		};
		const dicts = {
			en,
			zh
		};
		/** The active locale ('en' by default; updated by {@link attachLocale}). */
		let activeLocale = "en";
		/** Resolve the active dictionary (falls back to English). */
		function activeDict() {
			return dicts[activeLocale] ?? en;
		}
		/** Translate one key, substituting `{param}` placeholders. */
		function t(key, params) {
			const raw = activeDict()[key] ?? en[key] ?? key;
			if (params === void 0) return raw;
			return raw.replace(/\{(\w+)\}/g, (_m, name) => params[name] ?? `{${name}}`);
		}
		/**
		* Attach the module's locale to the DSH locale service: register the
		* dictionaries under {@link LOCALE_NS} and keep the module-level locale in
		* sync with the Host-backed preference. Returns the disposer.
		*/
		function attachLocale(locale) {
			const apply = () => {
				activeLocale = locale.getSnapshot().active === "zh" ? "zh" : "en";
			};
			apply();
			const offZh = locale.register(LOCALE_NS, "zh", zh);
			const offEn = locale.register(LOCALE_NS, "en", en);
			const offSub = locale.subscribe(apply);
			return () => {
				offSub();
				offZh();
				offEn();
			};
		}
		//#endregion
		//#region src/client/chunk-loader.ts
		/**
		* The platform externals a chunk bundle may require (mirror of
		* CLIENT_EXTERNALS in tsdown.config.ts — the chunk keeps these external and
		* the loader resolves them here). A superset is safe: the require only answers
		* what the chunk actually asks for, so an entry the running DSH version cannot
		* seed (e.g. `cordis`, which the terminal/browser chunks never require) is
		* resolved to `undefined` and stays inert.
		*/
		const CHUNK_EXTERNALS = [
			"react",
			"react/jsx-runtime",
			"react-dom",
			"react-dom/client",
			"cordis",
			"@deepseek-ai/dsh-client-ui-slots",
			"@deepseek-ai/dsh-client-ui-primitives",
			"@deepseek-ai/dsh-client-web-react",
			"@deepseek-ai/dsh-client-runtime/client"
		];
		/**
		* Chunk script endpoint served by the plugin host half (src/bundle-route.ts).
		* Extensions live under a separate `/ext/` path segment so the host can apply
		* a different (config-gated, manifest-resolved) lookup to them without the
		* two families ever sharing a name space.
		*/
		const CHUNK_URL = (name) => name.startsWith("ext:") ? `/powerdesk/bundle/ext/${name.slice(4)}.js` : `/powerdesk/bundle/${name}.js`;
		function chunkRegistry() {
			const g = globalThis;
			if (g.__dshPowerdeskChunks__ === void 0) g.__dshPowerdeskChunks__ = {};
			return g.__dshPowerdeskChunks__;
		}
		/** One in-flight chunk load, memoized until success or {@link resetChunks}. */
		const cache = /* @__PURE__ */ new Map();
		const testLoaders = /* @__PURE__ */ new Map();
		/** Inject a classic same-origin <script src> and resolve on load. */
		const defaultScriptLoader = (url) => new Promise((resolve, reject) => {
			if (typeof document === "undefined") {
				reject(/* @__PURE__ */ new Error(`[dsh-powerdesk] chunk script "${url}" cannot load: no document`));
				return;
			}
			const script = document.createElement("script");
			script.src = url;
			script.async = true;
			script.onload = () => resolve();
			script.onerror = () => {
				script.remove();
				reject(/* @__PURE__ */ new Error(`[dsh-powerdesk] chunk script "${url}" failed to load`));
			};
			document.head.appendChild(script);
		});
		/**
		* Resolve the platform externals through the shared module table (the
		* `__DSH_MODULES__.import(spec)` seed-word branch) and return a SYNCHRONOUS
		* require the chunk factory can use. The chunk body does `let react =
		* require("react")` synchronously, so every external must be pre-resolved
		* before the factory runs (mirrors dsh-better-sidebar's working loader).
		*
		* `await` is used even though N3.import is currently synchronous: the module
		* table contract is allowed to return a Promise for some specs, and awaiting
		* a non-thenable is a no-op — so this is robust to either shape without the
		* chunk body having to await.
		*
		* React interop: some module-system shapes hand back a pure-ESM namespace
		* `{ default: React }` without the CJS named exports (`useRef` etc.) on the
		* root. The chunk body calls `react.useRef` expecting CJS shape, so if the
		* resolved react lacks `useRef` but `default.useRef` exists, unwrap to
		* `default`. A one-time diagnostic logs which shape was seen.
		*/
		async function buildExternalsRequire(modules) {
			let diagnosed = false;
			const entries = await Promise.all(CHUNK_EXTERNALS.map(async (spec) => {
				let mod;
				try {
					mod = await modules.import(spec);
				} catch {
					return [spec, void 0];
				}
				if (spec === "react" && mod != null && typeof mod.useRef !== "function") {
					const def = mod.default;
					if (def != null && typeof def.useRef === "function") {
						if (!diagnosed) {
							diagnosed = true;
							console.warn("[dsh-powerdesk] react interop: require(\"react\") returned an ESM-style namespace {default}; unwrapping .default so react.useRef resolves. keys=", Object.keys(mod).slice(0, 12));
						}
						mod = def;
					} else if (!diagnosed) {
						diagnosed = true;
						console.warn("[dsh-powerdesk] react interop: require(\"react\") has no useRef on root or .default. keys=", Object.keys(mod).slice(0, 12), "useRef=", typeof mod.useRef, "default.useRef=", def == null ? "no-default" : typeof def.useRef);
					}
				}
				return [spec, mod];
			}));
			const table = new Map(entries);
			return (spec) => {
				if (table.has(spec)) return table.get(spec);
				throw new Error(`[dsh-powerdesk] chunk require of non-external "${spec}"`);
			};
		}
		/**
		* Load a chunk's exports (in-flight memoized; re-fetches on failure). The
		* core client.js never statically imports this module's consumers — restty
		* only downloads/parses when a terminal tab is first opened.
		*/
		function loadChunk(name) {
			const existing = cache.get(name);
			if (existing !== void 0) return existing;
			const task = (async () => {
				const modules = globalThis.__DSH_MODULES__;
				if (modules === void 0 || typeof modules.import !== "function") throw new Error(`[dsh-powerdesk] chunk "${name}": client module system unavailable`);
				await (testLoaders.get(name) ?? defaultScriptLoader)(CHUNK_URL(name));
				const factory = chunkRegistry()[name];
				if (typeof factory !== "function") throw new Error(`[dsh-powerdesk] chunk "${name}" script did not register its factory`);
				return factory(await buildExternalsRequire(modules));
			})();
			cache.set(name, task);
			task.catch(() => {
				cache.delete(name);
			});
			return task;
		}
		/**
		* Forget one chunk so the next open re-fetches and re-executes it. Used when
		* an extension is reinstalled: the bundle route revalidates by ETag, so the
		* changed script is re-downloaded, and re-execution overwrites the registry
		* slot with the new factory. Without this the memoized promise would keep
		* serving the previous install's exports for the life of the page.
		*/
		function dropChunk(name) {
			cache.delete(name);
		}
		/**
		* Drop all chunk state for a fresh plugin activation (HMR-safe): clear the
		* in-memory cache and any test-registry entries, so the next lazy open
		* re-fetches and re-executes the current chunk script.
		*/
		function resetChunks() {
			cache.clear();
			testLoaders.clear();
		}
		//#endregion
		//#region src/client/api.ts
		/**
		* Typed fetch wrapper over the /restty JSON API and the WebSocket URL builders.
		* Every call posts to `/powerdesk/api/<method>` with the sessionId (and the
		* session's cwd when known). Failures surface as {@link ResttyApiError} with
		* the wire code.
		*/
		/** One wire failure. */
		var ResttyApiError = class extends Error {
			code;
			constructor(code, message) {
				super(message);
				this.code = code;
			}
		};
		async function call(method, payload, signal) {
			let response;
			try {
				response = await fetch(`/powerdesk/api/${method}`, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(payload),
					signal
				});
			} catch (error) {
				throw new ResttyApiError("network", error instanceof Error ? error.message : String(error));
			}
			const parsed = await response.json().catch(() => null);
			if (!response.ok || parsed === null || parsed.ok !== true || parsed.value === void 0) throw new ResttyApiError(parsed?.error?.code ?? "http", parsed?.error?.message ?? `HTTP ${response.status}`);
			return parsed.value;
		}
		/** Fold a scope into a JSON payload ({cwd} only when present). */
		function scopePayload(scope, extra) {
			return {
				sessionId: scope.sessionId,
				...scope.cwd !== void 0 && scope.cwd !== "" ? { cwd: scope.cwd } : {},
				...extra
			};
		}
		/** The restty API surface (session scope threaded through every call). */
		const api = {
			/** Resolve the session's authoritative cwd (used by the standalone panel
			*  when the client list summary has no cwd). */
			sessionCwd: (scope, signal) => call("session.cwd", scopePayload(scope, {}), signal),
			/** Release a terminal's process immediately (tab closed while the WS was
			*  down; the close frame may be unreachable, so the host also accepts this
			*  explicit route). */
			ptyClose: (scope, tab) => call("pty.close", scopePayload(scope, { tab })),
			/** Native pty dependency status: after a WS close 1011 with reason
			*  `powerdesk-pty-deps-missing` the view fetches the full repair details here. */
			terminalDeps: () => call("terminal.deps", {}),
			/** Probe a URL's response headers (the browser tab's embeddability check;
			*  see the host's browser.probe route). Returns whether the target site
			*  forbids being embedded (X-Frame-Options / frame-ancestors). */
			browserProbe: (url, signal) => call("browser.probe", { url }, signal),
			/** List one directory's immediate children (Explorer tab). */
			fsList: (path, signal) => call("fs.list", { path }, signal),
			/** Read one file's content, capped server-side at a few MB (Editor tab). */
			fsRead: (path, signal) => call("fs.read", { path }, signal),
			/** Overwrite one file's content (Editor tab save). */
			fsWrite: (path, content) => call("fs.write", {
				path,
				content
			}),
			/** Create a NEW empty file; fails if it already exists (Notes "new note"). */
			fsCreate: (path) => call("fs.create", { path }),
			/** Create a directory, including missing parents (Notes "new folder"). */
			fsMkdir: (path) => call("fs.mkdir", { path }),
			/** Rename/move a file or folder (Notes rename). */
			fsRename: (from, to) => call("fs.rename", {
				from,
				to
			}),
			/** Delete a file or folder, recursively (Notes delete). */
			fsDelete: (path) => call("fs.delete", { path }),
			/** The recursive `.md` tree over a bound folder (Notes tab). */
			fsListMarkdownTree: (path, signal) => call("fs.listMarkdownTree", { path }, signal),
			/** The host's home directory (the folder-picker modal's starting point). */
			fsHome: (signal) => call("fs.home", {}, signal),
			/** Content search over a directory via ripgrep (Search tab). `options` are
			*  the search box's modifier toggles ("Aa" / "ab" / ".*"). */
			searchGrep: (path, query, options, signal) => call("search.grep", {
				path,
				query,
				...options
			}, signal),
			/** Ripgrep dependency status: fetched when the Search tab needs to show a
			*  repair banner (no `/powerdesk/ws/*` upgrade to close-marker off of here
			*  — search is a plain buffered POST, so the client just checks this
			*  directly rather than reacting to a socket close). */
			searchDeps: (signal) => call("search.deps", {}, signal),
			/** List all calendar events, earliest first (Calendar tab). */
			calendarList: (signal) => call("calendar.list", {}, signal),
			/** Create a calendar event (Calendar tab). Returns the created event. */
			calendarCreate: (event, signal) => call("calendar.create", { ...event }, signal),
			/** Update a calendar event by id (Calendar tab). Returns the changed-row count. */
			calendarUpdate: (event, signal) => call("calendar.update", { ...event }, signal),
			/** Delete a calendar event by id (Calendar tab). Returns the changed-row count. */
			calendarDelete: (id, signal) => call("calendar.delete", { id }, signal),
			/** SQLite native-binary dependency status: fetched when the Calendar tab
			*  needs to show a repair banner (same pattern as searchDeps). */
			calendarDeps: (signal) => call("calendar.deps", {}, signal),
			/** Installed extensions plus the config gate (answers even when disabled,
			*  so the settings card can explain why nothing loads). */
			extList: (signal) => call("ext.list", {}, signal),
			/** Install an uploaded archive. `id`/`title` are only consulted when the
			*  upload turns out to be a bare script with no manifest of its own. */
			extInstall: (upload) => call("ext.install", { ...upload }),
			/** Uninstall one extension (removing an absent id is a no-op). */
			extRemove: (id) => call("ext.remove", { id })
		};
		/**
		* Base64-encode an uploaded file for {@link api.extInstall}. Encoding is done
		* in chunks: `String.fromCharCode(...bytes)` on a multi-MB archive blows the
		* argument limit and throws a RangeError, which would surface as a confusing
		* "too many arguments" failure on exactly the large uploads this exists for.
		*/
		function toBase64(bytes) {
			const CHUNK = 32768;
			let binary = "";
			for (let i = 0; i < bytes.length; i += CHUNK) binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
			return btoa(binary);
		}
		//#endregion
		//#region \0dsh-css:/home/zteng/work/Tools/dsh-powerdesk/src/client/restty.module.css.mjs
		const css$1 = ".i00wLG_terminalWrap{background:var(--dsw-alias-bg-base,#111114);flex-direction:column;width:100%;height:100%;min-height:0;display:flex;position:relative;overflow:hidden}.i00wLG_terminal{flex:auto;width:100%;height:100%;min-height:0}.i00wLG_terminalBanner,.i00wLG_terminalDepsBanner{z-index:5;text-align:center;color:var(--dsw-alias-label-primary,#e6e6e6);background:color-mix(in srgb, var(--dsw-alias-bg-base,#111114) 92%, transparent);backdrop-filter:blur(2px);flex-direction:column;justify-content:center;align-items:center;gap:10px;padding:18px 22px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex;position:absolute;inset:0}.i00wLG_terminalBannerUrl{opacity:.7;word-break:break-all;font-size:11px}.i00wLG_terminalRetry{border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-elevated,#1b1b22);color:var(--dsw-alias-label-primary,#e6e6e6);cursor:pointer;font:inherit;border-radius:8px;align-self:center;padding:6px 14px}.i00wLG_terminalRetry:hover{filter:brightness(1.1)}.i00wLG_terminalDepsTitle{font-size:14px;font-weight:600}.i00wLG_terminalDepsHint{opacity:.85;max-width:520px}.i00wLG_terminalDepsCommandRow{align-items:stretch;gap:8px;width:100%;max-width:640px;display:flex}.i00wLG_terminalRepairCommand{text-align:left;white-space:pre-wrap;word-break:break-all;border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-elevated,#1b1b22);border-radius:8px;flex:auto;margin:0;padding:8px 10px;font-size:12px}.i00wLG_terminalDepsNote{opacity:.7;max-width:560px;font-size:12px}.i00wLG_terminalDepsActions{gap:8px;display:flex}.i00wLG_editorPlaceholder,.i00wLG_editorError{text-align:center;height:100%;color:var(--dsw-alias-label-secondary,#abb2bf);justify-content:center;align-items:center;gap:10px;padding:16px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex}.i00wLG_editorError{color:var(--dsw-alias-label-primary,#e6e6e6);flex-direction:column}.i00wLG_standaloneToggle{z-index:2147483000;border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-elevated,#1b1b22);color:var(--dsw-alias-label-primary,#e6e6e6);cursor:pointer;border-radius:999px;align-items:center;gap:6px;padding:8px 12px;font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;display:inline-flex;position:fixed;bottom:14px;right:14px;box-shadow:0 4px 14px #00000059}.i00wLG_standaloneToggle:hover{filter:brightness(1.1)}.i00wLG_standaloneHost{z-index:2147483000;border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-base,#111114);border-radius:12px;flex-direction:column;width:min(720px,92vw);height:min(440px,70vh);display:flex;position:fixed;bottom:56px;right:14px;overflow:hidden;box-shadow:0 10px 40px #00000073}.i00wLG_standaloneHeader{border-bottom:1px solid var(--dsw-alias-stroke-faint,#2a2a33);color:var(--dsw-alias-label-secondary,#abb2bf);justify-content:space-between;align-items:center;padding:6px 10px;font:11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex}.i00wLG_standaloneNoSession{text-align:center;color:var(--dsw-alias-label-secondary,#abb2bf);padding:18px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}.i00wLG_standaloneSurfaceSwitch{background:var(--dsw-alias-bg-elevated,#1b1b22);border-radius:6px;gap:2px;padding:2px;display:inline-flex}.i00wLG_standaloneSurfaceBtn,.i00wLG_standaloneSurfaceActive{cursor:pointer;color:var(--dsw-alias-label-secondary,#abb2bf);background:0 0;border:none;border-radius:4px;padding:2px 10px;font:11px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.i00wLG_standaloneSurfaceActive{background:var(--dsw-alias-interactive-bg-hover,#ffffff1f);color:var(--dsw-alias-label-primary,#e6e6e6)}.i00wLG_browser{flex-direction:column;flex:1;min-height:0;display:flex}.i00wLG_browserBar{border-bottom:1px solid var(--dsw-alias-border-l1,#2a2a33);flex:none;align-items:center;gap:4px;padding:6px 8px;display:flex}.i00wLG_iconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary,#abb2bf);cursor:pointer;background:0 0;border:none;border-radius:6px;flex:none;justify-content:center;align-items:center;display:inline-flex}.i00wLG_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,#ffffff14);color:var(--dsw-alias-label-primary,#e6e6e6)}.i00wLG_iconButton:disabled{opacity:.4;cursor:default}.i00wLG_browserInput{border:1px solid var(--dsw-alias-border-l1,#2a2a33);background:var(--dsw-alias-bg-layer-1,#1b1b22);min-width:0;height:28px;color:var(--dsw-alias-label-primary,#e6e6e6);border-radius:6px;flex:1;padding:0 10px;font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.i00wLG_browserInput:focus{border-color:var(--dsw-alias-border-l2,#444);outline:none}.i00wLG_browserMessage{color:var(--dsw-alias-state-warn-label,#c8a951);background:var(--dsw-alias-state-warn-tertiary,#c8a9511a);flex:none;padding:4px 12px;font-size:11px}.i00wLG_browserFrame{background:var(--dsw-alias-bg-base,#111114);border:none;flex:1;width:100%;min-height:0}.i00wLG_browserStart{text-align:center;min-height:0;color:var(--dsw-alias-label-tertiary,#848891);flex:1;justify-content:center;align-items:center;padding:20px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex}.i00wLG_browserBlocked{text-align:center;min-height:0;color:var(--dsw-alias-state-warn-primary,#c8a951);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:6px;padding:24px;display:flex}.i00wLG_browserBlockedTitle{color:var(--dsw-alias-label-primary,#e6e6e6);font-size:12px;font-weight:600}.i00wLG_browserBlockedDesc{max-width:280px;color:var(--dsw-alias-label-secondary,#abb2bf);font-size:11px}.i00wLG_browserBlockedActions{gap:8px;margin-top:6px;display:flex}.i00wLG_browserBlockedButton{border:1px solid var(--dsw-alias-border-l2,#444);background:var(--dsw-alias-bg-layer-1,#1b1b22);color:var(--dsw-alias-label-primary,#e6e6e6);cursor:pointer;border-radius:6px;padding:4px 12px;font-size:11px}.i00wLG_browserBlockedButton:hover{background:var(--dsw-alias-interactive-bg-hover,#ffffff14)}.i00wLG_sandboxStatus{border-bottom:1px solid var(--dsw-alias-border-l1,#2a2a33);flex:none;align-items:center;gap:6px;padding:4px 10px;font-size:11px;display:flex}.i00wLG_sandboxStatusOn{color:var(--dsw-alias-state-success-label,#4eaa6e)}.i00wLG_sandboxStatusOff{color:var(--dsw-alias-state-warn-label,#c8a951);background:var(--dsw-alias-state-warn-tertiary,#c8a95114)}.i00wLG_sandboxDot{background:currentColor;border-radius:50%;flex:none;width:8px;height:8px}.i00wLG_sandboxStatusText{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.i00wLG_sandboxAction{color:inherit;cursor:pointer;background:0 0;border:1px solid;border-radius:4px;flex:none;padding:2px 8px;font-size:11px}.i00wLG_sandboxAction:hover{opacity:.8}";
		const tagId$1 = "dsh-powerdesk/restty.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-powerdesk";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var restty_module_css_default = {
			"sandboxAction": "i00wLG_sandboxAction",
			"standaloneSurfaceActive": "i00wLG_standaloneSurfaceActive",
			"browserInput": "i00wLG_browserInput",
			"terminalDepsNote": "i00wLG_terminalDepsNote",
			"terminalWrap": "i00wLG_terminalWrap",
			"terminalDepsTitle": "i00wLG_terminalDepsTitle",
			"sandboxDot": "i00wLG_sandboxDot",
			"standaloneSurfaceBtn": "i00wLG_standaloneSurfaceBtn",
			"editorError": "i00wLG_editorError",
			"sandboxStatusText": "i00wLG_sandboxStatusText",
			"terminalDepsHint": "i00wLG_terminalDepsHint",
			"standaloneToggle": "i00wLG_standaloneToggle",
			"browserBar": "i00wLG_browserBar",
			"terminal": "i00wLG_terminal",
			"terminalRepairCommand": "i00wLG_terminalRepairCommand",
			"editorPlaceholder": "i00wLG_editorPlaceholder",
			"standaloneNoSession": "i00wLG_standaloneNoSession",
			"browserFrame": "i00wLG_browserFrame",
			"browserBlockedDesc": "i00wLG_browserBlockedDesc",
			"sandboxStatus": "i00wLG_sandboxStatus",
			"browserMessage": "i00wLG_browserMessage",
			"browser": "i00wLG_browser",
			"terminalDepsActions": "i00wLG_terminalDepsActions",
			"terminalBannerUrl": "i00wLG_terminalBannerUrl",
			"terminalDepsBanner": "i00wLG_terminalDepsBanner",
			"standaloneHost": "i00wLG_standaloneHost",
			"standaloneSurfaceSwitch": "i00wLG_standaloneSurfaceSwitch",
			"browserStart": "i00wLG_browserStart",
			"iconButton": "i00wLG_iconButton",
			"browserBlocked": "i00wLG_browserBlocked",
			"browserBlockedButton": "i00wLG_browserBlockedButton",
			"sandboxStatusOn": "i00wLG_sandboxStatusOn",
			"terminalRetry": "i00wLG_terminalRetry",
			"sandboxStatusOff": "i00wLG_sandboxStatusOff",
			"terminalDepsCommandRow": "i00wLG_terminalDepsCommandRow",
			"terminalBanner": "i00wLG_terminalBanner",
			"standaloneHeader": "i00wLG_standaloneHeader",
			"browserBlockedActions": "i00wLG_browserBlockedActions",
			"browserBlockedTitle": "i00wLG_browserBlockedTitle"
		};
		//#endregion
		//#region src/client/lazy-chunk.tsx
		/**
		* Lazy chunk view wrapper: mounts a component that lives in a lazy chunk,
		* showing a loading placeholder while the chunk script loads and an error +
		* retry affordance on failure. Used by the restty tab descriptor and the
		* standalone panel.
		*
		* Contract note: {@link lazyChunkComponent} returns a plain render-prop
		* function — the descriptor contract is `component: (props) => ReactNode`.
		* The wrapper function body contains no hooks; all state lives in the
		* inner {@link LazyChunkView} component.
		*/
		function LazyChunkView({ chunk, pick, props }) {
			const [attempt, setAttempt] = (0, react.useState)(0);
			const [state, setState] = (0, react.useState)({ status: "loading" });
			(0, react.useEffect)(() => {
				let cancelled = false;
				setState({ status: "loading" });
				loadChunk(chunk).then((mod) => {
					if (cancelled) return;
					const Comp = pick(mod);
					if (Comp === void 0) {
						setState({
							status: "error",
							message: `[dsh-powerdesk] chunk "${chunk}" is missing its component`
						});
						return;
					}
					setState({
						status: "ready",
						Comp
					});
				}).catch((error) => {
					if (cancelled) return;
					setState({
						status: "error",
						message: error instanceof Error ? error.message : String(error)
					});
				});
				return () => {
					cancelled = true;
				};
			}, [
				chunk,
				pick,
				attempt
			]);
			if (state.status === "loading") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: restty_module_css_default.editorPlaceholder,
				children: t("loading")
			});
			if (state.status === "error") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: restty_module_css_default.editorError,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: state.message }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: restty_module_css_default.terminalRetry,
					onClick: () => {
						setAttempt((current) => current + 1);
					},
					children: t("terminalRetry")
				})]
			});
			return (0, react.createElement)(state.Comp, props);
		}
		/**
		* Build a descriptor-compatible lazy wrapper for a chunk-resident component.
		* The returned function is the descriptor `component` itself: it returns an
		* element and never calls hooks, so both invocation styles (plain function
		* call and createElement/JSX render) work. `pick` must be a module-level
		* function (stable identity) — an inline lambda would re-trigger the load
		* effect on every render.
		* @param chunk - the chunk name (see chunk-loader.ts).
		* @param pick - select the component from the chunk's exports.
		*/
		function lazyChunkComponent(chunk, pick) {
			return (props) => (0, react.createElement)(LazyChunkView, {
				chunk,
				pick,
				props
			});
		}
		//#endregion
		//#region src/client/extensions.ts
		/**
		* User-installed extensions, client half: turn the host's list of installed
		* manifests into registered sidebar tabs, and keep that registration in sync
		* when extensions are installed or removed.
		*
		* An extension gets nothing bespoke — it is registered through the same
		* `service.registerTab` contract the built-in tabs use, with the same
		* `lazyChunkComponent` wrapper, so it inherits the loading placeholder, the
		* retry affordance, the RenderBoundary, and the Settings enable/disable
		* switch without any of them knowing extensions exist. The only extension-
		* specific parts are the `ext:` chunk key and the id namespacing.
		*
		* Reconciliation is whole-set: on every refresh the previous registrations
		* are disposed and the current list is registered from scratch. The
		* registries are small (a handful of Maps) and refreshes are user-initiated,
		* so a diffing scheme would add ordering bugs to save nothing measurable.
		*
		* @module dsh-powerdesk/client/extensions
		*/
		/** Tab id / chunk key prefix. Mirrors the host's manifest.chunkKeyOf. */
		const EXT_PREFIX = "ext:";
		/** The chunk name (and tab type id) of one extension. */
		function extensionChunkName(id) {
			return `${EXT_PREFIX}${id}`;
		}
		/**
		* Select the component from a loaded extension chunk's exports. The manifest
		* names the export (default `default`); a chunk that exports nothing usable
		* produces `undefined`, which LazyChunkView renders as an error with a retry
		* button rather than crashing the sidebar.
		*
		* CJS interop for `default`: a bundler compiling `export default Component`
		* to CJS emits `module.exports = Component`, so the chunk's exports ARE the
		* component and there is no `.default` property to read. Both shapes are
		* accepted — `.default` first (a chunk with several named exports), then the
		* exports object itself when it is callable. Without this, the natural way to
		* write an extension would silently resolve to nothing.
		*/
		function pickExport(exportName) {
			return (mod) => {
				const named = mod[exportName];
				if (typeof named === "function") return named;
				if (exportName === "default" && typeof mod === "function") return mod;
			};
		}
		/**
		* Build the tab descriptor for one installed extension. `icon` is rendered as
		* TEXT, never as markup: the manifest is author-controlled data and an icon
		* is at most a few characters, so there is no reason to give it an HTML
		* injection surface into the tab strip.
		*/
		function extensionTabDescriptor(extension) {
			const manifest = extension.manifest;
			if (manifest === void 0) return void 0;
			const chunk = extensionChunkName(manifest.id);
			return {
				id: chunk,
				title: manifest.title,
				...manifest.icon !== void 0 ? { icon: () => (0, react.createElement)("span", { "aria-hidden": true }, manifest.icon) } : {},
				...manifest.order !== void 0 ? { order: manifest.order } : {},
				...manifest.single === true ? { single: true } : {},
				component: lazyChunkComponent(chunk, pickExport(manifest.export))
			};
		}
		/**
		* Owns the extension tab registrations for one client activation. Created in
		* the client entry, refreshed by the settings card after an install/remove,
		* and disposed with the plugin fiber.
		*/
		var ExtensionHost = class {
			service;
			/** Disposers returned by `registerTab`, keyed by extension id. */
			registered = /* @__PURE__ */ new Map();
			/** Bumped per refresh so a slow in-flight fetch cannot apply out of order. */
			generation = 0;
			disposed = false;
			constructor(service) {
				this.service = service;
			}
			/**
			* Fetch the installed list and reconcile the registrations to it.
			*
			* Never throws: the sidebar must mount whether or not the extensions API
			* answered, so a failed fetch reports an empty, disabled result and leaves
			* the previous registrations alone rather than tearing down working tabs
			* because one poll failed.
			*/
			async refresh() {
				const generation = ++this.generation;
				let listed;
				try {
					listed = await api.extList();
				} catch (error) {
					console.warn("[dsh-powerdesk] could not list extensions:", error);
					const message = error instanceof Error ? error.message : String(error);
					return {
						enabled: false,
						dir: "",
						extensions: [],
						registered: [...this.registered.keys()],
						error: message
					};
				}
				if (this.disposed || generation !== this.generation) return {
					...listed,
					registered: [...this.registered.keys()]
				};
				this.unregisterAll();
				const registered = [];
				for (const extension of listed.extensions) {
					const descriptor = extensionTabDescriptor(extension);
					if (descriptor === void 0) continue;
					try {
						dropChunk(extensionChunkName(extension.id));
						this.registered.set(extension.id, this.service.registerTab(descriptor));
						registered.push(extension.id);
					} catch (error) {
						console.error(`[dsh-powerdesk] extension "${extension.id}" failed to register:`, error);
					}
				}
				return {
					...listed,
					registered
				};
			}
			/** Dispose every registration (idempotent; safe after {@link dispose}). */
			unregisterAll() {
				for (const dispose of this.registered.values()) try {
					dispose();
				} catch (error) {
					console.error("[dsh-powerdesk] extension unregister failed:", error);
				}
				this.registered.clear();
			}
			/** Tear down all extension tabs (plugin deactivation / HMR). */
			dispose() {
				this.disposed = true;
				this.generation += 1;
				this.unregisterAll();
			}
		};
		//#endregion
		//#region src/client/prefs.ts
		/** The tab id this plugin registers (kept for `readPrefsFromStore` callers). */
		const POWERDESK_TAB_ID = "dsh-powerdesk:terminal";
		/**
		* The font weights offered in the appearance panel, in selection order.
		* restty's `ResttyFontFamilyInput.weight` accepts any number; we surface a
		* small, named set so the dropdown stays readable.
		*/
		const TERMINAL_FONT_WEIGHTS = [
			400,
			500,
			600,
			700
		];
		/** localStorage key for terminal-appearance prefs (global, not per-session). */
		const PREFS_STORAGE_KEY = "dsh-powerdesk:prefs";
		/** The default preferences. */
		const DEFAULT_PREFS$1 = {
			fontFamily: "",
			fontWeight: 400,
			fontSize: 16,
			ptyBackend: "own",
			themeName: "",
			editorTheme: "dracula"
		};
		/** Clamp a font size into the supported range. */
		function clampResttyFontSize(size) {
			if (!Number.isFinite(size)) return 16;
			return Math.min(30, Math.max(12, Math.round(size)));
		}
		/** Clamp a font weight to the offered set (falls back to the default). */
		function clampResttyFontWeight(weight) {
			if (typeof weight !== "number" || !Number.isFinite(weight)) return 400;
			let best = TERMINAL_FONT_WEIGHTS[0];
			let bestDist = Number.POSITIVE_INFINITY;
			for (const w of TERMINAL_FONT_WEIGHTS) {
				const d = Math.abs(w - weight);
				if (d < bestDist) {
					bestDist = d;
					best = w;
				}
			}
			return best;
		}
		/** Merge a partial prefs blob over the defaults, clamping size + weight. */
		function mergePrefs(partial) {
			const raw = partial ?? {};
			const fontFamily = typeof raw.fontFamily === "string" ? raw.fontFamily : DEFAULT_PREFS$1.fontFamily;
			const fontWeight = typeof raw.fontWeight === "number" ? clampResttyFontWeight(raw.fontWeight) : DEFAULT_PREFS$1.fontWeight;
			const fontSize = typeof raw.fontSize === "number" ? raw.fontSize : DEFAULT_PREFS$1.fontSize;
			const ptyBackend = raw.ptyBackend === "better-sidebar" ? "better-sidebar" : "own";
			const themeName = typeof raw.themeName === "string" ? raw.themeName : DEFAULT_PREFS$1.themeName;
			const editorTheme = typeof raw.editorTheme === "string" ? raw.editorTheme : DEFAULT_PREFS$1.editorTheme;
			return {
				fontFamily,
				fontWeight,
				fontSize: clampResttyFontSize(fontSize),
				ptyBackend,
				themeName,
				editorTheme
			};
		}
		/**
		* A stored font size below the supported minimum is almost always a stale or
		* corrupt entry — e.g. an earlier input bug that committed an empty number
		* field as `0`, which then clamped to the then-minimum. Reset it to the
		* default rather than silently bumping to the new minimum: the user never
		* chose it. Returns a copy with `fontSize` dropped so {@link mergePrefs}
		* falls back to the default. Only applied on READ (stale storage), never on
		* write — a freshly typed out-of-range value still clamps to the nearest
		* bound via {@link clampResttyFontSize}.
		*/
		function dropStaleFontSize(raw) {
			if (typeof raw.fontSize === "number" && raw.fontSize < 12) {
				const { fontSize: _omit, ...rest } = raw;
				return rest;
			}
			return raw;
		}
		/** Read prefs from localStorage (the global terminal-appearance source). */
		function readPrefsFromLocalStorage() {
			if (typeof localStorage === "undefined") return { ...DEFAULT_PREFS$1 };
			try {
				const raw = localStorage.getItem(PREFS_STORAGE_KEY);
				return mergePrefs(dropStaleFontSize(raw !== null ? JSON.parse(raw) : {}));
			} catch {
				return { ...DEFAULT_PREFS$1 };
			}
		}
		let cachedSnapshot = readPrefsFromLocalStorage();
		const listeners = /* @__PURE__ */ new Set();
		/** The cross-chunk broadcast channel — see the module doc's "Cross-chunk
		*  notification" section for why this exists instead of a plain in-memory
		*  notify. */
		const PREFS_CHANGED_EVENT = "dsh-powerdesk:prefs-changed";
		function notifyTerminalPrefs() {
			cachedSnapshot = readPrefsFromLocalStorage();
			for (const listener of listeners) try {
				listener();
			} catch {}
		}
		if (typeof window !== "undefined") window.addEventListener(PREFS_CHANGED_EVENT, notifyTerminalPrefs);
		/**
		* Subscribe to terminal-appearance prefs changes (for `useSyncExternalStore`).
		* @returns an unsubscribe function.
		*/
		function subscribeTerminalPrefs(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		}
		/**
		* Stable snapshot for `useSyncExternalStore`. Returns the cached prefs object;
		* replaced (not mutated) on each write so React detects the change. Between
		* writes the SAME reference is returned (required by useSyncExternalStore).
		*/
		function getTerminalPrefsSnapshot() {
			return cachedSnapshot;
		}
		//#endregion
		//#region src/client/useTerminalPrefs.ts
		/**
		* Reactive binding to the global terminal-appearance prefs for the
		* `useSyncExternalStore` API. The Powerdesk Side card writes via
		* {@link ./prefs.ts}'s `writePrefsToLocalStorage`, which notifies the
		* {@link subscribeTerminalPrefs} listeners; any mounted terminal subscribed
		* through this hook re-renders with the new prefs without a remount.
		*
		* The snapshot is cached in `prefs.ts` and replaced (not mutated) on each
		* write, so `useSyncExternalStore` sees a stable reference between writes.
		*/
		/** Subscribe to the global terminal-appearance prefs and re-render on change. */
		function useTerminalPrefs() {
			return (0, react.useSyncExternalStore)(subscribeTerminalPrefs, getTerminalPrefsSnapshot, getTerminalPrefsSnapshot);
		}
		//#endregion
		//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region \0dsh-css:/home/zteng/work/Tools/dsh-powerdesk/src/client/sidebar.module.css.mjs
		const css = ".Kvd2vq_toggleCluster{z-index:45;flex-direction:row;gap:4px;display:flex;position:fixed;top:3px;right:10px}.Kvd2vq_panel:not(.Kvd2vq_panelHidden) .Kvd2vq_tabBar{padding-right:72px}.Kvd2vq_toggleButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out), color var(--ds-transition-duration-slow) var(--ds-ease-in-out);background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;display:flex}.Kvd2vq_toggleButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_toggleButton:disabled{opacity:.4;cursor:default}.Kvd2vq_panel{z-index:41;background:var(--dsw-alias-bg-layer-1);border-left:1px solid var(--dsw-alias-border-l2);transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;display:flex;position:fixed;top:0;bottom:0;right:0}.Kvd2vq_panelHidden{pointer-events:none;visibility:hidden;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);transform:translate(102%)}.Kvd2vq_panel[data-dragging]{transition:none}.Kvd2vq_panelResize{cursor:col-resize;z-index:2;touch-action:none;width:8px;position:absolute;top:0;bottom:0;left:-4px}.Kvd2vq_panelResizeActive{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_panelBody{flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_bottomPanel{z-index:40;background:var(--dsw-alias-bg-layer-1);border-top:1px solid var(--dsw-alias-border-l2);transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), height var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;display:flex;position:fixed;bottom:0;right:0}.Kvd2vq_bottomPanelHidden{pointer-events:none;visibility:hidden;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), height var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);transform:translateY(102%)}.Kvd2vq_bottomPanel[data-dragging]{transition:none}.Kvd2vq_bottomResize{cursor:row-resize;z-index:2;touch-action:none;height:8px;position:absolute;top:-4px;left:0;right:0}.Kvd2vq_bottomResizeActive{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_bottomClose{z-index:4;width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex;position:absolute;top:3px;right:6px}.Kvd2vq_bottomClose:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_bottomPanel .Kvd2vq_tabBar{padding-right:40px}body[data-dsh-title-bar-compat] .Kvd2vq_panel{padding-top:var(--dsh-title-bar-strip,40px)}.Kvd2vq_cornerHandle{left:-6px;bottom:calc(var(--dsh-sidebar-height,0px) + 6px);z-index:2;cursor:nwse-resize;touch-action:none;width:12px;height:12px;position:absolute}.Kvd2vq_cornerHandle:hover,.Kvd2vq_cornerHandle[data-dragging]{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_iconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_iconButton:disabled{opacity:.4;cursor:default}.Kvd2vq_workbench,.Kvd2vq_split{flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_splitRow{flex-direction:row}.Kvd2vq_splitCol{flex-direction:column}.Kvd2vq_splitChild{display:flex;position:relative;overflow:hidden}.Kvd2vq_divider{z-index:3;touch-action:none;flex:none;position:relative}.Kvd2vq_dividerRow:after,.Kvd2vq_dividerCol:after{content:\"\";background:var(--dsw-alias-border-l2);transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out);position:absolute}.Kvd2vq_dividerRow{cursor:col-resize;width:7px;margin:0 -2px}.Kvd2vq_dividerRow:after{width:1px;top:0;bottom:0;left:50%;transform:translate(-50%)}.Kvd2vq_dividerCol{cursor:row-resize;height:7px;margin:-2px 0}.Kvd2vq_dividerCol:after{height:1px;top:50%;left:0;right:0;transform:translateY(-50%)}.Kvd2vq_divider:hover:after,.Kvd2vq_dividerActive:after{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_pane{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;position:relative}.Kvd2vq_paneDrop{outline:1px solid var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}.Kvd2vq_dropOverlay{z-index:6;pointer-events:none;background:var(--dsw-alias-interactive-bg-hover-accent);opacity:.5;position:absolute}.Kvd2vq_dropLeft{width:25%;top:0;bottom:0;left:0}.Kvd2vq_dropRight{width:25%;top:0;bottom:0;right:0}.Kvd2vq_dropUp{height:25%;top:0;left:0;right:0}.Kvd2vq_dropDown{height:25%;bottom:0;left:0;right:0}.Kvd2vq_dropCenter{outline:2px dashed var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-2px;background:0 0;inset:25%}.Kvd2vq_paneContent{flex-direction:column;flex:1;min-height:0;display:flex;overflow:hidden}.Kvd2vq_paneTab{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_paneTabHidden{display:none}.Kvd2vq_paneEmptyCards{flex-direction:column;flex:1;gap:20px;min-height:0;padding:28px 20px 20px;display:flex;overflow:hidden}.Kvd2vq_paneEmptyHeader{text-align:left;flex-direction:row;flex:none;justify-content:space-between;align-items:flex-start;gap:12px;display:flex}.Kvd2vq_paneEmptyHeaderText{flex-direction:column;gap:4px;min-width:0;display:flex}.Kvd2vq_paneEmptyHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0;line-height:1.3}.Kvd2vq_paneEmptySubheading{font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);margin:0;line-height:1.4}.Kvd2vq_paneLayoutRadio{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:8px;flex:none;align-items:center;gap:2px;padding:2px;display:inline-flex}.Kvd2vq_paneLayoutOption{width:28px;height:28px;color:var(--dsw-alias-label-tertiary);cursor:pointer;transition:background .12s var(--dsh-ease-in-out,ease), color .12s var(--dsh-ease-in-out,ease);background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;display:inline-flex}.Kvd2vq_paneLayoutOption:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_paneLayoutOptionSelected,.Kvd2vq_paneLayoutOptionSelected:hover{background:var(--dsw-alias-interactive-bg-active);color:var(--dsw-alias-brand-primary)}.Kvd2vq_paneEmptyControls{flex:none;align-items:center;gap:8px;display:inline-flex}.Kvd2vq_paneCardGrid{flex:1;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));align-content:start;gap:12px;min-height:0;display:grid}.Kvd2vq_paneCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-width:0;color:var(--dsw-alias-label-secondary);cursor:pointer;text-align:left;transition:background .12s var(--dsh-ease-in-out,ease), border-color .12s var(--dsh-ease-in-out,ease), transform .12s var(--dsh-ease-in-out,ease), box-shadow .12s var(--dsh-ease-in-out,ease);border-radius:10px;flex-direction:row;align-items:flex-start;gap:12px;padding:14px;display:flex}.Kvd2vq_paneCardIcon{background:var(--dsw-alias-interactive-bg-hover-accent);width:36px;height:36px;color:var(--dsw-alias-brand-primary);border-radius:8px;flex:none;justify-content:center;align-items:center;font-size:16px;display:flex}.Kvd2vq_paneCardText{flex-direction:column;gap:2px;min-width:0;display:flex}.Kvd2vq_paneCardLabel{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.Kvd2vq_paneCardDesc{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.4;display:-webkit-box;overflow:hidden}.Kvd2vq_paneCard:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2);transform:translateY(-1px);box-shadow:0 2px 8px #0000001f}.Kvd2vq_paneCard:hover:not(:disabled) .Kvd2vq_paneCardIcon{background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_paneCard:active:not(:disabled){box-shadow:none;transform:translateY(0)}.Kvd2vq_paneCard:disabled{opacity:.45;cursor:default}.Kvd2vq_tabBar{border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);flex:none;align-items:stretch;height:34px;display:flex}.Kvd2vq_tabBarDrop{outline:1px dashed var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}.Kvd2vq_tabList{scrollbar-width:none;flex:1;min-width:0;display:flex;overflow-x:auto}.Kvd2vq_tabList::-webkit-scrollbar{display:none}.Kvd2vq_tab{min-width:64px;max-width:160px;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);border-right:1px solid var(--dsw-alias-border-l1);cursor:pointer;user-select:none;background:0 0;flex:none;align-items:center;gap:4px;padding:0 4px 0 10px;display:flex}.Kvd2vq_tab:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_tabActive{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_tabTitle{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Kvd2vq_tabBadge{min-width:16px;height:15px;font:var(--dsw-font-xxxs-strong-11);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-brand-primary);border-radius:8px;flex:none;justify-content:center;align-items:center;padding:0 4px;display:inline-flex}.Kvd2vq_tabClose{width:18px;height:18px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:4px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_tabClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_tabBarPlus{background:var(--dsw-alias-bg-layer-1);width:22px;height:22px;color:var(--dsw-alias-label-tertiary);cursor:pointer;border:none;border-radius:5px;flex:none;justify-content:center;align-self:center;align-items:center;margin:0 6px;padding:0;display:inline-flex;position:sticky;right:0}.Kvd2vq_tabBarPlus:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorer{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_explorerHeader{flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_explorerHeaderPath{flex:1;align-items:center;gap:2px;min-width:0;display:flex}.Kvd2vq_explorerHeaderActions{flex:none;align-items:center;gap:4px;display:flex}.Kvd2vq_explorerRoot{min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;text-align:left;flex:1;display:block;overflow:hidden}.Kvd2vq_explorerBody{flex:1;min-width:0;min-height:0;padding:2px 6px 8px;overflow:hidden auto}.Kvd2vq_explorerRow{box-sizing:border-box;width:100%;min-width:0;height:34px;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);text-align:left;cursor:pointer;white-space:nowrap;animation:Kvd2vq_dsh-row-in .15s var(--ds-ease-in-out);background:0 0;border:none;border-radius:8px;align-items:center;gap:6px;padding:0 8px;display:flex;overflow:hidden}.Kvd2vq_explorerRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_explorerDir{font:var(--dsw-font-s-strong-14)}.Kvd2vq_explorerRowActive{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_explorerHidden{opacity:.45}.Kvd2vq_explorerSymlink{color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_explorerBroken .Kvd2vq_explorerName{color:var(--dsw-alias-state-error-primary)}.Kvd2vq_explorerName{text-overflow:ellipsis;flex:1;min-width:0;overflow:hidden}.Kvd2vq_explorerRef{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;align-items:center;padding:0 8px;display:none}.Kvd2vq_explorerRef:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorerRow:hover .Kvd2vq_explorerRef,.Kvd2vq_explorerRow:focus-within .Kvd2vq_explorerRef{display:inline-flex}.Kvd2vq_explorerPill{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;align-items:center;padding:0 8px;display:inline-flex}.Kvd2vq_explorerPill:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorerPill:disabled{opacity:.4;cursor:default}.Kvd2vq_explorerPillActive{background:var(--dsw-alias-interactive-bg-active);color:var(--dsw-alias-brand-primary)}.Kvd2vq_explorerCopied{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_explorerError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);cursor:default}@keyframes Kvd2vq_dsh-row-in{0%{opacity:0}}.Kvd2vq_explorerEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;padding:16px}.Kvd2vq_searchSummary{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);padding:8px 12px 4px}.Kvd2vq_searchGroup{margin-bottom:4px}.Kvd2vq_searchMatchRow{cursor:pointer;text-align:left;background:0 0;border:none;border-radius:8px;align-items:flex-start;gap:8px;width:100%;min-width:0;min-height:26px;padding:4px 8px 4px 30px;display:flex}.Kvd2vq_searchMatchRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_searchMatchLine{min-width:24px;font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);text-align:right;user-select:none;flex:none;padding-top:1px}.Kvd2vq_searchMatchText{white-space:pre-wrap;overflow-wrap:anywhere;min-width:0;color:var(--dsw-alias-label-secondary);flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.5}.Kvd2vq_searchMatchHighlight{background:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 55%, transparent);color:var(--dsw-alias-label-primary);border-radius:2px}.Kvd2vq_searchModifiers{flex:none;align-items:center;gap:2px;display:flex}.Kvd2vq_searchModifierButton{width:22px;height:22px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;background:0 0;border:none;border-radius:5px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_searchModifierButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_searchModifierUnderline{text-decoration:underline}.Kvd2vq_editor{flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_dirtyDot{background:var(--dsw-alias-state-warn-primary);border-radius:50%;flex:none;width:7px;height:7px}.Kvd2vq_editorPlaceholder{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;flex:1;justify-content:center;align-items:center;padding:16px;display:flex}.Kvd2vq_orphanedType{opacity:.7;overflow-wrap:anywhere;margin-top:8px;font-size:12px;display:block}.Kvd2vq_editorBinary{text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:12px;padding:24px 16px;display:flex}.Kvd2vq_editorBinaryNotice{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_editorDownloadLink{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-strong-12);cursor:pointer;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out), border-color var(--ds-transition-duration-slow) var(--ds-ease-in-out);border-radius:6px;align-items:center;gap:6px;padding:6px 14px;text-decoration:none;display:inline-flex}.Kvd2vq_editorDownloadLink:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l2)}.Kvd2vq_editorError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);padding:12px 16px}.Kvd2vq_editorBanner{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex:none;padding:4px 12px}.Kvd2vq_sandboxStatus{font:var(--dsw-font-xxxs-11);flex:none;align-items:center;gap:8px;padding:4px 10px;display:flex}.Kvd2vq_sandboxStatusOn{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-bottom:1px solid var(--dsw-alias-border-l1)}.Kvd2vq_sandboxStatusOff{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);border-bottom:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, transparent)}.Kvd2vq_sandboxDot{background:var(--dsw-alias-state-success-primary);border-radius:50%;flex:none;width:6px;height:6px}.Kvd2vq_sandboxStatusOff .Kvd2vq_sandboxDot{background:var(--dsw-alias-state-error-primary)}.Kvd2vq_sandboxStatusText{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Kvd2vq_sandboxAction{border:1px solid var(--dsw-alias-border-l2);font:inherit;color:inherit;cursor:pointer;background:0 0;border-radius:6px;flex:none;padding:2px 8px}.Kvd2vq_sandboxAction:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorHtml{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_browser{flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_browserBar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:4px;padding:6px 8px;display:flex}.Kvd2vq_browserInput{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-width:0;height:28px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:6px;flex:1;padding:0 10px}.Kvd2vq_browserInput:focus{border-color:var(--dsw-alias-border-l2);outline:none}.Kvd2vq_browserMessage{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex:none;padding:4px 12px}.Kvd2vq_browserFrame{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_browserStart{text-align:center;min-height:0;font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);flex:1;justify-content:center;align-items:center;padding:20px;display:flex}.Kvd2vq_browserBlocked{text-align:center;min-height:0;color:var(--dsw-alias-state-warn-primary);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:6px;padding:24px;display:flex}.Kvd2vq_browserBlockedTitle{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary)}.Kvd2vq_browserBlockedDesc{max-width:280px;font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-secondary)}.Kvd2vq_browserBlockedActions{gap:8px;margin-top:6px;display:flex}.Kvd2vq_browserBlockedButton{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxxs-11);cursor:pointer;border-radius:6px;padding:4px 12px}.Kvd2vq_browserBlockedButton:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorCm{background:0 0;flex:1;min-height:0;overflow:hidden}.Kvd2vq_editorCmHidden{display:none}.Kvd2vq_editorCm .cm-editor{height:100%}.Kvd2vq_editorCm .cm-editor.cm-focused{outline:none}.Kvd2vq_editorModeToggle{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:6px;flex:none;align-items:center;gap:2px;padding:2px;display:inline-flex}.Kvd2vq_editorModeButton{color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-11);cursor:pointer;background:0 0;border:none;border-radius:4px;padding:2px 8px}.Kvd2vq_editorModeButton:hover{color:var(--dsw-alias-label-primary)}.Kvd2vq_editorModeActive{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}.Kvd2vq_editorImageWrap{flex:1;justify-content:center;align-items:center;min-height:0;padding:12px;display:flex;overflow:auto}.Kvd2vq_editorImage{object-fit:contain;max-width:100%;max-height:100%}.Kvd2vq_editorMd{min-height:0;font:var(--dsw-font-xs-13);flex:1;padding:10px 14px;overflow-y:auto}.Kvd2vq_selectionPopup{z-index:60;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:28px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxxs-strong-11);white-space:nowrap;cursor:pointer;border-radius:6px;align-items:center;padding:0 10px;display:inline-flex;position:fixed;transform:translate(-50%,calc(-100% - 8px))}.Kvd2vq_selectionPopup:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorPdf{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_editorPdfToolbar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:flex-end;padding:6px 8px;display:flex}.Kvd2vq_editorPdfStage{flex:1;min-height:0;display:flex;position:relative}.Kvd2vq_editorPdfFrame{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_editorPdfFrameBlocked{pointer-events:none}.Kvd2vq_editorPdfDragShield{z-index:4;pointer-events:none;background:0 0;position:absolute;inset:0}.Kvd2vq_editorPdfDragShieldActive{pointer-events:auto}body[data-dsh-tab-dragging] .Kvd2vq_editorPdfFrame{pointer-events:none!important}body[data-dsh-tab-dragging] .Kvd2vq_editorPdfDragShield{pointer-events:auto!important}.Kvd2vq_terminalWrap{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-height:0;display:flex;position:relative}.Kvd2vq_terminal{flex:1;min-height:0;padding:6px 4px 6px 8px}.Kvd2vq_terminal .xterm{height:100%}.Kvd2vq_terminalBanner{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex-wrap:wrap;flex:none;align-items:center;gap:8px;padding:3px 10px;display:flex}.Kvd2vq_terminalBannerUrl{word-break:break-all;opacity:.85;flex-basis:100%;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.Kvd2vq_boundaryError{z-index:50;background:var(--dsw-alias-bg-layer-1);border-left:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);flex-direction:column;align-items:flex-start;gap:8px;padding:16px;display:flex;position:fixed;top:0;bottom:0;right:0;overflow:auto}.Kvd2vq_terminalRetry{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;padding:1px 8px}.Kvd2vq_terminalRetry:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_terminalDepsBanner{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex-direction:column;flex:none;gap:6px;padding:10px;display:flex}.Kvd2vq_terminalDepsTitle{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-state-warn-primary)}.Kvd2vq_terminalDepsHint{opacity:.9}.Kvd2vq_terminalDepsCommandRow{align-items:flex-start;gap:8px;display:flex}.Kvd2vq_terminalRepairCommand{white-space:pre-wrap;word-break:break-all;user-select:text;min-width:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:4px;flex:1;max-height:160px;margin:0;padding:6px 8px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.5;overflow:auto}.Kvd2vq_terminalDepsNote{opacity:.85}.Kvd2vq_terminalDepsActions{align-items:center;gap:8px;display:flex}.Kvd2vq_tabBoundaryError{min-height:0;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);flex-direction:column;flex:1;align-items:flex-start;gap:8px;padding:12px 16px;display:flex;overflow:auto}.Kvd2vq_git{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden auto}.Kvd2vq_gitHeader{flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_gitBranchSelect{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);min-width:0;height:26px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:6px;flex:1;padding:0 6px}.Kvd2vq_gitSection{border-top:1px solid var(--dsw-alias-border-l1)}.Kvd2vq_gitSectionHeader{font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-label-tertiary);text-transform:uppercase;justify-content:space-between;align-items:center;padding:6px 12px 4px;display:flex}.Kvd2vq_gitLink{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-brand-primary);cursor:pointer;background:0 0;border:none;padding:0}.Kvd2vq_gitLink:hover:not(:disabled){text-decoration:underline}.Kvd2vq_gitLink:disabled{opacity:.4;cursor:default}.Kvd2vq_gitRow{min-height:34px;animation:Kvd2vq_dsh-row-in .15s var(--ds-ease-in-out);border-radius:8px;align-items:center;gap:6px;margin:0 6px;padding:0 8px;display:flex}.Kvd2vq_gitRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitRowSelected{background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_gitRowMain{cursor:pointer;text-align:left;background:0 0;border:none;flex:1;align-items:center;gap:8px;min-width:0;padding:3px 0;display:flex}.Kvd2vq_gitBadge{width:20px;height:16px;font:var(--dsw-font-xxxs-strong-11);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);border-radius:4px;flex:none;justify-content:center;align-items:center;display:inline-flex}.Kvd2vq_gitName{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);padding:4px 12px 8px}.Kvd2vq_gitPlaceholder{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;padding:16px}.Kvd2vq_gitError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);white-space:pre-wrap;padding:8px 12px}.Kvd2vq_gitDiff{border-top:1px solid var(--dsw-alias-border-l1);padding:8px}.Kvd2vq_gitDiffTab{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden auto}.Kvd2vq_gitDiffTabHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_gitDiffTabTitle{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitDiffFile{align-items:baseline;gap:6px;padding:8px 2px 2px;display:flex}.Kvd2vq_gitDiffFilePath{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_gitDiffFileOld{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;flex:none;max-width:40%;overflow:hidden}.Kvd2vq_gitDiffFileTag{border:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;padding:0 6px}.Kvd2vq_gitDiffHunk{font:var(--dsw-font-markdown-code-block-small);color:var(--dsw-alias-label-tertiary);gap:8px;padding:3px 2px;display:flex}.Kvd2vq_gitDiffHunkHeader{color:var(--dsw-alias-label-secondary);flex:none}.Kvd2vq_gitDiffHunkSection{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_gitDiffLine{font:var(--dsw-font-markdown-code-block-small);white-space:pre-wrap;overflow-wrap:anywhere;align-items:stretch;min-width:0;line-height:20px;display:flex}.Kvd2vq_gitDiffNum{text-align:right;width:36px;color:var(--dsw-alias-label-tertiary);user-select:none;flex:none;padding-right:8px}.Kvd2vq_gitDiffCode{flex:1;min-width:0;overflow:visible}.Kvd2vq_gitDiffCtx{color:var(--dsw-alias-label-primary)}.Kvd2vq_gitDiffDel{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent)}.Kvd2vq_gitDiffAdd{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent)}.Kvd2vq_gitDiffMeta{padding-left:2px}.Kvd2vq_gitDiffMetaText{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);font-style:italic}.Kvd2vq_gitDiffExpand{width:100%;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-brand-primary);cursor:pointer;text-align:center;background:0 0;border:none;margin:4px 0;display:block}.Kvd2vq_gitDiffExpand:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitConfirmDesc{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);white-space:pre-wrap;margin:0}.Kvd2vq_gitCommit{border-top:1px solid var(--dsw-alias-border-l1);align-items:center;gap:6px;padding:8px 12px;display:flex}.Kvd2vq_gitCommitInput{flex:1;min-width:0}.Kvd2vq_gitCommitButton{background:var(--dsw-alias-button-primary-fill);height:26px;color:var(--dsw-alias-label-primary-inverted);font:var(--dsw-font-xxs-strong-12);cursor:pointer;border:none;border-radius:6px;flex:none;padding:0 12px}.Kvd2vq_gitCommitButton:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}.Kvd2vq_gitCommitButton:disabled{opacity:.45;cursor:default}.Kvd2vq_gitLogRow{cursor:pointer;border-radius:8px;flex-direction:column;gap:2px;padding:5px 12px;display:flex}.Kvd2vq_gitLogRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitLogLine1{align-items:baseline;gap:8px;min-width:0;display:flex}.Kvd2vq_gitLogHash{font:var(--dsw-font-markdown-code-block-small);color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_gitLogLine2{flex-wrap:wrap;align-items:center;gap:6px;min-width:0;display:flex}.Kvd2vq_gitLogRef{border:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-brand-primary);white-space:nowrap;border-radius:999px;flex:none;padding:0 5px}.Kvd2vq_gitLogSubject{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitLogMeta{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_gitLogMore{border:1px solid var(--dsw-alias-border-l2);width:calc(100% - 24px);font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border-radius:6px;margin:4px 12px 8px;padding:6px 0;display:block}.Kvd2vq_gitLogMore:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_gitLogMore:disabled{opacity:.5;cursor:default}.Kvd2vq_producedRow{flex-wrap:wrap;align-items:center;gap:8px;padding:4px 0;display:flex}.Kvd2vq_producedLabel{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_producedChip{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);max-width:200px;color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;border-radius:999px;align-items:center;gap:4px;padding:2px 8px;display:inline-flex;overflow:hidden}.Kvd2vq_producedChip:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_producedChip span{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_producedMore{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_toggleButton:focus-visible,.Kvd2vq_bottomClose:focus-visible,.Kvd2vq_iconButton:focus-visible,.Kvd2vq_tab:focus-visible,.Kvd2vq_tabClose:focus-visible,.Kvd2vq_tabBarPlus:focus-visible,.Kvd2vq_paneCard:focus-visible,.Kvd2vq_paneLayoutOption:focus-visible,.Kvd2vq_explorerRow:focus-visible,.Kvd2vq_explorerRef:focus-visible,.Kvd2vq_gitRowMain:focus-visible,.Kvd2vq_gitLink:focus-visible,.Kvd2vq_gitCommitButton:focus-visible,.Kvd2vq_gitLogRow:focus-visible,.Kvd2vq_gitLogMore:focus-visible,.Kvd2vq_gitDiffExpand:focus-visible,.Kvd2vq_terminalRetry:focus-visible,.Kvd2vq_editorModeButton:focus-visible,.Kvd2vq_editorDownloadLink:focus-visible,.Kvd2vq_editorPptxButton:focus-visible,.Kvd2vq_editorDocxZoomRange:focus-visible{outline:2px solid var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}@media (prefers-reduced-motion:reduce){.Kvd2vq_panel,.Kvd2vq_panelHidden,.Kvd2vq_bottomPanel,.Kvd2vq_bottomPanelHidden,.Kvd2vq_toggleCluster,.Kvd2vq_toggleButton,.Kvd2vq_tab,.Kvd2vq_tabBarPlus,.Kvd2vq_paneCard,.Kvd2vq_explorerRow,.Kvd2vq_gitRow,.Kvd2vq_divider,.Kvd2vq_dividerRow:after,.Kvd2vq_dividerCol:after{transition:none;animation:none}}@media (width<=767px){.Kvd2vq_panel:not(.Kvd2vq_panelHidden) .Kvd2vq_tabBar{padding-right:40px}.Kvd2vq_tab{min-width:48px;max-width:128px}}.Kvd2vq_settingsIntro{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);margin:0 0 12px}.Kvd2vq_settingsGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;display:grid}.Kvd2vq_settingsCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);cursor:pointer;text-align:left;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out);border-radius:12px;flex-direction:column;gap:8px;padding:14px;display:flex;position:relative}.Kvd2vq_settingsCard:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_settingsCardIcon{background:var(--dsw-alias-bg-layer-2);width:32px;height:32px;color:var(--dsw-alias-label-primary);border-radius:9px;justify-content:center;align-items:center;display:flex}.Kvd2vq_settingsCardTitle{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary)}.Kvd2vq_settingsCardSubtitle{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_settingsCardToggle{border:1px solid var(--dsw-alias-border-l2);color:#0000;cursor:pointer;background:0 0;border-radius:50%;justify-content:center;align-items:center;width:22px;height:22px;display:flex;position:absolute;top:12px;right:12px}.Kvd2vq_settingsCardToggleOn{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);border-color:#0000}.Kvd2vq_settingsHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:12px 0 0}.Kvd2vq_settingsMissing{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-radius:10px;margin:0;padding:12px}.Kvd2vq_notesRoot{flex:1;min-height:0;display:flex}.Kvd2vq_notesTree{flex-direction:column;flex:none;min-width:0;display:flex;overflow:hidden}.Kvd2vq_notesEditor{flex-direction:column;flex:1;min-width:0;display:flex}.Kvd2vq_notesBindPrompt{text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:10px;padding:24px;display:flex}.Kvd2vq_folderPickerPath{border-bottom:1px solid var(--dsw-alias-border-l1);align-items:center;gap:8px;margin-bottom:4px;padding-bottom:10px;display:flex}.Kvd2vq_folderPickerList{height:320px;overflow:hidden auto}.Kvd2vq_folderPickerFooter{justify-content:flex-end;gap:8px;display:flex}.Kvd2vq_extSection{border-top:1px solid var(--dsw-alias-border-l1);margin-top:20px;padding-top:16px}.Kvd2vq_extHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0 0 8px}.Kvd2vq_extWarning{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:10px;margin:0 0 12px;padding:10px 12px}.Kvd2vq_extActions{gap:8px;margin-bottom:12px;display:flex}.Kvd2vq_extActions button,.Kvd2vq_extPromptActions button{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);cursor:pointer;border-radius:8px;padding:6px 12px}.Kvd2vq_extActions button:disabled,.Kvd2vq_extPromptActions button:disabled{opacity:.5;cursor:default}.Kvd2vq_extPromptPrimary{background:var(--dsw-alias-label-primary)!important;color:var(--dsw-alias-bg-base)!important;border-color:#0000!important}.Kvd2vq_extList{flex-direction:column;gap:8px;display:flex}.Kvd2vq_extRow{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:10px;align-items:flex-start;gap:10px;padding:10px 12px;display:flex}.Kvd2vq_extRowIcon{background:var(--dsw-alias-bg-layer-2);border-radius:8px;flex:none;justify-content:center;align-items:center;width:28px;height:28px;font-size:15px;line-height:1;display:flex}.Kvd2vq_extRowBody{flex-direction:column;flex:auto;gap:2px;min-width:0;display:flex}.Kvd2vq_extRowTitle{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary)}.Kvd2vq_extRowMeta{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}.Kvd2vq_extRowPath{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);opacity:.75;overflow-wrap:anywhere}.Kvd2vq_extRowRemove{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;background:0 0;border-radius:8px;flex:none;align-self:center;padding:5px 10px}.Kvd2vq_extRowRemove:disabled{opacity:.5;cursor:default}.Kvd2vq_extEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:0}.Kvd2vq_extError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);overflow-wrap:anywhere;border-radius:10px;margin:12px 0 0;padding:10px 12px}.Kvd2vq_extPrompt{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;flex-direction:column;gap:8px;margin-bottom:12px;padding:12px;display:flex}.Kvd2vq_extPromptHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);margin:0}.Kvd2vq_extPromptFile{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere;margin:0}.Kvd2vq_extPromptField{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;display:flex}.Kvd2vq_extPromptField input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:8px;padding:6px 10px}.Kvd2vq_extPromptActions{justify-content:flex-end;gap:8px;display:flex}.Kvd2vq_appearanceSection{border-top:1px solid var(--dsw-alias-border-l1);margin-top:20px;padding-top:16px}.Kvd2vq_appearanceHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0 0 8px}.Kvd2vq_appearanceGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:12px;display:grid}.Kvd2vq_appearanceFieldFull{grid-column:1/-1}.Kvd2vq_appearanceField{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;display:flex}.Kvd2vq_appearanceFieldLabel{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary)}.Kvd2vq_appearanceControl{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);box-sizing:border-box;border-radius:8px;width:100%;padding:6px 10px}.Kvd2vq_appearanceControl:focus{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2));outline:none}.Kvd2vq_appearanceSelectTrigger{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);box-sizing:border-box;cursor:pointer;text-align:left;border-radius:8px;justify-content:space-between;align-items:center;gap:8px;width:100%;padding:6px 10px;display:flex}.Kvd2vq_appearanceSelectTrigger:hover{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2))}.Kvd2vq_appearanceSelectTrigger:focus-visible{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2));box-shadow:0 0 0 2px var(--dsw-alias-interactive-bg-active,transparent);outline:none}.Kvd2vq_appearanceSelectTrigger[data-placeholder]{color:var(--dsw-alias-label-tertiary)}.Kvd2vq_appearanceSelectTrigger:disabled{opacity:.6;cursor:default}.Kvd2vq_appearanceSelectCaret{color:var(--dsw-alias-label-tertiary);flex-shrink:0;align-items:center;display:inline-flex}.Kvd2vq_appearanceSelectContent{min-width:var(--radix-select-trigger-width);max-height:var(--radix-select-content-available-height,280px);border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-elevated,var(--dsw-alias-bg-base));z-index:1000;border-radius:8px;overflow:hidden;box-shadow:0 6px 24px #0000002e}.Kvd2vq_appearanceSelectViewport{padding:4px}.Kvd2vq_appearanceSelectItem{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);cursor:pointer;user-select:none;border-radius:6px;outline:none;align-items:center;gap:6px;padding:6px 8px;display:flex}.Kvd2vq_appearanceSelectItem[data-highlighted]{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_appearanceSelectItem[data-disabled]{opacity:.5;cursor:default}.Kvd2vq_appearanceSelectIndicator{color:var(--dsw-alias-label-primary);flex-shrink:0;align-items:center;display:inline-flex}.Kvd2vq_appearanceInlineToggle{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);cursor:pointer;text-underline-offset:2px;background:0 0;border:none;align-self:flex-start;margin-top:2px;padding:0;text-decoration:underline}.Kvd2vq_appearanceInlineToggle:hover{color:var(--dsw-alias-label-secondary)}.Kvd2vq_appearanceHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:8px 0 0}.Kvd2vq_calendarContainer{height:100%}.Kvd2vq_calendarContainer .fc{height:100%;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);--fc-border-color:var(--dsw-alias-border-l2);--fc-page-bg-color:transparent;--fc-neutral-bg-color:var(--dsw-alias-bg-layer-2);--fc-list-event-hover-bg-color:var(--dsw-alias-interactive-bg-hover);--fc-today-bg-color:var(--dsw-alias-interactive-bg-hover-accent);--fc-now-indicator-color:var(--dsw-alias-state-error-primary);--fc-event-bg-color:var(--dsw-alias-brand-primary);--fc-event-border-color:var(--dsw-alias-brand-primary);--fc-event-text-color:var(--dsw-alias-label-primary-inverted);--fc-button-text-color:var(--dsw-alias-label-secondary);--fc-button-bg-color:var(--dsw-alias-bg-layer-2);--fc-button-border-color:var(--dsw-alias-border-l2);--fc-button-hover-bg-color:var(--dsw-alias-interactive-bg-hover);--fc-button-hover-border-color:var(--dsw-alias-border-l2);--fc-button-active-bg-color:var(--dsw-alias-interactive-bg-active);--fc-button-active-border-color:var(--dsw-alias-border-l2)}.Kvd2vq_calendarContainer .fc .fc-toolbar-title{font:var(--dsw-font-xxs-strong-12)}.Kvd2vq_calendarContainer .fc .fc-button{text-transform:capitalize;box-shadow:none}.Kvd2vq_calendarEventForm{flex-direction:column;gap:12px;display:flex}.Kvd2vq_calendarEventRow{gap:12px;display:flex}.Kvd2vq_calendarEventRow .Kvd2vq_calendarEventField{flex:1;min-width:0}.Kvd2vq_calendarEventField{flex-direction:column;gap:4px;display:flex}.Kvd2vq_calendarEventLabel{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-secondary)}.Kvd2vq_calendarEventDateInput,.Kvd2vq_calendarEventTextarea{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);width:100%;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:8px;padding:6px 10px}.Kvd2vq_calendarEventTextarea{resize:vertical;font-family:inherit}.Kvd2vq_calendarEventDateInput:focus,.Kvd2vq_calendarEventTextarea:focus{border-color:var(--dsw-alias-brand-primary);outline:none}";
		const tagId = "dsh-powerdesk/sidebar.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-powerdesk";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var sidebar_module_css_default = {
			"gitDiffHunkHeader": "Kvd2vq_gitDiffHunkHeader",
			"producedMore": "Kvd2vq_producedMore",
			"gitDiffAdd": "Kvd2vq_gitDiffAdd",
			"git": "Kvd2vq_git",
			"gitName": "Kvd2vq_gitName",
			"gitLogRow": "Kvd2vq_gitLogRow",
			"panelResizeActive": "Kvd2vq_panelResizeActive",
			"searchModifierButton": "Kvd2vq_searchModifierButton",
			"editorPdfFrameBlocked": "Kvd2vq_editorPdfFrameBlocked",
			"paneContent": "Kvd2vq_paneContent",
			"terminalBannerUrl": "Kvd2vq_terminalBannerUrl",
			"gitDiff": "Kvd2vq_gitDiff",
			"paneLayoutRadio": "Kvd2vq_paneLayoutRadio",
			"extRowIcon": "Kvd2vq_extRowIcon",
			"panelResize": "Kvd2vq_panelResize",
			"browserBlocked": "Kvd2vq_browserBlocked",
			"gitError": "Kvd2vq_gitError",
			"gitRowSelected": "Kvd2vq_gitRowSelected",
			"gitDiffLine": "Kvd2vq_gitDiffLine",
			"gitDiffExpand": "Kvd2vq_gitDiffExpand",
			"editorImageWrap": "Kvd2vq_editorImageWrap",
			"editorPdf": "Kvd2vq_editorPdf",
			"gitDiffFileTag": "Kvd2vq_gitDiffFileTag",
			"gitLink": "Kvd2vq_gitLink",
			"paneEmptyCards": "Kvd2vq_paneEmptyCards",
			"paneCardDesc": "Kvd2vq_paneCardDesc",
			"explorerBroken": "Kvd2vq_explorerBroken",
			"sandboxStatus": "Kvd2vq_sandboxStatus",
			"pane": "Kvd2vq_pane",
			"tabTitle": "Kvd2vq_tabTitle",
			"gitCommitButton": "Kvd2vq_gitCommitButton",
			"searchModifiers": "Kvd2vq_searchModifiers",
			"appearanceHeading": "Kvd2vq_appearanceHeading",
			"editorError": "Kvd2vq_editorError",
			"sandboxStatusOn": "Kvd2vq_sandboxStatusOn",
			"searchMatchHighlight": "Kvd2vq_searchMatchHighlight",
			"dropOverlay": "Kvd2vq_dropOverlay",
			"browserInput": "Kvd2vq_browserInput",
			"editorHtml": "Kvd2vq_editorHtml",
			"settingsCardToggle": "Kvd2vq_settingsCardToggle",
			"extEmpty": "Kvd2vq_extEmpty",
			"extError": "Kvd2vq_extError",
			"extSection": "Kvd2vq_extSection",
			"sandboxDot": "Kvd2vq_sandboxDot",
			"editorPdfDragShield": "Kvd2vq_editorPdfDragShield",
			"settingsCardTitle": "Kvd2vq_settingsCardTitle",
			"extPrompt": "Kvd2vq_extPrompt",
			"appearanceSelectTrigger": "Kvd2vq_appearanceSelectTrigger",
			"extRow": "Kvd2vq_extRow",
			"folderPickerPath": "Kvd2vq_folderPickerPath",
			"gitLogLine2": "Kvd2vq_gitLogLine2",
			"panelBody": "Kvd2vq_panelBody",
			"dirtyDot": "Kvd2vq_dirtyDot",
			"editorModeActive": "Kvd2vq_editorModeActive",
			"dropUp": "Kvd2vq_dropUp",
			"calendarContainer": "Kvd2vq_calendarContainer",
			"searchModifierUnderline": "Kvd2vq_searchModifierUnderline",
			"extWarning": "Kvd2vq_extWarning",
			"terminalDepsBanner": "Kvd2vq_terminalDepsBanner",
			"appearanceSection": "Kvd2vq_appearanceSection",
			"settingsHint": "Kvd2vq_settingsHint",
			"appearanceHint": "Kvd2vq_appearanceHint",
			"searchMatchLine": "Kvd2vq_searchMatchLine",
			"editorBinary": "Kvd2vq_editorBinary",
			"paneTab": "Kvd2vq_paneTab",
			"paneEmptyControls": "Kvd2vq_paneEmptyControls",
			"editorPptxButton": "Kvd2vq_editorPptxButton",
			"gitDiffTabTitle": "Kvd2vq_gitDiffTabTitle",
			"extPromptActions": "Kvd2vq_extPromptActions",
			"searchGroup": "Kvd2vq_searchGroup",
			"terminalBanner": "Kvd2vq_terminalBanner",
			"editor": "Kvd2vq_editor",
			"terminalDepsNote": "Kvd2vq_terminalDepsNote",
			"appearanceInlineToggle": "Kvd2vq_appearanceInlineToggle",
			"paneTabHidden": "Kvd2vq_paneTabHidden",
			"searchSummary": "Kvd2vq_searchSummary",
			"dropLeft": "Kvd2vq_dropLeft",
			"paneCardLabel": "Kvd2vq_paneCardLabel",
			"splitChild": "Kvd2vq_splitChild",
			"settingsMissing": "Kvd2vq_settingsMissing",
			"split": "Kvd2vq_split",
			"dropDown": "Kvd2vq_dropDown",
			"panelHidden": "Kvd2vq_panelHidden",
			"calendarEventForm": "Kvd2vq_calendarEventForm",
			"explorerHeader": "Kvd2vq_explorerHeader",
			"editorModeButton": "Kvd2vq_editorModeButton",
			"paneLayoutOption": "Kvd2vq_paneLayoutOption",
			"terminal": "Kvd2vq_terminal",
			"browserBlockedTitle": "Kvd2vq_browserBlockedTitle",
			"explorerPillActive": "Kvd2vq_explorerPillActive",
			"calendarEventDateInput": "Kvd2vq_calendarEventDateInput",
			"browser": "Kvd2vq_browser",
			"dividerRow": "Kvd2vq_dividerRow",
			"selectionPopup": "Kvd2vq_selectionPopup",
			"appearanceFieldFull": "Kvd2vq_appearanceFieldFull",
			"folderPickerFooter": "Kvd2vq_folderPickerFooter",
			"gitDiffHunk": "Kvd2vq_gitDiffHunk",
			"terminalWrap": "Kvd2vq_terminalWrap",
			"searchMatchRow": "Kvd2vq_searchMatchRow",
			"explorerSymlink": "Kvd2vq_explorerSymlink",
			"explorerHeaderPath": "Kvd2vq_explorerHeaderPath",
			"gitSectionHeader": "Kvd2vq_gitSectionHeader",
			"explorer": "Kvd2vq_explorer",
			"editorPdfDragShieldActive": "Kvd2vq_editorPdfDragShieldActive",
			"gitLogSubject": "Kvd2vq_gitLogSubject",
			"producedRow": "Kvd2vq_producedRow",
			"gitLogHash": "Kvd2vq_gitLogHash",
			"explorerHidden": "Kvd2vq_explorerHidden",
			"editorPdfStage": "Kvd2vq_editorPdfStage",
			"explorerError": "Kvd2vq_explorerError",
			"splitCol": "Kvd2vq_splitCol",
			"paneLayoutOptionSelected": "Kvd2vq_paneLayoutOptionSelected",
			"explorerBody": "Kvd2vq_explorerBody",
			"dividerCol": "Kvd2vq_dividerCol",
			"gitDiffMeta": "Kvd2vq_gitDiffMeta",
			"sandboxStatusOff": "Kvd2vq_sandboxStatusOff",
			"bottomClose": "Kvd2vq_bottomClose",
			"divider": "Kvd2vq_divider",
			"browserBlockedActions": "Kvd2vq_browserBlockedActions",
			"browserMessage": "Kvd2vq_browserMessage",
			"explorerRow": "Kvd2vq_explorerRow",
			"browserBlockedDesc": "Kvd2vq_browserBlockedDesc",
			"workbench": "Kvd2vq_workbench",
			"explorerCopied": "Kvd2vq_explorerCopied",
			"gitHeader": "Kvd2vq_gitHeader",
			"bottomResizeActive": "Kvd2vq_bottomResizeActive",
			"explorerRoot": "Kvd2vq_explorerRoot",
			"settingsCardToggleOn": "Kvd2vq_settingsCardToggleOn",
			"terminalRepairCommand": "Kvd2vq_terminalRepairCommand",
			"gitConfirmDesc": "Kvd2vq_gitConfirmDesc",
			"extRowTitle": "Kvd2vq_extRowTitle",
			"settingsIntro": "Kvd2vq_settingsIntro",
			"extPromptHint": "Kvd2vq_extPromptHint",
			"tabBarDrop": "Kvd2vq_tabBarDrop",
			"editorPdfFrame": "Kvd2vq_editorPdfFrame",
			"appearanceGrid": "Kvd2vq_appearanceGrid",
			"terminalRetry": "Kvd2vq_terminalRetry",
			"paneEmptyHeading": "Kvd2vq_paneEmptyHeading",
			"dsh-row-in": "Kvd2vq_dsh-row-in",
			"editorCmHidden": "Kvd2vq_editorCmHidden",
			"extRowBody": "Kvd2vq_extRowBody",
			"gitDiffFilePath": "Kvd2vq_gitDiffFilePath",
			"notesEditor": "Kvd2vq_notesEditor",
			"explorerHeaderActions": "Kvd2vq_explorerHeaderActions",
			"boundaryError": "Kvd2vq_boundaryError",
			"editorModeToggle": "Kvd2vq_editorModeToggle",
			"gitRowMain": "Kvd2vq_gitRowMain",
			"explorerName": "Kvd2vq_explorerName",
			"editorMd": "Kvd2vq_editorMd",
			"gitDiffHunkSection": "Kvd2vq_gitDiffHunkSection",
			"browserStart": "Kvd2vq_browserStart",
			"gitDiffCode": "Kvd2vq_gitDiffCode",
			"gitCommit": "Kvd2vq_gitCommit",
			"editorPlaceholder": "Kvd2vq_editorPlaceholder",
			"editorPdfToolbar": "Kvd2vq_editorPdfToolbar",
			"dropCenter": "Kvd2vq_dropCenter",
			"paneEmptyHeader": "Kvd2vq_paneEmptyHeader",
			"cornerHandle": "Kvd2vq_cornerHandle",
			"editorDocxZoomRange": "Kvd2vq_editorDocxZoomRange",
			"paneCardIcon": "Kvd2vq_paneCardIcon",
			"explorerRef": "Kvd2vq_explorerRef",
			"settingsGrid": "Kvd2vq_settingsGrid",
			"toggleCluster": "Kvd2vq_toggleCluster",
			"appearanceSelectItem": "Kvd2vq_appearanceSelectItem",
			"gitLogLine1": "Kvd2vq_gitLogLine1",
			"appearanceSelectViewport": "Kvd2vq_appearanceSelectViewport",
			"gitDiffDel": "Kvd2vq_gitDiffDel",
			"paneCardGrid": "Kvd2vq_paneCardGrid",
			"producedChip": "Kvd2vq_producedChip",
			"folderPickerList": "Kvd2vq_folderPickerList",
			"appearanceSelectIndicator": "Kvd2vq_appearanceSelectIndicator",
			"tabBarPlus": "Kvd2vq_tabBarPlus",
			"extHeading": "Kvd2vq_extHeading",
			"appearanceSelectContent": "Kvd2vq_appearanceSelectContent",
			"gitSection": "Kvd2vq_gitSection",
			"gitLogMeta": "Kvd2vq_gitLogMeta",
			"tabActive": "Kvd2vq_tabActive",
			"calendarEventTextarea": "Kvd2vq_calendarEventTextarea",
			"paneCard": "Kvd2vq_paneCard",
			"browserBar": "Kvd2vq_browserBar",
			"gitDiffFile": "Kvd2vq_gitDiffFile",
			"gitDiffFileOld": "Kvd2vq_gitDiffFileOld",
			"gitDiffCtx": "Kvd2vq_gitDiffCtx",
			"bottomPanel": "Kvd2vq_bottomPanel",
			"splitRow": "Kvd2vq_splitRow",
			"calendarEventLabel": "Kvd2vq_calendarEventLabel",
			"extPromptField": "Kvd2vq_extPromptField",
			"explorerPill": "Kvd2vq_explorerPill",
			"appearanceField": "Kvd2vq_appearanceField",
			"editorCm": "Kvd2vq_editorCm",
			"gitEmpty": "Kvd2vq_gitEmpty",
			"gitDiffMetaText": "Kvd2vq_gitDiffMetaText",
			"bottomResize": "Kvd2vq_bottomResize",
			"extRowMeta": "Kvd2vq_extRowMeta",
			"appearanceFieldLabel": "Kvd2vq_appearanceFieldLabel",
			"browserFrame": "Kvd2vq_browserFrame",
			"editorBinaryNotice": "Kvd2vq_editorBinaryNotice",
			"notesTree": "Kvd2vq_notesTree",
			"tabBadge": "Kvd2vq_tabBadge",
			"calendarEventRow": "Kvd2vq_calendarEventRow",
			"gitDiffTabHeader": "Kvd2vq_gitDiffTabHeader",
			"terminalDepsActions": "Kvd2vq_terminalDepsActions",
			"searchMatchText": "Kvd2vq_searchMatchText",
			"editorBanner": "Kvd2vq_editorBanner",
			"sandboxStatusText": "Kvd2vq_sandboxStatusText",
			"terminalDepsHint": "Kvd2vq_terminalDepsHint",
			"settingsCardIcon": "Kvd2vq_settingsCardIcon",
			"browserBlockedButton": "Kvd2vq_browserBlockedButton",
			"gitLogMore": "Kvd2vq_gitLogMore",
			"tab": "Kvd2vq_tab",
			"terminalDepsTitle": "Kvd2vq_terminalDepsTitle",
			"notesRoot": "Kvd2vq_notesRoot",
			"gitDiffNum": "Kvd2vq_gitDiffNum",
			"dropRight": "Kvd2vq_dropRight",
			"gitRow": "Kvd2vq_gitRow",
			"appearanceControl": "Kvd2vq_appearanceControl",
			"dividerActive": "Kvd2vq_dividerActive",
			"tabBar": "Kvd2vq_tabBar",
			"panel": "Kvd2vq_panel",
			"gitBadge": "Kvd2vq_gitBadge",
			"extPromptFile": "Kvd2vq_extPromptFile",
			"editorImage": "Kvd2vq_editorImage",
			"extPromptPrimary": "Kvd2vq_extPromptPrimary",
			"extList": "Kvd2vq_extList",
			"appearanceSelectCaret": "Kvd2vq_appearanceSelectCaret",
			"gitDiffTab": "Kvd2vq_gitDiffTab",
			"producedLabel": "Kvd2vq_producedLabel",
			"extRowPath": "Kvd2vq_extRowPath",
			"sandboxAction": "Kvd2vq_sandboxAction",
			"paneDrop": "Kvd2vq_paneDrop",
			"calendarEventField": "Kvd2vq_calendarEventField",
			"settingsCard": "Kvd2vq_settingsCard",
			"paneEmptyHeaderText": "Kvd2vq_paneEmptyHeaderText",
			"tabClose": "Kvd2vq_tabClose",
			"extActions": "Kvd2vq_extActions",
			"paneCardText": "Kvd2vq_paneCardText",
			"explorerEmpty": "Kvd2vq_explorerEmpty",
			"paneEmptySubheading": "Kvd2vq_paneEmptySubheading",
			"toggleButton": "Kvd2vq_toggleButton",
			"tabList": "Kvd2vq_tabList",
			"explorerDir": "Kvd2vq_explorerDir",
			"gitLogRef": "Kvd2vq_gitLogRef",
			"orphanedType": "Kvd2vq_orphanedType",
			"explorerRowActive": "Kvd2vq_explorerRowActive",
			"settingsCardSubtitle": "Kvd2vq_settingsCardSubtitle",
			"extRowRemove": "Kvd2vq_extRowRemove",
			"bottomPanelHidden": "Kvd2vq_bottomPanelHidden",
			"editorDownloadLink": "Kvd2vq_editorDownloadLink",
			"iconButton": "Kvd2vq_iconButton",
			"gitCommitInput": "Kvd2vq_gitCommitInput",
			"gitPlaceholder": "Kvd2vq_gitPlaceholder",
			"gitBranchSelect": "Kvd2vq_gitBranchSelect",
			"notesBindPrompt": "Kvd2vq_notesBindPrompt",
			"tabBoundaryError": "Kvd2vq_tabBoundaryError",
			"terminalDepsCommandRow": "Kvd2vq_terminalDepsCommandRow"
		};
		//#endregion
		//#region src/client/TabBar.tsx
		/**
		* The tab strip of one pane: tabs capped at TAB_MAX_WIDTH (ellipsized),
		* overflow scrolls horizontally, a close button per tab, a four-way split
		* button cluster, and the + button. Clicking + opens a NEW pane (a fresh
		* split of this pane) showing the empty-state card grid (explorer / notes /
		* terminal / browser); the user picks a card to open that tab type there.
		* There is NO dropdown menu — the user asked to remove it: "+" should
		* ALWAYS open a new page showing the cards, never a pick-list. Tabs are
		* draggable; dropping onto another tab inserts before it, dropping on the
		* strip background appends to this pane.
		*/
		/** Drag payload for tab moves (HTML5 DnD dataTransfer). */
		const TAB_DRAG_TYPE = "application/x-dsh-tab";
		function serializeDrag(payload) {
			return JSON.stringify(payload);
		}
		function parseDrag(raw) {
			try {
				const parsed = JSON.parse(raw);
				if (typeof parsed.tabId === "string" && typeof parsed.paneId === "string") return parsed;
				return null;
			} catch {
				return null;
			}
		}
		/** Global tab-drag flag: PDF iframes become non-interactive synchronously. */
		function setTabDragging(active) {
			if (active) document.body.setAttribute("data-dsh-tab-dragging", "");
			else document.body.removeAttribute("data-dsh-tab-dragging");
		}
		function TabBar(props) {
			const { paneId, tabs, active, onActivate, onClose, onNewPane, onDropTab, getTabIcon, getTabBadge, emptyTab } = props;
			const [dragOver, setDragOver] = (0, react.useState)(false);
			const listRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				const el = listRef.current;
				if (el === null) return;
				const onWheel = (event) => {
					if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;
					if (el.scrollWidth <= el.clientWidth) return;
					event.preventDefault();
					const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientWidth : 1;
					el.scrollLeft += (event.deltaX + event.deltaY) * unit;
				};
				el.addEventListener("wheel", onWheel, { passive: false });
				return () => {
					el.removeEventListener("wheel", onWheel);
				};
			}, []);
			(0, react.useEffect)(() => {
				const clear = () => {
					setTabDragging(false);
					setDragOver(false);
				};
				window.addEventListener("dragend", clear, true);
				window.addEventListener("drop", clear, true);
				window.addEventListener("blur", clear);
				return () => {
					window.removeEventListener("dragend", clear, true);
					window.removeEventListener("drop", clear, true);
					window.removeEventListener("blur", clear);
				};
			}, []);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: clsx(sidebar_module_css_default.tabBar, dragOver && sidebar_module_css_default.tabBarDrop),
				onDragOver: (event) => {
					event.preventDefault();
					event.stopPropagation();
					setDragOver(true);
				},
				onDragLeave: () => {
					setDragOver(false);
				},
				onDrop: (event) => {
					event.preventDefault();
					event.stopPropagation();
					setDragOver(false);
					setTabDragging(false);
					const payload = parseDrag(event.dataTransfer.getData(TAB_DRAG_TYPE));
					if (payload !== null) onDropTab(payload, null);
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					ref: listRef,
					className: sidebar_module_css_default.tabList,
					children: [
						tabs.map((tab) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: clsx(sidebar_module_css_default.tab, active === tab.id && sidebar_module_css_default.tabActive),
							title: tab.title,
							draggable: true,
							onDragStart: (event) => {
								setTabDragging(true);
								event.dataTransfer.setData(TAB_DRAG_TYPE, serializeDrag({
									tabId: tab.id,
									paneId
								}));
								event.dataTransfer.effectAllowed = "move";
							},
							onDragEnd: () => {
								setTabDragging(false);
								setDragOver(false);
							},
							onDragOver: (event) => {
								event.preventDefault();
								event.stopPropagation();
							},
							onDrop: (event) => {
								event.preventDefault();
								event.stopPropagation();
								setTabDragging(false);
								const payload = parseDrag(event.dataTransfer.getData(TAB_DRAG_TYPE));
								if (payload !== null) onDropTab(payload, tab.id);
							},
							onClick: () => {
								onActivate(tab.id);
							},
							onAuxClick: (event) => {
								if (event.button === 1) {
									event.preventDefault();
									onClose(tab.id);
								}
							},
							children: [
								getTabIcon?.(tab) ?? null,
								getTabBadge?.(tab) ?? null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: sidebar_module_css_default.tabTitle,
									children: tab.title
								}),
								tab.meta?.dirty === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: sidebar_module_css_default.dirtyDot,
									"aria-hidden": "true",
									title: t("editorUnsaved")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: sidebar_module_css_default.tabClose,
									"aria-label": t("close"),
									onClick: (event) => {
										event.stopPropagation();
										onClose(tab.id);
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseFill14, {})
								})
							]
						}, tab.id)),
						tabs.length === 0 && emptyTab !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: clsx(sidebar_module_css_default.tab, sidebar_module_css_default.tabActive),
							title: emptyTab.label,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: sidebar_module_css_default.tabTitle,
								children: emptyTab.label
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: sidebar_module_css_default.tabClose,
								"aria-label": t("closePane"),
								onClick: (event) => {
									event.stopPropagation();
									emptyTab.onClose();
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseFill14, {})
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: sidebar_module_css_default.tabBarPlus,
							"aria-label": t("newPane"),
							title: t("newPane"),
							onClick: () => {
								onNewPane();
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, {})
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/icons.tsx
		/**
		* Right-panel toggle glyph (the "侧拉" button): a frame with a filled strip
		* along its RIGHT edge, in the app's outline style (1.5px stroke,
		* currentColor).
		*/
		const IconPanelRightOutline16 = ({ size = 16, className }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className,
			viewBox: "0 0 16 16",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
				x: "1.5",
				y: "2",
				width: "13",
				height: "12",
				rx: "2.5",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
				x: "10.5",
				y: "3.25",
				width: "2.75",
				height: "9.5",
				rx: "1",
				fill: "currentColor",
				stroke: "none"
			})]
		});
		/**
		* Bottom-panel toggle glyph (the "底栏" button): a frame with a filled strip
		* along its BOTTOM edge, in the app's outline style.
		*/
		const IconPanelBottomOutline16 = ({ size = 16, className }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className,
			viewBox: "0 0 16 16",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
				x: "1.5",
				y: "2",
				width: "13",
				height: "12",
				rx: "2.5",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
				x: "3.25",
				y: "10",
				width: "9.5",
				height: "2.75",
				rx: "1",
				fill: "currentColor",
				stroke: "none"
			})]
		});
		/**
		* Horizontal split glyph: a frame split by a VERTICAL divider into two
		* side-by-side panes (split dir 'row'). The card page's "Horizontal" radio
		* option.
		*/
		const IconSplitHorizontal16 = ({ size = 16, className }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className,
			viewBox: "0 0 16 16",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
				x: "1.5",
				y: "2.5",
				width: "13",
				height: "11",
				rx: "2",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M8 4.5v7",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			})]
		});
		/**
		* Vertical split glyph: a frame split by a HORIZONTAL divider into two
		* stacked panes (split dir 'col'). The card page's "Vertical" radio option.
		*/
		const IconSplitVertical16 = ({ size = 16, className }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className,
			viewBox: "0 0 16 16",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
				x: "1.5",
				y: "2.5",
				width: "13",
				height: "11",
				rx: "2",
				stroke: "currentColor",
				strokeWidth: "1.5"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M4 8h8",
				stroke: "currentColor",
				strokeWidth: "1.5",
				strokeLinecap: "round"
			})]
		});
		//#endregion
		//#region src/client/RenderBoundary.tsx
		/**
		* The generic render error boundary for the sidebar tree: a render error in
		* the wrapped subtree shows a dismissible error strip (retry re-renders the
		* children) instead of blanking the shell. Used at two scopes:
		*
		* - ROOT (index.tsx, `css.boundaryError`): last-resort containment for
		*   errors in the sidebar shell itself (Workbench, drag layout, …) — a full
		*   swap keeps the page alive.
		* - PER-TAB (Sidebar.tsx TabContent, `css.tabBoundaryError`): a crashing
		*   viewer/editor shows a strip inside ITS OWN pane; the toggle cluster, the
		*   other tabs, and the panel itself stay alive (issue #31 — a tab crash
		*   must never take down the whole sidebar).
		*
		* The className prop selects the strip's geometry: the root's full-height
		* fixed rail vs. the tab's pane-filling block.
		*/
		var RenderBoundary = class extends react.Component {
			state = { error: null };
			static getDerivedStateFromError(error) {
				return { error: error instanceof Error ? error.message : String(error) };
			}
			componentDidCatch(error, info) {
				console.error("[dsh-better-sidebar] render error:", error, info.componentStack);
			}
			render() {
				if (this.state.error !== null) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: this.props.className,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["dsh-better-sidebar: ", this.state.error] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: sidebar_module_css_default.terminalRetry,
						onClick: () => {
							this.setState({ error: null });
						},
						children: t("terminalRetry")
					})]
				});
				return this.props.children;
			}
		};
		//#endregion
		//#region src/client/SplitPane.tsx
		/**
		* The workbench split-tree renderer + the VSCode-style drag-to-edge gesture.
		* Renders {@link SidebarState.splits} recursively: a `SidebarLeaf` becomes a
		* pane (its own tab strip + content), a `SidebarSplit` becomes a flex row/col
		* of children separated by draggable dividers (`resizeSplitIn`).
		*
		* Dropping a tab dragged from `TabBar` (see `TAB_DRAG_TYPE`) follows VSCode's
		* convention: a drop on a pane's TAB STRIP merges/reorders it into that pane
		* (`moveTab`); a drop on a pane's CONTENT area is zoned into 25% edge bands
		* plus a 50% center — an edge splits that pane and inserts a fresh leaf
		* (`moveTabToEdge`), the center merges like a strip drop.
		*
		* Every open tab across the WHOLE tree stays mounted (inactive-within-its-
		* leaf tabs hidden via CSS), so switching tabs or resizing panes never tears
		* down a terminal's connection/scrollback — same contract the single-pane
		* shell used, just applied per leaf instead of assuming there is only one.
		*/
		/**
		* Make sure the pane about to receive a file-open tab is NOT the Explorer's
		* own pane — the user's complaint: files were opening as siblings in the
		* explorer's own tab strip instead of beside it, VSCode-style. If a non-
		* explorer pane already exists, just activate it (the file opens there); if
		* the explorer is the only pane, split it (row) and activate the fresh
		* empty pane. `service.openFile` (called right after) then opens/focuses
		* the editor tab in whatever `state.activePane` now is.
		*/
		function makeRoomBesideExplorer(state) {
			const leaves = allLeaves(state.splits);
			const explorerLeaf = leaves.find((leaf) => leaf.tabs.some((tab) => tab.id === EXPLORER_TAB_ID));
			if (explorerLeaf === void 0) return state;
			const sibling = leaves.find((leaf) => leaf.id !== explorerLeaf.id);
			if (sibling !== void 0) return {
				...state,
				activePane: sibling.id
			};
			const beforeIds = new Set(leaves.map((leaf) => leaf.id));
			const splits = splitLeafAt(state.splits, explorerLeaf.id, "row");
			const freshLeaf = allLeaves(splits).find((leaf) => !beforeIds.has(leaf.id));
			return {
				...state,
				splits,
				activePane: freshLeaf?.id ?? state.activePane
			};
		}
		/** Render one tab's content via its registered descriptor. `expanded` /
		*  `onToggleDir` thread the shared directory-expansion set (ExplorerView);
		*  `onOpenFile` opens a file in the editor tab (service.openFile hardcodes
		*  the 'editor' type id — see service.ts). */
		function TabContent(props) {
			const { tab, descriptor, ctx, store, service, cwd, visible } = props;
			const scope = {
				sessionId: store.getSnapshot().sessionId,
				...cwd !== void 0 ? { cwd } : {}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RenderBoundary, {
				className: sidebar_module_css_default.tabBoundaryError,
				children: (0, react.createElement)(descriptor.component, {
					ctx,
					store,
					scope,
					tab,
					visible,
					expanded: store.getSnapshot().state?.expanded ?? [],
					onToggleDir: (path) => {
						store.reduce((s) => toggleExpanded(s, path));
					},
					onOpenFile: (path) => {
						store.reduce(makeRoomBesideExplorer);
						service.openFile(scope, path);
					},
					onOpenFileAtLine: (path, line) => {
						store.reduce(makeRoomBesideExplorer);
						service.openFileAtLine(scope, path, line);
					},
					onDirtyChange: (dirty) => {
						service.updateTab(tab.id, { meta: {
							...tab.meta ?? {},
							dirty
						} });
					}
				})
			});
		}
		/** 25% edge bands + 50% center, the VSCode drag-to-edge convention. */
		function zoneFromPointer(rect, x, y) {
			const relX = (x - rect.left) / rect.width;
			const relY = (y - rect.top) / rect.height;
			if (relX < .25) return "left";
			if (relX > .75) return "right";
			if (relY < .25) return "up";
			if (relY > .75) return "down";
			return "center";
		}
		function dropZoneClass(zone) {
			switch (zone) {
				case "left": return sidebar_module_css_default.dropLeft;
				case "right": return sidebar_module_css_default.dropRight;
				case "up": return sidebar_module_css_default.dropUp;
				case "down": return sidebar_module_css_default.dropDown;
				case "center": return sidebar_module_css_default.dropCenter;
			}
		}
		/** One split divider: pointer-capture drag, delta expressed as a fraction of
		*  the split container's size (matches {@link resizeSplitIn}'s contract). */
		function Divider(props) {
			const { dir, splitId, index, store } = props;
			const [active, setActive] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: clsx(sidebar_module_css_default.divider, dir === "row" ? sidebar_module_css_default.dividerRow : sidebar_module_css_default.dividerCol, active && sidebar_module_css_default.dividerActive),
				onPointerDown: (event) => {
					event.preventDefault();
					event.currentTarget.setPointerCapture(event.pointerId);
					setActive(true);
				},
				onPointerMove: (event) => {
					if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
					const container = event.currentTarget.parentElement;
					if (container === null) return;
					const rect = container.getBoundingClientRect();
					const size = dir === "row" ? rect.width : rect.height;
					if (size <= 0) return;
					const movement = dir === "row" ? event.movementX : event.movementY;
					store.reduce((s) => resizeSplitIn(s, splitId, index, movement / size));
				},
				onPointerUp: (event) => {
					if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
					setActive(false);
				}
			});
		}
		/** One leaf pane: its own tab strip, mounted tab contents, and the
		*  drag-to-edge drop overlay over its content area. */
		function PaneLeaf(props) {
			const { leaf, ctx, store, service, cwd, panelOpen, newTabOptions, onNewTab, defaultSplitDir, parentSplitDir, onCloseRoot } = props;
			const [dropZone, setDropZone] = (0, react.useState)(null);
			const descriptorOf = (0, react.useCallback)((tab) => service.getTab(tab.type), [service]);
			const tabIconOf = (0, react.useCallback)((tab) => {
				const icon = descriptorOf(tab)?.icon;
				return typeof icon === "function" ? icon(16) : icon ?? null;
			}, [descriptorOf]);
			const activeTab = leaf.tabs.find((tab) => tab.id === leaf.active) ?? leaf.tabs[leaf.tabs.length - 1] ?? null;
			const onNewTabHere = (0, react.useCallback)((typeId) => {
				store.reduce((s) => ({
					...s,
					activePane: leaf.id
				}));
				onNewTab(typeId);
			}, [
				store,
				leaf.id,
				onNewTab
			]);
			const onNewPane = (0, react.useCallback)(() => {
				store.reduce((s) => splitForNewPane(s, leaf.id, defaultSplitDir));
			}, [
				store,
				leaf.id,
				defaultSplitDir
			]);
			const onReorient = (0, react.useCallback)((dir) => {
				store.reduce((s) => reorientSplit(s, leaf.id, dir));
			}, [store, leaf.id]);
			const onClosePane = (0, react.useCallback)(() => {
				store.reduce((s) => closePane(s, leaf.id));
			}, [store, leaf.id]);
			const emptyTab = {
				label: t("newPane"),
				onClose: parentSplitDir !== void 0 ? onClosePane : onCloseRoot
			};
			const onCloseTab = (0, react.useCallback)((tabId) => {
				const isLastTab = parentSplitDir === void 0 && leaf.tabs.length === 1 && leaf.tabs[0].id === tabId;
				store.reduce((s) => closeTab(s, leaf.id, tabId));
				if (isLastTab) onCloseRoot();
			}, [
				store,
				leaf.id,
				leaf.tabs,
				parentSplitDir,
				onCloseRoot
			]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: clsx(sidebar_module_css_default.pane, dropZone !== null && sidebar_module_css_default.paneDrop),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TabBar, {
					paneId: leaf.id,
					tabs: leaf.tabs,
					active: leaf.active,
					onActivate: (tabId) => {
						store.reduce((s) => activateTab(s, leaf.id, tabId));
					},
					onClose: onCloseTab,
					onNewPane,
					getTabIcon: tabIconOf,
					onDropTab: (payload, before) => {
						const index = before === null ? -1 : leaf.tabs.findIndex((tab) => tab.id === before);
						store.reduce((s) => moveTab(s, payload.paneId, payload.tabId, leaf.id, index));
					},
					emptyTab
				}), leaf.tabs.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.paneContent,
					onDragOver: (event) => {
						if (!event.dataTransfer.types.includes("application/x-dsh-tab")) return;
						event.preventDefault();
						const rect = event.currentTarget.getBoundingClientRect();
						setDropZone(zoneFromPointer(rect, event.clientX, event.clientY));
					},
					onDragLeave: () => {
						setDropZone(null);
					},
					onDrop: (event) => {
						event.preventDefault();
						const payload = parseDrag(event.dataTransfer.getData(TAB_DRAG_TYPE));
						const zone = dropZone ?? "center";
						setDropZone(null);
						if (payload === null) return;
						store.reduce((s) => moveTabToEdge(s, payload.paneId, payload.tabId, leaf.id, zone));
					},
					children: [leaf.tabs.map((tab) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: clsx(sidebar_module_css_default.paneTab, tab.id !== activeTab?.id && sidebar_module_css_default.paneTabHidden),
						children: descriptorOf(tab) !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TabContent, {
							tab,
							descriptor: descriptorOf(tab),
							ctx,
							store,
							service,
							cwd,
							visible: panelOpen && tab.id === activeTab?.id
						})
					}, tab.id)), dropZone !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: clsx(sidebar_module_css_default.dropOverlay, dropZoneClass(dropZone)) })]
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.paneEmptyCards,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: sidebar_module_css_default.paneEmptyHeader,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: sidebar_module_css_default.paneEmptyHeaderText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
								className: sidebar_module_css_default.paneEmptyHeading,
								children: t("newPaneHeading")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: sidebar_module_css_default.paneEmptySubheading,
								children: t("newPaneSubheading")
							})]
						}), parentSplitDir !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: sidebar_module_css_default.paneEmptyControls,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: sidebar_module_css_default.paneLayoutRadio,
								role: "radiogroup",
								"aria-label": t("cardLayoutLabel"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									role: "radio",
									"aria-checked": parentSplitDir === "row",
									className: clsx(sidebar_module_css_default.paneLayoutOption, parentSplitDir === "row" && sidebar_module_css_default.paneLayoutOptionSelected),
									title: t("layoutHorizontal"),
									"aria-label": t("layoutHorizontal"),
									onClick: () => {
										onReorient("row");
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconSplitHorizontal16, {})
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									role: "radio",
									"aria-checked": parentSplitDir === "col",
									className: clsx(sidebar_module_css_default.paneLayoutOption, parentSplitDir === "col" && sidebar_module_css_default.paneLayoutOptionSelected),
									title: t("layoutVertical"),
									"aria-label": t("layoutVertical"),
									onClick: () => {
										onReorient("col");
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconSplitVertical16, {})
								})]
							})
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: sidebar_module_css_default.paneCardGrid,
						children: newTabOptions.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: sidebar_module_css_default.paneCard,
							disabled: option.disabled === true,
							title: option.label,
							onClick: () => {
								onNewTabHere(option.id);
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: sidebar_module_css_default.paneCardIcon,
								"aria-hidden": "true",
								children: option.icon ?? null
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: sidebar_module_css_default.paneCardText,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: sidebar_module_css_default.paneCardLabel,
									children: option.label
								}), option.description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: sidebar_module_css_default.paneCardDesc,
									children: option.description
								})]
							})]
						}, option.id))
					})]
				})]
			});
		}
		/** Recursive split-tree renderer: a leaf becomes a pane, a split becomes a
		*  flex row/col of children with draggable dividers between them. As it
		*  recurses, each split node OVERRIDES `parentSplitDir` (from the common
		*  props) with its own `dir` for its children, so a leaf always receives the
		*  direction of its IMMEDIATE parent split — the empty-state card page's
		*  horizontal/vertical radio reads it to show the selected option. */
		function SplitTree(props) {
			const { node, ...rest } = props;
			if (node.kind === "leaf") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PaneLeaf, {
				leaf: node,
				...rest
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: clsx(sidebar_module_css_default.split, node.dir === "row" ? sidebar_module_css_default.splitRow : sidebar_module_css_default.splitCol),
				children: node.children.map((child, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react.Fragment, { children: [i > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Divider, {
					dir: node.dir,
					splitId: node.id,
					index: i - 1,
					store: rest.store
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: sidebar_module_css_default.splitChild,
					style: { flex: `${String(node.sizes[i])} ${String(node.sizes[i])} 0%` },
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SplitTree, {
						node: child,
						...rest,
						parentSplitDir: node.dir
					})
				})] }, child.id))
			});
		}
		//#endregion
		//#region src/client/SidebarShell.tsx
		/**
		* The powerdesk sidebar shell — the LAYOUT + WRAPPER, copied from
		* dsh-better-sidebar's `Sidebar` (the panel/toggle/resize chrome), stripped
		* of every feature the powerdesk plugin does not ship: the bottom panel, the
		* explorer / git / subagent / jobs / editor / diff views, the agent-terminals
		* WebSocket, subagent/job auto-activation, and the cwd / session-list wiring
		* those views need.
		*
		* What remains is the discoverable entry the user asked for: a collapsible
		* right panel (width dragged on its left edge, persisted) with a workbench
		* that keeps every open tab MOUNTED (inactive ones hidden) so switching never
		* tears down a terminal's connection/scrollback. The tab registry contract
		* (`PowerdeskSidebarService`) is unchanged, so powerdesk's existing
		* terminal/browser tab descriptors register through the same path.
		*
		* The panel DOCKS instead of floating over the app: it still renders via
		* `position: fixed` (a body-level portal — see mountSidebarShell in
		* index.tsx), but while open it reserves its width as a right margin on the
		* host SPA's `#root`, so the host's own layout reflows to make room instead
		* of the panel overlaying the host's content.
		*
		* The workbench itself (recursive split tree, drag-to-edge splitting, resize
		* dividers) lives in `SplitPane.tsx`, reusing the split-tree engine already
		* in `state.ts` (`splitPane` / `moveTabToEdge` / `resizeSplitIn`, copied
		* whole from dsh-better-sidebar) — this shell owns only the outer panel
		* chrome (toggle, width drag, docking) and renders `state.splits` through it.
		*/
		/** The powerdesk sidebar shell. */
		function SidebarShell(props) {
			const { ctx, store, service } = props;
			const sessionList = (0, react.useSyncExternalStore)((0, react.useCallback)((cb) => ctx.sessions.list.subscribe(cb), [ctx]), (0, react.useCallback)(() => ctx.sessions.list.getSnapshot(), [ctx]));
			const current = sessionList.current;
			(0, react.useEffect)(() => {
				store.setSession(current);
			}, [current, store]);
			const cwd = current === void 0 ? void 0 : sessionList.byId[current]?.cwd;
			const snapshot = (0, react.useSyncExternalStore)((0, react.useCallback)((cb) => store.subscribe(cb), [store]), (0, react.useCallback)(() => store.getSnapshot(), [store]));
			const state = snapshot.state;
			const [, forceUpdate] = (0, react.useState)(0);
			(0, react.useEffect)(() => service.subscribe(() => forceUpdate((n) => n + 1)), [service]);
			const collapsed = state === void 0 || !state.panelOpen;
			(0, react.useEffect)(() => {
				if (collapsed) document.body.setAttribute("data-dsh-sidebar-collapsed", "");
				else document.body.removeAttribute("data-dsh-sidebar-collapsed");
				return () => {
					document.body.removeAttribute("data-dsh-sidebar-collapsed");
				};
			}, [collapsed]);
			const widthDrag = (0, react.useRef)({
				startX: 0,
				startWidth: 0
			});
			const [draggingWidth, setDraggingWidth] = (0, react.useState)(false);
			const heightDrag = (0, react.useRef)({
				startY: 0,
				startHeight: 0
			});
			const [draggingHeight, setDraggingHeight] = (0, react.useState)(false);
			const bottomOpen = state?.bottomOpen === true;
			const [, bumpOnResize] = (0, react.useState)(0);
			(0, react.useEffect)(() => {
				const onResize = () => {
					bumpOnResize((n) => n + 1);
				};
				window.addEventListener("resize", onResize);
				return () => {
					window.removeEventListener("resize", onResize);
				};
			}, []);
			const titleBarStripPx = typeof document !== "undefined" && document.body.hasAttribute("data-dsh-title-bar-compat") ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dsh-title-bar-strip")) || 40 : 0;
			const clusterTop = (() => {
				const DOCKED_TOP = 3;
				const HOST_HEADER_CLEAR = 44;
				const CLUSTER_ROW = 34;
				if (state === void 0 || state.panelOpen) return DOCKED_TOP + titleBarStripPx;
				if (!bottomOpen) return HOST_HEADER_CLEAR + titleBarStripPx;
				const bottomTopY = (typeof window !== "undefined" ? window.innerHeight : Infinity) - state.bottomHeight;
				return Math.max(DOCKED_TOP, Math.min(HOST_HEADER_CLEAR, bottomTopY - CLUSTER_ROW)) + titleBarStripPx;
			})();
			const clusterRight = state === void 0 || state.panelOpen ? 10 : 53;
			(0, react.useEffect)(() => {
				const hostRoot = document.getElementById("root");
				if (hostRoot === null) return;
				hostRoot.style.transition = draggingWidth ? "none" : "margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out)";
				hostRoot.style.marginRight = collapsed ? "0px" : `${String(state?.width ?? 0)}px`;
				return () => {
					hostRoot.style.marginRight = "";
					hostRoot.style.transition = "";
				};
			}, [
				collapsed,
				state?.width,
				draggingWidth
			]);
			(0, react.useEffect)(() => {
				const centerCol = document.querySelector("[class*=\"centerCol\"]");
				if (centerCol === null) return;
				centerCol.style.transition = draggingHeight ? "none" : "height var(--ds-transition-duration-slow) var(--ds-ease-in-out)";
				centerCol.style.height = bottomOpen ? `calc(100% - ${String(state?.bottomHeight ?? 0)}px)` : "";
				return () => {
					centerCol.style.height = "";
					centerCol.style.transition = "";
				};
			}, [
				bottomOpen,
				state?.bottomHeight,
				draggingHeight
			]);
			const bottomPanelRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				const observer = new ResizeObserver(apply);
				function apply() {
					const panel = bottomPanelRef.current;
					if (panel === null) return;
					const centerCol = document.querySelector("[class*=\"centerCol\"]");
					const left = centerCol !== null ? centerCol.getBoundingClientRect().left : 0;
					panel.style.left = `${String(Math.max(0, left))}px`;
					observer.disconnect();
					observer.observe(document.body);
					if (centerCol !== null) observer.observe(centerCol);
					if (centerCol?.previousElementSibling !== null && centerCol?.previousElementSibling !== void 0) observer.observe(centerCol.previousElementSibling);
				}
				apply();
				window.addEventListener("resize", apply);
				return () => {
					window.removeEventListener("resize", apply);
					observer.disconnect();
				};
			}, [
				collapsed,
				bottomOpen,
				state?.width
			]);
			const newTabOptions = (0, react.useMemo)(() => {
				if (state === void 0) return [];
				const scope = { sessionId: snapshot.sessionId };
				const descriptions = {
					"dsh-powerdesk:terminal": t("cardTerminalDesc"),
					"dsh-powerdesk:explorer": t("cardExplorerDesc"),
					"dsh-powerdesk:notes": t("cardNotesDesc"),
					"dsh-powerdesk:browser": t("cardBrowserDesc")
				};
				return service.getTabs().filter((descriptor) => descriptor.hidden !== true && service.isTabEnabled(descriptor.id)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((descriptor) => ({
					id: descriptor.id,
					label: typeof descriptor.title === "function" ? descriptor.title() : descriptor.title,
					disabled: descriptor.available?.(ctx, scope, state) === false,
					icon: typeof descriptor.icon === "function" ? descriptor.icon(16) : descriptor.icon,
					description: descriptions[descriptor.id]
				}));
			}, [
				service,
				state,
				ctx,
				snapshot.sessionId
			]);
			const onNewTab = (0, react.useCallback)((typeId) => {
				service.openTab({ type: typeId });
			}, [service]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.toggleCluster,
					style: {
						top: clusterTop,
						right: clusterRight
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: bottomOpen ? t("collapseBottom") : t("expandBottom"),
						side: "bottom",
						delayMs: 500,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: sidebar_module_css_default.toggleButton,
							"aria-label": bottomOpen ? t("collapseBottom") : t("expandBottom"),
							onClick: () => {
								store.reduce(toggleBottomPanel);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconPanelBottomOutline16, {})
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: state === void 0 || state.panelOpen ? t("collapse") : t("expand"),
						side: "bottom",
						delayMs: 500,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: sidebar_module_css_default.toggleButton,
							"aria-label": state === void 0 || state.panelOpen ? t("collapse") : t("expand"),
							onClick: () => {
								store.reduce(togglePanel);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconPanelRightOutline16, {})
						})
					})]
				}),
				state !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: clsx(sidebar_module_css_default.panel, !state.panelOpen && sidebar_module_css_default.panelHidden),
					style: { width: Math.min(state.width, typeof window !== "undefined" ? window.innerWidth : state.width) },
					"data-dragging": draggingWidth || void 0,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: clsx(sidebar_module_css_default.panelResize, draggingWidth && sidebar_module_css_default.panelResizeActive),
						onPointerDown: (event) => {
							event.preventDefault();
							event.currentTarget.setPointerCapture(event.pointerId);
							widthDrag.current = {
								startX: event.clientX,
								startWidth: state.width
							};
							setDraggingWidth(true);
						},
						onPointerMove: (event) => {
							if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
							const { startX, startWidth } = widthDrag.current;
							store.reduce((s) => setWidth(s, startWidth + (startX - event.clientX)));
						},
						onPointerUp: (event) => {
							if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
							event.currentTarget.releasePointerCapture(event.pointerId);
							const { startX, startWidth } = widthDrag.current;
							store.reduce((s) => setWidth(s, startWidth + (startX - event.clientX)));
							setDraggingWidth(false);
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: sidebar_module_css_default.panelBody,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SplitTree, {
							node: state.splits,
							ctx,
							store,
							service,
							cwd,
							panelOpen: state.panelOpen,
							newTabOptions,
							onNewTab,
							defaultSplitDir: "col",
							onCloseRoot: () => {
								store.reduce(togglePanel);
							}
						})
					})]
				}),
				state !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					ref: bottomPanelRef,
					className: clsx(sidebar_module_css_default.bottomPanel, !bottomOpen && sidebar_module_css_default.bottomPanelHidden),
					style: {
						height: state.bottomHeight,
						right: collapsed ? 0 : state.width
					},
					"data-dragging": draggingHeight || void 0,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: clsx(sidebar_module_css_default.bottomResize, draggingHeight && sidebar_module_css_default.bottomResizeActive),
							onPointerDown: (event) => {
								event.preventDefault();
								event.currentTarget.setPointerCapture(event.pointerId);
								heightDrag.current = {
									startY: event.clientY,
									startHeight: state.bottomHeight
								};
								setDraggingHeight(true);
							},
							onPointerMove: (event) => {
								if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
								const { startY, startHeight } = heightDrag.current;
								store.reduce((s) => setBottomHeight(s, startHeight + (startY - event.clientY)));
							},
							onPointerUp: (event) => {
								if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
								event.currentTarget.releasePointerCapture(event.pointerId);
								const { startY, startHeight } = heightDrag.current;
								store.reduce((s) => setBottomHeight(s, startHeight + (startY - event.clientY)));
								setDraggingHeight(false);
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: sidebar_module_css_default.bottomClose,
							"aria-label": t("collapseBottom"),
							onClick: () => {
								store.reduce(toggleBottomPanel);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconPanelBottomOutline16, {})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: sidebar_module_css_default.panelBody,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SplitTree, {
								node: state.bottomSplits,
								ctx,
								store,
								service,
								cwd,
								panelOpen: bottomOpen,
								newTabOptions,
								onNewTab,
								defaultSplitDir: "row",
								onCloseRoot: () => {
									store.reduce(toggleBottomPanel);
								}
							})
						})
					]
				})
			] });
		}
		//#endregion
		//#region src/client/ExtensionsPanel.tsx
		/**
		* The Extensions block of the Powerdesk settings card: install, list, inspect,
		* and remove user-installed extensions.
		*
		* Two upload shapes are handled, decided by the HOST from the uploaded bytes
		* (see src/extensions/install.ts), not here:
		*
		* - an archive carrying `powerdesk.json` installs directly;
		* - a bare bundle script has no manifest, so the host rejects it with a
		*   message and this panel then asks for an id + display name and retries.
		*
		* Doing it that way — attempt, then prompt on the specific rejection — keeps
		* a single source of truth for what an archive is. The alternative (sniffing
		* gzip/tar magic in the browser to decide which dialog to show) would put a
		* second, drifting copy of the format rules on the client.
		*
		* Trust: an extension runs with this page's full privileges, so the warning
		* is always visible rather than shown once. The on-disk location and the
		* upload's sha256 are surfaced per extension so a user can audit what is
		* actually being executed.
		*/
		/** Human-readable byte size for the per-extension detail line. */
		function formatBytes(bytes) {
			if (bytes === void 0) return "";
			if (bytes < 1024) return `${bytes} B`;
			if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
			return `${(bytes / 1048576).toFixed(1)} MB`;
		}
		/** Local-time install date, or '' when the record is missing. */
		function formatWhen(iso) {
			if (iso === void 0) return "";
			const parsed = Date.parse(iso);
			return Number.isNaN(parsed) ? "" : new Date(parsed).toLocaleString();
		}
		/** The host's rejection message for a manifest-less upload (install.ts). */
		function isBareScriptRejection(message) {
			return message.includes("id and a title");
		}
		/**
		* Whether a failed `ext.list` means the running host half predates the
		* extensions feature — it answers 404 `unknown restty API method` for a
		* route it does not have. This is the single most likely failure right after
		* an upgrade: the client half is re-fetched from disk on a page refresh
		* while Node still holds the previous host half in memory, so the two halves
		* disagree until DSH is restarted. Worth naming explicitly, because the
		* generic advice ("check the API") sends the user looking in the wrong place.
		*/
		function isStaleHostHalf(message) {
			return message.includes("unknown restty API method");
		}
		/** One installed extension's row: identity, provenance, and Remove. */
		function ExtensionRow(props) {
			const { extension, busy, onRemove } = props;
			const manifest = extension.manifest;
			const broken = manifest === void 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.extRow,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.extRowIcon,
						"aria-hidden": "true",
						children: manifest?.icon ?? "🧩"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: sidebar_module_css_default.extRowBody,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: sidebar_module_css_default.extRowTitle,
								children: manifest?.title ?? extension.id
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: sidebar_module_css_default.extRowMeta,
								children: broken ? `${t("extBroken")}: ${extension.error ?? ""}` : [
									extension.id,
									formatBytes(extension.bundleBytes),
									extension.install !== void 0 ? t("extInstalled", { when: formatWhen(extension.install.installedAt) }) : "",
									extension.install !== void 0 && extension.install.sourceFilename !== "" ? t("extSource", { file: extension.install.sourceFilename }) : ""
								].filter((part) => part !== "").join(" · ")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: sidebar_module_css_default.extRowPath,
								title: extension.install?.sha256 ?? "",
								children: [extension.dir, extension.install?.sha256 !== void 0 && extension.install.sha256 !== "" ? ` · sha256 ${extension.install.sha256.slice(0, 12)}…` : ""]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: sidebar_module_css_default.extRowRemove,
						disabled: busy,
						onClick: () => {
							onRemove(extension.id);
						},
						children: t("extRemove")
					})
				]
			});
		}
		/** The id + name prompt shown when a bare script has no manifest. */
		function BarePrompt(props) {
			const { pending, busy, onCancel, onConfirm } = props;
			const [id, setId] = (0, react.useState)("");
			const [title, setTitle] = (0, react.useState)("");
			const valid = /^[a-z0-9][a-z0-9-]{0,63}$/.test(id) && title.trim() !== "";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.extPrompt,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: sidebar_module_css_default.extPromptHint,
						children: t("extBareHint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: sidebar_module_css_default.extPromptFile,
						children: pending.filename
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: sidebar_module_css_default.extPromptField,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("extIdLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "text",
							value: id,
							placeholder: t("extIdPlaceholder"),
							onChange: (event) => {
								setId(event.target.value);
							}
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: sidebar_module_css_default.extPromptField,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("extTitleLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "text",
							value: title,
							placeholder: t("extTitlePlaceholder"),
							onChange: (event) => {
								setTitle(event.target.value);
							}
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: sidebar_module_css_default.extPromptActions,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onCancel,
							disabled: busy,
							children: t("extCancel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: sidebar_module_css_default.extPromptPrimary,
							disabled: !valid || busy,
							onClick: () => {
								onConfirm(id, title.trim());
							},
							children: busy ? t("extInstalling") : t("extConfirmInstall")
						})]
					})
				]
			});
		}
		/**
		* Render the Extensions block.
		* @param props - the ExtensionHost whose registrations follow this UI.
		*/
		function ExtensionsPanel({ extensions }) {
			const [listing, setListing] = (0, react.useState)(null);
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const [notice, setNotice] = (0, react.useState)(null);
			const [pending, setPending] = (0, react.useState)(null);
			const fileInput = (0, react.useRef)(null);
			const alive = (0, react.useRef)(true);
			(0, react.useEffect)(() => () => {
				alive.current = false;
			}, []);
			/** Re-read the installed list AND re-register the tabs from it. */
			const refresh = (0, react.useCallback)(async () => {
				if (extensions !== void 0) {
					const result = await extensions.refresh();
					if (alive.current) setListing(result);
					return;
				}
				try {
					const result = await api.extList();
					if (alive.current) setListing(result);
				} catch (fetchError) {
					if (alive.current) setError(fetchError instanceof Error ? fetchError.message : String(fetchError));
				}
			}, [extensions]);
			(0, react.useEffect)(() => {
				refresh();
			}, [refresh]);
			/** POST one upload, handling the "needs an id/title" rejection specially. */
			const install = (0, react.useCallback)(async (upload) => {
				setBusy(true);
				setError(null);
				setNotice(null);
				try {
					const installed = await api.extInstall(upload);
					if (!alive.current) return;
					setPending(null);
					setNotice(t("extInstalledOk", { title: installed.manifest?.title ?? installed.id }));
					await refresh();
				} catch (installError) {
					if (!alive.current) return;
					const message = installError instanceof Error ? installError.message : String(installError);
					if (upload.id === void 0 && isBareScriptRejection(message)) setPending({
						filename: upload.filename,
						dataBase64: upload.dataBase64
					});
					else setError(message);
				} finally {
					if (alive.current) setBusy(false);
				}
			}, [refresh]);
			const onFile = (0, react.useCallback)(async (file) => {
				const dataBase64 = toBase64(new Uint8Array(await file.arrayBuffer()));
				await install({
					filename: file.name,
					dataBase64
				});
			}, [install]);
			const onRemove = (0, react.useCallback)(async (id) => {
				if (!window.confirm(t("extRemoveConfirm"))) return;
				setBusy(true);
				setError(null);
				setNotice(null);
				try {
					await api.extRemove(id);
					await refresh();
				} catch (removeError) {
					if (alive.current) setError(removeError instanceof Error ? removeError.message : String(removeError));
				} finally {
					if (alive.current) setBusy(false);
				}
			}, [refresh]);
			const enabled = listing?.enabled === true;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.extSection,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
						className: sidebar_module_css_default.extHeading,
						children: t("extHeading")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: sidebar_module_css_default.settingsIntro,
						children: t("extIntro")
					}),
					listing?.error !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: sidebar_module_css_default.extError,
						children: isStaleHostHalf(listing.error) ? t("extStaleHost") : t("extUnreachable", { error: listing.error })
					}),
					!enabled && listing !== null && listing.error === void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: sidebar_module_css_default.settingsMissing,
						children: t("extDisabled")
					}),
					enabled && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: sidebar_module_css_default.extWarning,
							children: ["⚠️ ", t("extWarning")]
						}),
						pending !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BarePrompt, {
							pending,
							busy,
							onCancel: () => {
								setPending(null);
							},
							onConfirm: (id, title) => {
								install({
									...pending,
									id,
									title
								});
							}
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: sidebar_module_css_default.extActions,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									ref: fileInput,
									type: "file",
									accept: ".tgz,.gz,.tar,.js,application/gzip,application/x-gzip,application/x-tar,text/javascript",
									style: { display: "none" },
									onChange: (event) => {
										const file = event.target.files?.[0];
										event.target.value = "";
										if (file !== void 0) onFile(file);
									}
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: sidebar_module_css_default.extPromptPrimary,
									disabled: busy,
									onClick: () => {
										fileInput.current?.click();
									},
									children: busy ? t("extInstalling") : t("extUpload")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									onClick: () => {
										refresh();
									},
									children: t("extReload")
								})
							]
						}),
						listing.extensions.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: sidebar_module_css_default.extEmpty,
							children: t("extEmpty")
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: sidebar_module_css_default.extList,
							children: listing.extensions.map((extension) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExtensionRow, {
								extension,
								busy,
								onRemove: (id) => {
									onRemove(id);
								}
							}, extension.id))
						})
					] }),
					error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: sidebar_module_css_default.extError,
						children: error
					}),
					notice !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: sidebar_module_css_default.settingsHint,
						children: notice
					})
				]
			});
		}
		//#endregion
		//#region src/client/SettingsSection.tsx
		/**
		* The "Powerdesk" Side card in the DSH Settings shell: one card per
		* registered tab type (Terminal / Browser / Explorer / Editor), matching
		* dsh-better-sidebar's own settings page style — icon, title, the raw type
		* id as a subtitle, and a checkmark toggle to enable/disable it (an absent
		* key means enabled; toggling off hides the type from the + menu and makes
		* `openTab` a no-op for it — see service.ts's `isTabEnabled`/`setTabEnabled`).
		* Clicking the card body (not the toggle) opens that surface in the sidebar.
		*
		* The section is registered through `ctx.slots.inject('settings.section', …)`
		* in the client `apply()` (see index.tsx). The shell owns modal visibility and
		* navigation; it passes `close` (SettingsSectionOwnerProps) and our injected
		* `sidebar` face (the optional PowerdeskSidebarService, probed via
		* `ctx.get('powerdeskSidebar')`).
		*/
		/** The lazy terminal-appearance panel: `@radix-ui/react-select` (and the
		*  popper/floating-ui/dismissable-layer/focus-scope/portal stack it drags
		*  in) loads only when the user actually opens Settings, not at plugin
		*  startup — see chunks/settings.tsx. */
		const TerminalAppearancePanelLazy = lazyChunkComponent("settings", (mod) => mod.TerminalAppearancePanel);
		/** A small checkmark glyph for the enabled-toggle badge. */
		function IconCheck({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 12 12",
				fill: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M2.5 6.25 5 8.75 9.5 3.5",
					stroke: "currentColor",
					strokeWidth: "1.5",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			});
		}
		/** Strip the `dsh-powerdesk:` namespace prefix for a short subtitle
		*  (`dsh-powerdesk:explorer` -> `explorer`; `editor` stays `editor`). */
		function shortId(id) {
			const idx = id.indexOf(":");
			return idx >= 0 ? id.slice(idx + 1) : id;
		}
		/**
		* Open one powerdesk surface in the sidebar, then close the settings panel.
		* Sets a one-line "opened" hint instead of closing instantly so the user
		* sees confirmation (the sidebar opens behind the settings modal).
		*/
		function openSurface(sidebar, type, close, setHint) {
			try {
				sidebar.openTab({ type });
				setHint(t("settingsOpenedHint"));
				window.setTimeout(close, 350);
			} catch (error) {
				setHint(error instanceof Error ? error.message : String(error));
			}
		}
		/** One tab-type card: icon, title, subtitle id, and the enable toggle. */
		function TabCard(props) {
			const { descriptor, sidebar, close, setHint } = props;
			const enabled = sidebar.isTabEnabled(descriptor.id);
			const icon = typeof descriptor.icon === "function" ? descriptor.icon(20) : descriptor.icon;
			const title = typeof descriptor.title === "function" ? descriptor.title() : descriptor.title;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.settingsCard,
				onClick: () => {
					openSurface(sidebar, descriptor.id, close, setHint);
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.settingsCardIcon,
						children: icon
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.settingsCardTitle,
						children: title
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.settingsCardSubtitle,
						children: shortId(descriptor.id)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: clsx(sidebar_module_css_default.settingsCardToggle, enabled && sidebar_module_css_default.settingsCardToggleOn),
						"aria-label": enabled ? t("settingsDisableTab") : t("settingsEnableTab"),
						onClick: (event) => {
							event.stopPropagation();
							sidebar.setTabEnabled(descriptor.id, !enabled);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconCheck, { size: 12 })
					})
				]
			});
		}
		/**
		* Render the Powerdesk Side card.
		* @param props - the shell owner share (`close`) + injected `sidebar` face.
		* @returns the section element tree.
		*/
		function SettingsSection({ close, sidebar, extensions }) {
			const [hint, setHint] = (0, react.useState)(null);
			const [, forceUpdate] = (0, react.useState)(0);
			(0, react.useEffect)(() => sidebar?.subscribe(() => {
				forceUpdate((n) => n + 1);
			}), [sidebar]);
			const available = sidebar !== void 0 && typeof sidebar.openTab === "function";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: sidebar_module_css_default.settingsIntro,
					children: t("settingsIntro")
				}),
				available ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: sidebar_module_css_default.settingsGrid,
					children: sidebar.getTabs().map((descriptor) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TabCard, {
						descriptor,
						sidebar,
						close,
						setHint
					}, descriptor.id))
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: sidebar_module_css_default.settingsMissing,
					children: t("settingsSidebarMissing")
				}),
				hint !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: sidebar_module_css_default.settingsHint,
					children: hint
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TerminalAppearancePanelLazy, {}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExtensionsPanel, { extensions })
			] });
		}
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.31.0_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const mergeClasses = (...classes) => classes.filter((className, index, array) => {
			return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
		}).join(" ").trim();
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.31.0_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.31.0_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.31.0_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const toPascalCase = (string) => {
			const camelCase = toCamelCase(string);
			return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
		};
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.31.0_react@18.3.1/node_modules/lucide-react/dist/esm/defaultAttributes.mjs
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		var defaultAttributes = {
			xmlns: "http://www.w3.org/2000/svg",
			width: 24,
			height: 24,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 2,
			strokeLinecap: "round",
			strokeLinejoin: "round"
		};
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.31.0_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const hasA11yProp = (props) => {
			for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
			return false;
		};
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.31.0_react@18.3.1/node_modules/lucide-react/dist/esm/context.mjs
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const LucideContext = (0, react.createContext)({});
		const useLucideContext = () => (0, react.useContext)(LucideContext);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.31.0_react@18.3.1/node_modules/lucide-react/dist/esm/Icon.mjs
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const Icon = (0, react.forwardRef)(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
			const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = useLucideContext() ?? {};
			const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
			return (0, react.createElement)("svg", {
				ref,
				...defaultAttributes,
				width: size ?? contextSize ?? defaultAttributes.width,
				height: size ?? contextSize ?? defaultAttributes.height,
				stroke: color ?? contextColor,
				strokeWidth: calculatedStrokeWidth,
				className: mergeClasses("lucide", contextClass, className),
				...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
				...rest
			}, [...iconNode.map(([tag, attrs]) => (0, react.createElement)(tag, attrs)), ...Array.isArray(children) ? children : [children]]);
		});
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.31.0_react@18.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const createLucideIcon = (iconName, iconNode) => {
			const Component = (0, react.forwardRef)(({ className, ...props }, ref) => (0, react.createElement)(Icon, {
				ref,
				iconNode,
				className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
				...props
			}));
			Component.displayName = toPascalCase(iconName);
			return Component;
		};
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const ChevronDown = createLucideIcon("chevron-down", [["path", {
			d: "m6 9 6 6 6-6",
			key: "qrunsl"
		}]]);
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const ChevronRight = createLucideIcon("chevron-right", [["path", {
			d: "m9 18 6-6-6-6",
			key: "mthhwq"
		}]]);
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const Copy = createLucideIcon("copy", [["rect", {
			width: "14",
			height: "14",
			x: "8",
			y: "8",
			rx: "2",
			ry: "2",
			key: "17jyea"
		}], ["path", {
			d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
			key: "zix9uf"
		}]]);
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const File = createLucideIcon("file", [["path", {
			d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
			key: "1oefj6"
		}], ["path", {
			d: "M14 2v5a1 1 0 0 0 1 1h5",
			key: "wfsgrz"
		}]]);
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const FolderMinus = createLucideIcon("folder-minus", [["path", {
			d: "M9 13h6",
			key: "1uhe8q"
		}], ["path", {
			d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
			key: "1kt360"
		}]]);
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const FolderPlus = createLucideIcon("folder-plus", [
			["path", {
				d: "M12 10v6",
				key: "1bos4e"
			}],
			["path", {
				d: "M9 13h6",
				key: "1uhe8q"
			}],
			["path", {
				d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
				key: "1kt360"
			}]
		]);
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const Folder = createLucideIcon("folder", [["path", {
			d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
			key: "1kt360"
		}]]);
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const Search = createLucideIcon("search", [["path", {
			d: "m21 21-4.34-4.34",
			key: "14j7rj"
		}], ["circle", {
			cx: "11",
			cy: "11",
			r: "8",
			key: "4ej97u"
		}]]);
		//#endregion
		//#region src/client/explorer-prefs.ts
		const STORAGE_KEY = "dsh-powerdesk:explorer-bookmarks";
		const DEFAULT_PREFS = {
			bookmarks: [],
			activeId: null
		};
		function isBookmark(value) {
			if (typeof value !== "object" || value === null) return false;
			const record = value;
			return typeof record.id === "string" && typeof record.label === "string" && typeof record.path === "string";
		}
		/** Read the bookmark list + active id from localStorage (defaults when absent/malformed). */
		function readExplorerPrefs() {
			if (typeof localStorage === "undefined") return { ...DEFAULT_PREFS };
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw === null) return { ...DEFAULT_PREFS };
				const parsed = JSON.parse(raw);
				const bookmarks = Array.isArray(parsed.bookmarks) ? parsed.bookmarks.filter(isBookmark) : [];
				return {
					bookmarks,
					activeId: typeof parsed.activeId === "string" && bookmarks.some((b) => b.id === parsed.activeId) ? parsed.activeId : null
				};
			} catch {
				return { ...DEFAULT_PREFS };
			}
		}
		/** Persist the full bookmark list + active id. */
		function writeExplorerPrefs(prefs) {
			if (typeof localStorage === "undefined") return;
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
			} catch {}
		}
		let idCounter = 0;
		/** Mint a fresh bookmark id (monotonic within the tab's lifetime). */
		function makeBookmarkId() {
			idCounter += 1;
			return `bm-${Date.now().toString(36)}-${String(idCounter)}`;
		}
		//#endregion
		//#region src/client/FolderPicker.tsx
		/**
		* A folder-browser modal: click through subdirectories (fs.list), "Up" to
		* the parent, "Select this folder" to confirm the CURRENT directory.
		*
		* Browsers deliberately never hand a web page a real filesystem path from a
		* native file/folder picker (`<input type=file webkitdirectory>` and
		* `showDirectoryPicker()` both return sandboxed handles, not paths) — and
		* this plugin's fs.* routes need a real path (they run through Node on the
		* host, not the browser's File API). This modal is the workaround: it's our
		* own directory browser, built on the same fs.list the Explorer tab uses,
		* so picking a folder still feels like a native "choose folder" dialog.
		*
		* Shared by Explorer's "Add folder" and Notes' "Bind folder" flows.
		*/
		function joinPath$1(dir, name) {
			return dir.endsWith("/") || dir.endsWith("\\") ? `${dir}${name}` : `${dir}/${name}`;
		}
		function dirnameOf(path) {
			const trimmed = path.replace(/[/\\]+$/, "");
			const idx = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
			if (idx < 0) return trimmed;
			if (idx === 0) return trimmed[0] === "/" ? "/" : trimmed;
			return trimmed.slice(0, idx);
		}
		function FolderPicker({ open, initialPath, onSelect, onClose }) {
			const [path, setPath] = (0, react.useState)(null);
			const [dirs, setDirs] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)("");
			(0, react.useEffect)(() => {
				if (!open) return;
				setDirs(null);
				setError("");
				if (initialPath !== void 0 && initialPath.trim() !== "") {
					setPath(initialPath);
					return;
				}
				api.fsHome().then((result) => {
					setPath(result.path);
				}).catch(() => {
					setPath("/");
				});
			}, [open, initialPath]);
			(0, react.useEffect)(() => {
				if (!open || path === null) return;
				let cancelled = false;
				setDirs(null);
				setError("");
				api.fsList(path).then((result) => {
					if (cancelled) return;
					setDirs(result.entries.filter((entry) => entry.isDir).map((entry) => entry.name));
				}).catch((fetchError) => {
					if (cancelled) return;
					setDirs([]);
					setError(fetchError instanceof Error ? fetchError.message : String(fetchError));
				});
				return () => {
					cancelled = true;
				};
			}, [open, path]);
			const parent = path !== null ? dirnameOf(path) : null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open,
				onClose,
				title: t("folderPickerTitle"),
				closeLabel: t("close"),
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.folderPickerFooter,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: sidebar_module_css_default.explorerPill,
						onClick: onClose,
						children: t("cancel")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: sidebar_module_css_default.explorerPill,
						disabled: path === null,
						onClick: () => {
							if (path !== null) onSelect(path);
						},
						children: t("folderPickerSelect")
					})]
				}),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.folderPickerPath,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: sidebar_module_css_default.explorerPill,
						disabled: path === null || parent === path,
						onClick: () => {
							if (parent !== null) setPath(parent);
						},
						children: t("folderPickerUp")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.explorerRoot,
						title: path ?? "",
						children: path ?? ""
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.folderPickerList,
					children: [
						dirs === null && error === "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: sidebar_module_css_default.explorerRow,
							children: t("loading")
						}),
						error !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: clsx(sidebar_module_css_default.explorerRow, sidebar_module_css_default.explorerError),
							children: error
						}),
						dirs !== null && dirs.length === 0 && error === "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: sidebar_module_css_default.explorerEmpty,
							children: t("folderPickerEmpty")
						}),
						dirs?.map((name) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: clsx(sidebar_module_css_default.explorerRow, sidebar_module_css_default.explorerDir),
							onClick: () => {
								if (path !== null) setPath(joinPath$1(path, name));
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Folder, {
								size: 14,
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: sidebar_module_css_default.explorerName,
								children: name
							})]
						}, name))
					]
				})]
			});
		}
		//#endregion
		//#region src/client/SearchView.tsx
		/**
		* The Search tab: content search over the session's cwd via ripgrep (see
		* search-api.ts / search-deps.ts on the host half). A debounced query box
		* (mirrors BrowserView's `.browserBar`/`.browserInput`) drives `api.
		* searchGrep`, results are grouped by file (reusing `.explorerRow`/
		* `.explorerName`/`.explorerDir` from FileExplorer.tsx's row styling),
		* clicking a match opens it in the editor at that line via `onOpenFileAtLine`
		* (service.openFileAtLine → CodeEditor's `initialLine`).
		*
		* Deliberately NOT lazy-chunked: unlike Explorer/Editor/Terminal, this view
		* has no heavy dependency (no CodeMirror, no WASM renderer) — it's plain
		* React + fetch, cheap enough to ship in the main bundle.
		*/
		const DEBOUNCE_MS = 250;
		function basenameOf$1(path) {
			const trimmed = path.replace(/[/\\]+$/, "");
			const idx = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
			return idx >= 0 ? trimmed.slice(idx + 1) : trimmed;
		}
		/** Split `text` into plain/highlighted runs from ripgrep's [start,end) byte ranges. */
		function renderHighlighted(text, ranges) {
			if (ranges.length === 0) return [text];
			const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
			const parts = [];
			let cursor = 0;
			sorted.forEach(([start, end], i) => {
				if (start > cursor) parts.push(text.slice(cursor, start));
				parts.push(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("mark", {
					className: sidebar_module_css_default.searchMatchHighlight,
					children: text.slice(start, end)
				}, i));
				cursor = Math.max(cursor, end);
			});
			if (cursor < text.length) parts.push(text.slice(cursor));
			return parts;
		}
		/** One file's matches: a non-interactive group header + its match rows. */
		function FileGroup(props) {
			const { result, onOpenFileAtLine } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.searchGroup,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.explorerRow,
					title: result.path,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Folder, {
							size: 14,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: sidebar_module_css_default.explorerName,
							children: basenameOf$1(result.path)
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: sidebar_module_css_default.explorerCopied,
							children: result.matches.length
						})
					]
				}), result.matches.map((match, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.searchMatchRow,
					role: "button",
					tabIndex: 0,
					onClick: () => {
						onOpenFileAtLine(result.path, match.line);
					},
					onKeyDown: (event) => {
						if (event.key === "Enter") onOpenFileAtLine(result.path, match.line);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.searchMatchLine,
						children: match.line
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.searchMatchText,
						children: renderHighlighted(match.text, match.ranges)
					})]
				}, `${String(match.line)}:${String(i)}`))]
			});
		}
		function SearchView(props) {
			const { cwd, onOpenFileAtLine } = props;
			const [query, setQuery] = (0, react.useState)("");
			const [options, setOptions] = (0, react.useState)({
				matchCase: false,
				wholeWord: false,
				useRegex: false
			});
			const [state, setState] = (0, react.useState)({ status: "idle" });
			const abortRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				abortRef.current?.abort();
				const trimmed = query.trim();
				if (trimmed === "") {
					setState({ status: "idle" });
					return;
				}
				setState({ status: "loading" });
				const controller = new AbortController();
				abortRef.current = controller;
				const timer = window.setTimeout(() => {
					api.searchGrep(cwd ?? ".", trimmed, options, controller.signal).then((result) => {
						if (controller.signal.aborted) return;
						setState({
							status: "ready",
							files: result.files,
							truncated: result.truncated
						});
					}).catch((error) => {
						if (controller.signal.aborted) return;
						if (error instanceof ResttyApiError && error.code === "search-deps-missing") {
							api.searchDeps().then((info) => {
								if (info.ok === false) setState({
									status: "deps-missing",
									info
								});
							}).catch(() => {
								setState({
									status: "error",
									message: error.message
								});
							});
							return;
						}
						setState({
							status: "error",
							message: error instanceof Error ? error.message : String(error)
						});
					});
				}, DEBOUNCE_MS);
				return () => {
					window.clearTimeout(timer);
				};
			}, [
				query,
				cwd,
				options.matchCase,
				options.wholeWord,
				options.useRegex
			]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.explorer,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.browserBar,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Search, {
							size: 14,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							className: sidebar_module_css_default.browserInput,
							type: "text",
							value: query,
							placeholder: t("searchPlaceholder"),
							onChange: (event) => {
								setQuery(event.target.value);
							},
							autoFocus: true
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: sidebar_module_css_default.searchModifiers,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: clsx(sidebar_module_css_default.searchModifierButton, options.matchCase && sidebar_module_css_default.explorerPillActive),
									title: t("searchMatchCase"),
									"aria-label": t("searchMatchCase"),
									"aria-pressed": options.matchCase,
									onClick: () => {
										setOptions((o) => ({
											...o,
											matchCase: !o.matchCase
										}));
									},
									children: "Aa"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: clsx(sidebar_module_css_default.searchModifierButton, options.wholeWord && sidebar_module_css_default.explorerPillActive),
									title: t("searchWholeWord"),
									"aria-label": t("searchWholeWord"),
									"aria-pressed": options.wholeWord,
									onClick: () => {
										setOptions((o) => ({
											...o,
											wholeWord: !o.wholeWord
										}));
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: sidebar_module_css_default.searchModifierUnderline,
										children: "ab"
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: clsx(sidebar_module_css_default.searchModifierButton, options.useRegex && sidebar_module_css_default.explorerPillActive),
									title: t("searchUseRegex"),
									"aria-label": t("searchUseRegex"),
									"aria-pressed": options.useRegex,
									onClick: () => {
										setOptions((o) => ({
											...o,
											useRegex: !o.useRegex
										}));
									},
									children: ".*"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.explorerBody,
					children: [
						state.status === "idle" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: sidebar_module_css_default.explorerEmpty,
							children: t("searchNoQuery")
						}),
						state.status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: sidebar_module_css_default.explorerEmpty,
							children: t("loading")
						}),
						state.status === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: sidebar_module_css_default.explorerError,
							children: state.message
						}),
						state.status === "deps-missing" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SearchDepsBanner, { info: state.info }),
						state.status === "ready" && (state.files.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: sidebar_module_css_default.explorerEmpty,
							children: t("searchNoResults")
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: sidebar_module_css_default.searchSummary,
							children: [t("searchResultsSummary", {
								matches: String(state.files.reduce((sum, f) => sum + f.matches.length, 0)),
								files: String(state.files.length)
							}), state.truncated ? t("searchTruncated", { matches: String(state.files.reduce((sum, f) => sum + f.matches.length, 0)) }) : ""]
						}), state.files.map((result) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FileGroup, {
							result,
							onOpenFileAtLine
						}, result.path))] }))
					]
				})]
			});
		}
		/** Deps-missing banner — reuses ResttyTerminal.tsx's `.terminalDeps*` classes
		*  verbatim (also defined in this same sidebar.module.css), no new CSS. */
		function SearchDepsBanner(props) {
			const { info } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.terminalDepsBanner,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: sidebar_module_css_default.terminalDepsTitle,
						children: t("searchDepsFailed")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: sidebar_module_css_default.terminalDepsHint,
						children: t("searchDepsHint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: sidebar_module_css_default.terminalDepsCommandRow,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
							className: sidebar_module_css_default.terminalRepairCommand,
							children: info.command
						})
					}),
					info.note !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: sidebar_module_css_default.terminalDepsNote,
						children: info.note
					})
				]
			});
		}
		//#endregion
		//#region src/client/FileExplorer.tsx
		/**
		* The file explorer tab: a directory tree over one bookmarked local folder
		* ("+" adds a typed path and makes it the new root, "-" removes it and falls
		* back to the previous one — see explorer-prefs.ts; there is no separate
		* folder-switcher UI), clicking a file opens it in the editor tab via
		* `onOpenFile` (wired to `service.openFile` in SplitPane.tsx). Also doubles
		* as a "notes" browser: point a bookmark at wherever you keep notes and
		* browse/open .md files the same way as any other folder.
		*
		* Each file row reveals two copy actions on hover: "@" copies the path
		* relative to the current root (for @-mentioning in chat), a copy-glyph
		* button copies the absolute path.
		*
		* Directory expand state lives in the shared `SidebarState.expanded` set
		* (via `expanded`/`onToggleDir`, threaded through `TabComponentProps`) so it
		* survives tab switches within a session; bookmarks live in localStorage
		* (see explorer-prefs.ts) — independent of any session, so they persist
		* across reloads and are shared by every conversation.
		*/
		function basenameOf(path) {
			const trimmed = path.replace(/[/\\]+$/, "");
			const idx = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
			return idx >= 0 ? trimmed.slice(idx + 1) : trimmed;
		}
		function joinPath(dir, name) {
			return dir.endsWith("/") || dir.endsWith("\\") ? `${dir}${name}` : `${dir}/${name}`;
		}
		/** `path` relative to `root` (falls back to the absolute path when `path`
		*  isn't actually under `root` — should not happen, the tree only ever
		*  descends from `root`). Exported for testing. */
		function relativeTo(root, path) {
			const normalizedRoot = root.replace(/[/\\]+$/, "");
			if (path === normalizedRoot) return basenameOf(normalizedRoot);
			if (path.startsWith(`${normalizedRoot}/`) || path.startsWith(`${normalizedRoot}\\`)) return path.slice(normalizedRoot.length + 1);
			return path;
		}
		/** Write `text` to the clipboard; `onDone` fires only on success (silently
		*  drops the "copied" feedback on failure — permissions, insecure context). */
		function copyToClipboard(text, onDone) {
			navigator.clipboard?.writeText(text).then(onDone).catch(() => {});
		}
		/**
		* The relative-path reference copied by the `@` button. Always prefixed with
		* `@` (the user's `@file` mention convention) — clicking the `@` icon on
		* `package.json` copies `@package.json`, on `src/index.ts` copies
		* `@src/index.ts`. The `@` is part of the copied text, not just the icon.
		* Exported for testing.
		*/
		function atReference(root, path) {
			return `@${relativeTo(root, path)}`;
		}
		/** One file row: opens on click; hover reveals @ (copy relative path) and a
		*  copy-glyph button (copy absolute path), each with transient "Copied" feedback. */
		function FileRow(props) {
			const { path, name, root, depth, onOpenFile } = props;
			const [copied, setCopied] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				if (copied === null) return;
				const timer = window.setTimeout(() => {
					setCopied(null);
				}, 1200);
				return () => {
					window.clearTimeout(timer);
				};
			}, [copied]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.explorerRow,
				style: { paddingLeft: `${String(8 + depth * 22)}px` },
				role: "button",
				tabIndex: 0,
				onClick: () => {
					onOpenFile(path);
				},
				onKeyDown: (event) => {
					if (event.key === "Enter") onOpenFile(path);
				},
				title: name,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(File, {
						size: 14,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.explorerName,
						children: name
					}),
					copied === "relative" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.explorerCopied,
						children: t("explorerCopied")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: sidebar_module_css_default.explorerRef,
						title: t("explorerCopyRelative"),
						"aria-label": t("explorerCopyRelative"),
						onClick: (event) => {
							event.stopPropagation();
							copyToClipboard(atReference(root, path), () => {
								setCopied("relative");
							});
						},
						children: "@"
					}),
					copied === "absolute" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.explorerCopied,
						children: t("explorerCopied")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: sidebar_module_css_default.explorerRef,
						title: t("explorerCopyAbsolute"),
						"aria-label": t("explorerCopyAbsolute"),
						onClick: (event) => {
							event.stopPropagation();
							copyToClipboard(path, () => {
								setCopied("absolute");
							});
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Copy, {
							size: 12,
							"aria-hidden": "true"
						})
					})
				]
			});
		}
		/** One directory's children: fetches lazily on first render, re-fetches never
		*  (the tree is a browse view, not a live filesystem watcher). */
		function DirChildren(props) {
			const { path, depth, root, expanded, dirs, onToggleDir, onOpenFile, load } = props;
			(0, react.useEffect)(() => {
				if (!dirs.has(path)) load(path);
			}, [
				path,
				dirs,
				load
			]);
			const state = dirs.get(path);
			const indent = `${String(8 + depth * 22)}px`;
			if (state === void 0 || state.status === "loading") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: sidebar_module_css_default.explorerRow,
				style: { paddingLeft: indent },
				children: t("loading")
			});
			if (state.status === "error") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: clsx(sidebar_module_css_default.explorerRow, sidebar_module_css_default.explorerError),
				style: { paddingLeft: indent },
				children: state.message
			});
			if (state.entries.length === 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: sidebar_module_css_default.explorerEmpty,
				children: t("explorerEmptyDir")
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: state.entries.map((entry) => entry.isDir ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DirRow, {
				path: joinPath(path, entry.name),
				name: entry.name,
				depth,
				root,
				expanded,
				dirs,
				onToggleDir,
				onOpenFile,
				load
			}, entry.name) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FileRow, {
				path: joinPath(path, entry.name),
				name: entry.name,
				root,
				depth,
				onOpenFile
			}, entry.name)) });
		}
		/** One directory's own row (toggles expand) plus its children when open. */
		function DirRow(props) {
			const { path, name, depth, root, expanded, dirs, onToggleDir, onOpenFile, load } = props;
			const isOpen = expanded.includes(path);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: clsx(sidebar_module_css_default.explorerRow, sidebar_module_css_default.explorerDir),
				style: { paddingLeft: `${String(8 + depth * 22)}px` },
				onClick: () => {
					onToggleDir(path);
				},
				title: path,
				children: [
					isOpen ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChevronDown, {
						size: 14,
						"aria-hidden": "true"
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChevronRight, {
						size: 14,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Folder, {
						size: 14,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: sidebar_module_css_default.explorerName,
						children: name
					})
				]
			}), isOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DirChildren, {
				path,
				depth: depth + 1,
				root,
				expanded,
				dirs,
				onToggleDir,
				onOpenFile,
				load
			})] });
		}
		function FileExplorer(props) {
			const { cwd, expanded, onToggleDir, onOpenFile, onOpenFileAtLine } = props;
			const [prefs, setPrefs] = (0, react.useState)(() => readExplorerPrefs());
			const [picking, setPicking] = (0, react.useState)(false);
			const [dirs, setDirs] = (0, react.useState)(/* @__PURE__ */ new Map());
			const [mode, setMode] = (0, react.useState)("files");
			const [rootCopied, setRootCopied] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				if (!rootCopied) return;
				const timer = window.setTimeout(() => {
					setRootCopied(false);
				}, 1200);
				return () => {
					window.clearTimeout(timer);
				};
			}, [rootCopied]);
			const active = prefs.bookmarks.find((b) => b.id === prefs.activeId);
			const root = active?.path ?? cwd ?? ".";
			const persist = (0, react.useCallback)((next) => {
				setPrefs(next);
				writeExplorerPrefs(next);
			}, []);
			const load = (0, react.useCallback)((path) => {
				setDirs((prev) => new Map(prev).set(path, { status: "loading" }));
				api.fsList(path).then((result) => {
					setDirs((prev) => new Map(prev).set(path, {
						status: "ready",
						entries: result.entries
					}));
				}).catch((error) => {
					setDirs((prev) => new Map(prev).set(path, {
						status: "error",
						message: error instanceof Error ? error.message : String(error)
					}));
				});
			}, []);
			(0, react.useEffect)(() => {
				load(root);
			}, [root, load]);
			const addBookmark = (path) => {
				const trimmed = path.trim();
				if (trimmed === "") return;
				const bookmark = {
					id: makeBookmarkId(),
					label: basenameOf(trimmed) || trimmed,
					path: trimmed
				};
				persist({
					bookmarks: [...prefs.bookmarks, bookmark],
					activeId: bookmark.id
				});
				setPicking(false);
			};
			const removeActive = () => {
				if (active === void 0) return;
				const bookmarks = prefs.bookmarks.filter((b) => b.id !== active.id);
				persist({
					bookmarks,
					activeId: bookmarks[0]?.id ?? null
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.explorer,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: sidebar_module_css_default.explorerHeader,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: sidebar_module_css_default.explorerHeaderPath,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: sidebar_module_css_default.explorerRoot,
								onClick: () => {
									copyToClipboard(root, () => {
										setRootCopied(true);
									});
								},
								title: root,
								children: rootCopied ? t("explorerCopied") : active?.label ?? root
							})
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: sidebar_module_css_default.explorerHeaderActions,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: clsx(sidebar_module_css_default.explorerPill, mode === "search" && sidebar_module_css_default.explorerPillActive),
									title: t("searchTabTitle"),
									"aria-label": t("searchTabTitle"),
									"aria-pressed": mode === "search",
									onClick: () => {
										setMode((m) => m === "search" ? "files" : "search");
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Search, {
										size: 13,
										"aria-hidden": "true"
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: sidebar_module_css_default.explorerPill,
									title: t("explorerAddFolder"),
									"aria-label": t("explorerAddFolder"),
									onClick: () => {
										setPicking(true);
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FolderPlus, {
										size: 13,
										"aria-hidden": "true"
									})
								}),
								active !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: sidebar_module_css_default.explorerPill,
									title: t("explorerRemoveFolder"),
									"aria-label": t("explorerRemoveFolder"),
									onClick: removeActive,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FolderMinus, {
										size: 13,
										"aria-hidden": "true"
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FolderPicker, {
						open: picking,
						initialPath: root,
						onSelect: addBookmark,
						onClose: () => {
							setPicking(false);
						}
					}),
					mode === "search" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SearchView, {
						cwd: root,
						onOpenFileAtLine: onOpenFileAtLine ?? (() => {})
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: sidebar_module_css_default.explorerBody,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DirChildren, {
							path: root,
							depth: 0,
							root,
							expanded,
							dirs,
							onToggleDir,
							onOpenFile,
							load
						})
					})
				]
			});
		}
		//#endregion
		//#region src/client/index.tsx
		/**
		* Client half of dsh-powerdesk: attaches the DSH i18n system, resets the
		* lazy-chunk cache for a clean activation (HMR-safe), and surfaces the
		* terminal and the browser as "Terminal" and "Browser" tabs inside the
		* plugin's OWN sidebar shell.
		*
		* Powerdesk is self-contained: it owns its sidebar (the layout + wrapper
		* copied from dsh-better-sidebar — `SidebarShell`, `state.ts`, `service.ts`,
		* `TabBar`, the panel/tab CSS — stripped of the explorer / git / subagent /
		* editor / diff views and the host routes those need). It publishes a
		* `powerdeskSidebar` service (the tab registry) via `ctx.provide` and mounts
		* the shell in a portal, so the sidebar entry is always present without
		* depending on the `dsh-better-sidebar` plugin being installed. The two
		* powerdesk surfaces (a restty terminal + a sandboxed browser) register as
		* tabs through that same service.
		*
		* Requires the runtime's slots, sessions, and locale services. The bundle
		* is a module-table consumer only (react + ui-slots + ui-primitives + the
		* runtime/client shell, all provided or inlined); restty itself lives in a
		* lazy chunk fetched on first terminal-open.
		*/
		/** The tab id for the browser surface (the SidebarTab.type value). */
		const POWERDESK_BROWSER_TAB_ID = "dsh-powerdesk:browser";
		/** The tab id for the file explorer (the SidebarTab.type value). */
		const POWERDESK_EXPLORER_TAB_ID = EXPLORER_TAB_ID;
		/** The tab id for the Notes tab (the SidebarTab.type value). */
		const POWERDESK_NOTES_TAB_ID = "dsh-powerdesk:notes";
		/** The tab id for the calendar surface. */
		const POWERDESK_CALENDAR_TAB_ID = "dsh-powerdesk:calendar";
		/** The tab id for the editor. MUST stay literally 'editor' — service.ts's
		*  `openFile()` hardcodes `type: 'editor'` when it mints a file-open tab. */
		const EDITOR_TAB_ID = "editor";
		/** Services required before mounting (provided by the DSH client runtime). */
		const inject = [
			"slots",
			"sessions",
			"locale"
		];
		/** The lazy terminal component (restty loads on first open). */
		const TerminalView = lazyChunkComponent("terminal", (mod) => mod.ResttyTerminal);
		/** The lazy browser component (BrowserView + URL policy load on first open). */
		const BrowserViewLazy = lazyChunkComponent("browser", (mod) => mod.BrowserView);
		/** The lazy editor component (CodeMirror + language packages load on first file-open). */
		const CodeEditorLazy = lazyChunkComponent("editor", (mod) => mod.CodeEditor);
		/** The lazy Notes view (shares the 'editor' chunk — it embeds CodeEditor inline). */
		const NotesViewLazy = lazyChunkComponent("editor", (mod) => mod.NotesView);
		/** The lazy Calendar view (schedule-x + preact + temporal-polyfill load on
		*  first calendar-open; lives in its own 'calendar' chunk so it never weighs
		*  down startup — most sessions never open the calendar). */
		const CalendarViewLazy = lazyChunkComponent("calendar", (mod) => mod.CalendarView);
		/** Module-level monotonic counters for tab ids (one source of truth across
		*  reactivations; ids stay unique without state plumbing). */
		let nextResttyId = 1;
		let nextBrowserId = 1;
		/** A small terminal-glyph icon (no ui-primitives dependency). */
		function IconTerminal({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "1.25",
						y: "2.25",
						width: "13.5",
						height: "11.5",
						rx: "1.75",
						stroke: "currentColor",
						strokeWidth: "1.25"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M4 6l2.2 1.9L4 9.8",
						stroke: "currentColor",
						strokeWidth: "1.25",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M8 10h3.5",
						stroke: "currentColor",
						strokeWidth: "1.25",
						strokeLinecap: "round"
					})
				]
			});
		}
		/** A small globe-glyph icon for the browser tab. */
		function IconGlobe({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "8",
					cy: "8",
					r: "6.25",
					stroke: "currentColor",
					strokeWidth: "1.25"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M1.75 8h12.5M8 1.75c1.6 1.5 2.5 3.7 2.5 6.25s-.9 4.75-2.5 6.25M8 1.75c-1.6 1.5-2.5 3.7-2.5 6.25s.9 4.75 2.5 6.25",
					stroke: "currentColor",
					strokeWidth: "1.25",
					fill: "none"
				})]
			});
		}
		/** A small folder-glyph icon for the explorer tab. */
		function IconFolder({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M1.75 4.25c0-.69.56-1.25 1.25-1.25h3l1.25 1.5h5.75c.69 0 1.25.56 1.25 1.25v6.25c0 .69-.56 1.25-1.25 1.25H3c-.69 0-1.25-.56-1.25-1.25z",
					stroke: "currentColor",
					strokeWidth: "1.25",
					strokeLinejoin: "round"
				})
			});
		}
		/** A small file-glyph icon for the editor tab. */
		function IconFile({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M3.75 1.75h5l3.5 3.5v8.25a.75.75 0 0 1-.75.75h-7.75a.75.75 0 0 1-.75-.75V2.5a.75.75 0 0 1 .75-.75z",
					stroke: "currentColor",
					strokeWidth: "1.25",
					strokeLinejoin: "round"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M8.75 1.75V5.5h3.5",
					stroke: "currentColor",
					strokeWidth: "1.25",
					strokeLinejoin: "round"
				})]
			});
		}
		/** A small notebook-glyph icon for the Notes tab. */
		function IconNotes({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
					x: "2.25",
					y: "1.75",
					width: "11.5",
					height: "12.5",
					rx: "1.5",
					stroke: "currentColor",
					strokeWidth: "1.25"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M5 5h6M5 8h6M5 11h3.5",
					stroke: "currentColor",
					strokeWidth: "1.25",
					strokeLinecap: "round"
				})]
			});
		}
		/** A small calendar-glyph icon (no ui-primitives dependency). */
		function IconCalendar({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "2.25",
						y: "3.25",
						width: "11.5",
						height: "11",
						rx: "1.5",
						stroke: "currentColor",
						strokeWidth: "1.25"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M2.25 6.5h11.5",
						stroke: "currentColor",
						strokeWidth: "1.25"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M5 1.75v2.5M11 1.75v2.5",
						stroke: "currentColor",
						strokeWidth: "1.25",
						strokeLinecap: "round"
					})
				]
			});
		}
		/**
		* The sidebar tab view: reads the user's restty prefs from the sidebar
		* store synchronously (no hooks — the Sidebar re-renders the descriptor on a
		* store change, so a settings edit takes effect on the next render) and
		* mounts the lazy restty terminal. `visible` is forwarded so the parent can
		* pause rendering without a remount.
		*/
		function ResttyTabView(props) {
			const { scope, tab, visible } = props;
			const prefs = useTerminalPrefs();
			return (0, react.createElement)(TerminalView, {
				scope,
				tabId: tab.id,
				prefs,
				visible: visible ?? true
			});
		}
		/**
		* The sidebar browser tab view: mounts the BrowserView, seeded with the tab's
		* persisted path (the visited URL) so a reload restores the page. `visible`
		* pauses the embeddability probe.
		*/
		function BrowserTabView(props) {
			const { tab, visible } = props;
			return (0, react.createElement)(BrowserViewLazy, {
				initialUrl: tab.path,
				visible: visible ?? true
			});
		}
		/** Build the terminal tab descriptor (registered into powerdesk's own
		*  powerdeskSidebar service). Terminal appearance (font family/weight/size,
		*  theme) and the PTY backend are owned by the Powerdesk Side card's
		*  TerminalAppearancePanel, not by a per-tab settings popup — powerdesk's own
		*  sidebar shell never rendered the `pluginToggles` rows this descriptor used
		*  to declare, so they were dead. */
		function buildResttyTabDescriptor() {
			return {
				id: POWERDESK_TAB_ID,
				title: () => t("tabTitle"),
				icon: (size) => (0, react.createElement)(IconTerminal, { size }),
				order: 45,
				createTab: () => {
					const n = nextResttyId;
					nextResttyId += 1;
					return { tab: {
						id: `restty:${String(n)}`,
						type: POWERDESK_TAB_ID,
						title: `${t("terminal")} ${String(n)}`
					} };
				},
				component: (props) => (0, react.createElement)(ResttyTabView, props)
			};
		}
		/** Build the browser tab descriptor (registered into powerdesk's own
		*  powerdeskSidebar service). The browser tab uses a `urlTarget` claim so
		*  external http links clicked in the chat can be intercepted into the
		*  sidebar. */
		function buildBrowserTabDescriptor() {
			return {
				id: POWERDESK_BROWSER_TAB_ID,
				title: () => t("browserTabTitle"),
				icon: (size) => (0, react.createElement)(IconGlobe, { size }),
				order: 50,
				createTab: () => {
					const n = nextBrowserId;
					nextBrowserId += 1;
					return { tab: {
						id: `restty-browser:${String(n)}`,
						type: POWERDESK_BROWSER_TAB_ID,
						title: t("browser")
					} };
				},
				urlTarget: (url) => url.protocol === "http:",
				component: (props) => (0, react.createElement)(BrowserTabView, props)
			};
		}
		/**
		* The sidebar explorer tab view: a directory tree over one bookmarked local
		* folder. Not chunked (no heavy dependency, unlike restty/CodeMirror) — it
		* ships in the core client bundle. `expanded`/`onToggleDir`/`onOpenFile` are
		* threaded down from SplitPane.tsx's TabContent.
		*/
		function ExplorerTabView(props) {
			const { scope, expanded, onToggleDir, onOpenFile, onOpenFileAtLine } = props;
			return (0, react.createElement)(FileExplorer, {
				cwd: scope.cwd,
				expanded: expanded ?? [],
				onToggleDir: onToggleDir ?? (() => {}),
				onOpenFile: onOpenFile ?? (() => {}),
				onOpenFileAtLine: onOpenFileAtLine ?? (() => {})
			});
		}
		/**
		* The sidebar editor tab view: mounts the lazy CodeMirror editor over the
		* tab's persisted path. A tab with no path (should not happen — every
		* editor tab is minted by `service.openFile` with a path) renders nothing
		* rather than crashing the pane.
		*/
		function EditorTabView(props) {
			const { tab, visible, onDirtyChange } = props;
			if (tab.path === void 0) return null;
			const initialLine = tab.meta?.line;
			return (0, react.createElement)(CodeEditorLazy, {
				path: tab.path,
				visible: visible ?? true,
				initialLine,
				onDirtyChange: onDirtyChange ?? (() => {})
			});
		}
		/** Build the explorer tab descriptor. `single: true` — one explorer tab per
		*  session; opening it again focuses the existing one instead of duplicating. */
		function buildExplorerTabDescriptor() {
			return {
				id: POWERDESK_EXPLORER_TAB_ID,
				title: () => t("explorerTabTitle"),
				icon: (size) => (0, react.createElement)(IconFolder, { size }),
				order: 40,
				single: true,
				createTab: () => ({ tab: {
					id: POWERDESK_EXPLORER_TAB_ID,
					type: POWERDESK_EXPLORER_TAB_ID,
					title: t("explorerTabTitle")
				} }),
				component: (props) => (0, react.createElement)(ExplorerTabView, props)
			};
		}
		/**
		* Build the editor tab descriptor. `id` MUST stay 'editor' (service.ts's
		* `openFile()` hardcodes `type: 'editor'`); `hidden` keeps it out of the +
		* menu (only file-open mints one); `dedupeKey` on the path means opening
		* the same file twice focuses the existing tab instead of duplicating.
		*/
		function buildEditorTabDescriptor() {
			return {
				id: EDITOR_TAB_ID,
				title: () => t("editorTabTitle"),
				icon: (size) => (0, react.createElement)(IconFile, { size }),
				hidden: true,
				dedupeKey: (tab) => tab.path,
				component: (props) => (0, react.createElement)(EditorTabView, props)
			};
		}
		/** The sidebar Notes tab view: mounts the lazy Notes surface (tree + inline
		*  editor over one bound markdown folder — see NotesView.tsx). */
		function NotesTabView(props) {
			const { visible } = props;
			return (0, react.createElement)(NotesViewLazy, { visible: visible ?? true });
		}
		/** Build the Notes tab descriptor. `single: true` — one Notes tab per
		*  session; opening it again focuses the existing one instead of duplicating. */
		function buildNotesTabDescriptor() {
			return {
				id: POWERDESK_NOTES_TAB_ID,
				title: () => t("notesTabTitle"),
				icon: (size) => (0, react.createElement)(IconNotes, { size }),
				order: 42,
				single: true,
				createTab: () => ({ tab: {
					id: POWERDESK_NOTES_TAB_ID,
					type: POWERDESK_NOTES_TAB_ID,
					title: t("notesTabTitle")
				} }),
				component: (props) => (0, react.createElement)(NotesTabView, props)
			};
		}
		/** The sidebar Calendar tab view: mounts the lazy schedule-x surface (Month /
		*  Week / Day over a SQLite-backed event store — see CalendarView.tsx). */
		function CalendarTabView(props) {
			const { visible } = props;
			return (0, react.createElement)(CalendarViewLazy, { visible: visible ?? true });
		}
		/** Build the Calendar tab descriptor. `single: true` — one Calendar tab per
		*  session; opening it again focuses the existing one instead of duplicating. */
		function buildCalendarTabDescriptor() {
			return {
				id: POWERDESK_CALENDAR_TAB_ID,
				title: () => t("calendarTabTitle"),
				icon: (size) => (0, react.createElement)(IconCalendar, { size }),
				order: 43,
				single: true,
				createTab: () => ({ tab: {
					id: POWERDESK_CALENDAR_TAB_ID,
					type: POWERDESK_CALENDAR_TAB_ID,
					title: t("calendarTabTitle")
				} }),
				component: (props) => (0, react.createElement)(CalendarTabView, props)
			};
		}
		/**
		* Mount the powerdesk sidebar shell to <body> in a portal; returns the
		* disposer. The shell is the layout + wrapper (panel / tab bar / content)
		* copied from dsh-better-sidebar; the terminal + browser register as tabs
		* through the provided `powerdeskSidebar` service.
		*/
		function mountSidebarShell(ctx, store, service) {
			if (typeof document === "undefined") return () => {};
			const host = document.createElement("div");
			host.dataset.dshPlugin = "dsh-powerdesk";
			host.dataset.dshSidebar = "";
			document.body.appendChild(host);
			const root = (0, react_dom_client.createRoot)(host);
			root.render((0, react.createElement)(RenderBoundary, { className: sidebar_module_css_default.boundaryError }, (0, react.createElement)(SidebarShell, {
				ctx,
				store,
				service
			})));
			return () => {
				root.unmount();
				host.remove();
			};
		}
		/**
		* Client plugin body.
		* @param ctx - the client cordis context (slots, sessions, locale).
		*/
		function apply(ctx) {
			const offLocale = attachLocale(ctx.locale);
			ctx.effect(() => offLocale, "dsh-powerdesk: locale");
			resetChunks();
			const sidebarStore = createSidebarStore();
			const service = createPowerdeskSidebarService(sidebarStore);
			ctx.provide("powerdeskSidebar", service);
			ctx.effect(() => mountSidebarShell(ctx, sidebarStore, service), "dsh-powerdesk: sidebar shell mount");
			ctx.effect(() => service.registerTab(buildResttyTabDescriptor()), "dsh-powerdesk: terminal tab");
			ctx.effect(() => service.registerTab(buildBrowserTabDescriptor()), "dsh-powerdesk: browser tab");
			ctx.effect(() => service.registerTab(buildExplorerTabDescriptor()), "dsh-powerdesk: explorer tab");
			ctx.effect(() => service.registerTab(buildEditorTabDescriptor()), "dsh-powerdesk: editor tab");
			ctx.effect(() => service.registerTab(buildNotesTabDescriptor()), "dsh-powerdesk: notes tab");
			ctx.effect(() => service.registerTab(buildCalendarTabDescriptor()), "dsh-powerdesk: calendar tab");
			const extensionHost = new ExtensionHost(service);
			ctx.effect(() => {
				extensionHost.refresh();
				return () => {
					extensionHost.dispose();
				};
			}, "dsh-powerdesk: extension tabs");
			ctx.effect(() => ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "dsh-powerdesk",
				order: 100,
				label: () => t("settingsNav"),
				inject: () => ({
					sidebar: ctx.get("powerdeskSidebar"),
					extensions: extensionHost
				})
			}, SettingsSection)), "dsh-powerdesk: settings section");
		}
		//#endregion
		exports.POWERDESK_BROWSER_TAB_ID = POWERDESK_BROWSER_TAB_ID;
		exports.POWERDESK_CALENDAR_TAB_ID = POWERDESK_CALENDAR_TAB_ID;
		exports.POWERDESK_EXPLORER_TAB_ID = POWERDESK_EXPLORER_TAB_ID;
		exports.POWERDESK_NOTES_TAB_ID = POWERDESK_NOTES_TAB_ID;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map