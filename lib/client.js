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
			"urlTarget"
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
				openFile
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
			explorerTabTitle: "Explorer",
			explorerAddFolder: "Add folder",
			explorerRemoveFolder: "Remove",
			explorerEmptyDir: "Empty folder",
			explorerCopyRelative: "Copy relative path",
			explorerCopyAbsolute: "Copy absolute path",
			explorerCopied: "Copied",
			editorTabTitle: "Editor",
			editorSave: "Save",
			editorSaving: "Saving…",
			editorUnsaved: "Unsaved",
			editorSaved: "Saved",
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
			explorerTabTitle: "文件",
			explorerAddFolder: "添加文件夹",
			explorerRemoveFolder: "移除",
			explorerEmptyDir: "空文件夹",
			explorerCopyRelative: "复制相对路径",
			explorerCopyAbsolute: "复制绝对路径",
			explorerCopied: "已复制",
			editorTabTitle: "编辑器",
			editorSave: "保存",
			editorSaving: "保存中…",
			editorUnsaved: "未保存",
			editorSaved: "已保存",
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
		/** Chunk script endpoint served by the plugin host half (src/bundle-route.ts). */
		const CHUNK_URL = (name) => `/powerdesk/bundle/${name}.js`;
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
		* Drop all chunk state for a fresh plugin activation (HMR-safe): clear the
		* in-memory cache and any test-registry entries, so the next lazy open
		* re-fetches and re-executes the current chunk script.
		*/
		function resetChunks() {
			cache.clear();
			testLoaders.clear();
		}
		//#endregion
		//#region \0dsh-css:/Users/tengzhang/work/Tools/dsh-powerdesk/src/client/restty.module.css.mjs
		const css$1 = ".Y3ZLrW_terminalWrap{background:var(--dsw-alias-bg-base,#111114);flex-direction:column;width:100%;height:100%;min-height:0;display:flex;position:relative;overflow:hidden}.Y3ZLrW_terminal{flex:auto;width:100%;height:100%;min-height:0}.Y3ZLrW_terminalBanner,.Y3ZLrW_terminalDepsBanner{z-index:5;text-align:center;color:var(--dsw-alias-label-primary,#e6e6e6);background:color-mix(in srgb, var(--dsw-alias-bg-base,#111114) 92%, transparent);backdrop-filter:blur(2px);flex-direction:column;justify-content:center;align-items:center;gap:10px;padding:18px 22px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex;position:absolute;inset:0}.Y3ZLrW_terminalBannerUrl{opacity:.7;word-break:break-all;font-size:11px}.Y3ZLrW_terminalRetry{border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-elevated,#1b1b22);color:var(--dsw-alias-label-primary,#e6e6e6);cursor:pointer;font:inherit;border-radius:8px;align-self:center;padding:6px 14px}.Y3ZLrW_terminalRetry:hover{filter:brightness(1.1)}.Y3ZLrW_terminalDepsTitle{font-size:14px;font-weight:600}.Y3ZLrW_terminalDepsHint{opacity:.85;max-width:520px}.Y3ZLrW_terminalDepsCommandRow{align-items:stretch;gap:8px;width:100%;max-width:640px;display:flex}.Y3ZLrW_terminalRepairCommand{text-align:left;white-space:pre-wrap;word-break:break-all;border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-elevated,#1b1b22);border-radius:8px;flex:auto;margin:0;padding:8px 10px;font-size:12px}.Y3ZLrW_terminalDepsNote{opacity:.7;max-width:560px;font-size:12px}.Y3ZLrW_terminalDepsActions{gap:8px;display:flex}.Y3ZLrW_editorPlaceholder,.Y3ZLrW_editorError{text-align:center;height:100%;color:var(--dsw-alias-label-secondary,#abb2bf);justify-content:center;align-items:center;gap:10px;padding:16px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex}.Y3ZLrW_editorError{color:var(--dsw-alias-label-primary,#e6e6e6);flex-direction:column}.Y3ZLrW_standaloneToggle{z-index:2147483000;border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-elevated,#1b1b22);color:var(--dsw-alias-label-primary,#e6e6e6);cursor:pointer;border-radius:999px;align-items:center;gap:6px;padding:8px 12px;font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;display:inline-flex;position:fixed;bottom:14px;right:14px;box-shadow:0 4px 14px #00000059}.Y3ZLrW_standaloneToggle:hover{filter:brightness(1.1)}.Y3ZLrW_standaloneHost{z-index:2147483000;border:1px solid var(--dsw-alias-stroke-default,#444);background:var(--dsw-alias-bg-base,#111114);border-radius:12px;flex-direction:column;width:min(720px,92vw);height:min(440px,70vh);display:flex;position:fixed;bottom:56px;right:14px;overflow:hidden;box-shadow:0 10px 40px #00000073}.Y3ZLrW_standaloneHeader{border-bottom:1px solid var(--dsw-alias-stroke-faint,#2a2a33);color:var(--dsw-alias-label-secondary,#abb2bf);justify-content:space-between;align-items:center;padding:6px 10px;font:11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex}.Y3ZLrW_standaloneNoSession{text-align:center;color:var(--dsw-alias-label-secondary,#abb2bf);padding:18px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}.Y3ZLrW_standaloneSurfaceSwitch{background:var(--dsw-alias-bg-elevated,#1b1b22);border-radius:6px;gap:2px;padding:2px;display:inline-flex}.Y3ZLrW_standaloneSurfaceBtn,.Y3ZLrW_standaloneSurfaceActive{cursor:pointer;color:var(--dsw-alias-label-secondary,#abb2bf);background:0 0;border:none;border-radius:4px;padding:2px 10px;font:11px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.Y3ZLrW_standaloneSurfaceActive{background:var(--dsw-alias-interactive-bg-hover,#ffffff1f);color:var(--dsw-alias-label-primary,#e6e6e6)}.Y3ZLrW_browser{flex-direction:column;flex:1;min-height:0;display:flex}.Y3ZLrW_browserBar{border-bottom:1px solid var(--dsw-alias-border-l1,#2a2a33);flex:none;align-items:center;gap:4px;padding:6px 8px;display:flex}.Y3ZLrW_iconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary,#abb2bf);cursor:pointer;background:0 0;border:none;border-radius:6px;flex:none;justify-content:center;align-items:center;display:inline-flex}.Y3ZLrW_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,#ffffff14);color:var(--dsw-alias-label-primary,#e6e6e6)}.Y3ZLrW_iconButton:disabled{opacity:.4;cursor:default}.Y3ZLrW_browserInput{border:1px solid var(--dsw-alias-border-l1,#2a2a33);background:var(--dsw-alias-bg-layer-1,#1b1b22);min-width:0;height:28px;color:var(--dsw-alias-label-primary,#e6e6e6);border-radius:6px;flex:1;padding:0 10px;font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace}.Y3ZLrW_browserInput:focus{border-color:var(--dsw-alias-border-l2,#444);outline:none}.Y3ZLrW_browserMessage{color:var(--dsw-alias-state-warn-label,#c8a951);background:var(--dsw-alias-state-warn-tertiary,#c8a9511a);flex:none;padding:4px 12px;font-size:11px}.Y3ZLrW_browserFrame{background:var(--dsw-alias-bg-base,#111114);border:none;flex:1;width:100%;min-height:0}.Y3ZLrW_browserStart{text-align:center;min-height:0;color:var(--dsw-alias-label-tertiary,#848891);flex:1;justify-content:center;align-items:center;padding:20px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;display:flex}.Y3ZLrW_browserBlocked{text-align:center;min-height:0;color:var(--dsw-alias-state-warn-primary,#c8a951);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:6px;padding:24px;display:flex}.Y3ZLrW_browserBlockedTitle{color:var(--dsw-alias-label-primary,#e6e6e6);font-size:12px;font-weight:600}.Y3ZLrW_browserBlockedDesc{max-width:280px;color:var(--dsw-alias-label-secondary,#abb2bf);font-size:11px}.Y3ZLrW_browserBlockedActions{gap:8px;margin-top:6px;display:flex}.Y3ZLrW_browserBlockedButton{border:1px solid var(--dsw-alias-border-l2,#444);background:var(--dsw-alias-bg-layer-1,#1b1b22);color:var(--dsw-alias-label-primary,#e6e6e6);cursor:pointer;border-radius:6px;padding:4px 12px;font-size:11px}.Y3ZLrW_browserBlockedButton:hover{background:var(--dsw-alias-interactive-bg-hover,#ffffff14)}.Y3ZLrW_sandboxStatus{border-bottom:1px solid var(--dsw-alias-border-l1,#2a2a33);flex:none;align-items:center;gap:6px;padding:4px 10px;font-size:11px;display:flex}.Y3ZLrW_sandboxStatusOn{color:var(--dsw-alias-state-success-label,#4eaa6e)}.Y3ZLrW_sandboxStatusOff{color:var(--dsw-alias-state-warn-label,#c8a951);background:var(--dsw-alias-state-warn-tertiary,#c8a95114)}.Y3ZLrW_sandboxDot{background:currentColor;border-radius:50%;flex:none;width:8px;height:8px}.Y3ZLrW_sandboxStatusText{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Y3ZLrW_sandboxAction{color:inherit;cursor:pointer;background:0 0;border:1px solid;border-radius:4px;flex:none;padding:2px 8px;font-size:11px}.Y3ZLrW_sandboxAction:hover{opacity:.8}";
		const tagId$1 = "dsh-powerdesk/restty.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-powerdesk";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var restty_module_css_default = {
			"standaloneToggle": "Y3ZLrW_standaloneToggle",
			"terminalDepsTitle": "Y3ZLrW_terminalDepsTitle",
			"terminalRepairCommand": "Y3ZLrW_terminalRepairCommand",
			"standaloneNoSession": "Y3ZLrW_standaloneNoSession",
			"browserBlockedButton": "Y3ZLrW_browserBlockedButton",
			"browserBlockedTitle": "Y3ZLrW_browserBlockedTitle",
			"browserBar": "Y3ZLrW_browserBar",
			"terminalRetry": "Y3ZLrW_terminalRetry",
			"terminalDepsCommandRow": "Y3ZLrW_terminalDepsCommandRow",
			"sandboxStatusText": "Y3ZLrW_sandboxStatusText",
			"standaloneSurfaceActive": "Y3ZLrW_standaloneSurfaceActive",
			"browserFrame": "Y3ZLrW_browserFrame",
			"terminalDepsNote": "Y3ZLrW_terminalDepsNote",
			"browserBlockedActions": "Y3ZLrW_browserBlockedActions",
			"sandboxStatusOn": "Y3ZLrW_sandboxStatusOn",
			"browserInput": "Y3ZLrW_browserInput",
			"terminalBannerUrl": "Y3ZLrW_terminalBannerUrl",
			"editorError": "Y3ZLrW_editorError",
			"sandboxStatus": "Y3ZLrW_sandboxStatus",
			"standaloneHost": "Y3ZLrW_standaloneHost",
			"sandboxDot": "Y3ZLrW_sandboxDot",
			"sandboxAction": "Y3ZLrW_sandboxAction",
			"editorPlaceholder": "Y3ZLrW_editorPlaceholder",
			"standaloneSurfaceSwitch": "Y3ZLrW_standaloneSurfaceSwitch",
			"browser": "Y3ZLrW_browser",
			"browserBlockedDesc": "Y3ZLrW_browserBlockedDesc",
			"standaloneHeader": "Y3ZLrW_standaloneHeader",
			"browserBlocked": "Y3ZLrW_browserBlocked",
			"sandboxStatusOff": "Y3ZLrW_sandboxStatusOff",
			"standaloneSurfaceBtn": "Y3ZLrW_standaloneSurfaceBtn",
			"terminalDepsBanner": "Y3ZLrW_terminalDepsBanner",
			"terminal": "Y3ZLrW_terminal",
			"iconButton": "Y3ZLrW_iconButton",
			"browserMessage": "Y3ZLrW_browserMessage",
			"browserStart": "Y3ZLrW_browserStart",
			"terminalDepsActions": "Y3ZLrW_terminalDepsActions",
			"terminalBanner": "Y3ZLrW_terminalBanner",
			"terminalDepsHint": "Y3ZLrW_terminalDepsHint",
			"terminalWrap": "Y3ZLrW_terminalWrap"
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
		//#region src/client/prefs.ts
		/** The tab id this plugin registers with dsh-better-sidebar. */
		const POWERDESK_TAB_ID = "dsh-powerdesk:terminal";
		/** The default preferences. */
		const DEFAULT_PREFS$1 = {
			fontFamily: "",
			fontSize: 15,
			ptyBackend: "own",
			themeName: ""
		};
		/** Clamp a font size into the supported range. */
		function clampResttyFontSize(size) {
			if (!Number.isFinite(size)) return 15;
			return Math.min(32, Math.max(8, Math.round(size)));
		}
		/** Merge a partial prefs blob over the defaults, clamping the font size. */
		function mergePrefs(partial) {
			const raw = partial ?? {};
			const fontFamily = typeof raw.fontFamily === "string" ? raw.fontFamily : DEFAULT_PREFS$1.fontFamily;
			const fontSize = typeof raw.fontSize === "number" ? raw.fontSize : DEFAULT_PREFS$1.fontSize;
			const ptyBackend = raw.ptyBackend === "better-sidebar" ? "better-sidebar" : "own";
			const themeName = typeof raw.themeName === "string" ? raw.themeName : DEFAULT_PREFS$1.themeName;
			return {
				fontFamily,
				fontSize: clampResttyFontSize(fontSize),
				ptyBackend,
				themeName
			};
		}
		/** Read prefs from dsh-better-sidebar's store (integrated mode). */
		function readPrefsFromStore(store) {
			const blob = store.getPrefs().pluginSettings?.[POWERDESK_TAB_ID];
			return mergePrefs(typeof blob === "object" && blob !== null ? blob : {});
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
		//#region \0dsh-css:/Users/tengzhang/work/Tools/dsh-powerdesk/src/client/sidebar.module.css.mjs
		const css = ".Z67XTa_toggleCluster{z-index:45;flex-direction:row;gap:4px;display:flex;position:fixed;top:3px;right:10px}.Z67XTa_panel:not(.Z67XTa_panelHidden) .Z67XTa_tabBar{padding-right:72px}.Z67XTa_toggleButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out), color var(--ds-transition-duration-slow) var(--ds-ease-in-out);background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;display:flex}.Z67XTa_toggleButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Z67XTa_toggleButton:disabled{opacity:.4;cursor:default}.Z67XTa_panel{z-index:41;background:var(--dsw-alias-bg-layer-1);border-left:1px solid var(--dsw-alias-border-l2);transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;display:flex;position:fixed;top:0;bottom:0;right:0}.Z67XTa_panelHidden{pointer-events:none;visibility:hidden;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);transform:translate(102%)}.Z67XTa_panel[data-dragging]{transition:none}.Z67XTa_panelResize{cursor:col-resize;z-index:2;touch-action:none;width:8px;position:absolute;top:0;bottom:0;left:-4px}.Z67XTa_panelResizeActive{background:var(--dsw-alias-interactive-bg-hover-accent)}.Z67XTa_panelBody{flex:1;min-width:0;min-height:0;display:flex}.Z67XTa_bottomPanel{z-index:40;background:var(--dsw-alias-bg-layer-1);border-top:1px solid var(--dsw-alias-border-l2);transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), height var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;display:flex;position:fixed;bottom:0;right:0}.Z67XTa_bottomPanelHidden{pointer-events:none;visibility:hidden;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), height var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);transform:translateY(102%)}.Z67XTa_bottomPanel[data-dragging]{transition:none}.Z67XTa_bottomResize{cursor:row-resize;z-index:2;touch-action:none;height:8px;position:absolute;top:-4px;left:0;right:0}.Z67XTa_bottomResizeActive{background:var(--dsw-alias-interactive-bg-hover-accent)}.Z67XTa_bottomClose{z-index:4;width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex;position:absolute;top:3px;right:6px}.Z67XTa_bottomClose:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Z67XTa_bottomPanel .Z67XTa_tabBar{padding-right:40px}body[data-dsh-title-bar-compat] .Z67XTa_toggleCluster{top:calc(var(--dsh-title-bar-strip,40px) + 3px)}body[data-dsh-title-bar-compat] .Z67XTa_panel{padding-top:var(--dsh-title-bar-strip,40px)}.Z67XTa_cornerHandle{left:-6px;bottom:calc(var(--dsh-sidebar-height,0px) + 6px);z-index:2;cursor:nwse-resize;touch-action:none;width:12px;height:12px;position:absolute}.Z67XTa_cornerHandle:hover,.Z67XTa_cornerHandle[data-dragging]{background:var(--dsw-alias-interactive-bg-hover-accent)}.Z67XTa_iconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Z67XTa_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Z67XTa_iconButton:disabled{opacity:.4;cursor:default}.Z67XTa_workbench,.Z67XTa_split{flex:1;min-width:0;min-height:0;display:flex}.Z67XTa_splitRow{flex-direction:row}.Z67XTa_splitCol{flex-direction:column}.Z67XTa_splitChild{display:flex;position:relative;overflow:hidden}.Z67XTa_divider{z-index:3;touch-action:none;flex:none;position:relative}.Z67XTa_dividerRow:after,.Z67XTa_dividerCol:after{content:\"\";background:var(--dsw-alias-border-l2);transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out);position:absolute}.Z67XTa_dividerRow{cursor:col-resize;width:7px;margin:0 -2px}.Z67XTa_dividerRow:after{width:1px;top:0;bottom:0;left:50%;transform:translate(-50%)}.Z67XTa_dividerCol{cursor:row-resize;height:7px;margin:-2px 0}.Z67XTa_dividerCol:after{height:1px;top:50%;left:0;right:0;transform:translateY(-50%)}.Z67XTa_divider:hover:after,.Z67XTa_dividerActive:after{background:var(--dsw-alias-interactive-bg-hover-accent)}.Z67XTa_pane{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;position:relative}.Z67XTa_paneDrop{outline:1px solid var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}.Z67XTa_dropOverlay{z-index:6;pointer-events:none;background:var(--dsw-alias-interactive-bg-hover-accent);opacity:.5;position:absolute}.Z67XTa_dropLeft{width:25%;top:0;bottom:0;left:0}.Z67XTa_dropRight{width:25%;top:0;bottom:0;right:0}.Z67XTa_dropUp{height:25%;top:0;left:0;right:0}.Z67XTa_dropDown{height:25%;bottom:0;left:0;right:0}.Z67XTa_dropCenter{outline:2px dashed var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-2px;background:0 0;inset:25%}.Z67XTa_paneContent{flex-direction:column;flex:1;min-height:0;display:flex;overflow:hidden}.Z67XTa_paneTab{flex-direction:column;flex:1;min-height:0;display:flex}.Z67XTa_paneTabHidden{display:none}.Z67XTa_paneEmptyCards{flex:1;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));align-content:start;gap:8px;min-height:0;padding:12px;display:grid;overflow:hidden}.Z67XTa_paneCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-width:0;color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-strong-12);cursor:pointer;text-align:center;border-radius:8px;flex-direction:column;justify-content:center;align-items:center;gap:6px;padding:12px 8px;display:flex}.Z67XTa_paneCard:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2)}.Z67XTa_paneCard:disabled{opacity:.45;cursor:default}.Z67XTa_tabBar{border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);flex:none;align-items:stretch;height:34px;display:flex}.Z67XTa_tabBarDrop{outline:1px dashed var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}.Z67XTa_tabList{scrollbar-width:none;flex:1;min-width:0;display:flex;overflow-x:auto}.Z67XTa_tabList::-webkit-scrollbar{display:none}.Z67XTa_tab{min-width:64px;max-width:160px;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);border-right:1px solid var(--dsw-alias-border-l1);cursor:pointer;user-select:none;background:0 0;flex:none;align-items:center;gap:4px;padding:0 4px 0 10px;display:flex}.Z67XTa_tab:hover{background:var(--dsw-alias-interactive-bg-hover)}.Z67XTa_tabActive{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-active)}.Z67XTa_tabTitle{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Z67XTa_tabBadge{min-width:16px;height:15px;font:var(--dsw-font-xxxs-strong-11);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-brand-primary);border-radius:8px;flex:none;justify-content:center;align-items:center;padding:0 4px;display:inline-flex}.Z67XTa_tabClose{width:18px;height:18px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:4px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Z67XTa_tabClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Z67XTa_tabBarPlus{background:var(--dsw-alias-bg-layer-1);width:22px;height:22px;color:var(--dsw-alias-label-tertiary);cursor:pointer;border:none;border-radius:5px;flex:none;justify-content:center;align-self:center;align-items:center;margin:0 6px;padding:0;display:inline-flex;position:sticky;right:0}.Z67XTa_tabBarPlus:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Z67XTa_explorer{flex-direction:column;flex:1;min-height:0;display:flex}.Z67XTa_explorerHeader{flex:none;justify-content:space-between;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Z67XTa_explorerRoot{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Z67XTa_explorerBody{flex:1;min-height:0;padding:2px 6px 8px;overflow:hidden auto}.Z67XTa_explorerRow{width:100%;min-width:0;height:34px;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);text-align:left;cursor:pointer;white-space:nowrap;animation:Z67XTa_dsh-row-in .15s var(--ds-ease-in-out);background:0 0;border:none;border-radius:8px;align-items:center;gap:6px;padding:0 8px;display:flex;overflow:hidden}.Z67XTa_explorerRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Z67XTa_explorerDir{font:var(--dsw-font-s-strong-14)}.Z67XTa_explorerRowActive{background:var(--dsw-alias-interactive-bg-hover)}.Z67XTa_explorerHidden{opacity:.45}.Z67XTa_explorerSymlink{color:var(--dsw-alias-label-tertiary);flex:none}.Z67XTa_explorerBroken .Z67XTa_explorerName{color:var(--dsw-alias-state-error-primary)}.Z67XTa_explorerName{text-overflow:ellipsis;flex:1;min-width:0;overflow:hidden}.Z67XTa_explorerRef{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;align-items:center;padding:0 8px;display:none}.Z67XTa_explorerRef:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Z67XTa_explorerRow:hover .Z67XTa_explorerRef,.Z67XTa_explorerRow:focus-within .Z67XTa_explorerRef{display:inline-flex}.Z67XTa_explorerPill{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;align-items:center;padding:0 8px;display:inline-flex}.Z67XTa_explorerPill:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Z67XTa_explorerPill:disabled{opacity:.4;cursor:default}.Z67XTa_explorerCopied{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);flex:none}.Z67XTa_explorerError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);cursor:default}@keyframes Z67XTa_dsh-row-in{0%{opacity:0}}.Z67XTa_explorerEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;padding:16px}.Z67XTa_editor{flex-direction:column;flex:1;min-height:0;display:flex}.Z67XTa_editorHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:6px;padding:4px 8px;display:flex}.Z67XTa_editorTitle{min-width:0;font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;flex:1;overflow:hidden}.Z67XTa_editorStatus{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary)}.Z67XTa_editorStatusError{color:var(--dsw-alias-state-error-primary)}.Z67XTa_dirtyDot{background:var(--dsw-alias-state-warn-primary);border-radius:50%;flex:none;width:7px;height:7px}.Z67XTa_editorPlaceholder{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;flex:1;justify-content:center;align-items:center;padding:16px;display:flex}.Z67XTa_orphanedType{opacity:.7;overflow-wrap:anywhere;margin-top:8px;font-size:12px;display:block}.Z67XTa_editorBinary{text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:12px;padding:24px 16px;display:flex}.Z67XTa_editorBinaryNotice{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Z67XTa_editorDownloadLink{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-strong-12);cursor:pointer;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out), border-color var(--ds-transition-duration-slow) var(--ds-ease-in-out);border-radius:6px;align-items:center;gap:6px;padding:6px 14px;text-decoration:none;display:inline-flex}.Z67XTa_editorDownloadLink:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l2)}.Z67XTa_editorError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);padding:12px 16px}.Z67XTa_editorBanner{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex:none;padding:4px 12px}.Z67XTa_sandboxStatus{font:var(--dsw-font-xxxs-11);flex:none;align-items:center;gap:8px;padding:4px 10px;display:flex}.Z67XTa_sandboxStatusOn{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-bottom:1px solid var(--dsw-alias-border-l1)}.Z67XTa_sandboxStatusOff{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);border-bottom:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, transparent)}.Z67XTa_sandboxDot{background:var(--dsw-alias-state-success-primary);border-radius:50%;flex:none;width:6px;height:6px}.Z67XTa_sandboxStatusOff .Z67XTa_sandboxDot{background:var(--dsw-alias-state-error-primary)}.Z67XTa_sandboxStatusText{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Z67XTa_sandboxAction{border:1px solid var(--dsw-alias-border-l2);font:inherit;color:inherit;cursor:pointer;background:0 0;border-radius:6px;flex:none;padding:2px 8px}.Z67XTa_sandboxAction:hover{background:var(--dsw-alias-interactive-bg-hover)}.Z67XTa_editorHtml{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Z67XTa_browser{flex-direction:column;flex:1;min-height:0;display:flex}.Z67XTa_browserBar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:4px;padding:6px 8px;display:flex}.Z67XTa_browserInput{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-width:0;height:28px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:6px;flex:1;padding:0 10px}.Z67XTa_browserInput:focus{border-color:var(--dsw-alias-border-l2);outline:none}.Z67XTa_browserMessage{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex:none;padding:4px 12px}.Z67XTa_browserFrame{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Z67XTa_browserStart{text-align:center;min-height:0;font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);flex:1;justify-content:center;align-items:center;padding:20px;display:flex}.Z67XTa_browserBlocked{text-align:center;min-height:0;color:var(--dsw-alias-state-warn-primary);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:6px;padding:24px;display:flex}.Z67XTa_browserBlockedTitle{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary)}.Z67XTa_browserBlockedDesc{max-width:280px;font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-secondary)}.Z67XTa_browserBlockedActions{gap:8px;margin-top:6px;display:flex}.Z67XTa_browserBlockedButton{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxxs-11);cursor:pointer;border-radius:6px;padding:4px 12px}.Z67XTa_browserBlockedButton:hover{background:var(--dsw-alias-interactive-bg-hover)}.Z67XTa_editorCm{background:0 0;flex:1;min-height:0;overflow:hidden}.Z67XTa_editorCmHidden{display:none}.Z67XTa_editorCm .cm-editor{height:100%}.Z67XTa_editorCm .cm-editor.cm-focused{outline:none}.Z67XTa_editorModeToggle{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:6px;flex:none;align-items:center;gap:2px;padding:2px;display:inline-flex}.Z67XTa_editorModeButton{color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-11);cursor:pointer;background:0 0;border:none;border-radius:4px;padding:2px 8px}.Z67XTa_editorModeButton:hover{color:var(--dsw-alias-label-primary)}.Z67XTa_editorModeActive{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}.Z67XTa_editorImageWrap{flex:1;justify-content:center;align-items:center;min-height:0;padding:12px;display:flex;overflow:auto}.Z67XTa_editorImage{object-fit:contain;max-width:100%;max-height:100%}.Z67XTa_editorMd{min-height:0;font:var(--dsw-font-xs-13);flex:1;padding:10px 14px;overflow-y:auto}.Z67XTa_selectionPopup{z-index:60;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:28px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxxs-strong-11);white-space:nowrap;cursor:pointer;border-radius:6px;align-items:center;padding:0 10px;display:inline-flex;position:fixed;transform:translate(-50%,calc(-100% - 8px))}.Z67XTa_selectionPopup:hover{background:var(--dsw-alias-interactive-bg-hover)}.Z67XTa_editorPdf{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-height:0;display:flex}.Z67XTa_editorPdfToolbar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:flex-end;padding:6px 8px;display:flex}.Z67XTa_editorPdfStage{flex:1;min-height:0;display:flex;position:relative}.Z67XTa_editorPdfFrame{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Z67XTa_editorPdfFrameBlocked{pointer-events:none}.Z67XTa_editorPdfDragShield{z-index:4;pointer-events:none;background:0 0;position:absolute;inset:0}.Z67XTa_editorPdfDragShieldActive{pointer-events:auto}body[data-dsh-tab-dragging] .Z67XTa_editorPdfFrame{pointer-events:none!important}body[data-dsh-tab-dragging] .Z67XTa_editorPdfDragShield{pointer-events:auto!important}.Z67XTa_terminalWrap{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-height:0;display:flex;position:relative}.Z67XTa_terminal{flex:1;min-height:0;padding:6px 4px 6px 8px}.Z67XTa_terminal .xterm{height:100%}.Z67XTa_terminalBanner{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex-wrap:wrap;flex:none;align-items:center;gap:8px;padding:3px 10px;display:flex}.Z67XTa_terminalBannerUrl{word-break:break-all;opacity:.85;flex-basis:100%;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.Z67XTa_boundaryError{z-index:50;background:var(--dsw-alias-bg-layer-1);border-left:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);flex-direction:column;align-items:flex-start;gap:8px;padding:16px;display:flex;position:fixed;top:0;bottom:0;right:0;overflow:auto}.Z67XTa_terminalRetry{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;padding:1px 8px}.Z67XTa_terminalRetry:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Z67XTa_terminalDepsBanner{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex-direction:column;flex:none;gap:6px;padding:10px;display:flex}.Z67XTa_terminalDepsTitle{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-state-warn-primary)}.Z67XTa_terminalDepsHint{opacity:.9}.Z67XTa_terminalDepsCommandRow{align-items:flex-start;gap:8px;display:flex}.Z67XTa_terminalRepairCommand{white-space:pre-wrap;word-break:break-all;user-select:text;min-width:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:4px;flex:1;max-height:160px;margin:0;padding:6px 8px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.5;overflow:auto}.Z67XTa_terminalDepsNote{opacity:.85}.Z67XTa_terminalDepsActions{align-items:center;gap:8px;display:flex}.Z67XTa_tabBoundaryError{min-height:0;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);flex-direction:column;flex:1;align-items:flex-start;gap:8px;padding:12px 16px;display:flex;overflow:auto}.Z67XTa_git{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden auto}.Z67XTa_gitHeader{flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Z67XTa_gitBranchSelect{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);min-width:0;height:26px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:6px;flex:1;padding:0 6px}.Z67XTa_gitSection{border-top:1px solid var(--dsw-alias-border-l1)}.Z67XTa_gitSectionHeader{font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-label-tertiary);text-transform:uppercase;justify-content:space-between;align-items:center;padding:6px 12px 4px;display:flex}.Z67XTa_gitLink{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-brand-primary);cursor:pointer;background:0 0;border:none;padding:0}.Z67XTa_gitLink:hover:not(:disabled){text-decoration:underline}.Z67XTa_gitLink:disabled{opacity:.4;cursor:default}.Z67XTa_gitRow{min-height:34px;animation:Z67XTa_dsh-row-in .15s var(--ds-ease-in-out);border-radius:8px;align-items:center;gap:6px;margin:0 6px;padding:0 8px;display:flex}.Z67XTa_gitRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Z67XTa_gitRowSelected{background:var(--dsw-alias-interactive-bg-active)}.Z67XTa_gitRowMain{cursor:pointer;text-align:left;background:0 0;border:none;flex:1;align-items:center;gap:8px;min-width:0;padding:3px 0;display:flex}.Z67XTa_gitBadge{width:20px;height:16px;font:var(--dsw-font-xxxs-strong-11);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);border-radius:4px;flex:none;justify-content:center;align-items:center;display:inline-flex}.Z67XTa_gitName{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Z67XTa_gitEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);padding:4px 12px 8px}.Z67XTa_gitPlaceholder{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;padding:16px}.Z67XTa_gitError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);white-space:pre-wrap;padding:8px 12px}.Z67XTa_gitDiff{border-top:1px solid var(--dsw-alias-border-l1);padding:8px}.Z67XTa_gitDiffTab{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden auto}.Z67XTa_gitDiffTabHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Z67XTa_gitDiffTabTitle{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Z67XTa_gitDiffFile{align-items:baseline;gap:6px;padding:8px 2px 2px;display:flex}.Z67XTa_gitDiffFilePath{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Z67XTa_gitDiffFileOld{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;flex:none;max-width:40%;overflow:hidden}.Z67XTa_gitDiffFileTag{border:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;padding:0 6px}.Z67XTa_gitDiffHunk{font:var(--dsw-font-markdown-code-block-small);color:var(--dsw-alias-label-tertiary);gap:8px;padding:3px 2px;display:flex}.Z67XTa_gitDiffHunkHeader{color:var(--dsw-alias-label-secondary);flex:none}.Z67XTa_gitDiffHunkSection{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Z67XTa_gitDiffLine{font:var(--dsw-font-markdown-code-block-small);white-space:pre-wrap;overflow-wrap:anywhere;align-items:stretch;min-width:0;line-height:20px;display:flex}.Z67XTa_gitDiffNum{text-align:right;width:36px;color:var(--dsw-alias-label-tertiary);user-select:none;flex:none;padding-right:8px}.Z67XTa_gitDiffCode{flex:1;min-width:0;overflow:visible}.Z67XTa_gitDiffCtx{color:var(--dsw-alias-label-primary)}.Z67XTa_gitDiffDel{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent)}.Z67XTa_gitDiffAdd{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent)}.Z67XTa_gitDiffMeta{padding-left:2px}.Z67XTa_gitDiffMetaText{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);font-style:italic}.Z67XTa_gitDiffExpand{width:100%;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-brand-primary);cursor:pointer;text-align:center;background:0 0;border:none;margin:4px 0;display:block}.Z67XTa_gitDiffExpand:hover{background:var(--dsw-alias-interactive-bg-hover)}.Z67XTa_gitConfirmDesc{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);white-space:pre-wrap;margin:0}.Z67XTa_gitCommit{border-top:1px solid var(--dsw-alias-border-l1);align-items:center;gap:6px;padding:8px 12px;display:flex}.Z67XTa_gitCommitInput{flex:1;min-width:0}.Z67XTa_gitCommitButton{background:var(--dsw-alias-button-primary-fill);height:26px;color:var(--dsw-alias-label-primary-inverted);font:var(--dsw-font-xxs-strong-12);cursor:pointer;border:none;border-radius:6px;flex:none;padding:0 12px}.Z67XTa_gitCommitButton:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}.Z67XTa_gitCommitButton:disabled{opacity:.45;cursor:default}.Z67XTa_gitLogRow{cursor:pointer;border-radius:8px;flex-direction:column;gap:2px;padding:5px 12px;display:flex}.Z67XTa_gitLogRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Z67XTa_gitLogLine1{align-items:baseline;gap:8px;min-width:0;display:flex}.Z67XTa_gitLogHash{font:var(--dsw-font-markdown-code-block-small);color:var(--dsw-alias-label-tertiary);flex:none}.Z67XTa_gitLogLine2{flex-wrap:wrap;align-items:center;gap:6px;min-width:0;display:flex}.Z67XTa_gitLogRef{border:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-brand-primary);white-space:nowrap;border-radius:999px;flex:none;padding:0 5px}.Z67XTa_gitLogSubject{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Z67XTa_gitLogMeta{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary)}.Z67XTa_gitLogMore{border:1px solid var(--dsw-alias-border-l2);width:calc(100% - 24px);font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border-radius:6px;margin:4px 12px 8px;padding:6px 0;display:block}.Z67XTa_gitLogMore:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Z67XTa_gitLogMore:disabled{opacity:.5;cursor:default}.Z67XTa_producedRow{flex-wrap:wrap;align-items:center;gap:8px;padding:4px 0;display:flex}.Z67XTa_producedLabel{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Z67XTa_producedChip{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);max-width:200px;color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;border-radius:999px;align-items:center;gap:4px;padding:2px 8px;display:inline-flex;overflow:hidden}.Z67XTa_producedChip:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Z67XTa_producedChip span{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Z67XTa_producedMore{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Z67XTa_toggleButton:focus-visible,.Z67XTa_bottomClose:focus-visible,.Z67XTa_iconButton:focus-visible,.Z67XTa_tab:focus-visible,.Z67XTa_tabClose:focus-visible,.Z67XTa_tabBarPlus:focus-visible,.Z67XTa_paneCard:focus-visible,.Z67XTa_explorerRow:focus-visible,.Z67XTa_explorerRef:focus-visible,.Z67XTa_gitRowMain:focus-visible,.Z67XTa_gitLink:focus-visible,.Z67XTa_gitCommitButton:focus-visible,.Z67XTa_gitLogRow:focus-visible,.Z67XTa_gitLogMore:focus-visible,.Z67XTa_gitDiffExpand:focus-visible,.Z67XTa_terminalRetry:focus-visible,.Z67XTa_editorModeButton:focus-visible,.Z67XTa_editorDownloadLink:focus-visible,.Z67XTa_editorPptxButton:focus-visible,.Z67XTa_editorDocxZoomRange:focus-visible{outline:2px solid var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}@media (prefers-reduced-motion:reduce){.Z67XTa_panel,.Z67XTa_panelHidden,.Z67XTa_bottomPanel,.Z67XTa_bottomPanelHidden,.Z67XTa_toggleCluster,.Z67XTa_toggleButton,.Z67XTa_tab,.Z67XTa_tabBarPlus,.Z67XTa_paneCard,.Z67XTa_explorerRow,.Z67XTa_gitRow,.Z67XTa_divider,.Z67XTa_dividerRow:after,.Z67XTa_dividerCol:after{transition:none;animation:none}}@media (width<=767px){.Z67XTa_panel:not(.Z67XTa_panelHidden) .Z67XTa_tabBar{padding-right:40px}.Z67XTa_tab{min-width:48px;max-width:128px}}.Z67XTa_settingsIntro{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);margin:0 0 12px}.Z67XTa_settingsGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;display:grid}.Z67XTa_settingsCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);cursor:pointer;text-align:left;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out);border-radius:12px;flex-direction:column;gap:8px;padding:14px;display:flex;position:relative}.Z67XTa_settingsCard:hover{background:var(--dsw-alias-interactive-bg-hover)}.Z67XTa_settingsCardIcon{background:var(--dsw-alias-bg-layer-2);width:32px;height:32px;color:var(--dsw-alias-label-primary);border-radius:9px;justify-content:center;align-items:center;display:flex}.Z67XTa_settingsCardTitle{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary)}.Z67XTa_settingsCardSubtitle{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Z67XTa_settingsCardToggle{border:1px solid var(--dsw-alias-border-l2);color:#0000;cursor:pointer;background:0 0;border-radius:50%;justify-content:center;align-items:center;width:22px;height:22px;display:flex;position:absolute;top:12px;right:12px}.Z67XTa_settingsCardToggleOn{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);border-color:#0000}.Z67XTa_settingsHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:12px 0 0}.Z67XTa_settingsMissing{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-radius:10px;margin:0;padding:12px}.Z67XTa_notesRoot{flex:1;min-height:0;display:flex}.Z67XTa_notesTree{flex-direction:column;flex:none;min-width:0;display:flex;overflow:hidden}.Z67XTa_notesEditor{flex-direction:column;flex:1;min-width:0;display:flex}.Z67XTa_notesBindPrompt{text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:10px;padding:24px;display:flex}.Z67XTa_folderPickerPath{border-bottom:1px solid var(--dsw-alias-border-l1);align-items:center;gap:8px;margin-bottom:4px;padding-bottom:10px;display:flex}.Z67XTa_folderPickerList{height:320px;overflow:hidden auto}.Z67XTa_folderPickerFooter{justify-content:flex-end;gap:8px;display:flex}";
		const tagId = "dsh-powerdesk/sidebar.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-powerdesk";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var sidebar_module_css_default = {
			"orphanedType": "Z67XTa_orphanedType",
			"panelHidden": "Z67XTa_panelHidden",
			"bottomClose": "Z67XTa_bottomClose",
			"editorHtml": "Z67XTa_editorHtml",
			"dropOverlay": "Z67XTa_dropOverlay",
			"terminalDepsHint": "Z67XTa_terminalDepsHint",
			"browserMessage": "Z67XTa_browserMessage",
			"gitDiffTabTitle": "Z67XTa_gitDiffTabTitle",
			"gitBadge": "Z67XTa_gitBadge",
			"terminalBanner": "Z67XTa_terminalBanner",
			"gitEmpty": "Z67XTa_gitEmpty",
			"gitDiffFileOld": "Z67XTa_gitDiffFileOld",
			"gitDiffHunkHeader": "Z67XTa_gitDiffHunkHeader",
			"terminalDepsActions": "Z67XTa_terminalDepsActions",
			"editorCm": "Z67XTa_editorCm",
			"git": "Z67XTa_git",
			"panel": "Z67XTa_panel",
			"gitLogLine1": "Z67XTa_gitLogLine1",
			"tabBadge": "Z67XTa_tabBadge",
			"editorPptxButton": "Z67XTa_editorPptxButton",
			"panelResize": "Z67XTa_panelResize",
			"editorModeActive": "Z67XTa_editorModeActive",
			"explorerRoot": "Z67XTa_explorerRoot",
			"notesRoot": "Z67XTa_notesRoot",
			"gitDiffHunkSection": "Z67XTa_gitDiffHunkSection",
			"explorerName": "Z67XTa_explorerName",
			"editorPdfStage": "Z67XTa_editorPdfStage",
			"gitPlaceholder": "Z67XTa_gitPlaceholder",
			"dropLeft": "Z67XTa_dropLeft",
			"producedRow": "Z67XTa_producedRow",
			"sandboxDot": "Z67XTa_sandboxDot",
			"bottomResizeActive": "Z67XTa_bottomResizeActive",
			"dropUp": "Z67XTa_dropUp",
			"editorPdf": "Z67XTa_editorPdf",
			"tabBar": "Z67XTa_tabBar",
			"tabBarDrop": "Z67XTa_tabBarDrop",
			"explorerDir": "Z67XTa_explorerDir",
			"gitRowSelected": "Z67XTa_gitRowSelected",
			"dsh-row-in": "Z67XTa_dsh-row-in",
			"editorPdfFrameBlocked": "Z67XTa_editorPdfFrameBlocked",
			"gitLink": "Z67XTa_gitLink",
			"editor": "Z67XTa_editor",
			"gitCommit": "Z67XTa_gitCommit",
			"settingsGrid": "Z67XTa_settingsGrid",
			"editorPdfToolbar": "Z67XTa_editorPdfToolbar",
			"dropRight": "Z67XTa_dropRight",
			"split": "Z67XTa_split",
			"iconButton": "Z67XTa_iconButton",
			"editorPdfDragShield": "Z67XTa_editorPdfDragShield",
			"dividerActive": "Z67XTa_dividerActive",
			"explorerSymlink": "Z67XTa_explorerSymlink",
			"editorStatus": "Z67XTa_editorStatus",
			"editorDownloadLink": "Z67XTa_editorDownloadLink",
			"settingsCardToggle": "Z67XTa_settingsCardToggle",
			"paneContent": "Z67XTa_paneContent",
			"explorerBody": "Z67XTa_explorerBody",
			"editorCmHidden": "Z67XTa_editorCmHidden",
			"gitRowMain": "Z67XTa_gitRowMain",
			"gitDiffMetaText": "Z67XTa_gitDiffMetaText",
			"gitConfirmDesc": "Z67XTa_gitConfirmDesc",
			"gitCommitInput": "Z67XTa_gitCommitInput",
			"settingsIntro": "Z67XTa_settingsIntro",
			"explorerPill": "Z67XTa_explorerPill",
			"gitLogMore": "Z67XTa_gitLogMore",
			"gitDiffTab": "Z67XTa_gitDiffTab",
			"tabBarPlus": "Z67XTa_tabBarPlus",
			"gitHeader": "Z67XTa_gitHeader",
			"gitDiffExpand": "Z67XTa_gitDiffExpand",
			"gitLogHash": "Z67XTa_gitLogHash",
			"gitLogMeta": "Z67XTa_gitLogMeta",
			"tabActive": "Z67XTa_tabActive",
			"gitSectionHeader": "Z67XTa_gitSectionHeader",
			"explorerRef": "Z67XTa_explorerRef",
			"tabBoundaryError": "Z67XTa_tabBoundaryError",
			"producedLabel": "Z67XTa_producedLabel",
			"editorHeader": "Z67XTa_editorHeader",
			"gitDiffAdd": "Z67XTa_gitDiffAdd",
			"settingsCardToggleOn": "Z67XTa_settingsCardToggleOn",
			"dropDown": "Z67XTa_dropDown",
			"producedMore": "Z67XTa_producedMore",
			"gitDiffCode": "Z67XTa_gitDiffCode",
			"sandboxStatusOn": "Z67XTa_sandboxStatusOn",
			"splitCol": "Z67XTa_splitCol",
			"terminalWrap": "Z67XTa_terminalWrap",
			"gitRow": "Z67XTa_gitRow",
			"bottomPanelHidden": "Z67XTa_bottomPanelHidden",
			"gitDiffHunk": "Z67XTa_gitDiffHunk",
			"terminalDepsNote": "Z67XTa_terminalDepsNote",
			"explorerRowActive": "Z67XTa_explorerRowActive",
			"gitDiffFilePath": "Z67XTa_gitDiffFilePath",
			"browserBlockedDesc": "Z67XTa_browserBlockedDesc",
			"explorerError": "Z67XTa_explorerError",
			"selectionPopup": "Z67XTa_selectionPopup",
			"terminalRetry": "Z67XTa_terminalRetry",
			"gitDiffTabHeader": "Z67XTa_gitDiffTabHeader",
			"editorDocxZoomRange": "Z67XTa_editorDocxZoomRange",
			"terminalDepsBanner": "Z67XTa_terminalDepsBanner",
			"gitDiffMeta": "Z67XTa_gitDiffMeta",
			"browserBar": "Z67XTa_browserBar",
			"settingsHint": "Z67XTa_settingsHint",
			"settingsCardIcon": "Z67XTa_settingsCardIcon",
			"gitDiffDel": "Z67XTa_gitDiffDel",
			"terminal": "Z67XTa_terminal",
			"cornerHandle": "Z67XTa_cornerHandle",
			"editorBinary": "Z67XTa_editorBinary",
			"tabList": "Z67XTa_tabList",
			"boundaryError": "Z67XTa_boundaryError",
			"settingsMissing": "Z67XTa_settingsMissing",
			"browserFrame": "Z67XTa_browserFrame",
			"bottomPanel": "Z67XTa_bottomPanel",
			"gitDiffNum": "Z67XTa_gitDiffNum",
			"sandboxAction": "Z67XTa_sandboxAction",
			"editorPdfFrame": "Z67XTa_editorPdfFrame",
			"gitDiffLine": "Z67XTa_gitDiffLine",
			"gitCommitButton": "Z67XTa_gitCommitButton",
			"gitLogRef": "Z67XTa_gitLogRef",
			"notesTree": "Z67XTa_notesTree",
			"notesBindPrompt": "Z67XTa_notesBindPrompt",
			"dividerCol": "Z67XTa_dividerCol",
			"folderPickerList": "Z67XTa_folderPickerList",
			"panelBody": "Z67XTa_panelBody",
			"sandboxStatus": "Z67XTa_sandboxStatus",
			"tabTitle": "Z67XTa_tabTitle",
			"browserInput": "Z67XTa_browserInput",
			"gitDiffFile": "Z67XTa_gitDiffFile",
			"gitLogSubject": "Z67XTa_gitLogSubject",
			"splitChild": "Z67XTa_splitChild",
			"explorerHidden": "Z67XTa_explorerHidden",
			"paneCard": "Z67XTa_paneCard",
			"paneEmptyCards": "Z67XTa_paneEmptyCards",
			"paneDrop": "Z67XTa_paneDrop",
			"sandboxStatusText": "Z67XTa_sandboxStatusText",
			"bottomResize": "Z67XTa_bottomResize",
			"splitRow": "Z67XTa_splitRow",
			"sandboxStatusOff": "Z67XTa_sandboxStatusOff",
			"browser": "Z67XTa_browser",
			"panelResizeActive": "Z67XTa_panelResizeActive",
			"workbench": "Z67XTa_workbench",
			"editorStatusError": "Z67XTa_editorStatusError",
			"browserBlockedTitle": "Z67XTa_browserBlockedTitle",
			"editorModeToggle": "Z67XTa_editorModeToggle",
			"editorImageWrap": "Z67XTa_editorImageWrap",
			"editorMd": "Z67XTa_editorMd",
			"terminalBannerUrl": "Z67XTa_terminalBannerUrl",
			"dirtyDot": "Z67XTa_dirtyDot",
			"terminalDepsCommandRow": "Z67XTa_terminalDepsCommandRow",
			"gitBranchSelect": "Z67XTa_gitBranchSelect",
			"producedChip": "Z67XTa_producedChip",
			"settingsCard": "Z67XTa_settingsCard",
			"settingsCardTitle": "Z67XTa_settingsCardTitle",
			"gitDiffCtx": "Z67XTa_gitDiffCtx",
			"gitLogLine2": "Z67XTa_gitLogLine2",
			"paneTab": "Z67XTa_paneTab",
			"explorerBroken": "Z67XTa_explorerBroken",
			"dropCenter": "Z67XTa_dropCenter",
			"gitDiff": "Z67XTa_gitDiff",
			"settingsCardSubtitle": "Z67XTa_settingsCardSubtitle",
			"folderPickerPath": "Z67XTa_folderPickerPath",
			"browserBlockedActions": "Z67XTa_browserBlockedActions",
			"tab": "Z67XTa_tab",
			"editorModeButton": "Z67XTa_editorModeButton",
			"editorPdfDragShieldActive": "Z67XTa_editorPdfDragShieldActive",
			"editorBinaryNotice": "Z67XTa_editorBinaryNotice",
			"terminalDepsTitle": "Z67XTa_terminalDepsTitle",
			"terminalRepairCommand": "Z67XTa_terminalRepairCommand",
			"gitLogRow": "Z67XTa_gitLogRow",
			"paneTabHidden": "Z67XTa_paneTabHidden",
			"toggleCluster": "Z67XTa_toggleCluster",
			"folderPickerFooter": "Z67XTa_folderPickerFooter",
			"toggleButton": "Z67XTa_toggleButton",
			"gitDiffFileTag": "Z67XTa_gitDiffFileTag",
			"browserStart": "Z67XTa_browserStart",
			"divider": "Z67XTa_divider",
			"browserBlockedButton": "Z67XTa_browserBlockedButton",
			"editorTitle": "Z67XTa_editorTitle",
			"gitError": "Z67XTa_gitError",
			"explorer": "Z67XTa_explorer",
			"dividerRow": "Z67XTa_dividerRow",
			"tabClose": "Z67XTa_tabClose",
			"gitName": "Z67XTa_gitName",
			"explorerRow": "Z67XTa_explorerRow",
			"pane": "Z67XTa_pane",
			"editorImage": "Z67XTa_editorImage",
			"gitSection": "Z67XTa_gitSection",
			"explorerEmpty": "Z67XTa_explorerEmpty",
			"notesEditor": "Z67XTa_notesEditor",
			"editorBanner": "Z67XTa_editorBanner",
			"browserBlocked": "Z67XTa_browserBlocked",
			"editorError": "Z67XTa_editorError",
			"explorerCopied": "Z67XTa_explorerCopied",
			"explorerHeader": "Z67XTa_explorerHeader",
			"editorPlaceholder": "Z67XTa_editorPlaceholder"
		};
		//#endregion
		//#region src/client/TabBar.tsx
		/**
		* The tab strip of one pane: tabs capped at TAB_MAX_WIDTH (ellipsized),
		* overflow scrolls horizontally, a close button per tab, a four-way split
		* button cluster, and the + menu that opens new tabs (explorer / git /
		* terminal). Tabs are draggable; dropping onto another tab inserts before it,
		* dropping on the strip background appends to this pane.
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
			const { paneId, tabs, active, onActivate, onClose, onNewTab, newTabOptions, onDropTab, getTabIcon, getTabBadge } = props;
			const [menuOpen, setMenuOpen] = (0, react.useState)(false);
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
					children: [tabs.map((tab) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
					}, tab.id)), newTabOptions.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
						open: menuOpen,
						onClose: () => {
							setMenuOpen(false);
						},
						items: newTabOptions.map((option) => ({
							id: option.id,
							label: option.label,
							...option.disabled === true ? { disabled: true } : {},
							...option.icon !== void 0 ? { icon: option.icon } : {}
						})),
						onSelect: (id) => {
							onNewTab(id);
							setMenuOpen(false);
						},
						portal: true,
						align: "end",
						anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: sidebar_module_css_default.tabBarPlus,
							"aria-label": t("newTab"),
							title: t("newTab"),
							onClick: () => {
								setMenuOpen((v) => !v);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, {})
						})
					})]
				})
			});
		}
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
			const { leaf, ctx, store, service, cwd, panelOpen, newTabOptions, onNewTab } = props;
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
			const isFileOnlyPane = leaf.tabs.length > 0 && leaf.tabs.every((tab) => tab.type === "editor");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: clsx(sidebar_module_css_default.pane, dropZone !== null && sidebar_module_css_default.paneDrop),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TabBar, {
					paneId: leaf.id,
					tabs: leaf.tabs,
					active: leaf.active,
					onActivate: (tabId) => {
						store.reduce((s) => activateTab(s, leaf.id, tabId));
					},
					onClose: (tabId) => {
						store.reduce((s) => closeTab(s, leaf.id, tabId));
					},
					onNewTab: onNewTabHere,
					newTabOptions: isFileOnlyPane ? [] : newTabOptions,
					getTabIcon: tabIconOf,
					onDropTab: (payload, before) => {
						const index = before === null ? -1 : leaf.tabs.findIndex((tab) => tab.id === before);
						store.reduce((s) => moveTab(s, payload.paneId, payload.tabId, leaf.id, index));
					}
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
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: sidebar_module_css_default.paneEmptyCards,
					children: newTabOptions.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: sidebar_module_css_default.paneCard,
						disabled: option.disabled === true,
						title: option.label,
						onClick: () => {
							onNewTabHere(option.id);
						},
						children: [option.icon ?? null, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: option.label })]
					}, option.id))
				})]
			});
		}
		/** Recursive split-tree renderer: a leaf becomes a pane, a split becomes a
		*  flex row/col of children with draggable dividers between them. */
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
						...rest
					})
				})] }, child.id))
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
			(0, react.useEffect)(() => {
				const hostRoot = document.getElementById("root");
				if (hostRoot === null) return;
				hostRoot.style.transition = draggingWidth || draggingHeight ? "none" : "margin-right var(--ds-transition-duration-slow) var(--ds-ease-in-out), margin-bottom var(--ds-transition-duration-slow) var(--ds-ease-in-out)";
				hostRoot.style.marginRight = collapsed ? "0px" : `${String(state?.width ?? 0)}px`;
				hostRoot.style.marginBottom = bottomOpen ? `${String(state?.bottomHeight ?? 0)}px` : "0px";
				return () => {
					hostRoot.style.marginRight = "";
					hostRoot.style.marginBottom = "";
					hostRoot.style.transition = "";
				};
			}, [
				collapsed,
				state?.width,
				bottomOpen,
				state?.bottomHeight,
				draggingWidth,
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
				return service.getTabs().filter((descriptor) => descriptor.hidden !== true && service.isTabEnabled(descriptor.id)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((descriptor) => ({
					id: descriptor.id,
					label: typeof descriptor.title === "function" ? descriptor.title() : descriptor.title,
					disabled: descriptor.available?.(ctx, scope, state) === false,
					icon: typeof descriptor.icon === "function" ? descriptor.icon(16) : descriptor.icon
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
							onNewTab
						})
					})]
				}),
				state !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					ref: bottomPanelRef,
					className: clsx(sidebar_module_css_default.bottomPanel, !bottomOpen && sidebar_module_css_default.bottomPanelHidden),
					style: { height: state.bottomHeight },
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
								onNewTab
							})
						})
					]
				})
			] });
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
		function SettingsSection({ close, sidebar }) {
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
				})
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
			fsHome: (signal) => call("fs.home", {}, signal)
		};
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
		//#region src/client/FileExplorer.tsx
		/**
		* The file explorer tab: a directory tree over one bookmarked local folder
		* (switchable — the header's folder button lists every bookmark, "+" adds
		* a typed path), clicking a file opens it in the editor tab via
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
		*  descends from `root`). */
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
							copyToClipboard(relativeTo(root, path), () => {
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
			const { cwd, expanded, onToggleDir, onOpenFile } = props;
			const [prefs, setPrefs] = (0, react.useState)(() => readExplorerPrefs());
			const [menuOpen, setMenuOpen] = (0, react.useState)(false);
			const [picking, setPicking] = (0, react.useState)(false);
			const [dirs, setDirs] = (0, react.useState)(/* @__PURE__ */ new Map());
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
			const bookmarkOptions = (0, react.useMemo)(() => prefs.bookmarks.map((b) => ({
				id: b.id,
				label: b.label
			})), [prefs.bookmarks]);
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
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
								open: menuOpen,
								onClose: () => {
									setMenuOpen(false);
								},
								items: bookmarkOptions,
								onSelect: (id) => {
									persist({
										...prefs,
										activeId: id
									});
									setMenuOpen(false);
								},
								portal: true,
								align: "start",
								anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: sidebar_module_css_default.explorerRoot,
									onClick: () => {
										setMenuOpen((v) => !v);
									},
									title: root,
									children: active?.label ?? root
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
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FolderPicker, {
						open: picking,
						initialPath: root,
						onSelect: addBookmark,
						onClose: () => {
							setPicking(false);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
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
		/**
		* The sidebar tab view: reads the user's restty prefs from the sidebar
		* store synchronously (no hooks — the Sidebar re-renders the descriptor on a
		* store change, so a settings edit takes effect on the next render) and
		* mounts the lazy restty terminal. `visible` is forwarded so the parent can
		* pause rendering without a remount.
		*/
		function ResttyTabView(props) {
			const { store, scope, tab, visible } = props;
			const prefs = readPrefsFromStore(store);
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
		*  powerdeskSidebar service). */
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
				settings: {
					label: () => t("tabTitle"),
					pluginToggles: [
						{
							key: "fontFamily",
							type: "text",
							title: () => t("settingsFontFamilyTitle"),
							desc: () => t("settingsFontFamilyDesc"),
							placeholder: () => t("settingsFontFamilyPlaceholder")
						},
						{
							key: "fontSize",
							type: "number",
							title: () => t("settingsFontSizeTitle"),
							desc: () => t("settingsFontSizeDesc"),
							min: 8,
							max: 32,
							unit: "px"
						},
						{
							key: "ptyBackend",
							type: "text",
							title: () => t("settingsBackendTitle"),
							desc: () => t("settingsBackendDesc"),
							placeholder: "own"
						},
						{
							key: "themeName",
							type: "text",
							title: () => t("settingsThemeTitle"),
							desc: () => t("settingsThemeDesc")
						}
					]
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
			const { scope, expanded, onToggleDir, onOpenFile } = props;
			return (0, react.createElement)(FileExplorer, {
				cwd: scope.cwd,
				expanded: expanded ?? [],
				onToggleDir: onToggleDir ?? (() => {}),
				onOpenFile: onOpenFile ?? (() => {})
			});
		}
		/**
		* The sidebar editor tab view: mounts the lazy CodeMirror editor over the
		* tab's persisted path. A tab with no path (should not happen — every
		* editor tab is minted by `service.openFile` with a path) renders nothing
		* rather than crashing the pane.
		*/
		function EditorTabView(props) {
			const { tab, visible } = props;
			if (tab.path === void 0) return null;
			return (0, react.createElement)(CodeEditorLazy, {
				path: tab.path,
				visible: visible ?? true
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
			ctx.effect(() => ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "dsh-powerdesk",
				order: 100,
				label: () => t("settingsNav"),
				inject: () => ({ sidebar: ctx.get("powerdeskSidebar") })
			}, SettingsSection)), "dsh-powerdesk: settings section");
		}
		//#endregion
		exports.POWERDESK_BROWSER_TAB_ID = POWERDESK_BROWSER_TAB_ID;
		exports.POWERDESK_EXPLORER_TAB_ID = POWERDESK_EXPLORER_TAB_ID;
		exports.POWERDESK_NOTES_TAB_ID = POWERDESK_NOTES_TAB_ID;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map