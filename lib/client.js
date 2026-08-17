window.__ModuleLoader__.load({
	id: "dsh-powerdesk",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp$22 = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp$22(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp$22(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		let react$1 = __toESM(react, 1);
		react = __toESM(react);
		let react_dom_client = require("react-dom/client");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_dom = require("react-dom");
		react_dom = __toESM(react_dom, 1);
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
			appearanceHeading: "Terminal appearance",
			appearanceIntro: "Pick a font, weight, size, and theme for the terminal. Font and size changes apply to the next terminal tab you open.",
			appearanceFontFamily: "Font",
			appearanceFontFamilyAuto: "System default",
			appearanceFontFamilyManual: "Type a font name…",
			appearanceFontsLoading: "Loading fonts…",
			appearanceFontWeight: "Weight",
			appearanceFontSize: "Size",
			appearanceTheme: "Theme",
			appearanceFontHint: "Lists your installed system fonts (incl. Nerd Fonts). On browsers without the Local Font Access API (Firefox/Safari), type the family name instead.",
			appearanceThemeHint: "“System default” follows light/dark.",
			appearanceReopenHint: "Font changes take effect on the next terminal tab you open.",
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
			themeOneDark: "One Dark",
			themeSolarizedDark: "Solarized Dark",
			themeRosePine: "Rosé Pine",
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
			appearanceHeading: "终端外观",
			appearanceIntro: "选择终端的字体、字重、字号与主题。字体与字号更改将在下次打开终端标签页时生效。",
			appearanceFontFamily: "字体",
			appearanceFontFamilyAuto: "系统默认",
			appearanceFontFamilyManual: "输入字体名…",
			appearanceFontsLoading: "正在加载字体…",
			appearanceFontWeight: "字重",
			appearanceFontSize: "字号",
			appearanceTheme: "主题",
			appearanceFontHint: "列出你系统中已安装的字体（含 Nerd Fonts）。在不支持本地字体访问 API 的浏览器（Firefox/Safari）上，请改为手动输入字体名。",
			appearanceThemeHint: "“系统默认”跟随明暗模式。",
			appearanceReopenHint: "字体更改将在下次打开终端标签页时生效。",
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
			themeOneDark: "One Dark",
			themeSolarizedDark: "Solarized Dark",
			themeRosePine: "Rosé Pine",
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
			"sandboxStatus": "i00wLG_sandboxStatus",
			"terminalBanner": "i00wLG_terminalBanner",
			"sandboxStatusOn": "i00wLG_sandboxStatusOn",
			"terminalDepsActions": "i00wLG_terminalDepsActions",
			"browserBar": "i00wLG_browserBar",
			"terminal": "i00wLG_terminal",
			"iconButton": "i00wLG_iconButton",
			"sandboxStatusText": "i00wLG_sandboxStatusText",
			"terminalDepsCommandRow": "i00wLG_terminalDepsCommandRow",
			"standaloneSurfaceSwitch": "i00wLG_standaloneSurfaceSwitch",
			"standaloneToggle": "i00wLG_standaloneToggle",
			"standaloneSurfaceBtn": "i00wLG_standaloneSurfaceBtn",
			"terminalRetry": "i00wLG_terminalRetry",
			"terminalDepsNote": "i00wLG_terminalDepsNote",
			"browserMessage": "i00wLG_browserMessage",
			"sandboxAction": "i00wLG_sandboxAction",
			"sandboxStatusOff": "i00wLG_sandboxStatusOff",
			"browserInput": "i00wLG_browserInput",
			"editorError": "i00wLG_editorError",
			"browserFrame": "i00wLG_browserFrame",
			"terminalDepsHint": "i00wLG_terminalDepsHint",
			"browserStart": "i00wLG_browserStart",
			"terminalBannerUrl": "i00wLG_terminalBannerUrl",
			"standaloneNoSession": "i00wLG_standaloneNoSession",
			"terminalWrap": "i00wLG_terminalWrap",
			"terminalDepsBanner": "i00wLG_terminalDepsBanner",
			"editorPlaceholder": "i00wLG_editorPlaceholder",
			"browserBlockedTitle": "i00wLG_browserBlockedTitle",
			"sandboxDot": "i00wLG_sandboxDot",
			"terminalRepairCommand": "i00wLG_terminalRepairCommand",
			"standaloneHeader": "i00wLG_standaloneHeader",
			"browserBlockedDesc": "i00wLG_browserBlockedDesc",
			"standaloneHost": "i00wLG_standaloneHost",
			"browserBlockedActions": "i00wLG_browserBlockedActions",
			"standaloneSurfaceActive": "i00wLG_standaloneSurfaceActive",
			"browser": "i00wLG_browser",
			"browserBlocked": "i00wLG_browserBlocked",
			"terminalDepsTitle": "i00wLG_terminalDepsTitle",
			"browserBlockedButton": "i00wLG_browserBlockedButton"
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
			const [attempt, setAttempt] = (0, react$1.useState)(0);
			const [state, setState] = (0, react$1.useState)({ status: "loading" });
			(0, react$1.useEffect)(() => {
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
			return (0, react$1.createElement)(state.Comp, props);
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
			return (props) => (0, react$1.createElement)(LazyChunkView, {
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
				...manifest.icon !== void 0 ? { icon: () => (0, react$1.createElement)("span", { "aria-hidden": true }, manifest.icon) } : {},
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
			themeName: ""
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
			return {
				fontFamily,
				fontWeight,
				fontSize: clampResttyFontSize(fontSize),
				ptyBackend,
				themeName
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
		function notifyTerminalPrefs() {
			cachedSnapshot = readPrefsFromLocalStorage();
			for (const listener of listeners) try {
				listener();
			} catch {}
		}
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
		/** Write a prefs patch to localStorage and notify subscribers. */
		function writePrefsToLocalStorage(patch) {
			const current = readPrefsFromLocalStorage();
			const next = {
				...current,
				...patch,
				fontSize: clampResttyFontSize(patch.fontSize ?? current.fontSize),
				fontWeight: clampResttyFontWeight(patch.fontWeight ?? current.fontWeight)
			};
			if (typeof localStorage !== "undefined") try {
				localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(next));
			} catch {}
			notifyTerminalPrefs();
			return next;
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
			return (0, react$1.useSyncExternalStore)(subscribeTerminalPrefs, getTerminalPrefsSnapshot, getTerminalPrefsSnapshot);
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
		const css = ".Kvd2vq_toggleCluster{z-index:45;flex-direction:row;gap:4px;display:flex;position:fixed;top:3px;right:53px}.Kvd2vq_panel:not(.Kvd2vq_panelHidden) .Kvd2vq_tabBar{padding-right:82px}.Kvd2vq_toggleButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out), color var(--ds-transition-duration-slow) var(--ds-ease-in-out);background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;display:flex}.Kvd2vq_toggleButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_toggleButton:disabled{opacity:.4;cursor:default}.Kvd2vq_panel{z-index:41;background:var(--dsw-alias-bg-layer-1);border-left:1px solid var(--dsw-alias-border-l2);transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;display:flex;position:fixed;top:0;bottom:0;right:0}.Kvd2vq_panelHidden{pointer-events:none;visibility:hidden;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);transform:translate(102%)}.Kvd2vq_panel[data-dragging]{transition:none}.Kvd2vq_panelResize{cursor:col-resize;z-index:2;touch-action:none;width:8px;position:absolute;top:0;bottom:0;left:-4px}.Kvd2vq_panelResizeActive{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_panelBody{flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_bottomPanel{z-index:40;background:var(--dsw-alias-bg-layer-1);border-top:1px solid var(--dsw-alias-border-l2);transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), height var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;display:flex;position:fixed;bottom:0;right:0}.Kvd2vq_bottomPanelHidden{pointer-events:none;visibility:hidden;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), height var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);transform:translateY(102%)}.Kvd2vq_bottomPanel[data-dragging]{transition:none}.Kvd2vq_bottomResize{cursor:row-resize;z-index:2;touch-action:none;height:8px;position:absolute;top:-4px;left:0;right:0}.Kvd2vq_bottomResizeActive{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_bottomClose{z-index:4;width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex;position:absolute;top:3px;right:6px}.Kvd2vq_bottomClose:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_bottomPanel .Kvd2vq_tabBar{padding-right:40px}body[data-dsh-title-bar-compat] .Kvd2vq_panel{padding-top:var(--dsh-title-bar-strip,40px)}.Kvd2vq_cornerHandle{left:-6px;bottom:calc(var(--dsh-sidebar-height,0px) + 6px);z-index:2;cursor:nwse-resize;touch-action:none;width:12px;height:12px;position:absolute}.Kvd2vq_cornerHandle:hover,.Kvd2vq_cornerHandle[data-dragging]{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_iconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_iconButton:disabled{opacity:.4;cursor:default}.Kvd2vq_workbench,.Kvd2vq_split{flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_splitRow{flex-direction:row}.Kvd2vq_splitCol{flex-direction:column}.Kvd2vq_splitChild{display:flex;position:relative;overflow:hidden}.Kvd2vq_divider{z-index:3;touch-action:none;flex:none;position:relative}.Kvd2vq_dividerRow:after,.Kvd2vq_dividerCol:after{content:\"\";background:var(--dsw-alias-border-l2);transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out);position:absolute}.Kvd2vq_dividerRow{cursor:col-resize;width:7px;margin:0 -2px}.Kvd2vq_dividerRow:after{width:1px;top:0;bottom:0;left:50%;transform:translate(-50%)}.Kvd2vq_dividerCol{cursor:row-resize;height:7px;margin:-2px 0}.Kvd2vq_dividerCol:after{height:1px;top:50%;left:0;right:0;transform:translateY(-50%)}.Kvd2vq_divider:hover:after,.Kvd2vq_dividerActive:after{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_pane{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;position:relative}.Kvd2vq_paneDrop{outline:1px solid var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}.Kvd2vq_dropOverlay{z-index:6;pointer-events:none;background:var(--dsw-alias-interactive-bg-hover-accent);opacity:.5;position:absolute}.Kvd2vq_dropLeft{width:25%;top:0;bottom:0;left:0}.Kvd2vq_dropRight{width:25%;top:0;bottom:0;right:0}.Kvd2vq_dropUp{height:25%;top:0;left:0;right:0}.Kvd2vq_dropDown{height:25%;bottom:0;left:0;right:0}.Kvd2vq_dropCenter{outline:2px dashed var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-2px;background:0 0;inset:25%}.Kvd2vq_paneContent{flex-direction:column;flex:1;min-height:0;display:flex;overflow:hidden}.Kvd2vq_paneTab{flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_paneTabHidden{display:none}.Kvd2vq_paneEmptyCards{flex-direction:column;flex:1;gap:20px;min-height:0;padding:28px 20px 20px;display:flex;overflow:hidden}.Kvd2vq_paneEmptyHeader{text-align:left;flex-direction:row;flex:none;justify-content:space-between;align-items:flex-start;gap:12px;display:flex}.Kvd2vq_paneEmptyHeaderText{flex-direction:column;gap:4px;min-width:0;display:flex}.Kvd2vq_paneEmptyHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0;line-height:1.3}.Kvd2vq_paneEmptySubheading{font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);margin:0;line-height:1.4}.Kvd2vq_paneLayoutRadio{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:8px;flex:none;align-items:center;gap:2px;padding:2px;display:inline-flex}.Kvd2vq_paneLayoutOption{width:28px;height:28px;color:var(--dsw-alias-label-tertiary);cursor:pointer;transition:background .12s var(--dsh-ease-in-out,ease), color .12s var(--dsh-ease-in-out,ease);background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;display:inline-flex}.Kvd2vq_paneLayoutOption:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_paneLayoutOptionSelected,.Kvd2vq_paneLayoutOptionSelected:hover{background:var(--dsw-alias-interactive-bg-active);color:var(--dsw-alias-brand-primary)}.Kvd2vq_paneEmptyControls{flex:none;align-items:center;gap:8px;display:inline-flex}.Kvd2vq_paneCardGrid{flex:1;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));align-content:start;gap:12px;min-height:0;display:grid}.Kvd2vq_paneCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-width:0;color:var(--dsw-alias-label-secondary);cursor:pointer;text-align:left;transition:background .12s var(--dsh-ease-in-out,ease), border-color .12s var(--dsh-ease-in-out,ease), transform .12s var(--dsh-ease-in-out,ease), box-shadow .12s var(--dsh-ease-in-out,ease);border-radius:10px;flex-direction:row;align-items:flex-start;gap:12px;padding:14px;display:flex}.Kvd2vq_paneCardIcon{background:var(--dsw-alias-interactive-bg-hover-accent);width:36px;height:36px;color:var(--dsw-alias-brand-primary);border-radius:8px;flex:none;justify-content:center;align-items:center;font-size:16px;display:flex}.Kvd2vq_paneCardText{flex-direction:column;gap:2px;min-width:0;display:flex}.Kvd2vq_paneCardLabel{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.Kvd2vq_paneCardDesc{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.4;display:-webkit-box;overflow:hidden}.Kvd2vq_paneCard:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2);transform:translateY(-1px);box-shadow:0 2px 8px #0000001f}.Kvd2vq_paneCard:hover:not(:disabled) .Kvd2vq_paneCardIcon{background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_paneCard:active:not(:disabled){box-shadow:none;transform:translateY(0)}.Kvd2vq_paneCard:disabled{opacity:.45;cursor:default}.Kvd2vq_tabBar{border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);flex:none;align-items:stretch;height:34px;display:flex}.Kvd2vq_tabBarDrop{outline:1px dashed var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}.Kvd2vq_tabList{scrollbar-width:none;flex:1;min-width:0;display:flex;overflow-x:auto}.Kvd2vq_tabList::-webkit-scrollbar{display:none}.Kvd2vq_tab{min-width:64px;max-width:160px;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);border-right:1px solid var(--dsw-alias-border-l1);cursor:pointer;user-select:none;background:0 0;flex:none;align-items:center;gap:4px;padding:0 4px 0 10px;display:flex}.Kvd2vq_tab:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_tabActive{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_tabTitle{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Kvd2vq_tabBadge{min-width:16px;height:15px;font:var(--dsw-font-xxxs-strong-11);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-brand-primary);border-radius:8px;flex:none;justify-content:center;align-items:center;padding:0 4px;display:inline-flex}.Kvd2vq_tabClose{width:18px;height:18px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:4px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_tabClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_tabBarPlus{background:var(--dsw-alias-bg-layer-1);width:22px;height:22px;color:var(--dsw-alias-label-tertiary);cursor:pointer;border:none;border-radius:5px;flex:none;justify-content:center;align-self:center;align-items:center;margin:0 6px;padding:0;display:inline-flex;position:sticky;right:0}.Kvd2vq_tabBarPlus:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorer{flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_explorerHeader{flex:none;justify-content:space-between;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_explorerRoot{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_explorerBody{flex:1;min-height:0;padding:2px 6px 8px;overflow:hidden auto}.Kvd2vq_explorerRow{width:100%;min-width:0;height:34px;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);text-align:left;cursor:pointer;white-space:nowrap;animation:Kvd2vq_dsh-row-in .15s var(--ds-ease-in-out);background:0 0;border:none;border-radius:8px;align-items:center;gap:6px;padding:0 8px;display:flex;overflow:hidden}.Kvd2vq_explorerRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_explorerDir{font:var(--dsw-font-s-strong-14)}.Kvd2vq_explorerRowActive{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_explorerHidden{opacity:.45}.Kvd2vq_explorerSymlink{color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_explorerBroken .Kvd2vq_explorerName{color:var(--dsw-alias-state-error-primary)}.Kvd2vq_explorerName{text-overflow:ellipsis;flex:1;min-width:0;overflow:hidden}.Kvd2vq_explorerRef{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;align-items:center;padding:0 8px;display:none}.Kvd2vq_explorerRef:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorerRow:hover .Kvd2vq_explorerRef,.Kvd2vq_explorerRow:focus-within .Kvd2vq_explorerRef{display:inline-flex}.Kvd2vq_explorerPill{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;align-items:center;padding:0 8px;display:inline-flex}.Kvd2vq_explorerPill:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorerPill:disabled{opacity:.4;cursor:default}.Kvd2vq_explorerCopied{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_explorerError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);cursor:default}@keyframes Kvd2vq_dsh-row-in{0%{opacity:0}}.Kvd2vq_explorerEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;padding:16px}.Kvd2vq_editor{flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_editorHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:6px;padding:4px 8px;display:flex}.Kvd2vq_editorTitle{min-width:0;font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;flex:1;overflow:hidden}.Kvd2vq_editorStatus{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_editorStatusError{color:var(--dsw-alias-state-error-primary)}.Kvd2vq_dirtyDot{background:var(--dsw-alias-state-warn-primary);border-radius:50%;flex:none;width:7px;height:7px}.Kvd2vq_editorPlaceholder{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;flex:1;justify-content:center;align-items:center;padding:16px;display:flex}.Kvd2vq_orphanedType{opacity:.7;overflow-wrap:anywhere;margin-top:8px;font-size:12px;display:block}.Kvd2vq_editorBinary{text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:12px;padding:24px 16px;display:flex}.Kvd2vq_editorBinaryNotice{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_editorDownloadLink{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-strong-12);cursor:pointer;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out), border-color var(--ds-transition-duration-slow) var(--ds-ease-in-out);border-radius:6px;align-items:center;gap:6px;padding:6px 14px;text-decoration:none;display:inline-flex}.Kvd2vq_editorDownloadLink:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l2)}.Kvd2vq_editorError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);padding:12px 16px}.Kvd2vq_editorBanner{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex:none;padding:4px 12px}.Kvd2vq_sandboxStatus{font:var(--dsw-font-xxxs-11);flex:none;align-items:center;gap:8px;padding:4px 10px;display:flex}.Kvd2vq_sandboxStatusOn{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-bottom:1px solid var(--dsw-alias-border-l1)}.Kvd2vq_sandboxStatusOff{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);border-bottom:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, transparent)}.Kvd2vq_sandboxDot{background:var(--dsw-alias-state-success-primary);border-radius:50%;flex:none;width:6px;height:6px}.Kvd2vq_sandboxStatusOff .Kvd2vq_sandboxDot{background:var(--dsw-alias-state-error-primary)}.Kvd2vq_sandboxStatusText{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Kvd2vq_sandboxAction{border:1px solid var(--dsw-alias-border-l2);font:inherit;color:inherit;cursor:pointer;background:0 0;border-radius:6px;flex:none;padding:2px 8px}.Kvd2vq_sandboxAction:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorHtml{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_browser{flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_browserBar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:4px;padding:6px 8px;display:flex}.Kvd2vq_browserInput{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-width:0;height:28px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:6px;flex:1;padding:0 10px}.Kvd2vq_browserInput:focus{border-color:var(--dsw-alias-border-l2);outline:none}.Kvd2vq_browserMessage{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex:none;padding:4px 12px}.Kvd2vq_browserFrame{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_browserStart{text-align:center;min-height:0;font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);flex:1;justify-content:center;align-items:center;padding:20px;display:flex}.Kvd2vq_browserBlocked{text-align:center;min-height:0;color:var(--dsw-alias-state-warn-primary);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:6px;padding:24px;display:flex}.Kvd2vq_browserBlockedTitle{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary)}.Kvd2vq_browserBlockedDesc{max-width:280px;font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-secondary)}.Kvd2vq_browserBlockedActions{gap:8px;margin-top:6px;display:flex}.Kvd2vq_browserBlockedButton{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxxs-11);cursor:pointer;border-radius:6px;padding:4px 12px}.Kvd2vq_browserBlockedButton:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorCm{background:0 0;flex:1;min-height:0;overflow:hidden}.Kvd2vq_editorCmHidden{display:none}.Kvd2vq_editorCm .cm-editor{height:100%}.Kvd2vq_editorCm .cm-editor.cm-focused{outline:none}.Kvd2vq_editorModeToggle{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:6px;flex:none;align-items:center;gap:2px;padding:2px;display:inline-flex}.Kvd2vq_editorModeButton{color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-11);cursor:pointer;background:0 0;border:none;border-radius:4px;padding:2px 8px}.Kvd2vq_editorModeButton:hover{color:var(--dsw-alias-label-primary)}.Kvd2vq_editorModeActive{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}.Kvd2vq_editorImageWrap{flex:1;justify-content:center;align-items:center;min-height:0;padding:12px;display:flex;overflow:auto}.Kvd2vq_editorImage{object-fit:contain;max-width:100%;max-height:100%}.Kvd2vq_editorMd{min-height:0;font:var(--dsw-font-xs-13);flex:1;padding:10px 14px;overflow-y:auto}.Kvd2vq_selectionPopup{z-index:60;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:28px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxxs-strong-11);white-space:nowrap;cursor:pointer;border-radius:6px;align-items:center;padding:0 10px;display:inline-flex;position:fixed;transform:translate(-50%,calc(-100% - 8px))}.Kvd2vq_selectionPopup:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorPdf{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_editorPdfToolbar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:flex-end;padding:6px 8px;display:flex}.Kvd2vq_editorPdfStage{flex:1;min-height:0;display:flex;position:relative}.Kvd2vq_editorPdfFrame{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_editorPdfFrameBlocked{pointer-events:none}.Kvd2vq_editorPdfDragShield{z-index:4;pointer-events:none;background:0 0;position:absolute;inset:0}.Kvd2vq_editorPdfDragShieldActive{pointer-events:auto}body[data-dsh-tab-dragging] .Kvd2vq_editorPdfFrame{pointer-events:none!important}body[data-dsh-tab-dragging] .Kvd2vq_editorPdfDragShield{pointer-events:auto!important}.Kvd2vq_terminalWrap{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-height:0;display:flex;position:relative}.Kvd2vq_terminal{flex:1;min-height:0;padding:6px 4px 6px 8px}.Kvd2vq_terminal .xterm{height:100%}.Kvd2vq_terminalBanner{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex-wrap:wrap;flex:none;align-items:center;gap:8px;padding:3px 10px;display:flex}.Kvd2vq_terminalBannerUrl{word-break:break-all;opacity:.85;flex-basis:100%;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.Kvd2vq_boundaryError{z-index:50;background:var(--dsw-alias-bg-layer-1);border-left:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);flex-direction:column;align-items:flex-start;gap:8px;padding:16px;display:flex;position:fixed;top:0;bottom:0;right:0;overflow:auto}.Kvd2vq_terminalRetry{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;padding:1px 8px}.Kvd2vq_terminalRetry:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_terminalDepsBanner{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex-direction:column;flex:none;gap:6px;padding:10px;display:flex}.Kvd2vq_terminalDepsTitle{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-state-warn-primary)}.Kvd2vq_terminalDepsHint{opacity:.9}.Kvd2vq_terminalDepsCommandRow{align-items:flex-start;gap:8px;display:flex}.Kvd2vq_terminalRepairCommand{white-space:pre-wrap;word-break:break-all;user-select:text;min-width:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:4px;flex:1;max-height:160px;margin:0;padding:6px 8px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.5;overflow:auto}.Kvd2vq_terminalDepsNote{opacity:.85}.Kvd2vq_terminalDepsActions{align-items:center;gap:8px;display:flex}.Kvd2vq_tabBoundaryError{min-height:0;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);flex-direction:column;flex:1;align-items:flex-start;gap:8px;padding:12px 16px;display:flex;overflow:auto}.Kvd2vq_git{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden auto}.Kvd2vq_gitHeader{flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_gitBranchSelect{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);min-width:0;height:26px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:6px;flex:1;padding:0 6px}.Kvd2vq_gitSection{border-top:1px solid var(--dsw-alias-border-l1)}.Kvd2vq_gitSectionHeader{font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-label-tertiary);text-transform:uppercase;justify-content:space-between;align-items:center;padding:6px 12px 4px;display:flex}.Kvd2vq_gitLink{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-brand-primary);cursor:pointer;background:0 0;border:none;padding:0}.Kvd2vq_gitLink:hover:not(:disabled){text-decoration:underline}.Kvd2vq_gitLink:disabled{opacity:.4;cursor:default}.Kvd2vq_gitRow{min-height:34px;animation:Kvd2vq_dsh-row-in .15s var(--ds-ease-in-out);border-radius:8px;align-items:center;gap:6px;margin:0 6px;padding:0 8px;display:flex}.Kvd2vq_gitRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitRowSelected{background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_gitRowMain{cursor:pointer;text-align:left;background:0 0;border:none;flex:1;align-items:center;gap:8px;min-width:0;padding:3px 0;display:flex}.Kvd2vq_gitBadge{width:20px;height:16px;font:var(--dsw-font-xxxs-strong-11);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);border-radius:4px;flex:none;justify-content:center;align-items:center;display:inline-flex}.Kvd2vq_gitName{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);padding:4px 12px 8px}.Kvd2vq_gitPlaceholder{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;padding:16px}.Kvd2vq_gitError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);white-space:pre-wrap;padding:8px 12px}.Kvd2vq_gitDiff{border-top:1px solid var(--dsw-alias-border-l1);padding:8px}.Kvd2vq_gitDiffTab{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden auto}.Kvd2vq_gitDiffTabHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_gitDiffTabTitle{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitDiffFile{align-items:baseline;gap:6px;padding:8px 2px 2px;display:flex}.Kvd2vq_gitDiffFilePath{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_gitDiffFileOld{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;flex:none;max-width:40%;overflow:hidden}.Kvd2vq_gitDiffFileTag{border:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;padding:0 6px}.Kvd2vq_gitDiffHunk{font:var(--dsw-font-markdown-code-block-small);color:var(--dsw-alias-label-tertiary);gap:8px;padding:3px 2px;display:flex}.Kvd2vq_gitDiffHunkHeader{color:var(--dsw-alias-label-secondary);flex:none}.Kvd2vq_gitDiffHunkSection{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_gitDiffLine{font:var(--dsw-font-markdown-code-block-small);white-space:pre-wrap;overflow-wrap:anywhere;align-items:stretch;min-width:0;line-height:20px;display:flex}.Kvd2vq_gitDiffNum{text-align:right;width:36px;color:var(--dsw-alias-label-tertiary);user-select:none;flex:none;padding-right:8px}.Kvd2vq_gitDiffCode{flex:1;min-width:0;overflow:visible}.Kvd2vq_gitDiffCtx{color:var(--dsw-alias-label-primary)}.Kvd2vq_gitDiffDel{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent)}.Kvd2vq_gitDiffAdd{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent)}.Kvd2vq_gitDiffMeta{padding-left:2px}.Kvd2vq_gitDiffMetaText{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);font-style:italic}.Kvd2vq_gitDiffExpand{width:100%;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-brand-primary);cursor:pointer;text-align:center;background:0 0;border:none;margin:4px 0;display:block}.Kvd2vq_gitDiffExpand:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitConfirmDesc{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);white-space:pre-wrap;margin:0}.Kvd2vq_gitCommit{border-top:1px solid var(--dsw-alias-border-l1);align-items:center;gap:6px;padding:8px 12px;display:flex}.Kvd2vq_gitCommitInput{flex:1;min-width:0}.Kvd2vq_gitCommitButton{background:var(--dsw-alias-button-primary-fill);height:26px;color:var(--dsw-alias-label-primary-inverted);font:var(--dsw-font-xxs-strong-12);cursor:pointer;border:none;border-radius:6px;flex:none;padding:0 12px}.Kvd2vq_gitCommitButton:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}.Kvd2vq_gitCommitButton:disabled{opacity:.45;cursor:default}.Kvd2vq_gitLogRow{cursor:pointer;border-radius:8px;flex-direction:column;gap:2px;padding:5px 12px;display:flex}.Kvd2vq_gitLogRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitLogLine1{align-items:baseline;gap:8px;min-width:0;display:flex}.Kvd2vq_gitLogHash{font:var(--dsw-font-markdown-code-block-small);color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_gitLogLine2{flex-wrap:wrap;align-items:center;gap:6px;min-width:0;display:flex}.Kvd2vq_gitLogRef{border:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-brand-primary);white-space:nowrap;border-radius:999px;flex:none;padding:0 5px}.Kvd2vq_gitLogSubject{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitLogMeta{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_gitLogMore{border:1px solid var(--dsw-alias-border-l2);width:calc(100% - 24px);font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border-radius:6px;margin:4px 12px 8px;padding:6px 0;display:block}.Kvd2vq_gitLogMore:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_gitLogMore:disabled{opacity:.5;cursor:default}.Kvd2vq_producedRow{flex-wrap:wrap;align-items:center;gap:8px;padding:4px 0;display:flex}.Kvd2vq_producedLabel{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_producedChip{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);max-width:200px;color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;border-radius:999px;align-items:center;gap:4px;padding:2px 8px;display:inline-flex;overflow:hidden}.Kvd2vq_producedChip:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_producedChip span{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_producedMore{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_toggleButton:focus-visible,.Kvd2vq_bottomClose:focus-visible,.Kvd2vq_iconButton:focus-visible,.Kvd2vq_tab:focus-visible,.Kvd2vq_tabClose:focus-visible,.Kvd2vq_tabBarPlus:focus-visible,.Kvd2vq_paneCard:focus-visible,.Kvd2vq_paneLayoutOption:focus-visible,.Kvd2vq_explorerRow:focus-visible,.Kvd2vq_explorerRef:focus-visible,.Kvd2vq_gitRowMain:focus-visible,.Kvd2vq_gitLink:focus-visible,.Kvd2vq_gitCommitButton:focus-visible,.Kvd2vq_gitLogRow:focus-visible,.Kvd2vq_gitLogMore:focus-visible,.Kvd2vq_gitDiffExpand:focus-visible,.Kvd2vq_terminalRetry:focus-visible,.Kvd2vq_editorModeButton:focus-visible,.Kvd2vq_editorDownloadLink:focus-visible,.Kvd2vq_editorPptxButton:focus-visible,.Kvd2vq_editorDocxZoomRange:focus-visible{outline:2px solid var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}@media (prefers-reduced-motion:reduce){.Kvd2vq_panel,.Kvd2vq_panelHidden,.Kvd2vq_bottomPanel,.Kvd2vq_bottomPanelHidden,.Kvd2vq_toggleCluster,.Kvd2vq_toggleButton,.Kvd2vq_tab,.Kvd2vq_tabBarPlus,.Kvd2vq_paneCard,.Kvd2vq_explorerRow,.Kvd2vq_gitRow,.Kvd2vq_divider,.Kvd2vq_dividerRow:after,.Kvd2vq_dividerCol:after{transition:none;animation:none}}@media (width<=767px){.Kvd2vq_panel:not(.Kvd2vq_panelHidden) .Kvd2vq_tabBar{padding-right:40px}.Kvd2vq_tab{min-width:48px;max-width:128px}}.Kvd2vq_settingsIntro{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);margin:0 0 12px}.Kvd2vq_settingsGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;display:grid}.Kvd2vq_settingsCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);cursor:pointer;text-align:left;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out);border-radius:12px;flex-direction:column;gap:8px;padding:14px;display:flex;position:relative}.Kvd2vq_settingsCard:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_settingsCardIcon{background:var(--dsw-alias-bg-layer-2);width:32px;height:32px;color:var(--dsw-alias-label-primary);border-radius:9px;justify-content:center;align-items:center;display:flex}.Kvd2vq_settingsCardTitle{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary)}.Kvd2vq_settingsCardSubtitle{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_settingsCardToggle{border:1px solid var(--dsw-alias-border-l2);color:#0000;cursor:pointer;background:0 0;border-radius:50%;justify-content:center;align-items:center;width:22px;height:22px;display:flex;position:absolute;top:12px;right:12px}.Kvd2vq_settingsCardToggleOn{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);border-color:#0000}.Kvd2vq_settingsHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:12px 0 0}.Kvd2vq_settingsMissing{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-radius:10px;margin:0;padding:12px}.Kvd2vq_notesRoot{flex:1;min-height:0;display:flex}.Kvd2vq_notesTree{flex-direction:column;flex:none;min-width:0;display:flex;overflow:hidden}.Kvd2vq_notesEditor{flex-direction:column;flex:1;min-width:0;display:flex}.Kvd2vq_notesBindPrompt{text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:10px;padding:24px;display:flex}.Kvd2vq_folderPickerPath{border-bottom:1px solid var(--dsw-alias-border-l1);align-items:center;gap:8px;margin-bottom:4px;padding-bottom:10px;display:flex}.Kvd2vq_folderPickerList{height:320px;overflow:hidden auto}.Kvd2vq_folderPickerFooter{justify-content:flex-end;gap:8px;display:flex}.Kvd2vq_extSection{border-top:1px solid var(--dsw-alias-border-l1);margin-top:20px;padding-top:16px}.Kvd2vq_extHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0 0 8px}.Kvd2vq_extWarning{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:10px;margin:0 0 12px;padding:10px 12px}.Kvd2vq_extActions{gap:8px;margin-bottom:12px;display:flex}.Kvd2vq_extActions button,.Kvd2vq_extPromptActions button{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);cursor:pointer;border-radius:8px;padding:6px 12px}.Kvd2vq_extActions button:disabled,.Kvd2vq_extPromptActions button:disabled{opacity:.5;cursor:default}.Kvd2vq_extPromptPrimary{background:var(--dsw-alias-label-primary)!important;color:var(--dsw-alias-bg-base)!important;border-color:#0000!important}.Kvd2vq_extList{flex-direction:column;gap:8px;display:flex}.Kvd2vq_extRow{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:10px;align-items:flex-start;gap:10px;padding:10px 12px;display:flex}.Kvd2vq_extRowIcon{background:var(--dsw-alias-bg-layer-2);border-radius:8px;flex:none;justify-content:center;align-items:center;width:28px;height:28px;font-size:15px;line-height:1;display:flex}.Kvd2vq_extRowBody{flex-direction:column;flex:auto;gap:2px;min-width:0;display:flex}.Kvd2vq_extRowTitle{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary)}.Kvd2vq_extRowMeta{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}.Kvd2vq_extRowPath{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);opacity:.75;overflow-wrap:anywhere}.Kvd2vq_extRowRemove{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;background:0 0;border-radius:8px;flex:none;align-self:center;padding:5px 10px}.Kvd2vq_extRowRemove:disabled{opacity:.5;cursor:default}.Kvd2vq_extEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:0}.Kvd2vq_extError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);overflow-wrap:anywhere;border-radius:10px;margin:12px 0 0;padding:10px 12px}.Kvd2vq_extPrompt{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;flex-direction:column;gap:8px;margin-bottom:12px;padding:12px;display:flex}.Kvd2vq_extPromptHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);margin:0}.Kvd2vq_extPromptFile{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere;margin:0}.Kvd2vq_extPromptField{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;display:flex}.Kvd2vq_extPromptField input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:8px;padding:6px 10px}.Kvd2vq_extPromptActions{justify-content:flex-end;gap:8px;display:flex}.Kvd2vq_appearanceSection{border-top:1px solid var(--dsw-alias-border-l1);margin-top:20px;padding-top:16px}.Kvd2vq_appearanceHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0 0 8px}.Kvd2vq_appearanceGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:12px;display:grid}.Kvd2vq_appearanceFieldFull{grid-column:1/-1}.Kvd2vq_appearanceField{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;display:flex}.Kvd2vq_appearanceFieldLabel{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary)}.Kvd2vq_appearanceControl{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);box-sizing:border-box;border-radius:8px;width:100%;padding:6px 10px}.Kvd2vq_appearanceControl:focus{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2));outline:none}.Kvd2vq_appearanceSelectTrigger{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);box-sizing:border-box;cursor:pointer;text-align:left;border-radius:8px;justify-content:space-between;align-items:center;gap:8px;width:100%;padding:6px 10px;display:flex}.Kvd2vq_appearanceSelectTrigger:hover{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2))}.Kvd2vq_appearanceSelectTrigger:focus-visible{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2));box-shadow:0 0 0 2px var(--dsw-alias-interactive-bg-active,transparent);outline:none}.Kvd2vq_appearanceSelectTrigger[data-placeholder]{color:var(--dsw-alias-label-tertiary)}.Kvd2vq_appearanceSelectTrigger:disabled{opacity:.6;cursor:default}.Kvd2vq_appearanceSelectCaret{color:var(--dsw-alias-label-tertiary);flex-shrink:0;align-items:center;display:inline-flex}.Kvd2vq_appearanceSelectContent{min-width:var(--radix-select-trigger-width);max-height:var(--radix-select-content-available-height,280px);border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-elevated,var(--dsw-alias-bg-base));z-index:1000;border-radius:8px;overflow:hidden;box-shadow:0 6px 24px #0000002e}.Kvd2vq_appearanceSelectViewport{padding:4px}.Kvd2vq_appearanceSelectItem{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);cursor:pointer;user-select:none;border-radius:6px;outline:none;align-items:center;gap:6px;padding:6px 8px;display:flex}.Kvd2vq_appearanceSelectItem[data-highlighted]{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_appearanceSelectItem[data-disabled]{opacity:.5;cursor:default}.Kvd2vq_appearanceSelectIndicator{color:var(--dsw-alias-label-primary);flex-shrink:0;align-items:center;display:inline-flex}.Kvd2vq_appearanceInlineToggle{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);cursor:pointer;text-underline-offset:2px;background:0 0;border:none;align-self:flex-start;margin-top:2px;padding:0;text-decoration:underline}.Kvd2vq_appearanceInlineToggle:hover{color:var(--dsw-alias-label-secondary)}.Kvd2vq_appearanceHint,.Kvd2vq_appearanceReopenHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:8px 0 0}.Kvd2vq_appearanceReopenHint{font-style:italic}";
		const tagId = "dsh-powerdesk/sidebar.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-powerdesk";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var sidebar_module_css_default = {
			"paneEmptyHeaderText": "Kvd2vq_paneEmptyHeaderText",
			"appearanceReopenHint": "Kvd2vq_appearanceReopenHint",
			"producedLabel": "Kvd2vq_producedLabel",
			"editorModeActive": "Kvd2vq_editorModeActive",
			"editorPdfFrameBlocked": "Kvd2vq_editorPdfFrameBlocked",
			"dropLeft": "Kvd2vq_dropLeft",
			"editorModeButton": "Kvd2vq_editorModeButton",
			"folderPickerPath": "Kvd2vq_folderPickerPath",
			"explorerCopied": "Kvd2vq_explorerCopied",
			"producedChip": "Kvd2vq_producedChip",
			"editorPdfDragShieldActive": "Kvd2vq_editorPdfDragShieldActive",
			"panelBody": "Kvd2vq_panelBody",
			"extRow": "Kvd2vq_extRow",
			"terminalDepsHint": "Kvd2vq_terminalDepsHint",
			"extRowMeta": "Kvd2vq_extRowMeta",
			"gitDiffFilePath": "Kvd2vq_gitDiffFilePath",
			"paneContent": "Kvd2vq_paneContent",
			"browserBlockedTitle": "Kvd2vq_browserBlockedTitle",
			"dividerCol": "Kvd2vq_dividerCol",
			"selectionPopup": "Kvd2vq_selectionPopup",
			"split": "Kvd2vq_split",
			"gitBadge": "Kvd2vq_gitBadge",
			"gitHeader": "Kvd2vq_gitHeader",
			"gitRowSelected": "Kvd2vq_gitRowSelected",
			"dsh-row-in": "Kvd2vq_dsh-row-in",
			"editorHeader": "Kvd2vq_editorHeader",
			"editorCmHidden": "Kvd2vq_editorCmHidden",
			"editor": "Kvd2vq_editor",
			"gitError": "Kvd2vq_gitError",
			"panelResizeActive": "Kvd2vq_panelResizeActive",
			"paneEmptyHeading": "Kvd2vq_paneEmptyHeading",
			"editorPlaceholder": "Kvd2vq_editorPlaceholder",
			"browserBlocked": "Kvd2vq_browserBlocked",
			"gitDiffHunkHeader": "Kvd2vq_gitDiffHunkHeader",
			"terminalRepairCommand": "Kvd2vq_terminalRepairCommand",
			"gitEmpty": "Kvd2vq_gitEmpty",
			"editorPptxButton": "Kvd2vq_editorPptxButton",
			"tabTitle": "Kvd2vq_tabTitle",
			"editorBinaryNotice": "Kvd2vq_editorBinaryNotice",
			"explorerBody": "Kvd2vq_explorerBody",
			"browserMessage": "Kvd2vq_browserMessage",
			"paneLayoutOptionSelected": "Kvd2vq_paneLayoutOptionSelected",
			"tab": "Kvd2vq_tab",
			"settingsCard": "Kvd2vq_settingsCard",
			"gitPlaceholder": "Kvd2vq_gitPlaceholder",
			"extEmpty": "Kvd2vq_extEmpty",
			"explorerRowActive": "Kvd2vq_explorerRowActive",
			"gitLink": "Kvd2vq_gitLink",
			"paneEmptyHeader": "Kvd2vq_paneEmptyHeader",
			"appearanceFieldFull": "Kvd2vq_appearanceFieldFull",
			"paneDrop": "Kvd2vq_paneDrop",
			"explorerDir": "Kvd2vq_explorerDir",
			"appearanceSection": "Kvd2vq_appearanceSection",
			"dropRight": "Kvd2vq_dropRight",
			"browserBlockedDesc": "Kvd2vq_browserBlockedDesc",
			"settingsCardTitle": "Kvd2vq_settingsCardTitle",
			"terminalBannerUrl": "Kvd2vq_terminalBannerUrl",
			"paneCardText": "Kvd2vq_paneCardText",
			"paneCard": "Kvd2vq_paneCard",
			"editorHtml": "Kvd2vq_editorHtml",
			"browserFrame": "Kvd2vq_browserFrame",
			"terminalWrap": "Kvd2vq_terminalWrap",
			"gitLogMore": "Kvd2vq_gitLogMore",
			"workbench": "Kvd2vq_workbench",
			"editorCm": "Kvd2vq_editorCm",
			"gitDiffMeta": "Kvd2vq_gitDiffMeta",
			"gitCommit": "Kvd2vq_gitCommit",
			"gitDiffFile": "Kvd2vq_gitDiffFile",
			"settingsIntro": "Kvd2vq_settingsIntro",
			"gitDiffLine": "Kvd2vq_gitDiffLine",
			"panelHidden": "Kvd2vq_panelHidden",
			"explorerHeader": "Kvd2vq_explorerHeader",
			"browserBlockedButton": "Kvd2vq_browserBlockedButton",
			"gitDiffNum": "Kvd2vq_gitDiffNum",
			"settingsHint": "Kvd2vq_settingsHint",
			"extRowTitle": "Kvd2vq_extRowTitle",
			"extPrompt": "Kvd2vq_extPrompt",
			"gitCommitButton": "Kvd2vq_gitCommitButton",
			"gitDiff": "Kvd2vq_gitDiff",
			"extRowIcon": "Kvd2vq_extRowIcon",
			"settingsCardToggle": "Kvd2vq_settingsCardToggle",
			"browser": "Kvd2vq_browser",
			"folderPickerList": "Kvd2vq_folderPickerList",
			"gitSection": "Kvd2vq_gitSection",
			"tabBarDrop": "Kvd2vq_tabBarDrop",
			"explorerRow": "Kvd2vq_explorerRow",
			"terminalRetry": "Kvd2vq_terminalRetry",
			"iconButton": "Kvd2vq_iconButton",
			"paneEmptyCards": "Kvd2vq_paneEmptyCards",
			"explorerName": "Kvd2vq_explorerName",
			"browserBlockedActions": "Kvd2vq_browserBlockedActions",
			"gitLogRow": "Kvd2vq_gitLogRow",
			"gitCommitInput": "Kvd2vq_gitCommitInput",
			"panel": "Kvd2vq_panel",
			"pane": "Kvd2vq_pane",
			"gitDiffFileOld": "Kvd2vq_gitDiffFileOld",
			"browserStart": "Kvd2vq_browserStart",
			"editorError": "Kvd2vq_editorError",
			"explorerBroken": "Kvd2vq_explorerBroken",
			"paneCardIcon": "Kvd2vq_paneCardIcon",
			"explorerRef": "Kvd2vq_explorerRef",
			"appearanceInlineToggle": "Kvd2vq_appearanceInlineToggle",
			"gitName": "Kvd2vq_gitName",
			"editorModeToggle": "Kvd2vq_editorModeToggle",
			"sandboxStatusOn": "Kvd2vq_sandboxStatusOn",
			"editorImageWrap": "Kvd2vq_editorImageWrap",
			"bottomResize": "Kvd2vq_bottomResize",
			"appearanceField": "Kvd2vq_appearanceField",
			"gitLogHash": "Kvd2vq_gitLogHash",
			"tabBoundaryError": "Kvd2vq_tabBoundaryError",
			"gitLogRef": "Kvd2vq_gitLogRef",
			"editorDocxZoomRange": "Kvd2vq_editorDocxZoomRange",
			"editorBinary": "Kvd2vq_editorBinary",
			"appearanceSelectItem": "Kvd2vq_appearanceSelectItem",
			"gitDiffAdd": "Kvd2vq_gitDiffAdd",
			"dividerRow": "Kvd2vq_dividerRow",
			"editorTitle": "Kvd2vq_editorTitle",
			"orphanedType": "Kvd2vq_orphanedType",
			"sandboxStatusText": "Kvd2vq_sandboxStatusText",
			"gitLogLine2": "Kvd2vq_gitLogLine2",
			"extWarning": "Kvd2vq_extWarning",
			"appearanceHint": "Kvd2vq_appearanceHint",
			"editorPdfToolbar": "Kvd2vq_editorPdfToolbar",
			"gitSectionHeader": "Kvd2vq_gitSectionHeader",
			"gitDiffTabHeader": "Kvd2vq_gitDiffTabHeader",
			"explorer": "Kvd2vq_explorer",
			"gitRowMain": "Kvd2vq_gitRowMain",
			"editorImage": "Kvd2vq_editorImage",
			"dropCenter": "Kvd2vq_dropCenter",
			"paneLayoutRadio": "Kvd2vq_paneLayoutRadio",
			"gitRow": "Kvd2vq_gitRow",
			"dirtyDot": "Kvd2vq_dirtyDot",
			"gitConfirmDesc": "Kvd2vq_gitConfirmDesc",
			"extPromptField": "Kvd2vq_extPromptField",
			"appearanceSelectCaret": "Kvd2vq_appearanceSelectCaret",
			"extActions": "Kvd2vq_extActions",
			"gitBranchSelect": "Kvd2vq_gitBranchSelect",
			"appearanceSelectViewport": "Kvd2vq_appearanceSelectViewport",
			"gitLogMeta": "Kvd2vq_gitLogMeta",
			"editorPdfStage": "Kvd2vq_editorPdfStage",
			"extPromptPrimary": "Kvd2vq_extPromptPrimary",
			"terminal": "Kvd2vq_terminal",
			"toggleCluster": "Kvd2vq_toggleCluster",
			"producedMore": "Kvd2vq_producedMore",
			"notesRoot": "Kvd2vq_notesRoot",
			"gitDiffHunkSection": "Kvd2vq_gitDiffHunkSection",
			"appearanceSelectIndicator": "Kvd2vq_appearanceSelectIndicator",
			"gitDiffHunk": "Kvd2vq_gitDiffHunk",
			"explorerPill": "Kvd2vq_explorerPill",
			"appearanceHeading": "Kvd2vq_appearanceHeading",
			"folderPickerFooter": "Kvd2vq_folderPickerFooter",
			"terminalDepsCommandRow": "Kvd2vq_terminalDepsCommandRow",
			"splitCol": "Kvd2vq_splitCol",
			"divider": "Kvd2vq_divider",
			"bottomPanelHidden": "Kvd2vq_bottomPanelHidden",
			"gitDiffFileTag": "Kvd2vq_gitDiffFileTag",
			"splitRow": "Kvd2vq_splitRow",
			"tabClose": "Kvd2vq_tabClose",
			"explorerRoot": "Kvd2vq_explorerRoot",
			"sandboxAction": "Kvd2vq_sandboxAction",
			"browserBar": "Kvd2vq_browserBar",
			"panelResize": "Kvd2vq_panelResize",
			"editorPdfDragShield": "Kvd2vq_editorPdfDragShield",
			"paneTabHidden": "Kvd2vq_paneTabHidden",
			"notesBindPrompt": "Kvd2vq_notesBindPrompt",
			"extList": "Kvd2vq_extList",
			"extRowRemove": "Kvd2vq_extRowRemove",
			"settingsCardSubtitle": "Kvd2vq_settingsCardSubtitle",
			"appearanceGrid": "Kvd2vq_appearanceGrid",
			"browserInput": "Kvd2vq_browserInput",
			"settingsMissing": "Kvd2vq_settingsMissing",
			"extError": "Kvd2vq_extError",
			"extRowBody": "Kvd2vq_extRowBody",
			"producedRow": "Kvd2vq_producedRow",
			"dividerActive": "Kvd2vq_dividerActive",
			"boundaryError": "Kvd2vq_boundaryError",
			"tabBadge": "Kvd2vq_tabBadge",
			"bottomPanel": "Kvd2vq_bottomPanel",
			"dropOverlay": "Kvd2vq_dropOverlay",
			"extPromptActions": "Kvd2vq_extPromptActions",
			"extPromptFile": "Kvd2vq_extPromptFile",
			"paneCardDesc": "Kvd2vq_paneCardDesc",
			"gitDiffTabTitle": "Kvd2vq_gitDiffTabTitle",
			"notesEditor": "Kvd2vq_notesEditor",
			"tabActive": "Kvd2vq_tabActive",
			"editorStatusError": "Kvd2vq_editorStatusError",
			"paneLayoutOption": "Kvd2vq_paneLayoutOption",
			"editorBanner": "Kvd2vq_editorBanner",
			"sandboxStatusOff": "Kvd2vq_sandboxStatusOff",
			"gitDiffTab": "Kvd2vq_gitDiffTab",
			"toggleButton": "Kvd2vq_toggleButton",
			"settingsGrid": "Kvd2vq_settingsGrid",
			"bottomClose": "Kvd2vq_bottomClose",
			"extRowPath": "Kvd2vq_extRowPath",
			"git": "Kvd2vq_git",
			"terminalDepsNote": "Kvd2vq_terminalDepsNote",
			"editorStatus": "Kvd2vq_editorStatus",
			"appearanceFieldLabel": "Kvd2vq_appearanceFieldLabel",
			"gitLogSubject": "Kvd2vq_gitLogSubject",
			"sandboxDot": "Kvd2vq_sandboxDot",
			"dropUp": "Kvd2vq_dropUp",
			"terminalDepsActions": "Kvd2vq_terminalDepsActions",
			"splitChild": "Kvd2vq_splitChild",
			"paneCardLabel": "Kvd2vq_paneCardLabel",
			"gitDiffMetaText": "Kvd2vq_gitDiffMetaText",
			"gitDiffExpand": "Kvd2vq_gitDiffExpand",
			"settingsCardToggleOn": "Kvd2vq_settingsCardToggleOn",
			"appearanceSelectContent": "Kvd2vq_appearanceSelectContent",
			"appearanceControl": "Kvd2vq_appearanceControl",
			"editorPdf": "Kvd2vq_editorPdf",
			"sandboxStatus": "Kvd2vq_sandboxStatus",
			"editorPdfFrame": "Kvd2vq_editorPdfFrame",
			"editorMd": "Kvd2vq_editorMd",
			"paneEmptyControls": "Kvd2vq_paneEmptyControls",
			"extPromptHint": "Kvd2vq_extPromptHint",
			"tabBarPlus": "Kvd2vq_tabBarPlus",
			"explorerSymlink": "Kvd2vq_explorerSymlink",
			"explorerError": "Kvd2vq_explorerError",
			"appearanceSelectTrigger": "Kvd2vq_appearanceSelectTrigger",
			"bottomResizeActive": "Kvd2vq_bottomResizeActive",
			"paneCardGrid": "Kvd2vq_paneCardGrid",
			"terminalBanner": "Kvd2vq_terminalBanner",
			"terminalDepsBanner": "Kvd2vq_terminalDepsBanner",
			"paneTab": "Kvd2vq_paneTab",
			"gitDiffCode": "Kvd2vq_gitDiffCode",
			"explorerHidden": "Kvd2vq_explorerHidden",
			"gitLogLine1": "Kvd2vq_gitLogLine1",
			"editorDownloadLink": "Kvd2vq_editorDownloadLink",
			"gitDiffCtx": "Kvd2vq_gitDiffCtx",
			"dropDown": "Kvd2vq_dropDown",
			"explorerEmpty": "Kvd2vq_explorerEmpty",
			"extSection": "Kvd2vq_extSection",
			"notesTree": "Kvd2vq_notesTree",
			"tabList": "Kvd2vq_tabList",
			"extHeading": "Kvd2vq_extHeading",
			"paneEmptySubheading": "Kvd2vq_paneEmptySubheading",
			"cornerHandle": "Kvd2vq_cornerHandle",
			"tabBar": "Kvd2vq_tabBar",
			"settingsCardIcon": "Kvd2vq_settingsCardIcon",
			"gitDiffDel": "Kvd2vq_gitDiffDel",
			"terminalDepsTitle": "Kvd2vq_terminalDepsTitle"
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
			const [dragOver, setDragOver] = (0, react$1.useState)(false);
			const listRef = (0, react$1.useRef)(null);
			(0, react$1.useEffect)(() => {
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
			(0, react$1.useEffect)(() => {
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
		var RenderBoundary = class extends react$1.Component {
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
				children: (0, react$1.createElement)(descriptor.component, {
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
			const [active, setActive] = (0, react$1.useState)(false);
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
			const [dropZone, setDropZone] = (0, react$1.useState)(null);
			const descriptorOf = (0, react$1.useCallback)((tab) => service.getTab(tab.type), [service]);
			const tabIconOf = (0, react$1.useCallback)((tab) => {
				const icon = descriptorOf(tab)?.icon;
				return typeof icon === "function" ? icon(16) : icon ?? null;
			}, [descriptorOf]);
			const activeTab = leaf.tabs.find((tab) => tab.id === leaf.active) ?? leaf.tabs[leaf.tabs.length - 1] ?? null;
			const onNewTabHere = (0, react$1.useCallback)((typeId) => {
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
			const onNewPane = (0, react$1.useCallback)(() => {
				store.reduce((s) => splitForNewPane(s, leaf.id, defaultSplitDir));
			}, [
				store,
				leaf.id,
				defaultSplitDir
			]);
			const onReorient = (0, react$1.useCallback)((dir) => {
				store.reduce((s) => reorientSplit(s, leaf.id, dir));
			}, [store, leaf.id]);
			const onClosePane = (0, react$1.useCallback)(() => {
				store.reduce((s) => closePane(s, leaf.id));
			}, [store, leaf.id]);
			const emptyTab = {
				label: t("newPane"),
				onClose: parentSplitDir !== void 0 ? onClosePane : onCloseRoot
			};
			const onCloseTab = (0, react$1.useCallback)((tabId) => {
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
				children: node.children.map((child, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react$1.Fragment, { children: [i > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Divider, {
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
			const sessionList = (0, react$1.useSyncExternalStore)((0, react$1.useCallback)((cb) => ctx.sessions.list.subscribe(cb), [ctx]), (0, react$1.useCallback)(() => ctx.sessions.list.getSnapshot(), [ctx]));
			const current = sessionList.current;
			(0, react$1.useEffect)(() => {
				store.setSession(current);
			}, [current, store]);
			const cwd = current === void 0 ? void 0 : sessionList.byId[current]?.cwd;
			const snapshot = (0, react$1.useSyncExternalStore)((0, react$1.useCallback)((cb) => store.subscribe(cb), [store]), (0, react$1.useCallback)(() => store.getSnapshot(), [store]));
			const state = snapshot.state;
			const [, forceUpdate] = (0, react$1.useState)(0);
			(0, react$1.useEffect)(() => service.subscribe(() => forceUpdate((n) => n + 1)), [service]);
			const collapsed = state === void 0 || !state.panelOpen;
			(0, react$1.useEffect)(() => {
				if (collapsed) document.body.setAttribute("data-dsh-sidebar-collapsed", "");
				else document.body.removeAttribute("data-dsh-sidebar-collapsed");
				return () => {
					document.body.removeAttribute("data-dsh-sidebar-collapsed");
				};
			}, [collapsed]);
			const widthDrag = (0, react$1.useRef)({
				startX: 0,
				startWidth: 0
			});
			const [draggingWidth, setDraggingWidth] = (0, react$1.useState)(false);
			const heightDrag = (0, react$1.useRef)({
				startY: 0,
				startHeight: 0
			});
			const [draggingHeight, setDraggingHeight] = (0, react$1.useState)(false);
			const bottomOpen = state?.bottomOpen === true;
			const [, bumpOnResize] = (0, react$1.useState)(0);
			(0, react$1.useEffect)(() => {
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
			(0, react$1.useEffect)(() => {
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
			(0, react$1.useEffect)(() => {
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
			const bottomPanelRef = (0, react$1.useRef)(null);
			(0, react$1.useEffect)(() => {
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
			const newTabOptions = (0, react$1.useMemo)(() => {
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
			const onNewTab = (0, react$1.useCallback)((typeId) => {
				service.openTab({ type: typeId });
			}, [service]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: sidebar_module_css_default.toggleCluster,
					style: { top: clusterTop },
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
			const [id, setId] = (0, react$1.useState)("");
			const [title, setTitle] = (0, react$1.useState)("");
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
			const [listing, setListing] = (0, react$1.useState)(null);
			const [busy, setBusy] = (0, react$1.useState)(false);
			const [error, setError] = (0, react$1.useState)(null);
			const [notice, setNotice] = (0, react$1.useState)(null);
			const [pending, setPending] = (0, react$1.useState)(null);
			const fileInput = (0, react$1.useRef)(null);
			const alive = (0, react$1.useRef)(true);
			(0, react$1.useEffect)(() => () => {
				alive.current = false;
			}, []);
			/** Re-read the installed list AND re-register the tabs from it. */
			const refresh = (0, react$1.useCallback)(async () => {
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
			(0, react$1.useEffect)(() => {
				refresh();
			}, [refresh]);
			/** POST one upload, handling the "needs an id/title" rejection specially. */
			const install = (0, react$1.useCallback)(async (upload) => {
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
			const onFile = (0, react$1.useCallback)(async (file) => {
				const dataBase64 = toBase64(new Uint8Array(await file.arrayBuffer()));
				await install({
					filename: file.name,
					dataBase64
				});
			}, [install]);
			const onRemove = (0, react$1.useCallback)(async (id) => {
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
		//#region node_modules/.pnpm/@radix-ui+number@1.1.3/node_modules/@radix-ui/number/dist/index.mjs
		var __defProp$21 = Object.defineProperty;
		var __name$21 = (target, value) => __defProp$21(target, "name", {
			value,
			configurable: true
		});
		function clamp$1(value, [min, max]) {
			return Math.min(max, Math.max(min, value));
		}
		__name$21(clamp$1, "clamp");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+primitive@1.1.7/node_modules/@radix-ui/primitive/dist/index.mjs
		var __defProp$20 = Object.defineProperty;
		var __name$20 = (target, value) => __defProp$20(target, "name", {
			value,
			configurable: true
		});
		var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
		function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
			return /* @__PURE__ */ __name$20(function handleEvent(event) {
				originalEventHandler?.(event);
				if (checkForDefaultPrevented === false || !event || !event.defaultPrevented) return ourEventHandler?.(event);
			}, "handleEvent");
		}
		__name$20(composeEventHandlers, "composeEventHandlers");
		function getOwnerWindow(element) {
			if (!canUseDOM) throw new Error("Cannot access window outside of the DOM");
			return element?.ownerDocument?.defaultView ?? window;
		}
		__name$20(getOwnerWindow, "getOwnerWindow");
		function getOwnerDocument(element) {
			if (!canUseDOM) throw new Error("Cannot access document outside of the DOM");
			return element?.ownerDocument ?? document;
		}
		__name$20(getOwnerDocument, "getOwnerDocument");
		function getActiveElement(node, activeDescendant = false) {
			const { activeElement } = getOwnerDocument(node);
			if (!activeElement?.nodeName) return null;
			if (isFrame(activeElement) && activeElement.contentDocument) return getActiveElement(activeElement.contentDocument.body, activeDescendant);
			if (activeDescendant) {
				const id = activeElement.getAttribute("aria-activedescendant");
				if (id) {
					const element = getOwnerDocument(activeElement).getElementById(id);
					if (element) return element;
				}
			}
			return activeElement;
		}
		__name$20(getActiveElement, "getActiveElement");
		function isFrame(element) {
			return element.tagName === "IFRAME";
		}
		__name$20(isFrame, "isFrame");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-context@1.2.2_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-context/dist/index.mjs
		var __defProp$19 = Object.defineProperty;
		var __name$19 = (target, value) => __defProp$19(target, "name", {
			value,
			configurable: true
		});
		// @__NO_SIDE_EFFECTS__
		function createContext2(rootComponentName, defaultContext) {
			const Context = react$1.createContext(defaultContext);
			Context.displayName = rootComponentName + "Context";
			const Provider = /* @__PURE__ */ __name$19((props) => {
				const { children, ...context } = props;
				const value = react$1.useMemo(() => context, Object.values(context));
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Context.Provider, {
					value,
					children
				});
			}, "Provider");
			Provider.displayName = rootComponentName + "Provider";
			function useContext2(consumerName, options = {}) {
				const { optional = false } = options;
				const context = react$1.useContext(Context);
				if (context) return context;
				if (defaultContext !== void 0) return defaultContext;
				if (optional) return void 0;
				throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
			}
			__name$19(useContext2, "useContext");
			return [Provider, useContext2];
		}
		__name$19(createContext2, "createContext");
		// @__NO_SIDE_EFFECTS__
		function createContextScope(scopeName, createContextScopeDeps = []) {
			let defaultContexts = [];
			function createContext3(rootComponentName, defaultContext) {
				const BaseContext = react$1.createContext(defaultContext);
				BaseContext.displayName = rootComponentName + "Context";
				const index = defaultContexts.length;
				defaultContexts = [...defaultContexts, defaultContext];
				const Provider = /* @__PURE__ */ __name$19((props) => {
					const { scope, children, ...context } = props;
					const Context = scope?.[scopeName]?.[index] || BaseContext;
					const value = react$1.useMemo(() => context, Object.values(context));
					return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Context.Provider, {
						value,
						children
					});
				}, "Provider");
				Provider.displayName = rootComponentName + "Provider";
				function useContext2(consumerName, scope, options = {}) {
					const { optional = false } = options;
					const Context = scope?.[scopeName]?.[index] || BaseContext;
					const context = react$1.useContext(Context);
					if (context) return context;
					if (defaultContext !== void 0) return defaultContext;
					if (optional) return void 0;
					throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
				}
				__name$19(useContext2, "useContext");
				return [Provider, useContext2];
			}
			__name$19(createContext3, "createContext");
			const createScope = /* @__PURE__ */ __name$19(() => {
				const scopeContexts = defaultContexts.map((defaultContext) => {
					return react$1.createContext(defaultContext);
				});
				return /* @__PURE__ */ __name$19(function useScope(scope) {
					const contexts = scope?.[scopeName] || scopeContexts;
					return react$1.useMemo(() => ({ [`__scope${scopeName}`]: {
						...scope,
						[scopeName]: contexts
					} }), [scope, contexts]);
				}, "useScope");
			}, "createScope");
			createScope.scopeName = scopeName;
			return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
		}
		__name$19(createContextScope, "createContextScope");
		function composeContextScopes(...scopes) {
			const baseScope = scopes[0];
			if (scopes.length === 1) return baseScope;
			const createScope = /* @__PURE__ */ __name$19(() => {
				const scopeHooks = scopes.map((createScope2) => ({
					useScope: createScope2(),
					scopeName: createScope2.scopeName
				}));
				return /* @__PURE__ */ __name$19(function useComposedScopes(overrideScopes) {
					const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
						const currentScope = useScope(overrideScopes)[`__scope${scopeName}`];
						return {
							...nextScopes2,
							...currentScope
						};
					}, {});
					return react$1.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
				}, "useComposedScopes");
			}, "createScope");
			createScope.scopeName = baseScope.scopeName;
			return createScope;
		}
		__name$19(composeContextScopes, "composeContextScopes");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.5_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
		var __defProp$18 = Object.defineProperty;
		var __name$18 = (target, value) => __defProp$18(target, "name", {
			value,
			configurable: true
		});
		function setRef$1(ref, value) {
			if (typeof ref === "function") return ref(value);
			else if (ref !== null && ref !== void 0) ref.current = value;
		}
		__name$18(setRef$1, "setRef");
		function composeRefs(...refs) {
			return (node) => {
				let hasCleanup = false;
				const cleanups = refs.map((ref) => {
					const cleanup = setRef$1(ref, node);
					if (!hasCleanup && typeof cleanup == "function") hasCleanup = true;
					return cleanup;
				});
				if (hasCleanup) return () => {
					for (let i = 0; i < cleanups.length; i++) {
						const cleanup = cleanups[i];
						if (typeof cleanup == "function") cleanup();
						else setRef$1(refs[i], null);
					}
				};
			};
		}
		__name$18(composeRefs, "composeRefs");
		function useComposedRefs(...refs) {
			return react$1.useCallback(composeRefs(...refs), refs);
		}
		__name$18(useComposedRefs, "useComposedRefs");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-slot@1.3.3_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-slot/dist/index.mjs
		var __defProp$17 = Object.defineProperty;
		var __name$17 = (target, value) => __defProp$17(target, "name", {
			value,
			configurable: true
		});
		// @__NO_SIDE_EFFECTS__
		function createSlot(ownerName) {
			const Slot2 = react$1.forwardRef((props, forwardedRef) => {
				let { children, ...slotProps } = props;
				let slottableElement = null;
				let hasSlottable = false;
				const newChildren = [];
				if (isLazyComponent(children) && typeof use === "function") children = use(children._payload);
				react$1.Children.forEach(children, (maybeSlottable) => {
					if (isSlottable(maybeSlottable)) {
						hasSlottable = true;
						const slottable = maybeSlottable;
						let child = "child" in slottable.props ? slottable.props.child : slottable.props.children;
						if (isLazyComponent(child) && typeof use === "function") child = use(child._payload);
						slottableElement = getSlottableElementFromSlottable(slottable, child);
						newChildren.push(slottableElement?.props?.children);
					} else newChildren.push(maybeSlottable);
				});
				if (slottableElement) slottableElement = react$1.cloneElement(slottableElement, void 0, newChildren);
				else if (!hasSlottable && react$1.Children.count(children) === 1 && react$1.isValidElement(children)) slottableElement = children;
				const slottableElementRef = slottableElement ? getElementRef$1(slottableElement) : void 0;
				const composedRef = useComposedRefs(forwardedRef, slottableElementRef);
				if (!slottableElement) {
					if (children || children === 0) throw new Error(hasSlottable ? createSlottableError(ownerName) : createSlotError(ownerName));
					return children;
				}
				const mergedProps = mergeProps(slotProps, slottableElement.props ?? {});
				if (slottableElement.type !== react$1.Fragment) mergedProps.ref = forwardedRef ? composedRef : slottableElementRef;
				return react$1.cloneElement(slottableElement, mergedProps);
			});
			Slot2.displayName = `${ownerName}.Slot`;
			return Slot2;
		}
		__name$17(createSlot, "createSlot");
		var SLOTTABLE_IDENTIFIER = Symbol.for("radix.slottable");
		// @__NO_SIDE_EFFECTS__
		function createSlottable(ownerName) {
			const Slottable2 = /* @__PURE__ */ __name$17((props) => "child" in props ? props.children(props.child) : props.children, "Slottable");
			Slottable2.displayName = `${ownerName}.Slottable`;
			Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
			return Slottable2;
		}
		__name$17(createSlottable, "createSlottable");
		var getSlottableElementFromSlottable = /* @__PURE__ */ __name$17((slottable, child) => {
			if ("child" in slottable.props) {
				const child2 = slottable.props.child;
				if (!react$1.isValidElement(child2)) return null;
				return react$1.cloneElement(child2, void 0, slottable.props.children(child2.props.children));
			}
			return react$1.isValidElement(child) ? child : null;
		}, "getSlottableElementFromSlottable");
		function mergeProps(slotProps, childProps) {
			const overrideProps = { ...childProps };
			for (const propName in childProps) {
				const slotPropValue = slotProps[propName];
				const childPropValue = childProps[propName];
				if (/^on[A-Z]/.test(propName)) {
					if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
						const result = childPropValue(...args);
						slotPropValue(...args);
						return result;
					};
					else if (slotPropValue) overrideProps[propName] = slotPropValue;
				} else if (propName === "style") overrideProps[propName] = {
					...slotPropValue,
					...childPropValue
				};
				else if (propName === "className") overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
			}
			return {
				...slotProps,
				...overrideProps
			};
		}
		__name$17(mergeProps, "mergeProps");
		function getElementRef$1(element) {
			let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
			let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
			if (mayWarn) return element.ref;
			getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
			mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
			if (mayWarn) return element.props.ref;
			return element.props.ref || element.ref;
		}
		__name$17(getElementRef$1, "getElementRef");
		function isSlottable(child) {
			return react$1.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
		}
		__name$17(isSlottable, "isSlottable");
		var REACT_LAZY_TYPE = Symbol.for("react.lazy");
		function isLazyComponent(element) {
			return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
		}
		__name$17(isLazyComponent, "isLazyComponent");
		function isPromiseLike(value) {
			return typeof value === "object" && value !== null && "then" in value;
		}
		__name$17(isPromiseLike, "isPromiseLike");
		var createSlotError = /* @__PURE__ */ __name$17((ownerName) => {
			return `${ownerName} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`;
		}, "createSlotError");
		var createSlottableError = /* @__PURE__ */ __name$17((ownerName) => {
			return `${ownerName} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`;
		}, "createSlottableError");
		var use = react$1[" use ".trim().toString()];
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-collection@1.1.15_@types+react-dom@18.3.7_@types+react@18.3.31__@types+_2112a96bceb6b62ecd4753f26b7fbff6/node_modules/@radix-ui/react-collection/dist/index.mjs
		var __defProp$16 = Object.defineProperty;
		var __name$16 = (target, value) => __defProp$16(target, "name", {
			value,
			configurable: true
		});
		// @__NO_SIDE_EFFECTS__
		function createCollection(name) {
			const PROVIDER_NAME = name + "CollectionProvider";
			const [createCollectionContext, createCollectionScope] = /* @__PURE__ */ createContextScope(PROVIDER_NAME);
			const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
				collectionRef: { current: null },
				itemMap: /* @__PURE__ */ new Map()
			});
			const CollectionProvider = /* @__PURE__ */ __name$16((props) => {
				const { scope, children } = props;
				const ref = react$1.useRef(null);
				const itemMap = react$1.useRef(/* @__PURE__ */ new Map()).current;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollectionProviderImpl, {
					scope,
					itemMap,
					collectionRef: ref,
					children
				});
			}, "CollectionProvider");
			CollectionProvider.displayName = PROVIDER_NAME;
			const COLLECTION_SLOT_NAME = name + "CollectionSlot";
			const CollectionSlotImpl = /* @__PURE__ */ createSlot(COLLECTION_SLOT_NAME);
			const CollectionSlot = react$1.forwardRef((props, forwardedRef) => {
				const { scope, children } = props;
				const composedRefs = useComposedRefs(forwardedRef, useCollectionContext(COLLECTION_SLOT_NAME, scope).collectionRef);
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollectionSlotImpl, {
					ref: composedRefs,
					children
				});
			});
			CollectionSlot.displayName = COLLECTION_SLOT_NAME;
			const ITEM_SLOT_NAME = name + "CollectionItemSlot";
			const ITEM_DATA_ATTR = "data-radix-collection-item";
			const CollectionItemSlotImpl = /* @__PURE__ */ createSlot(ITEM_SLOT_NAME);
			const CollectionItemSlot = react$1.forwardRef((props, forwardedRef) => {
				const { scope, children, ...itemData } = props;
				const ref = react$1.useRef(null);
				const composedRefs = useComposedRefs(forwardedRef, ref);
				const context = useCollectionContext(ITEM_SLOT_NAME, scope);
				react$1.useEffect(() => {
					context.itemMap.set(ref, {
						ref,
						...itemData
					});
					return () => void context.itemMap.delete(ref);
				});
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollectionItemSlotImpl, {
					[ITEM_DATA_ATTR]: "",
					ref: composedRefs,
					children
				});
			});
			CollectionItemSlot.displayName = ITEM_SLOT_NAME;
			function useCollection(scope) {
				const context = useCollectionContext(name + "CollectionConsumer", scope);
				return react$1.useCallback(() => {
					const collectionNode = context.collectionRef.current;
					if (!collectionNode) return [];
					const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
					return Array.from(context.itemMap.values()).sort((a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current));
				}, [context.collectionRef, context.itemMap]);
			}
			__name$16(useCollection, "useCollection");
			return [
				{
					Provider: CollectionProvider,
					Slot: CollectionSlot,
					ItemSlot: CollectionItemSlot
				},
				useCollection,
				createCollectionScope
			];
		}
		__name$16(createCollection, "createCollection");
		var __instanciated = /* @__PURE__ */ new WeakMap();
		var OrderedDict = class _OrderedDict extends Map {
			static {
				__name$16(this, "OrderedDict");
			}
			#keys;
			constructor(entries) {
				super(entries);
				this.#keys = [...super.keys()];
				__instanciated.set(this, true);
			}
			set(key, value) {
				if (__instanciated.get(this)) {
					if (this.has(key)) this.#keys[this.#keys.indexOf(key)] = key;
					else this.#keys.push(key);
				}
				super.set(key, value);
				return this;
			}
			insert(index, key, value) {
				const has = this.has(key);
				const length = this.#keys.length;
				const relativeIndex = toSafeInteger(index);
				let actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
				const safeIndex = actualIndex < 0 || actualIndex >= length ? -1 : actualIndex;
				if (safeIndex === this.size || has && safeIndex === this.size - 1 || safeIndex === -1) {
					this.set(key, value);
					return this;
				}
				const size = this.size + (has ? 0 : 1);
				if (relativeIndex < 0) actualIndex++;
				const keys = [...this.#keys];
				let nextValue;
				let shouldSkip = false;
				for (let i = actualIndex; i < size; i++) if (actualIndex === i) {
					let nextKey = keys[i];
					if (keys[i] === key) nextKey = keys[i + 1];
					if (has) this.delete(key);
					nextValue = this.get(nextKey);
					this.set(key, value);
				} else {
					if (!shouldSkip && keys[i - 1] === key) shouldSkip = true;
					const currentKey = keys[shouldSkip ? i : i - 1];
					const currentValue = nextValue;
					nextValue = this.get(currentKey);
					this.delete(currentKey);
					this.set(currentKey, currentValue);
				}
				return this;
			}
			with(index, key, value) {
				const copy = new _OrderedDict(this);
				copy.insert(index, key, value);
				return copy;
			}
			before(key) {
				const index = this.#keys.indexOf(key) - 1;
				if (index < 0) return;
				return this.entryAt(index);
			}
			/**
			* Sets a new key-value pair at the position before the given key.
			*/
			setBefore(key, newKey, value) {
				const index = this.#keys.indexOf(key);
				if (index === -1) return this;
				return this.insert(index, newKey, value);
			}
			after(key) {
				let index = this.#keys.indexOf(key);
				index = index === -1 || index === this.size - 1 ? -1 : index + 1;
				if (index === -1) return;
				return this.entryAt(index);
			}
			/**
			* Sets a new key-value pair at the position after the given key.
			*/
			setAfter(key, newKey, value) {
				const index = this.#keys.indexOf(key);
				if (index === -1) return this;
				return this.insert(index + 1, newKey, value);
			}
			first() {
				return this.entryAt(0);
			}
			last() {
				return this.entryAt(-1);
			}
			clear() {
				this.#keys = [];
				return super.clear();
			}
			delete(key) {
				const deleted = super.delete(key);
				if (deleted) this.#keys.splice(this.#keys.indexOf(key), 1);
				return deleted;
			}
			deleteAt(index) {
				const key = this.keyAt(index);
				if (key !== void 0) return this.delete(key);
				return false;
			}
			at(index) {
				const key = at(this.#keys, index);
				if (key !== void 0) return this.get(key);
			}
			entryAt(index) {
				const key = at(this.#keys, index);
				if (key !== void 0) return [key, this.get(key)];
			}
			indexOf(key) {
				return this.#keys.indexOf(key);
			}
			keyAt(index) {
				return at(this.#keys, index);
			}
			from(key, offset) {
				const index = this.indexOf(key);
				if (index === -1) return;
				let dest = index + offset;
				if (dest < 0) dest = 0;
				if (dest >= this.size) dest = this.size - 1;
				return this.at(dest);
			}
			keyFrom(key, offset) {
				const index = this.indexOf(key);
				if (index === -1) return;
				let dest = index + offset;
				if (dest < 0) dest = 0;
				if (dest >= this.size) dest = this.size - 1;
				return this.keyAt(dest);
			}
			find(predicate, thisArg) {
				let index = 0;
				for (const entry of this) {
					if (Reflect.apply(predicate, thisArg, [
						entry,
						index,
						this
					])) return entry;
					index++;
				}
			}
			findIndex(predicate, thisArg) {
				let index = 0;
				for (const entry of this) {
					if (Reflect.apply(predicate, thisArg, [
						entry,
						index,
						this
					])) return index;
					index++;
				}
				return -1;
			}
			filter(predicate, thisArg) {
				const entries = [];
				let index = 0;
				for (const entry of this) {
					if (Reflect.apply(predicate, thisArg, [
						entry,
						index,
						this
					])) entries.push(entry);
					index++;
				}
				return new _OrderedDict(entries);
			}
			map(callbackfn, thisArg) {
				const entries = [];
				let index = 0;
				for (const entry of this) {
					entries.push([entry[0], Reflect.apply(callbackfn, thisArg, [
						entry,
						index,
						this
					])]);
					index++;
				}
				return new _OrderedDict(entries);
			}
			reduce(...args) {
				const [callbackfn, initialValue] = args;
				let index = 0;
				let accumulator = initialValue ?? this.at(0);
				for (const entry of this) {
					if (index === 0 && args.length === 1) accumulator = entry;
					else accumulator = Reflect.apply(callbackfn, this, [
						accumulator,
						entry,
						index,
						this
					]);
					index++;
				}
				return accumulator;
			}
			reduceRight(...args) {
				const [callbackfn, initialValue] = args;
				let accumulator = initialValue ?? this.at(-1);
				for (let index = this.size - 1; index >= 0; index--) {
					const entry = this.at(index);
					if (index === this.size - 1 && args.length === 1) accumulator = entry;
					else accumulator = Reflect.apply(callbackfn, this, [
						accumulator,
						entry,
						index,
						this
					]);
				}
				return accumulator;
			}
			toSorted(compareFn) {
				const entries = [...this.entries()].sort(compareFn);
				return new _OrderedDict(entries);
			}
			toReversed() {
				const reversed = new _OrderedDict();
				for (let index = this.size - 1; index >= 0; index--) {
					const key = this.keyAt(index);
					const element = this.get(key);
					reversed.set(key, element);
				}
				return reversed;
			}
			toSpliced(...args) {
				const entries = [...this.entries()];
				entries.splice(...args);
				return new _OrderedDict(entries);
			}
			slice(start, end) {
				const result = new _OrderedDict();
				let stop = this.size - 1;
				if (start === void 0) return result;
				if (start < 0) start = start + this.size;
				if (end !== void 0 && end > 0) stop = end - 1;
				for (let index = start; index <= stop; index++) {
					const key = this.keyAt(index);
					const element = this.get(key);
					result.set(key, element);
				}
				return result;
			}
			every(predicate, thisArg) {
				let index = 0;
				for (const entry of this) {
					if (!Reflect.apply(predicate, thisArg, [
						entry,
						index,
						this
					])) return false;
					index++;
				}
				return true;
			}
			some(predicate, thisArg) {
				let index = 0;
				for (const entry of this) {
					if (Reflect.apply(predicate, thisArg, [
						entry,
						index,
						this
					])) return true;
					index++;
				}
				return false;
			}
		};
		function at(array, index) {
			if ("at" in Array.prototype) return Array.prototype.at.call(array, index);
			const actualIndex = toSafeIndex(array, index);
			return actualIndex === -1 ? void 0 : array[actualIndex];
		}
		__name$16(at, "at");
		function toSafeIndex(array, index) {
			const length = array.length;
			const relativeIndex = toSafeInteger(index);
			const actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex;
			return actualIndex < 0 || actualIndex >= length ? -1 : actualIndex;
		}
		__name$16(toSafeIndex, "toSafeIndex");
		function toSafeInteger(number) {
			return number !== number || number === 0 ? 0 : Math.trunc(number);
		}
		__name$16(toSafeInteger, "toSafeInteger");
		// @__NO_SIDE_EFFECTS__
		function createCollection2(name) {
			const PROVIDER_NAME = name + "CollectionProvider";
			const [createCollectionContext, createCollectionScope] = /* @__PURE__ */ createContextScope(PROVIDER_NAME);
			const [CollectionContextProvider, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
				collectionElement: null,
				collectionRef: { current: null },
				collectionRefObject: { current: null },
				itemMap: new OrderedDict(),
				setItemMap: /* @__PURE__ */ __name$16(() => void 0, "setItemMap")
			});
			const CollectionProvider = /* @__PURE__ */ __name$16(({ state, ...props }) => {
				return state ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollectionProviderImpl, {
					...props,
					state
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollectionInit, { ...props });
			}, "CollectionProvider");
			CollectionProvider.displayName = PROVIDER_NAME;
			const CollectionInit = /* @__PURE__ */ __name$16((props) => {
				const state = useInitCollection();
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollectionProviderImpl, {
					...props,
					state
				});
			}, "CollectionInit");
			CollectionInit.displayName = PROVIDER_NAME + "Init";
			const CollectionProviderImpl = /* @__PURE__ */ __name$16((props) => {
				const { scope, children, state } = props;
				const ref = react$1.useRef(null);
				const [collectionElement, setCollectionElement] = react$1.useState(null);
				const composeRefs = useComposedRefs(ref, setCollectionElement);
				const [itemMap, setItemMap] = state;
				react$1.useEffect(() => {
					if (!collectionElement) return;
					const observer = getChildListObserver(() => {});
					observer.observe(collectionElement, {
						childList: true,
						subtree: true
					});
					return () => {
						observer.disconnect();
					};
				}, [collectionElement]);
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollectionContextProvider, {
					scope,
					itemMap,
					setItemMap,
					collectionRef: composeRefs,
					collectionRefObject: ref,
					collectionElement,
					children
				});
			}, "CollectionProviderImpl");
			CollectionProviderImpl.displayName = PROVIDER_NAME + "Impl";
			const COLLECTION_SLOT_NAME = name + "CollectionSlot";
			const CollectionSlotImpl = /* @__PURE__ */ createSlot(COLLECTION_SLOT_NAME);
			const CollectionSlot = react$1.forwardRef((props, forwardedRef) => {
				const { scope, children } = props;
				const composedRefs = useComposedRefs(forwardedRef, useCollectionContext(COLLECTION_SLOT_NAME, scope).collectionRef);
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollectionSlotImpl, {
					ref: composedRefs,
					children
				});
			});
			CollectionSlot.displayName = COLLECTION_SLOT_NAME;
			const ITEM_SLOT_NAME = name + "CollectionItemSlot";
			const ITEM_DATA_ATTR = "data-radix-collection-item";
			const CollectionItemSlotImpl = /* @__PURE__ */ createSlot(ITEM_SLOT_NAME);
			const CollectionItemSlot = react$1.forwardRef((props, forwardedRef) => {
				const { scope, children, ...itemData } = props;
				const ref = react$1.useRef(null);
				const [element, setElement] = react$1.useState(null);
				const composedRefs = useComposedRefs(forwardedRef, ref, setElement);
				const { setItemMap } = useCollectionContext(ITEM_SLOT_NAME, scope);
				const itemDataRef = react$1.useRef(itemData);
				if (!shallowEqual(itemDataRef.current, itemData)) itemDataRef.current = itemData;
				const memoizedItemData = itemDataRef.current;
				react$1.useEffect(() => {
					const itemData2 = memoizedItemData;
					setItemMap((map) => {
						if (!element) return map;
						if (!map.has(element)) {
							map.set(element, {
								...itemData2,
								element
							});
							return map.toSorted(sortByDocumentPosition);
						}
						return map.set(element, {
							...itemData2,
							element
						}).toSorted(sortByDocumentPosition);
					});
					return () => {
						setItemMap((map) => {
							if (!element || !map.has(element)) return map;
							map.delete(element);
							return new OrderedDict(map);
						});
					};
				}, [
					element,
					memoizedItemData,
					setItemMap
				]);
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollectionItemSlotImpl, {
					[ITEM_DATA_ATTR]: "",
					ref: composedRefs,
					children
				});
			});
			CollectionItemSlot.displayName = ITEM_SLOT_NAME;
			function useInitCollection() {
				return react$1.useState(new OrderedDict());
			}
			__name$16(useInitCollection, "useInitCollection");
			function useCollection(scope) {
				const { itemMap } = useCollectionContext(name + "CollectionConsumer", scope);
				return itemMap;
			}
			__name$16(useCollection, "useCollection");
			return [{
				Provider: CollectionProvider,
				Slot: CollectionSlot,
				ItemSlot: CollectionItemSlot
			}, {
				createCollectionScope,
				useCollection,
				useInitCollection
			}];
		}
		__name$16(createCollection2, "createCollection");
		function shallowEqual(a, b) {
			if (a === b) return true;
			if (typeof a !== "object" || typeof b !== "object") return false;
			if (a == null || b == null) return false;
			const keysA = Object.keys(a);
			const keysB = Object.keys(b);
			if (keysA.length !== keysB.length) return false;
			for (const key of keysA) {
				if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
				if (a[key] !== b[key]) return false;
			}
			return true;
		}
		__name$16(shallowEqual, "shallowEqual");
		function isElementPreceding(a, b) {
			return !!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
		}
		__name$16(isElementPreceding, "isElementPreceding");
		function sortByDocumentPosition(a, b) {
			return !a[1].element || !b[1].element ? 0 : isElementPreceding(a[1].element, b[1].element) ? -1 : 1;
		}
		__name$16(sortByDocumentPosition, "sortByDocumentPosition");
		function getChildListObserver(callback) {
			return new MutationObserver((mutationsList) => {
				for (const mutation of mutationsList) if (mutation.type === "childList") {
					callback();
					return;
				}
			});
		}
		__name$16(getChildListObserver, "getChildListObserver");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-direction@1.1.4_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-direction/dist/index.mjs
		var __defProp$15 = Object.defineProperty;
		var __name$15 = (target, value) => __defProp$15(target, "name", {
			value,
			configurable: true
		});
		var DirectionContext = react$1.createContext(void 0);
		function useDirection(localDir) {
			const globalDir = react$1.useContext(DirectionContext);
			return localDir || globalDir || "ltr";
		}
		__name$15(useDirection, "useDirection");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-primitive@2.1.10_@types+react-dom@18.3.7_@types+react@18.3.31__@types+r_13f2c98306b57ec3095ec9668f21e5b2/node_modules/@radix-ui/react-primitive/dist/index.mjs
		var __defProp$14 = Object.defineProperty;
		var __name$14 = (target, value) => __defProp$14(target, "name", {
			value,
			configurable: true
		});
		var Primitive = [
			"a",
			"button",
			"div",
			"form",
			"h2",
			"h3",
			"img",
			"input",
			"label",
			"li",
			"nav",
			"ol",
			"p",
			"select",
			"span",
			"svg",
			"ul"
		].reduce((primitive, node) => {
			const Slot = /* @__PURE__ */ createSlot(`Primitive.${node}`);
			const Node = react$1.forwardRef((props, forwardedRef) => {
				const { asChild, ...primitiveProps } = props;
				const Comp = asChild ? Slot : node;
				if (typeof window !== "undefined") window[Symbol.for("radix-ui")] = true;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Comp, {
					...primitiveProps,
					ref: forwardedRef
				});
			});
			Node.displayName = `Primitive.${node}`;
			return {
				...primitive,
				[node]: Node
			};
		}, {});
		function dispatchDiscreteCustomEvent(target, event) {
			if (target) react_dom.flushSync(() => target.dispatchEvent(event));
		}
		__name$14(dispatchDiscreteCustomEvent, "dispatchDiscreteCustomEvent");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.4_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
		var __defProp$13 = Object.defineProperty;
		var __name$13 = (target, value) => __defProp$13(target, "name", {
			value,
			configurable: true
		});
		function useCallbackRef$1(callback) {
			const callbackRef = react$1.useRef(callback);
			react$1.useEffect(() => {
				callbackRef.current = callback;
			});
			return react$1.useMemo(() => ((...args) => callbackRef.current?.(...args)), []);
		}
		__name$13(useCallbackRef$1, "useCallbackRef");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-dismissable-layer@1.1.19_@types+react-dom@18.3.7_@types+react@18.3.31___7124fa7a64d9804273e89d2c10b89c69/node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
		var __defProp$12 = Object.defineProperty;
		var __name$12 = (target, value) => __defProp$12(target, "name", {
			value,
			configurable: true
		});
		var CONTEXT_UPDATE = "dismissableLayer.update";
		var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
		var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
		var originalBodyPointerEvents;
		var DismissableLayerContext = react$1.createContext({
			layers: /* @__PURE__ */ new Set(),
			layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
			branches: /* @__PURE__ */ new Set(),
			dismissableSurfaces: /* @__PURE__ */ new Set()
		});
		var DismissableLayer = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$12(function DismissableLayer2(props, forwardedRef) {
			const { disableOutsidePointerEvents = false, deferPointerDownOutside = false, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, ...layerProps } = props;
			const context = react$1.useContext(DismissableLayerContext);
			const [node, setNode] = react$1.useState(null);
			const ownerDocument = node?.ownerDocument ?? globalThis?.document;
			const [, force] = react$1.useState({});
			const composedRefs = useComposedRefs(forwardedRef, setNode);
			const layers = Array.from(context.layers);
			const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
			const highestLayerWithOutsidePointerEventsDisabledIndex = highestLayerWithOutsidePointerEventsDisabled ? layers.indexOf(highestLayerWithOutsidePointerEventsDisabled) : -1;
			const index = node ? layers.indexOf(node) : -1;
			const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
			const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
			const isDeferredPointerDownOutsideRef = react$1.useRef(false);
			const pointerDownOutside = usePointerDownOutside((event) => {
				onPointerDownOutside?.(event);
				onInteractOutside?.(event);
				if (!event.defaultPrevented) onDismiss?.();
			}, {
				ownerDocument,
				deferPointerDownOutside,
				isDeferredPointerDownOutsideRef,
				dismissableSurfaces: context.dismissableSurfaces,
				shouldHandlePointerDownOutside: react$1.useCallback((target) => {
					if (!(target instanceof Node)) return false;
					const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
					return isPointerEventsEnabled && !isPointerDownOnBranch;
				}, [context.branches, isPointerEventsEnabled])
			});
			const focusOutside = useFocusOutside((event) => {
				if (deferPointerDownOutside && isDeferredPointerDownOutsideRef.current) return;
				const target = event.target;
				if ([...context.branches].some((branch) => branch.contains(target))) return;
				onFocusOutside?.(event);
				onInteractOutside?.(event);
				if (!event.defaultPrevented) onDismiss?.();
			}, ownerDocument);
			const isHighestLayer = node ? index === layers.length - 1 : false;
			const handleKeyDown = useCallbackRef$1((event) => {
				if (event.key !== "Escape") return;
				onEscapeKeyDown?.(event);
				if (!event.defaultPrevented && onDismiss) {
					event.preventDefault();
					onDismiss();
				}
			});
			react$1.useEffect(() => {
				if (!isHighestLayer) return;
				ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
				return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
			}, [
				ownerDocument,
				isHighestLayer,
				handleKeyDown
			]);
			react$1.useEffect(() => {
				if (!node) return;
				if (disableOutsidePointerEvents) {
					if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
						originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
						ownerDocument.body.style.pointerEvents = "none";
					}
					context.layersWithOutsidePointerEventsDisabled.add(node);
				}
				context.layers.add(node);
				dispatchUpdate();
				return () => {
					if (disableOutsidePointerEvents) {
						context.layersWithOutsidePointerEventsDisabled.delete(node);
						if (context.layersWithOutsidePointerEventsDisabled.size === 0) ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
					}
				};
			}, [
				node,
				ownerDocument,
				disableOutsidePointerEvents,
				context
			]);
			react$1.useEffect(() => {
				return () => {
					if (!node) return;
					context.layers.delete(node);
					context.layersWithOutsidePointerEventsDisabled.delete(node);
					dispatchUpdate();
				};
			}, [node, context]);
			react$1.useEffect(() => {
				const handleUpdate = /* @__PURE__ */ __name$12(() => force({}), "handleUpdate");
				document.addEventListener(CONTEXT_UPDATE, handleUpdate);
				return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
			}, []);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.div, {
				...layerProps,
				ref: composedRefs,
				style: {
					pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
					...props.style
				},
				onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
				onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
				onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, pointerDownOutside.onPointerDownCapture)
			});
		}, "DismissableLayer"));
		function useDismissableLayerSurface() {
			const context = react$1.useContext(DismissableLayerContext);
			const [node, setNode] = react$1.useState(null);
			react$1.useEffect(() => {
				if (!node) return;
				context.dismissableSurfaces.add(node);
				return () => {
					context.dismissableSurfaces.delete(node);
				};
			}, [node, context.dismissableSurfaces]);
			return setNode;
		}
		__name$12(useDismissableLayerSurface, "useDismissableLayerSurface");
		var IS_TRUE = /* @__PURE__ */ __name$12(() => true, "IS_TRUE");
		function usePointerDownOutside(onPointerDownOutside, args) {
			const { ownerDocument = globalThis?.document, deferPointerDownOutside = false, isDeferredPointerDownOutsideRef, dismissableSurfaces, shouldHandlePointerDownOutside = IS_TRUE } = args;
			const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
			const isPointerInsideReactTreeRef = react$1.useRef(false);
			const isPointerDownOutsideRef = react$1.useRef(false);
			const interceptedOutsideInteractionEventsRef = react$1.useRef(/* @__PURE__ */ new Map());
			const handleClickRef = react$1.useRef(() => {});
			react$1.useEffect(() => {
				function resetOutsideInteraction() {
					isPointerDownOutsideRef.current = false;
					isDeferredPointerDownOutsideRef.current = false;
					interceptedOutsideInteractionEventsRef.current.clear();
				}
				__name$12(resetOutsideInteraction, "resetOutsideInteraction");
				function isOutsideInteractionIntercepted() {
					return Array.from(interceptedOutsideInteractionEventsRef.current.values()).some(Boolean);
				}
				__name$12(isOutsideInteractionIntercepted, "isOutsideInteractionIntercepted");
				function handleInteractionCapture(event) {
					if (!isPointerDownOutsideRef.current) return;
					const target = event.target;
					if (!(target instanceof Node && [...dismissableSurfaces].some((surface) => surface.contains(target)))) interceptedOutsideInteractionEventsRef.current.set(event.type, true);
					if (event.type === "click") window.setTimeout(() => {
						if (isPointerDownOutsideRef.current) handleClickRef.current();
					}, 0);
				}
				__name$12(handleInteractionCapture, "handleInteractionCapture");
				function handleInteractionBubble(event) {
					if (isPointerDownOutsideRef.current) interceptedOutsideInteractionEventsRef.current.set(event.type, false);
				}
				__name$12(handleInteractionBubble, "handleInteractionBubble");
				const handlePointerDown = /* @__PURE__ */ __name$12((event) => {
					if (event.target && !isPointerInsideReactTreeRef.current) {
						let handleAndDispatchPointerDownOutsideEvent2 = function() {
							ownerDocument.removeEventListener("click", handleClickRef.current);
							const wasOutsideInteractionIntercepted = isOutsideInteractionIntercepted();
							resetOutsideInteraction();
							if (!wasOutsideInteractionIntercepted) handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail, { discrete: true });
						};
						__name$12(handleAndDispatchPointerDownOutsideEvent2, "handleAndDispatchPointerDownOutsideEvent");
						if (!shouldHandlePointerDownOutside(event.target)) {
							ownerDocument.removeEventListener("click", handleClickRef.current);
							resetOutsideInteraction();
							isPointerInsideReactTreeRef.current = false;
							return;
						}
						const eventDetail = { originalEvent: event };
						isPointerDownOutsideRef.current = true;
						isDeferredPointerDownOutsideRef.current = deferPointerDownOutside && event.button === 0;
						interceptedOutsideInteractionEventsRef.current.clear();
						if (!deferPointerDownOutside || event.button !== 0) handleAndDispatchPointerDownOutsideEvent2();
						else {
							ownerDocument.removeEventListener("click", handleClickRef.current);
							handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
							ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
						}
					} else {
						ownerDocument.removeEventListener("click", handleClickRef.current);
						resetOutsideInteraction();
					}
					isPointerInsideReactTreeRef.current = false;
				}, "handlePointerDown");
				const outsideInteractionEvents = [
					"pointerup",
					"mousedown",
					"mouseup",
					"touchstart",
					"touchend",
					"click"
				];
				for (const eventName of outsideInteractionEvents) {
					ownerDocument.addEventListener(eventName, handleInteractionCapture, true);
					ownerDocument.addEventListener(eventName, handleInteractionBubble);
				}
				const timerId = window.setTimeout(() => {
					ownerDocument.addEventListener("pointerdown", handlePointerDown);
				}, 0);
				return () => {
					window.clearTimeout(timerId);
					ownerDocument.removeEventListener("pointerdown", handlePointerDown);
					ownerDocument.removeEventListener("click", handleClickRef.current);
					for (const eventName of outsideInteractionEvents) {
						ownerDocument.removeEventListener(eventName, handleInteractionCapture, true);
						ownerDocument.removeEventListener(eventName, handleInteractionBubble);
					}
				};
			}, [
				ownerDocument,
				handlePointerDownOutside,
				deferPointerDownOutside,
				isDeferredPointerDownOutsideRef,
				dismissableSurfaces,
				shouldHandlePointerDownOutside
			]);
			return { onPointerDownCapture: /* @__PURE__ */ __name$12(() => isPointerInsideReactTreeRef.current = true, "onPointerDownCapture") };
		}
		__name$12(usePointerDownOutside, "usePointerDownOutside");
		function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
			const handleFocusOutside = useCallbackRef$1(onFocusOutside);
			const isFocusInsideReactTreeRef = react$1.useRef(false);
			react$1.useEffect(() => {
				const handleFocus = /* @__PURE__ */ __name$12((event) => {
					if (event.target && !isFocusInsideReactTreeRef.current) handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, { originalEvent: event }, { discrete: false });
				}, "handleFocus");
				ownerDocument.addEventListener("focusin", handleFocus);
				return () => ownerDocument.removeEventListener("focusin", handleFocus);
			}, [ownerDocument, handleFocusOutside]);
			return {
				onFocusCapture: /* @__PURE__ */ __name$12(() => isFocusInsideReactTreeRef.current = true, "onFocusCapture"),
				onBlurCapture: /* @__PURE__ */ __name$12(() => isFocusInsideReactTreeRef.current = false, "onBlurCapture")
			};
		}
		__name$12(useFocusOutside, "useFocusOutside");
		function dispatchUpdate() {
			const event = new CustomEvent(CONTEXT_UPDATE);
			document.dispatchEvent(event);
		}
		__name$12(dispatchUpdate, "dispatchUpdate");
		function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
			const target = detail.originalEvent.target;
			const event = new CustomEvent(name, {
				bubbles: false,
				cancelable: true,
				detail
			});
			if (handler) target.addEventListener(name, handler, { once: true });
			if (discrete) dispatchDiscreteCustomEvent(target, event);
			else target.dispatchEvent(event);
		}
		__name$12(handleAndDispatchCustomEvent, "handleAndDispatchCustomEvent");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-focus-guards@1.1.6_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-focus-guards/dist/index.mjs
		var __defProp$11 = Object.defineProperty;
		var __name$11 = (target, value) => __defProp$11(target, "name", {
			value,
			configurable: true
		});
		var count$1 = 0;
		var guards = null;
		function FocusGuards(props) {
			useFocusGuards();
			return props.children;
		}
		__name$11(FocusGuards, "FocusGuards");
		function useFocusGuards() {
			react$1.useEffect(() => {
				if (!guards) guards = {
					start: createFocusGuard(),
					end: createFocusGuard()
				};
				const { start, end } = guards;
				if (document.body.firstElementChild !== start) document.body.insertAdjacentElement("afterbegin", start);
				if (document.body.lastElementChild !== end) document.body.insertAdjacentElement("beforeend", end);
				count$1++;
				return () => {
					if (count$1 === 1) {
						guards?.start.remove();
						guards?.end.remove();
						guards = null;
					}
					count$1 = Math.max(0, count$1 - 1);
				};
			}, []);
		}
		__name$11(useFocusGuards, "useFocusGuards");
		function createFocusGuard() {
			const element = document.createElement("span");
			element.setAttribute("data-radix-focus-guard", "");
			element.tabIndex = 0;
			element.style.outline = "none";
			element.style.opacity = "0";
			element.style.position = "fixed";
			element.style.pointerEvents = "none";
			return element;
		}
		__name$11(createFocusGuard, "createFocusGuard");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-focus-scope@1.1.16_@types+react-dom@18.3.7_@types+react@18.3.31__@types_c897b3d4475f359d06f1ee3270126427/node_modules/@radix-ui/react-focus-scope/dist/index.mjs
		var __defProp$10 = Object.defineProperty;
		var __name$10 = (target, value) => __defProp$10(target, "name", {
			value,
			configurable: true
		});
		var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
		var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
		var EVENT_OPTIONS = {
			bubbles: false,
			cancelable: true
		};
		var FocusScope = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$10(function FocusScope2(props, forwardedRef) {
			const { loop = false, trapped = false, onMountAutoFocus: onMountAutoFocusProp, onUnmountAutoFocus: onUnmountAutoFocusProp, ...scopeProps } = props;
			const [container, setContainer] = react$1.useState(null);
			const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
			const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
			const lastFocusedElementRef = react$1.useRef(null);
			const composedRefs = useComposedRefs(forwardedRef, setContainer);
			const focusScope = react$1.useRef({
				paused: false,
				pause() {
					this.paused = true;
				},
				resume() {
					this.paused = false;
				}
			}).current;
			react$1.useEffect(() => {
				if (trapped) {
					let handleFocusIn2 = function(event) {
						if (focusScope.paused || !container) return;
						const target = event.target;
						if (container.contains(target)) lastFocusedElementRef.current = target;
						else focus(lastFocusedElementRef.current, { select: true });
					}, handleFocusOut2 = function(event) {
						if (focusScope.paused || !container) return;
						const relatedTarget = event.relatedTarget;
						if (relatedTarget === null) return;
						if (!container.contains(relatedTarget)) focus(lastFocusedElementRef.current, { select: true });
					}, handleMutations2 = function(mutations) {
						if (document.activeElement !== document.body) return;
						for (const mutation of mutations) if (mutation.removedNodes.length > 0) focus(container);
					};
					__name$10(handleFocusIn2, "handleFocusIn");
					__name$10(handleFocusOut2, "handleFocusOut");
					__name$10(handleMutations2, "handleMutations");
					document.addEventListener("focusin", handleFocusIn2);
					document.addEventListener("focusout", handleFocusOut2);
					const mutationObserver = new MutationObserver(handleMutations2);
					if (container) mutationObserver.observe(container, {
						childList: true,
						subtree: true
					});
					return () => {
						document.removeEventListener("focusin", handleFocusIn2);
						document.removeEventListener("focusout", handleFocusOut2);
						mutationObserver.disconnect();
					};
				}
			}, [
				trapped,
				container,
				focusScope.paused
			]);
			react$1.useEffect(() => {
				if (container) {
					focusScopesStack.add(focusScope);
					const previouslyFocusedElement = document.activeElement;
					if (!container.contains(previouslyFocusedElement)) {
						const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
						container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
						container.dispatchEvent(mountEvent);
						if (!mountEvent.defaultPrevented) {
							focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
							if (document.activeElement === previouslyFocusedElement) focus(container);
						}
					}
					return () => {
						container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
						setTimeout(() => {
							const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
							container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
							container.dispatchEvent(unmountEvent);
							if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? document.body, { select: true });
							container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
							focusScopesStack.remove(focusScope);
						}, 0);
					};
				}
			}, [
				container,
				onMountAutoFocus,
				onUnmountAutoFocus,
				focusScope
			]);
			const handleKeyDown = react$1.useCallback((event) => {
				if (!loop && !trapped) return;
				if (focusScope.paused) return;
				const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
				const focusedElement = document.activeElement;
				if (isTabKey && focusedElement) {
					const container2 = event.currentTarget;
					const [first, last] = getTabbableEdges(container2);
					if (!(first && last)) {
						if (focusedElement === container2) event.preventDefault();
					} else if (!event.shiftKey && focusedElement === last) {
						event.preventDefault();
						if (loop) focus(first, { select: true });
					} else if (event.shiftKey && focusedElement === first) {
						event.preventDefault();
						if (loop) focus(last, { select: true });
					}
				}
			}, [
				loop,
				trapped,
				focusScope.paused
			]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.div, {
				tabIndex: -1,
				...scopeProps,
				ref: composedRefs,
				onKeyDown: handleKeyDown
			});
		}, "FocusScope"));
		function focusFirst(candidates, { select = false } = {}) {
			const previouslyFocusedElement = document.activeElement;
			for (const candidate of candidates) {
				focus(candidate, { select });
				if (document.activeElement !== previouslyFocusedElement) return;
			}
		}
		__name$10(focusFirst, "focusFirst");
		function getTabbableEdges(container) {
			const candidates = getTabbableCandidates(container);
			return [findVisible(candidates, container), findVisible(candidates.reverse(), container)];
		}
		__name$10(getTabbableEdges, "getTabbableEdges");
		function getTabbableCandidates(container) {
			const nodes = [];
			const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: /* @__PURE__ */ __name$10((node) => {
				const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
				if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
				return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
			}, "acceptNode") });
			while (walker.nextNode()) nodes.push(walker.currentNode);
			return nodes;
		}
		__name$10(getTabbableCandidates, "getTabbableCandidates");
		function findVisible(elements, container) {
			const canUseCheckVisibility = typeof container.checkVisibility === "function" && container.checkVisibility({ checkVisibilityCSS: true });
			for (const element of elements) if (!(canUseCheckVisibility ? !element.checkVisibility({ checkVisibilityCSS: true }) : isHidden(element, { upTo: container }))) return element;
		}
		__name$10(findVisible, "findVisible");
		function isHidden(node, { upTo }) {
			if (getComputedStyle(node).visibility === "hidden") return true;
			while (node) {
				if (upTo !== void 0 && node === upTo) return false;
				if (getComputedStyle(node).display === "none") return true;
				node = node.parentElement;
			}
			return false;
		}
		__name$10(isHidden, "isHidden");
		function isSelectableInput(element) {
			return element instanceof HTMLInputElement && "select" in element;
		}
		__name$10(isSelectableInput, "isSelectableInput");
		function focus(element, { select = false } = {}) {
			if (element && element.focus) {
				const previouslyFocusedElement = document.activeElement;
				element.focus({ preventScroll: true });
				if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
			}
		}
		__name$10(focus, "focus");
		var focusScopesStack = createFocusScopesStack();
		function createFocusScopesStack() {
			let stack = [];
			return {
				add(focusScope) {
					const activeFocusScope = stack[0];
					if (focusScope !== activeFocusScope) activeFocusScope?.pause();
					stack = arrayRemove(stack, focusScope);
					stack.unshift(focusScope);
				},
				remove(focusScope) {
					stack = arrayRemove(stack, focusScope);
					stack[0]?.resume();
				}
			};
		}
		__name$10(createFocusScopesStack, "createFocusScopesStack");
		function arrayRemove(array, item) {
			const updatedArray = [...array];
			const index = updatedArray.indexOf(item);
			if (index !== -1) updatedArray.splice(index, 1);
			return updatedArray;
		}
		__name$10(arrayRemove, "arrayRemove");
		function removeLinks(items) {
			return items.filter((item) => item.tagName !== "A");
		}
		__name$10(removeLinks, "removeLinks");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.1.4_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
		var useLayoutEffect2 = globalThis?.document ? react$1.useLayoutEffect : () => {};
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-id@1.1.4_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-id/dist/index.mjs
		var __defProp$9 = Object.defineProperty;
		var __name$9 = (target, value) => __defProp$9(target, "name", {
			value,
			configurable: true
		});
		var useReactId = react$1[" useId ".trim().toString()] || (() => void 0);
		var count = 0;
		function useId(deterministicId) {
			const [id, setId] = react$1.useState(useReactId());
			useLayoutEffect2(() => {
				if (!deterministicId) setId((reactId) => reactId ?? String(count++));
			}, [deterministicId]);
			return deterministicId || (id ? `radix-${id}` : "");
		}
		__name$9(useId, "useId");
		//#endregion
		//#region node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
		/**
		* Custom positioning reference element.
		* @see https://floating-ui.com/docs/virtual-elements
		*/
		const sides = [
			"top",
			"right",
			"bottom",
			"left"
		];
		const min = Math.min;
		const max = Math.max;
		const round = Math.round;
		const floor = Math.floor;
		const createCoords = (v) => ({
			x: v,
			y: v
		});
		const oppositeSideMap = {
			left: "right",
			right: "left",
			bottom: "top",
			top: "bottom"
		};
		function clamp(start, value, end) {
			return max(start, min(value, end));
		}
		function evaluate(value, param) {
			return typeof value === "function" ? value(param) : value;
		}
		function getSide(placement) {
			return placement.split("-")[0];
		}
		function getAlignment(placement) {
			return placement.split("-")[1];
		}
		function getOppositeAxis(axis) {
			return axis === "x" ? "y" : "x";
		}
		function getAxisLength(axis) {
			return axis === "y" ? "height" : "width";
		}
		function getSideAxis(placement) {
			const firstChar = placement[0];
			return firstChar === "t" || firstChar === "b" ? "y" : "x";
		}
		function getAlignmentAxis(placement) {
			return getOppositeAxis(getSideAxis(placement));
		}
		function getAlignmentSides(placement, rects, rtl) {
			if (rtl === void 0) rtl = false;
			const alignment = getAlignment(placement);
			const alignmentAxis = getAlignmentAxis(placement);
			const length = getAxisLength(alignmentAxis);
			let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
			if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
			return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
		}
		function getExpandedPlacements(placement) {
			const oppositePlacement = getOppositePlacement(placement);
			return [
				getOppositeAlignmentPlacement(placement),
				oppositePlacement,
				getOppositeAlignmentPlacement(oppositePlacement)
			];
		}
		function getOppositeAlignmentPlacement(placement) {
			return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
		}
		const lrPlacement = ["left", "right"];
		const rlPlacement = ["right", "left"];
		const tbPlacement = ["top", "bottom"];
		const btPlacement = ["bottom", "top"];
		function getSideList(side, isStart, rtl) {
			switch (side) {
				case "top":
				case "bottom":
					if (rtl) return isStart ? rlPlacement : lrPlacement;
					return isStart ? lrPlacement : rlPlacement;
				case "left":
				case "right": return isStart ? tbPlacement : btPlacement;
				default: return [];
			}
		}
		function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
			const alignment = getAlignment(placement);
			let list = getSideList(getSide(placement), direction === "start", rtl);
			if (alignment) {
				list = list.map((side) => side + "-" + alignment);
				if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
			}
			return list;
		}
		function getOppositePlacement(placement) {
			const side = getSide(placement);
			return oppositeSideMap[side] + placement.slice(side.length);
		}
		function expandPaddingObject(padding) {
			var _padding$top, _padding$right, _padding$bottom, _padding$left;
			return {
				top: (_padding$top = padding.top) != null ? _padding$top : 0,
				right: (_padding$right = padding.right) != null ? _padding$right : 0,
				bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
				left: (_padding$left = padding.left) != null ? _padding$left : 0
			};
		}
		function getPaddingObject(padding) {
			return typeof padding !== "number" ? expandPaddingObject(padding) : {
				top: padding,
				right: padding,
				bottom: padding,
				left: padding
			};
		}
		function rectToClientRect(rect) {
			const { x, y, width, height } = rect;
			return {
				width,
				height,
				top: y,
				left: x,
				right: x + width,
				bottom: y + height,
				x,
				y
			};
		}
		//#endregion
		//#region node_modules/.pnpm/@floating-ui+core@1.8.0/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
		function computeCoordsFromPlacement(_ref, placement, rtl) {
			let { reference, floating } = _ref;
			const sideAxis = getSideAxis(placement);
			const alignmentAxis = getAlignmentAxis(placement);
			const alignLength = getAxisLength(alignmentAxis);
			const side = getSide(placement);
			const isVertical = sideAxis === "y";
			const commonX = reference.x + reference.width / 2 - floating.width / 2;
			const commonY = reference.y + reference.height / 2 - floating.height / 2;
			const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
			let coords;
			switch (side) {
				case "top":
					coords = {
						x: commonX,
						y: reference.y - floating.height
					};
					break;
				case "bottom":
					coords = {
						x: commonX,
						y: reference.y + reference.height
					};
					break;
				case "right":
					coords = {
						x: reference.x + reference.width,
						y: commonY
					};
					break;
				case "left":
					coords = {
						x: reference.x - floating.width,
						y: commonY
					};
					break;
				default: coords = {
					x: reference.x,
					y: reference.y
				};
			}
			const alignment = getAlignment(placement);
			if (alignment) coords[alignmentAxis] += commonAlign * (alignment === "end" ? 1 : -1) * (rtl && isVertical ? -1 : 1);
			return coords;
		}
		/**
		* Resolves with an object of overflow side offsets that determine how much the
		* element is overflowing a given clipping boundary on each side.
		* - positive = overflowing the boundary by that number of pixels
		* - negative = how many pixels left before it will overflow
		* - 0 = lies flush with the boundary
		* @see https://floating-ui.com/docs/detectOverflow
		*/
		async function detectOverflow(state, options) {
			var _await$platform$isEle;
			if (options === void 0) options = {};
			const { x, y, platform, rects, elements, strategy } = state;
			const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
			const paddingObject = getPaddingObject(padding);
			const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
			const clippingClientRect = rectToClientRect(await platform.getClippingRect({
				element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
				boundary,
				rootBoundary,
				strategy
			}));
			const rect = elementContext === "floating" ? {
				x,
				y,
				width: rects.floating.width,
				height: rects.floating.height
			} : rects.reference;
			const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
			const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) && await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
				x: 1,
				y: 1
			};
			const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
				elements,
				rect,
				offsetParent,
				strategy
			}) : rect);
			return {
				top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
				bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
				left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
				right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
			};
		}
		const MAX_RESET_COUNT = 50;
		/**
		* Computes the `x` and `y` coordinates that will place the floating element
		* next to a given reference element.
		*
		* This export does not have any `platform` interface logic. You will need to
		* write one for the platform you are using Floating UI with.
		*/
		const computePosition$1 = async (reference, floating, config) => {
			const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
			const platformWithDetectOverflow = platform.detectOverflow ? platform : {
				...platform,
				detectOverflow
			};
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
			let rects = await platform.getElementRects({
				reference,
				floating,
				strategy
			});
			let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
			let statefulPlacement = placement;
			let resetCount = 0;
			const middlewareData = {};
			for (let i = 0; i < middleware.length; i++) {
				const currentMiddleware = middleware[i];
				if (!currentMiddleware) continue;
				const { name, fn } = currentMiddleware;
				const { x: nextX, y: nextY, data, reset } = await fn({
					x,
					y,
					initialPlacement: placement,
					placement: statefulPlacement,
					strategy,
					middlewareData,
					rects,
					platform: platformWithDetectOverflow,
					elements: {
						reference,
						floating
					}
				});
				x = nextX != null ? nextX : x;
				y = nextY != null ? nextY : y;
				middlewareData[name] = {
					...middlewareData[name],
					...data
				};
				if (reset && resetCount < MAX_RESET_COUNT) {
					resetCount++;
					if (typeof reset === "object") {
						if (reset.placement) statefulPlacement = reset.placement;
						if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
							reference,
							floating,
							strategy
						}) : reset.rects;
						({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
					}
					i = -1;
				}
			}
			return {
				x,
				y,
				placement: statefulPlacement,
				strategy,
				middlewareData
			};
		};
		/**
		* Provides data to position an inner element of the floating element so that it
		* appears centered to the reference element.
		* @see https://floating-ui.com/docs/arrow
		*/
		const arrow$3 = (options) => ({
			name: "arrow",
			options,
			async fn(state) {
				const { x, y, placement, rects, platform, elements, middlewareData } = state;
				const { element, padding = 0 } = evaluate(options, state) || {};
				if (element == null) return {};
				const paddingObject = getPaddingObject(padding);
				const coords = {
					x,
					y
				};
				const axis = getAlignmentAxis(placement);
				const length = getAxisLength(axis);
				const arrowDimensions = await platform.getDimensions(element);
				const isYAxis = axis === "y";
				const minProp = isYAxis ? "top" : "left";
				const maxProp = isYAxis ? "bottom" : "right";
				const clientProp = isYAxis ? "clientHeight" : "clientWidth";
				const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
				const startDiff = coords[axis] - rects.reference[axis];
				const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
				let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
				if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) clientSize = elements.floating[clientProp] || rects.floating[length];
				const centerToReference = endDiff / 2 - startDiff / 2;
				const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
				const minPadding = min(paddingObject[minProp], largestPossiblePadding);
				const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
				const max = clientSize - arrowDimensions[length] - maxPadding;
				const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
				const offset = clamp(minPadding, center, max);
				const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
				const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
				return {
					[axis]: coords[axis] + alignmentOffset,
					data: {
						[axis]: offset,
						centerOffset: center - offset - alignmentOffset,
						...shouldAddOffset && { alignmentOffset }
					},
					reset: shouldAddOffset
				};
			}
		});
		/**
		* Optimizes the visibility of the floating element by flipping the `placement`
		* in order to keep it in view when the preferred placement(s) will overflow the
		* clipping boundary. Alternative to `autoPlacement`.
		* @see https://floating-ui.com/docs/flip
		*/
		const flip$2 = function(options) {
			if (options === void 0) options = {};
			return {
				name: "flip",
				options,
				async fn(state) {
					var _middlewareData$arrow, _middlewareData$flip;
					const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
					const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
					if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
					const side = getSide(placement);
					const initialSideAxis = getSideAxis(initialPlacement);
					const isBasePlacement = getSide(initialPlacement) === initialPlacement;
					const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
					const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
					const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
					if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
					const placements = [initialPlacement, ...fallbackPlacements];
					const overflow = await platform.detectOverflow(state, detectOverflowOptions);
					const overflows = [];
					let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
					if (checkMainAxis) overflows.push(overflow[side]);
					if (checkCrossAxis) {
						const sides = getAlignmentSides(placement, rects, rtl);
						overflows.push(overflow[sides[0]], overflow[sides[1]]);
					}
					overflowsData = [...overflowsData, {
						placement,
						overflows
					}];
					if (!overflows.every((side) => side <= 0)) {
						var _middlewareData$flip2, _overflowsData$filter;
						const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
						const nextPlacement = placements[nextIndex];
						if (nextPlacement) {
							if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
								data: {
									index: nextIndex,
									overflows: overflowsData
								},
								reset: { placement: nextPlacement }
							};
						}
						let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
						if (!resetPlacement) switch (fallbackStrategy) {
							case "bestFit": {
								var _overflowsData$filter2;
								const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
									if (hasFallbackAxisSideDirection) {
										const currentSideAxis = getSideAxis(d.placement);
										return currentSideAxis === initialSideAxis || currentSideAxis === "y";
									}
									return true;
								}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
								if (placement) resetPlacement = placement;
								break;
							}
							case "initialPlacement": resetPlacement = initialPlacement;
						}
						if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
					}
					return {};
				}
			};
		};
		function getSideOffsets(overflow, rect) {
			return {
				top: overflow.top - rect.height,
				right: overflow.right - rect.width,
				bottom: overflow.bottom - rect.height,
				left: overflow.left - rect.width
			};
		}
		function isAnySideFullyClipped(overflow) {
			return sides.some((side) => overflow[side] >= 0);
		}
		/**
		* Provides data to hide the floating element in applicable situations, such as
		* when it is not in the same clipping context as the reference element.
		* @see https://floating-ui.com/docs/hide
		*/
		const hide$2 = function(options) {
			if (options === void 0) options = {};
			return {
				name: "hide",
				options,
				async fn(state) {
					const { rects, platform } = state;
					const { strategy = "referenceHidden", ...detectOverflowOptions } = evaluate(options, state);
					switch (strategy) {
						case "referenceHidden": {
							const offsets = getSideOffsets(await platform.detectOverflow(state, {
								...detectOverflowOptions,
								elementContext: "reference"
							}), rects.reference);
							return { data: {
								referenceHiddenOffsets: offsets,
								referenceHidden: isAnySideFullyClipped(offsets)
							} };
						}
						case "escaped": {
							const offsets = getSideOffsets(await platform.detectOverflow(state, {
								...detectOverflowOptions,
								altBoundary: true
							}), rects.floating);
							return { data: {
								escapedOffsets: offsets,
								escaped: isAnySideFullyClipped(offsets)
							} };
						}
						default: return {};
					}
				}
			};
		};
		const originSides = /*#__PURE__*/ new Set(["left", "top"]);
		async function convertValueToCoords(state, options) {
			const { placement, platform, elements } = state;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const side = getSide(placement);
			const alignment = getAlignment(placement);
			const isVertical = getSideAxis(placement) === "y";
			const mainAxisMulti = originSides.has(side) ? -1 : 1;
			const crossAxisMulti = rtl && isVertical ? -1 : 1;
			const rawValue = evaluate(options, state);
			let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
				mainAxis: rawValue,
				crossAxis: 0,
				alignmentAxis: null
			} : {
				mainAxis: rawValue.mainAxis || 0,
				crossAxis: rawValue.crossAxis || 0,
				alignmentAxis: rawValue.alignmentAxis
			};
			if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
			return isVertical ? {
				x: crossAxis * crossAxisMulti,
				y: mainAxis * mainAxisMulti
			} : {
				x: mainAxis * mainAxisMulti,
				y: crossAxis * crossAxisMulti
			};
		}
		/**
		* Modifies the placement by translating the floating element along the
		* specified axes.
		* A number (shorthand for `mainAxis` or distance), or an axes configuration
		* object may be passed.
		* @see https://floating-ui.com/docs/offset
		*/
		const offset$2 = function(options) {
			if (options === void 0) options = 0;
			return {
				name: "offset",
				options,
				async fn(state) {
					var _middlewareData$offse, _middlewareData$arrow;
					const { x, y, placement, middlewareData } = state;
					const diffCoords = await convertValueToCoords(state, options);
					if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
					return {
						x: x + diffCoords.x,
						y: y + diffCoords.y,
						data: {
							...diffCoords,
							placement
						}
					};
				}
			};
		};
		/**
		* Optimizes the visibility of the floating element by shifting it in order to
		* keep it in view when it will overflow the clipping boundary.
		* @see https://floating-ui.com/docs/shift
		*/
		const shift$2 = function(options) {
			if (options === void 0) options = {};
			return {
				name: "shift",
				options,
				async fn(state) {
					const { x, y, placement, platform } = state;
					const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
						let { x, y } = _ref;
						return {
							x,
							y
						};
					} }, ...detectOverflowOptions } = evaluate(options, state);
					const coords = {
						x,
						y
					};
					const overflow = await platform.detectOverflow(state, detectOverflowOptions);
					const crossAxis = getSideAxis(placement);
					const mainAxis = getOppositeAxis(crossAxis);
					let mainAxisCoord = coords[mainAxis];
					let crossAxisCoord = coords[crossAxis];
					const clampCoord = (axis, coord) => clamp(coord + overflow[axis === "y" ? "top" : "left"], coord, coord - overflow[axis === "y" ? "bottom" : "right"]);
					if (checkMainAxis) mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
					if (checkCrossAxis) crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
					const limitedCoords = limiter.fn({
						...state,
						[mainAxis]: mainAxisCoord,
						[crossAxis]: crossAxisCoord
					});
					return {
						...limitedCoords,
						data: {
							x: limitedCoords.x - x,
							y: limitedCoords.y - y,
							enabled: {
								[mainAxis]: checkMainAxis,
								[crossAxis]: checkCrossAxis
							}
						}
					};
				}
			};
		};
		/**
		* Built-in `limiter` that will stop `shift()` at a certain point.
		*/
		const limitShift$2 = function(options) {
			if (options === void 0) options = {};
			return {
				options,
				fn(state) {
					var _rawOffset$mainAxis, _rawOffset$crossAxis;
					const { x, y, placement, rects, middlewareData } = state;
					const { offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true } = evaluate(options, state);
					const coords = {
						x,
						y
					};
					const crossAxis = getSideAxis(placement);
					const mainAxis = getOppositeAxis(crossAxis);
					let mainAxisCoord = coords[mainAxis];
					let crossAxisCoord = coords[crossAxis];
					const rawOffset = evaluate(offset, state);
					const computedOffset = typeof rawOffset === "number" ? {
						mainAxis: rawOffset,
						crossAxis: 0
					} : {
						mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) != null ? _rawOffset$mainAxis : 0,
						crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) != null ? _rawOffset$crossAxis : 0
					};
					if (checkMainAxis) {
						const len = mainAxis === "y" ? "height" : "width";
						const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
						const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
						if (mainAxisCoord < limitMin) mainAxisCoord = limitMin;
						else if (mainAxisCoord > limitMax) mainAxisCoord = limitMax;
					}
					if (checkCrossAxis) {
						var _middlewareData$offse, _middlewareData$offse2;
						const len = mainAxis === "y" ? "width" : "height";
						const isOriginSide = originSides.has(getSide(placement));
						const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
						const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
						if (crossAxisCoord < limitMin) crossAxisCoord = limitMin;
						else if (crossAxisCoord > limitMax) crossAxisCoord = limitMax;
					}
					return {
						[mainAxis]: mainAxisCoord,
						[crossAxis]: crossAxisCoord
					};
				}
			};
		};
		/**
		* Provides data that allows you to change the size of the floating element —
		* for instance, prevent it from overflowing the clipping boundary or match the
		* width of the reference element.
		* @see https://floating-ui.com/docs/size
		*/
		const size$2 = function(options) {
			if (options === void 0) options = {};
			return {
				name: "size",
				options,
				async fn(state) {
					const { placement, rects, platform, elements } = state;
					const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
					const overflow = await platform.detectOverflow(state, detectOverflowOptions);
					const side = getSide(placement);
					const alignment = getAlignment(placement);
					const isYAxis = getSideAxis(placement) === "y";
					const { width, height } = rects.floating;
					let heightSide;
					let widthSide;
					if (side === "top" || side === "bottom") {
						heightSide = side;
						widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
					} else {
						widthSide = side;
						heightSide = alignment === "end" ? "top" : "bottom";
					}
					const maximumClippingHeight = height - overflow.top - overflow.bottom;
					const maximumClippingWidth = width - overflow.left - overflow.right;
					const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
					const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
					const shiftData = state.middlewareData.shift;
					const noShift = !shiftData;
					let availableHeight = overflowAvailableHeight;
					let availableWidth = overflowAvailableWidth;
					if (shiftData != null && shiftData.enabled.x) availableWidth = maximumClippingWidth;
					if (shiftData != null && shiftData.enabled.y) availableHeight = maximumClippingHeight;
					if (noShift && !alignment) {
						if (isYAxis) availableWidth = width - 2 * max(overflow.left, overflow.right);
						else availableHeight = height - 2 * max(overflow.top, overflow.bottom);
					}
					await apply({
						...state,
						availableWidth,
						availableHeight
					});
					const nextDimensions = await platform.getDimensions(elements.floating);
					if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
					return {};
				}
			};
		};
		//#endregion
		//#region node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
		function hasWindow() {
			return typeof window !== "undefined";
		}
		function getNodeName(node) {
			if (isNode(node)) return (node.nodeName || "").toLowerCase();
			return "#document";
		}
		function getWindow(node) {
			var _node$ownerDocument;
			return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
		}
		function getDocumentElement(node) {
			var _ref;
			return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
		}
		function isNode(value) {
			if (!hasWindow()) return false;
			return value instanceof Node || value instanceof getWindow(value).Node;
		}
		function isElement(value) {
			if (!hasWindow()) return false;
			return value instanceof Element || value instanceof getWindow(value).Element;
		}
		function isHTMLElement(value) {
			if (!hasWindow()) return false;
			return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
		}
		function isShadowRoot(value) {
			if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
			return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
		}
		function isOverflowElement(element) {
			const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
			return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
		}
		function isTableElement(element) {
			return /^(table|td|th)$/.test(getNodeName(element));
		}
		function isTopLayer(element) {
			try {
				if (element.matches(":popover-open")) return true;
			} catch (_e) {}
			try {
				return element.matches(":modal");
			} catch (_e) {
				return false;
			}
		}
		const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
		const containRe = /paint|layout|strict|content/;
		const isNotNone = (value) => !!value && value !== "none";
		let isWebKitValue;
		function isContainingBlock(elementOrCss) {
			const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
			return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
		}
		function getContainingBlock(element) {
			let currentNode = getParentNode(element);
			while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
				if (isContainingBlock(currentNode)) return currentNode;
				else if (isTopLayer(currentNode)) return null;
				currentNode = getParentNode(currentNode);
			}
			return null;
		}
		function isWebKit() {
			if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
			return isWebKitValue;
		}
		function isLastTraversableNode(node) {
			return /^(html|body|#document)$/.test(getNodeName(node));
		}
		function getComputedStyle$1(element) {
			return getWindow(element).getComputedStyle(element);
		}
		function getNodeScroll(element) {
			if (isElement(element)) return {
				scrollLeft: element.scrollLeft,
				scrollTop: element.scrollTop
			};
			return {
				scrollLeft: element.scrollX,
				scrollTop: element.scrollY
			};
		}
		function getParentNode(node) {
			if (getNodeName(node) === "html") return node;
			const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
			return isShadowRoot(result) ? result.host : result;
		}
		function getNearestOverflowAncestor(node) {
			const parentNode = getParentNode(node);
			if (isLastTraversableNode(parentNode)) return (node.ownerDocument || node).body;
			if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
			return getNearestOverflowAncestor(parentNode);
		}
		function getOverflowAncestors(node, list, traverseIframes) {
			var _node$ownerDocument2;
			if (list === void 0) list = [];
			if (traverseIframes === void 0) traverseIframes = true;
			const scrollableAncestor = getNearestOverflowAncestor(node);
			const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
			const win = getWindow(scrollableAncestor);
			if (isBody) {
				const frameElement = getFrameElement(win);
				return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
			} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
		}
		function getFrameElement(win) {
			return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
		}
		//#endregion
		//#region node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
		function getCssDimensions(element) {
			const css = getComputedStyle$1(element);
			let width = parseFloat(css.width) || 0;
			let height = parseFloat(css.height) || 0;
			const hasOffset = isHTMLElement(element);
			const offsetWidth = hasOffset ? element.offsetWidth : width;
			const offsetHeight = hasOffset ? element.offsetHeight : height;
			const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
			if (shouldFallback) {
				width = offsetWidth;
				height = offsetHeight;
			}
			return {
				width,
				height,
				$: shouldFallback
			};
		}
		function unwrapElement(element) {
			return !isElement(element) ? element.contextElement : element;
		}
		function getScale(element) {
			const domElement = unwrapElement(element);
			if (!isHTMLElement(domElement)) return createCoords(1);
			const rect = domElement.getBoundingClientRect();
			const { width, height, $ } = getCssDimensions(domElement);
			let x = ($ ? round(rect.width) : rect.width) / width;
			let y = ($ ? round(rect.height) : rect.height) / height;
			if (!x || !Number.isFinite(x)) x = 1;
			if (!y || !Number.isFinite(y)) y = 1;
			return {
				x,
				y
			};
		}
		const noOffsets = /*#__PURE__*/ createCoords(0);
		function getVisualOffsets(element) {
			const win = getWindow(element);
			if (!isWebKit() || !win.visualViewport) return noOffsets;
			return {
				x: win.visualViewport.offsetLeft,
				y: win.visualViewport.offsetTop
			};
		}
		function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
			if (isFixed === void 0) isFixed = false;
			return !!floatingOffsetParent && isFixed && floatingOffsetParent === getWindow(element);
		}
		function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
			if (includeScale === void 0) includeScale = false;
			if (isFixedStrategy === void 0) isFixedStrategy = false;
			const clientRect = element.getBoundingClientRect();
			const domElement = unwrapElement(element);
			let scale = createCoords(1);
			if (includeScale) {
				if (offsetParent) {
					if (isElement(offsetParent)) scale = getScale(offsetParent);
				} else scale = getScale(element);
			}
			const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
			let x = (clientRect.left + visualOffsets.x) / scale.x;
			let y = (clientRect.top + visualOffsets.y) / scale.y;
			let width = clientRect.width / scale.x;
			let height = clientRect.height / scale.y;
			if (domElement && offsetParent) {
				const win = getWindow(domElement);
				const offsetWin = isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
				let currentWin = win;
				let currentIFrame = getFrameElement(currentWin);
				while (currentIFrame && offsetWin !== currentWin) {
					const iframeScale = getScale(currentIFrame);
					const iframeRect = currentIFrame.getBoundingClientRect();
					const css = getComputedStyle$1(currentIFrame);
					const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
					const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
					x *= iframeScale.x;
					y *= iframeScale.y;
					width *= iframeScale.x;
					height *= iframeScale.y;
					x += left;
					y += top;
					currentWin = getWindow(currentIFrame);
					currentIFrame = getFrameElement(currentWin);
				}
			}
			return rectToClientRect({
				width,
				height,
				x,
				y
			});
		}
		function getWindowScrollBarX(element, rect) {
			const leftScroll = getNodeScroll(element).scrollLeft;
			if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
			return rect.left + leftScroll;
		}
		function getHTMLOffset(documentElement, scroll) {
			const htmlRect = documentElement.getBoundingClientRect();
			return {
				x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
				y: htmlRect.top + scroll.scrollTop
			};
		}
		function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
			let { elements, rect, offsetParent, strategy } = _ref;
			const isFixed = strategy === "fixed";
			const documentElement = getDocumentElement(offsetParent);
			const topLayer = elements ? isTopLayer(elements.floating) : false;
			if (offsetParent === documentElement || topLayer && isFixed) return rect;
			let scroll = {
				scrollLeft: 0,
				scrollTop: 0
			};
			let scale = createCoords(1);
			const offsets = createCoords(0);
			const isOffsetParentAnElement = isHTMLElement(offsetParent);
			if (isOffsetParentAnElement || !isFixed) {
				if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
				if (isOffsetParentAnElement) {
					const offsetRect = getBoundingClientRect(offsetParent);
					scale = getScale(offsetParent);
					offsets.x = offsetRect.x + offsetParent.clientLeft;
					offsets.y = offsetRect.y + offsetParent.clientTop;
				}
			}
			const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
			return {
				width: rect.width * scale.x,
				height: rect.height * scale.y,
				x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
				y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
			};
		}
		function getClientRects(element) {
			return element.getClientRects ? Array.from(element.getClientRects()) : [];
		}
		function getDocumentRect(html) {
			const scroll = getNodeScroll(html);
			const body = html.ownerDocument.body;
			const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
			const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
			let x = -scroll.scrollLeft + getWindowScrollBarX(html);
			const y = -scroll.scrollTop;
			if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
			return {
				width,
				height,
				x,
				y
			};
		}
		const SCROLLBAR_MAX = 25;
		function getViewportRect(element, strategy, rootBoundary) {
			if (rootBoundary === void 0) rootBoundary = "viewport";
			const isLayoutViewport = rootBoundary === "layoutViewport";
			const win = getWindow(element);
			const html = getDocumentElement(element);
			const visualViewport = win.visualViewport;
			let width = html.clientWidth;
			let height = html.clientHeight;
			let x = 0;
			let y = 0;
			if (visualViewport) {
				const layoutRelativeClientCoords = !isWebKit() || strategy === "fixed";
				if (isLayoutViewport) {
					if (!layoutRelativeClientCoords) {
						x = -visualViewport.offsetLeft;
						y = -visualViewport.offsetTop;
					}
				} else {
					width = visualViewport.width;
					height = visualViewport.height;
					if (layoutRelativeClientCoords) {
						x = visualViewport.offsetLeft;
						y = visualViewport.offsetTop;
					}
				}
			}
			if (getWindowScrollBarX(html) <= 0) {
				const doc = html.ownerDocument;
				const body = doc.body;
				const bodyStyles = getComputedStyle(body);
				const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
				const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
				const gutter = getComputedStyle(html).scrollbarGutter === "stable both-edges" ? reservedWidth / 2 : reservedWidth;
				if (gutter <= SCROLLBAR_MAX) width -= gutter;
			}
			return {
				width,
				height,
				x,
				y
			};
		}
		function getInnerBoundingClientRect(element, strategy) {
			const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
			const top = clientRect.top + element.clientTop;
			const left = clientRect.left + element.clientLeft;
			const scale = getScale(element);
			return {
				width: element.clientWidth * scale.x,
				height: element.clientHeight * scale.y,
				x: left * scale.x,
				y: top * scale.y
			};
		}
		function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
			let rect;
			if (clippingAncestor === "viewport" || clippingAncestor === "layoutViewport") rect = getViewportRect(element, strategy, clippingAncestor);
			else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
			else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
			else {
				const visualOffsets = getVisualOffsets(element);
				rect = {
					x: clippingAncestor.x - visualOffsets.x,
					y: clippingAncestor.y - visualOffsets.y,
					width: clippingAncestor.width,
					height: clippingAncestor.height
				};
			}
			return rectToClientRect(rect);
		}
		function getClippingElementAncestors(element, cache) {
			const cachedResult = cache.get(element);
			if (cachedResult) return cachedResult;
			let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
			let lastKeptComputedStyle = null;
			const elementIsFixed = getComputedStyle$1(element).position === "fixed";
			let currentNode = elementIsFixed ? getParentNode(element) : element;
			while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
				const computedStyle = getComputedStyle$1(currentNode);
				const currentNodeIsContaining = isContainingBlock(currentNode);
				const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? "fixed" : "";
				if (!currentNodeIsContaining && (lastPosition === "fixed" || lastPosition === "absolute" && computedStyle.position === "static")) result = result.filter((ancestor) => ancestor !== currentNode);
				else lastKeptComputedStyle = computedStyle;
				currentNode = getParentNode(currentNode);
			}
			cache.set(element, result);
			return result;
		}
		function getClippingRect(_ref) {
			let { element, boundary, rootBoundary, strategy } = _ref;
			const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
			const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
			let top = firstRect.top;
			let right = firstRect.right;
			let bottom = firstRect.bottom;
			let left = firstRect.left;
			for (let i = 1; i < clippingAncestors.length; i++) {
				const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
				top = max(rect.top, top);
				right = min(rect.right, right);
				bottom = min(rect.bottom, bottom);
				left = max(rect.left, left);
			}
			return {
				width: right - left,
				height: bottom - top,
				x: left,
				y: top
			};
		}
		function getDimensions(element) {
			const { width, height } = getCssDimensions(element);
			return {
				width,
				height
			};
		}
		function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
			const isOffsetParentAnElement = isHTMLElement(offsetParent);
			const documentElement = getDocumentElement(offsetParent);
			const isFixed = strategy === "fixed";
			const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
			let scroll = {
				scrollLeft: 0,
				scrollTop: 0
			};
			const offsets = createCoords(0);
			if (isOffsetParentAnElement || !isFixed) {
				if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
				if (isOffsetParentAnElement) {
					const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
					offsets.x = offsetRect.x + offsetParent.clientLeft;
					offsets.y = offsetRect.y + offsetParent.clientTop;
				}
			}
			if (!isOffsetParentAnElement && documentElement) offsets.x = getWindowScrollBarX(documentElement);
			const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
			return {
				x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
				y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
				width: rect.width,
				height: rect.height
			};
		}
		function isStaticPositioned(element) {
			return getComputedStyle$1(element).position === "static";
		}
		function getTrueOffsetParent(element, polyfill) {
			if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
			if (polyfill) return polyfill(element);
			let rawOffsetParent = element.offsetParent;
			if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
			return rawOffsetParent;
		}
		function getOffsetParent(element, polyfill) {
			const win = getWindow(element);
			if (isTopLayer(element)) return win;
			if (!isHTMLElement(element)) {
				let svgOffsetParent = getParentNode(element);
				while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
					if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
					svgOffsetParent = getParentNode(svgOffsetParent);
				}
				return win;
			}
			let offsetParent = getTrueOffsetParent(element, polyfill);
			while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
			if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
			return offsetParent || getContainingBlock(element) || win;
		}
		const getElementRects = async function(data) {
			const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
			const getDimensionsFn = this.getDimensions;
			const floatingDimensions = await getDimensionsFn(data.floating);
			return {
				reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
				floating: {
					x: 0,
					y: 0,
					width: floatingDimensions.width,
					height: floatingDimensions.height
				}
			};
		};
		function isRTL(element) {
			return getComputedStyle$1(element).direction === "rtl";
		}
		const platform = {
			convertOffsetParentRelativeRectToViewportRelativeRect,
			getDocumentElement,
			getClippingRect,
			getOffsetParent,
			getElementRects,
			getClientRects,
			getDimensions,
			getScale,
			isElement,
			isRTL
		};
		function rectsAreEqual(a, b) {
			return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
		}
		function observeMove(element, onMove, ancestorResize) {
			let io = null;
			let timeoutId;
			const root = getDocumentElement(element);
			function cleanup() {
				var _io;
				clearTimeout(timeoutId);
				(_io = io) == null || _io.disconnect();
				io = null;
			}
			function refresh(skip, threshold) {
				if (skip === void 0) skip = false;
				if (threshold === void 0) threshold = 1;
				cleanup();
				const elementRectForRootMargin = element.getBoundingClientRect();
				const { left, top, width, height } = elementRectForRootMargin;
				if (!skip) onMove();
				if (!width || !height) return;
				const insetTop = floor(top);
				const insetRight = floor(root.clientWidth - (left + width));
				const insetBottom = floor(root.clientHeight - (top + height));
				const insetLeft = floor(left);
				const options = {
					rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
					threshold: max(0, min(1, threshold)) || 1
				};
				let isFirstUpdate = true;
				function handleObserve(entries) {
					const ratio = entries[0].intersectionRatio;
					if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) return refresh();
					if (ratio !== threshold) {
						if (!isFirstUpdate) return refresh();
						if (!ratio) timeoutId = setTimeout(() => {
							refresh(false, 1e-7);
						}, 1e3);
						else refresh(false, ratio);
					}
					isFirstUpdate = false;
				}
				try {
					io = new IntersectionObserver(handleObserve, {
						...options,
						root: root.ownerDocument
					});
				} catch (_e) {
					io = new IntersectionObserver(handleObserve, options);
				}
				io.observe(element);
			}
			const win = getWindow(element);
			const handleResize = () => refresh(ancestorResize);
			win.addEventListener("resize", handleResize);
			refresh(true);
			return () => {
				win.removeEventListener("resize", handleResize);
				cleanup();
			};
		}
		/**
		* Automatically updates the position of the floating element when necessary.
		* Should only be called when the floating element is mounted on the DOM or
		* visible on the screen.
		* @returns cleanup function that should be invoked when the floating element is
		* removed from the DOM or hidden from the screen.
		* @see https://floating-ui.com/docs/autoUpdate
		*/
		function autoUpdate(reference, floating, update, options) {
			if (options === void 0) options = {};
			const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === "function", layoutShift = typeof IntersectionObserver === "function", animationFrame = false } = options;
			const referenceEl = unwrapElement(reference);
			const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
			ancestors.forEach((ancestor) => {
				ancestorScroll && ancestor.addEventListener("scroll", update);
				ancestorResize && ancestor.addEventListener("resize", update);
			});
			const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
			let reobserveFrame = -1;
			let resizeObserver = null;
			if (elementResize) {
				resizeObserver = new ResizeObserver((_ref) => {
					let [firstEntry] = _ref;
					if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
						resizeObserver.unobserve(floating);
						cancelAnimationFrame(reobserveFrame);
						reobserveFrame = requestAnimationFrame(() => {
							var _resizeObserver;
							(_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
						});
					}
					update();
				});
				if (referenceEl && !animationFrame) resizeObserver.observe(referenceEl);
				if (floating) resizeObserver.observe(floating);
			}
			let frameId;
			let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
			if (animationFrame) frameLoop();
			function frameLoop() {
				const nextRefRect = getBoundingClientRect(reference);
				if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) update();
				prevRefRect = nextRefRect;
				frameId = requestAnimationFrame(frameLoop);
			}
			update();
			return () => {
				var _resizeObserver2;
				ancestors.forEach((ancestor) => {
					ancestorScroll && ancestor.removeEventListener("scroll", update);
					ancestorResize && ancestor.removeEventListener("resize", update);
				});
				cleanupIo?.();
				(_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
				resizeObserver = null;
				if (animationFrame) cancelAnimationFrame(frameId);
			};
		}
		/**
		* Modifies the placement by translating the floating element along the
		* specified axes.
		* A number (shorthand for `mainAxis` or distance), or an axes configuration
		* object may be passed.
		* @see https://floating-ui.com/docs/offset
		*/
		const offset$1 = offset$2;
		/**
		* Optimizes the visibility of the floating element by shifting it in order to
		* keep it in view when it will overflow the clipping boundary.
		* @see https://floating-ui.com/docs/shift
		*/
		const shift$1 = shift$2;
		/**
		* Optimizes the visibility of the floating element by flipping the `placement`
		* in order to keep it in view when the preferred placement(s) will overflow the
		* clipping boundary. Alternative to `autoPlacement`.
		* @see https://floating-ui.com/docs/flip
		*/
		const flip$1 = flip$2;
		/**
		* Provides data that allows you to change the size of the floating element —
		* for instance, prevent it from overflowing the clipping boundary or match the
		* width of the reference element.
		* @see https://floating-ui.com/docs/size
		*/
		const size$1 = size$2;
		/**
		* Provides data to hide the floating element in applicable situations, such as
		* when it is not in the same clipping context as the reference element.
		* @see https://floating-ui.com/docs/hide
		*/
		const hide$1 = hide$2;
		/**
		* Provides data to position an inner element of the floating element so that it
		* appears centered to the reference element.
		* @see https://floating-ui.com/docs/arrow
		*/
		const arrow$2 = arrow$3;
		/**
		* Built-in `limiter` that will stop `shift()` at a certain point.
		*/
		const limitShift$1 = limitShift$2;
		/**
		* Computes the `x` and `y` coordinates that will place the floating element
		* next to a given reference element.
		*/
		const computePosition = (reference, floating, options) => {
			const cache = /* @__PURE__ */ new Map();
			const mergedOptions = options != null ? options : {};
			const platformWithCache = {
				...platform,
				...mergedOptions.platform,
				_c: cache
			};
			return computePosition$1(reference, floating, {
				...mergedOptions,
				platform: platformWithCache
			});
		};
		//#endregion
		//#region node_modules/.pnpm/@floating-ui+react-dom@2.1.9_react-dom@18.2.0_react@18.3.1__react@18.3.1/node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs
		var index = typeof document !== "undefined" ? react$1.useLayoutEffect : function noop() {};
		function deepEqual(a, b) {
			if (a === b) return true;
			if (typeof a !== typeof b) return false;
			if (typeof a === "function" && a.toString() === b.toString()) return true;
			let length;
			let i;
			let keys;
			if (a && b && typeof a === "object") {
				if (Array.isArray(a)) {
					length = a.length;
					if (length !== b.length) return false;
					for (i = length; i-- !== 0;) if (!deepEqual(a[i], b[i])) return false;
					return true;
				}
				keys = Object.keys(a);
				length = keys.length;
				if (length !== Object.keys(b).length) return false;
				for (i = length; i-- !== 0;) if (!{}.hasOwnProperty.call(b, keys[i])) return false;
				for (i = length; i-- !== 0;) {
					const key = keys[i];
					if (key === "_owner" && a.$$typeof) continue;
					if (!deepEqual(a[key], b[key])) return false;
				}
				return true;
			}
			return a !== a && b !== b;
		}
		function getDPR(element) {
			if (typeof window === "undefined") return 1;
			return (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
		}
		function roundByDPR(element, value) {
			const dpr = getDPR(element);
			return Math.round(value * dpr) / dpr;
		}
		function useLatestRef(value) {
			const ref = react$1.useRef(value);
			index(() => {
				ref.current = value;
			});
			return ref;
		}
		/**
		* Provides data to position a floating element.
		* @see https://floating-ui.com/docs/useFloating
		*/
		function useFloating(options) {
			if (options === void 0) options = {};
			const { placement = "bottom", strategy = "absolute", middleware = [], platform, elements: { reference: externalReference, floating: externalFloating } = {}, transform = true, whileElementsMounted, open } = options;
			const [data, setData] = react$1.useState({
				x: 0,
				y: 0,
				strategy,
				placement,
				middlewareData: {},
				isPositioned: false
			});
			const [latestMiddleware, setLatestMiddleware] = react$1.useState(middleware);
			if (!deepEqual(latestMiddleware, middleware)) setLatestMiddleware(middleware);
			const [_reference, _setReference] = react$1.useState(null);
			const [_floating, _setFloating] = react$1.useState(null);
			const setReference = react$1.useCallback((node) => {
				if (node !== referenceRef.current) {
					referenceRef.current = node;
					_setReference(node);
				}
			}, []);
			const setFloating = react$1.useCallback((node) => {
				if (node !== floatingRef.current) {
					floatingRef.current = node;
					_setFloating(node);
				}
			}, []);
			const referenceEl = externalReference || _reference;
			const floatingEl = externalFloating || _floating;
			const referenceRef = react$1.useRef(null);
			const floatingRef = react$1.useRef(null);
			const dataRef = react$1.useRef(data);
			const hasWhileElementsMounted = whileElementsMounted != null;
			const whileElementsMountedRef = useLatestRef(whileElementsMounted);
			const platformRef = useLatestRef(platform);
			const openRef = useLatestRef(open);
			const update = react$1.useCallback(() => {
				if (!referenceRef.current || !floatingRef.current) return;
				const config = {
					placement,
					strategy,
					middleware: latestMiddleware
				};
				if (platformRef.current) config.platform = platformRef.current;
				computePosition(referenceRef.current, floatingRef.current, config).then((data) => {
					const fullData = {
						...data,
						isPositioned: openRef.current !== false
					};
					if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
						dataRef.current = fullData;
						react_dom.flushSync(() => {
							setData(fullData);
						});
					}
				});
			}, [
				latestMiddleware,
				placement,
				strategy,
				platformRef,
				openRef
			]);
			index(() => {
				if (open === false && dataRef.current.isPositioned) {
					dataRef.current.isPositioned = false;
					setData((data) => ({
						...data,
						isPositioned: false
					}));
				}
			}, [open]);
			const isMountedRef = react$1.useRef(false);
			index(() => {
				isMountedRef.current = true;
				return () => {
					isMountedRef.current = false;
				};
			}, []);
			index(() => {
				if (referenceEl) referenceRef.current = referenceEl;
				if (floatingEl) floatingRef.current = floatingEl;
				if (referenceEl && floatingEl) {
					if (whileElementsMountedRef.current) return whileElementsMountedRef.current(referenceEl, floatingEl, update);
					update();
				}
			}, [
				referenceEl,
				floatingEl,
				update,
				whileElementsMountedRef,
				hasWhileElementsMounted
			]);
			const refs = react$1.useMemo(() => ({
				reference: referenceRef,
				floating: floatingRef,
				setReference,
				setFloating
			}), [setReference, setFloating]);
			const elements = react$1.useMemo(() => ({
				reference: referenceEl,
				floating: floatingEl
			}), [referenceEl, floatingEl]);
			const floatingStyles = react$1.useMemo(() => {
				const initialStyles = {
					position: strategy,
					left: 0,
					top: 0
				};
				if (!elements.floating) return initialStyles;
				const x = roundByDPR(elements.floating, data.x);
				const y = roundByDPR(elements.floating, data.y);
				if (transform) return {
					...initialStyles,
					transform: "translate(" + x + "px, " + y + "px)",
					...getDPR(elements.floating) >= 1.5 && { willChange: "transform" }
				};
				return {
					position: strategy,
					left: x,
					top: y
				};
			}, [
				strategy,
				transform,
				elements.floating,
				data.x,
				data.y
			]);
			return react$1.useMemo(() => ({
				...data,
				update,
				refs,
				elements,
				floatingStyles
			}), [
				data,
				update,
				refs,
				elements,
				floatingStyles
			]);
		}
		/**
		* Provides data to position an inner element of the floating element so that it
		* appears centered to the reference element.
		* This wraps the core `arrow` middleware to allow React refs as the element.
		* @see https://floating-ui.com/docs/arrow
		*/
		const arrow$1 = (options) => {
			function isRef(value) {
				return {}.hasOwnProperty.call(value, "current");
			}
			return {
				name: "arrow",
				options,
				fn(state) {
					const { element, padding } = typeof options === "function" ? options(state) : options;
					if (element && isRef(element)) {
						if (element.current != null) return arrow$2({
							element: element.current,
							padding
						}).fn(state);
						return {};
					}
					if (element) return arrow$2({
						element,
						padding
					}).fn(state);
					return {};
				}
			};
		};
		/**
		* Modifies the placement by translating the floating element along the
		* specified axes.
		* A number (shorthand for `mainAxis` or distance), or an axes configuration
		* object may be passed.
		* @see https://floating-ui.com/docs/offset
		*/
		const offset = (options, deps) => {
			const result = offset$1(options);
			return {
				name: result.name,
				fn: result.fn,
				options: [options, deps]
			};
		};
		/**
		* Optimizes the visibility of the floating element by shifting it in order to
		* keep it in view when it will overflow the clipping boundary.
		* @see https://floating-ui.com/docs/shift
		*/
		const shift = (options, deps) => {
			const result = shift$1(options);
			return {
				name: result.name,
				fn: result.fn,
				options: [options, deps]
			};
		};
		/**
		* Built-in `limiter` that will stop `shift()` at a certain point.
		*/
		const limitShift = (options, deps) => {
			return {
				fn: limitShift$1(options).fn,
				options: [options, deps]
			};
		};
		/**
		* Optimizes the visibility of the floating element by flipping the `placement`
		* in order to keep it in view when the preferred placement(s) will overflow the
		* clipping boundary. Alternative to `autoPlacement`.
		* @see https://floating-ui.com/docs/flip
		*/
		const flip = (options, deps) => {
			const result = flip$1(options);
			return {
				name: result.name,
				fn: result.fn,
				options: [options, deps]
			};
		};
		/**
		* Provides data that allows you to change the size of the floating element —
		* for instance, prevent it from overflowing the clipping boundary or match the
		* width of the reference element.
		* @see https://floating-ui.com/docs/size
		*/
		const size = (options, deps) => {
			const result = size$1(options);
			return {
				name: result.name,
				fn: result.fn,
				options: [options, deps]
			};
		};
		/**
		* Provides data to hide the floating element in applicable situations, such as
		* when it is not in the same clipping context as the reference element.
		* @see https://floating-ui.com/docs/hide
		*/
		const hide = (options, deps) => {
			const result = hide$1(options);
			return {
				name: result.name,
				fn: result.fn,
				options: [options, deps]
			};
		};
		/**
		* Provides data to position an inner element of the floating element so that it
		* appears centered to the reference element.
		* This wraps the core `arrow` middleware to allow React refs as the element.
		* @see https://floating-ui.com/docs/arrow
		*/
		const arrow = (options, deps) => {
			const result = arrow$1(options);
			return {
				name: result.name,
				fn: result.fn,
				options: [options, deps]
			};
		};
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-use-size@1.1.4_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-use-size/dist/index.mjs
		var __defProp$8 = Object.defineProperty;
		var __name$8 = (target, value) => __defProp$8(target, "name", {
			value,
			configurable: true
		});
		function useSize(element) {
			const [size, setSize] = react$1.useState(void 0);
			useLayoutEffect2(() => {
				if (element) {
					setSize({
						width: element.offsetWidth,
						height: element.offsetHeight
					});
					const resizeObserver = new ResizeObserver((entries) => {
						if (!Array.isArray(entries)) return;
						if (!entries.length) return;
						const entry = entries[0];
						let width;
						let height;
						if ("borderBoxSize" in entry) {
							const borderSizeEntry = entry["borderBoxSize"];
							const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
							width = borderSize["inlineSize"];
							height = borderSize["blockSize"];
						} else {
							width = element.offsetWidth;
							height = element.offsetHeight;
						}
						setSize({
							width,
							height
						});
					});
					resizeObserver.observe(element, { box: "border-box" });
					return () => resizeObserver.unobserve(element);
				} else setSize(void 0);
			}, [element]);
			return size;
		}
		__name$8(useSize, "useSize");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-popper@1.3.7_@types+react-dom@18.3.7_@types+react@18.3.31__@types+react_28096db0f9bde2423c97e3931a7c2161/node_modules/@radix-ui/react-popper/dist/index.mjs
		var __defProp$7 = Object.defineProperty;
		var __name$7 = (target, value) => __defProp$7(target, "name", {
			value,
			configurable: true
		});
		var POPPER_NAME = "Popper";
		var [createPopperContext, createPopperScope] = /* @__PURE__ */ createContextScope(POPPER_NAME);
		var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
		var Popper = /* @__PURE__ */ __name$7((props) => {
			const { __scopePopper, children } = props;
			const [anchor, setAnchor] = react$1.useState(null);
			const [placementState, setPlacementState] = react$1.useState(void 0);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PopperProvider, {
				scope: __scopePopper,
				anchor,
				onAnchorChange: setAnchor,
				placementState,
				setPlacementState,
				children
			});
		}, "Popper");
		var ANCHOR_NAME = "PopperAnchor";
		var PopperAnchor = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$7(function PopperAnchor2(props, forwardedRef) {
			const { __scopePopper, virtualRef, ...anchorProps } = props;
			const context = usePopperContext(ANCHOR_NAME, __scopePopper);
			const ref = react$1.useRef(null);
			const onAnchorChange = context.onAnchorChange;
			const composedRefs = useComposedRefs(forwardedRef, react$1.useCallback((node) => {
				ref.current = node;
				if (node) onAnchorChange(node);
			}, [onAnchorChange]));
			const anchorRef = react$1.useRef(null);
			react$1.useEffect(() => {
				if (!virtualRef) return;
				const previousAnchor = anchorRef.current;
				anchorRef.current = virtualRef.current;
				if (previousAnchor !== anchorRef.current) onAnchorChange(anchorRef.current);
			});
			const sideAndAlign = context.placementState && getSideAndAlignFromPlacement(context.placementState);
			const placedSide = sideAndAlign?.[0];
			const placedAlign = sideAndAlign?.[1];
			return virtualRef ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.div, {
				"data-radix-popper-side": placedSide,
				"data-radix-popper-align": placedAlign,
				...anchorProps,
				ref: composedRefs
			});
		}, "PopperAnchor"));
		var CONTENT_NAME$1 = "PopperContent";
		var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$1);
		var PopperContent = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$7(function PopperContent2(props, forwardedRef) {
			const { __scopePopper, side = "bottom", sideOffset = 0, align = "center", alignOffset = 0, arrowPadding = 0, avoidCollisions = true, collisionBoundary = [], collisionPadding: collisionPaddingProp = 0, sticky = "partial", hideWhenDetached = false, updatePositionStrategy = "optimized", onPlaced, ...contentProps } = props;
			const context = usePopperContext(CONTENT_NAME$1, __scopePopper);
			const [content, setContent] = react$1.useState(null);
			const composedRefs = useComposedRefs(forwardedRef, setContent);
			const [arrow$4, setArrow] = react$1.useState(null);
			const arrowSize = useSize(arrow$4);
			const arrowWidth = arrowSize?.width ?? 0;
			const arrowHeight = arrowSize?.height ?? 0;
			const desiredPlacement = side + (align !== "center" ? "-" + align : "");
			const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				...collisionPaddingProp
			};
			const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
			const hasExplicitBoundaries = boundary.length > 0;
			const detectOverflowOptions = {
				padding: collisionPadding,
				boundary: boundary.filter(isNotNull),
				altBoundary: hasExplicitBoundaries
			};
			const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
				strategy: "fixed",
				placement: desiredPlacement,
				whileElementsMounted: /* @__PURE__ */ __name$7((...args) => {
					return autoUpdate(...args, { animationFrame: updatePositionStrategy === "always" });
				}, "whileElementsMounted"),
				elements: { reference: context.anchor },
				middleware: [
					offset({
						mainAxis: sideOffset + arrowHeight,
						alignmentAxis: alignOffset
					}),
					avoidCollisions && shift({
						mainAxis: true,
						crossAxis: false,
						limiter: sticky === "partial" ? limitShift() : void 0,
						...detectOverflowOptions
					}),
					avoidCollisions && flip({ ...detectOverflowOptions }),
					size({
						...detectOverflowOptions,
						apply: /* @__PURE__ */ __name$7(({ elements, rects, availableWidth, availableHeight }) => {
							const { width: anchorWidth, height: anchorHeight } = rects.reference;
							const contentStyle = elements.floating.style;
							contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
							contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
							contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
							contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
						}, "apply")
					}),
					arrow$4 && arrow({
						element: arrow$4,
						padding: arrowPadding
					}),
					transformOrigin({
						arrowWidth,
						arrowHeight
					}),
					hideWhenDetached && hide({
						strategy: "referenceHidden",
						...detectOverflowOptions,
						boundary: hasExplicitBoundaries ? detectOverflowOptions.boundary : void 0
					})
				]
			});
			const setPlacementState = context.setPlacementState;
			useLayoutEffect2(() => {
				setPlacementState(placement);
				return () => {
					setPlacementState(void 0);
				};
			}, [placement, setPlacementState]);
			const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
			const handlePlaced = useCallbackRef$1(onPlaced);
			useLayoutEffect2(() => {
				if (isPositioned) handlePlaced?.();
			}, [isPositioned, handlePlaced]);
			const arrowX = middlewareData.arrow?.x;
			const arrowY = middlewareData.arrow?.y;
			const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
			const [contentZIndex, setContentZIndex] = react$1.useState();
			useLayoutEffect2(() => {
				if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
			}, [content]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: refs.setFloating,
				"data-radix-popper-content-wrapper": "",
				style: {
					...floatingStyles,
					transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
					minWidth: "max-content",
					zIndex: contentZIndex,
					"--radix-popper-transform-origin": [middlewareData.transformOrigin?.x, middlewareData.transformOrigin?.y].join(" "),
					...middlewareData.hide?.referenceHidden && {
						visibility: "hidden",
						pointerEvents: "none"
					}
				},
				dir: props.dir,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PopperContentProvider, {
					scope: __scopePopper,
					placedSide,
					placedAlign,
					onArrowChange: setArrow,
					arrowX,
					arrowY,
					shouldHideArrow: cannotCenterArrow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.div, {
						"data-side": placedSide,
						"data-align": placedAlign,
						...contentProps,
						ref: composedRefs,
						style: {
							...contentProps.style,
							animation: !isPositioned ? "none" : contentProps.style?.animation
						}
					})
				})
			});
		}, "PopperContent"));
		function isNotNull(value) {
			return value !== null;
		}
		__name$7(isNotNull, "isNotNull");
		var transformOrigin = /* @__PURE__ */ __name$7((options) => ({
			name: "transformOrigin",
			options,
			fn(data) {
				const { placement, rects, middlewareData } = data;
				const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
				const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
				const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
				const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
				const noArrowAlign = {
					start: "0%",
					center: "50%",
					end: "100%"
				}[placedAlign];
				const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
				const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
				let x = "";
				let y = "";
				if (placedSide === "bottom") {
					x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
					y = `${-arrowHeight}px`;
				} else if (placedSide === "top") {
					x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
					y = `${rects.floating.height + arrowHeight}px`;
				} else if (placedSide === "right") {
					x = `${-arrowHeight}px`;
					y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
				} else if (placedSide === "left") {
					x = `${rects.floating.width + arrowHeight}px`;
					y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
				}
				return { data: {
					x,
					y
				} };
			}
		}), "transformOrigin");
		function getSideAndAlignFromPlacement(placement) {
			const [side, align = "center"] = placement.split("-");
			return [side, align];
		}
		__name$7(getSideAndAlignFromPlacement, "getSideAndAlignFromPlacement");
		var Root2 = Popper;
		var Anchor = PopperAnchor;
		var Content = PopperContent;
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-portal@1.1.17_@types+react-dom@18.3.7_@types+react@18.3.31__@types+reac_fec8154ee9f066565a91ca8c6ba2c7d1/node_modules/@radix-ui/react-portal/dist/index.mjs
		var __defProp$6 = Object.defineProperty;
		var __name$6 = (target, value) => __defProp$6(target, "name", {
			value,
			configurable: true
		});
		var Portal = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$6(function Portal2(props, forwardedRef) {
			const { container: containerProp, ...portalProps } = props;
			const [mounted, setMounted] = react$1.useState(false);
			useLayoutEffect2(() => setMounted(true), []);
			const container = containerProp || mounted && globalThis?.document?.body;
			return container ? react_dom.createPortal(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.div, {
				...portalProps,
				ref: forwardedRef
			}), container) : null;
		}, "Portal"));
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-presence@1.1.10_@types+react-dom@18.3.7_@types+react@18.3.31__@types+re_1e2cd35b12d6127fe3d2d84d5861b3c1/node_modules/@radix-ui/react-presence/dist/index.mjs
		var __defProp$5 = Object.defineProperty;
		var __name$5 = (target, value) => __defProp$5(target, "name", {
			value,
			configurable: true
		});
		function useStateMachine(initialState, machine) {
			return react$1.useReducer((state, event) => {
				return machine[state][event] ?? state;
			}, initialState);
		}
		__name$5(useStateMachine, "useStateMachine");
		var Presence = /* @__PURE__ */ __name$5((props) => {
			const { present, children } = props;
			const presence = usePresence(present);
			const child = typeof children === "function" ? children({ present: presence.isPresent }) : react$1.Children.only(children);
			const ref = useStableComposedRefs(presence.ref, getElementRef(child));
			return typeof children === "function" || presence.isPresent ? react$1.cloneElement(child, { ref }) : null;
		}, "Presence");
		function usePresence(present) {
			const [node, setNode] = react$1.useState();
			const stylesRef = react$1.useRef(null);
			const prevPresentRef = react$1.useRef(present);
			const prevAnimationNameRef = react$1.useRef("none");
			const mountAnimationNameRef = react$1.useRef(void 0);
			const [state, send] = useStateMachine(present ? "mounted" : "unmounted", {
				mounted: {
					UNMOUNT: "unmounted",
					ANIMATION_OUT: "unmountSuspended"
				},
				unmountSuspended: {
					MOUNT: "mounted",
					ANIMATION_END: "unmounted"
				},
				unmounted: { MOUNT: "mounted" }
			});
			react$1.useEffect(() => {
				if (state === "mounted") {
					prevAnimationNameRef.current = mountAnimationNameRef.current ?? getAnimationName(stylesRef.current);
					mountAnimationNameRef.current = void 0;
				} else prevAnimationNameRef.current = "none";
			}, [state]);
			useLayoutEffect2(() => {
				const styles = stylesRef.current;
				const wasPresent = prevPresentRef.current;
				if (wasPresent !== present) {
					const prevAnimationName = prevAnimationNameRef.current;
					const currentAnimationName = getAnimationName(styles);
					if (present) {
						mountAnimationNameRef.current = currentAnimationName;
						send("MOUNT");
					} else if (currentAnimationName === "none" || styles?.display === "none") send("UNMOUNT");
					else if (wasPresent && prevAnimationName !== currentAnimationName) send("ANIMATION_OUT");
					else send("UNMOUNT");
					prevPresentRef.current = present;
				}
			}, [present, send]);
			useLayoutEffect2(() => {
				if (node) {
					let timeoutId;
					const ownerWindow = node.ownerDocument.defaultView ?? window;
					const handleAnimationEnd = /* @__PURE__ */ __name$5((event) => {
						const isCurrentAnimation = getAnimationName(stylesRef.current).includes(CSS.escape(event.animationName));
						if (event.target === node && isCurrentAnimation) {
							send("ANIMATION_END");
							if (!prevPresentRef.current) {
								const currentFillMode = node.style.animationFillMode;
								node.style.animationFillMode = "forwards";
								timeoutId = ownerWindow.setTimeout(() => {
									if (node.style.animationFillMode === "forwards") node.style.animationFillMode = currentFillMode;
								});
							}
						}
					}, "handleAnimationEnd");
					const handleAnimationStart = /* @__PURE__ */ __name$5((event) => {
						if (event.target === node) prevAnimationNameRef.current = getAnimationName(stylesRef.current);
					}, "handleAnimationStart");
					node.addEventListener("animationstart", handleAnimationStart);
					node.addEventListener("animationcancel", handleAnimationEnd);
					node.addEventListener("animationend", handleAnimationEnd);
					return () => {
						ownerWindow.clearTimeout(timeoutId);
						node.removeEventListener("animationstart", handleAnimationStart);
						node.removeEventListener("animationcancel", handleAnimationEnd);
						node.removeEventListener("animationend", handleAnimationEnd);
					};
				} else send("ANIMATION_END");
			}, [node, send]);
			return {
				isPresent: ["mounted", "unmountSuspended"].includes(state),
				ref: react$1.useCallback((node2) => {
					if (node2) {
						const styles = getComputedStyle(node2);
						stylesRef.current = styles;
						mountAnimationNameRef.current = getAnimationName(styles);
					} else stylesRef.current = null;
					setNode(node2);
				}, [])
			};
		}
		__name$5(usePresence, "usePresence");
		function setRef(ref, value) {
			if (typeof ref === "function") return ref(value);
			else if (ref !== null && ref !== void 0) ref.current = value;
		}
		__name$5(setRef, "setRef");
		function useStableComposedRefs(...refs) {
			const refsRef = react$1.useRef(refs);
			refsRef.current = refs;
			return react$1.useCallback((node) => {
				const currentRefs = refsRef.current;
				let hasCleanup = false;
				const cleanups = currentRefs.map((ref) => {
					const cleanup = setRef(ref, node);
					if (!hasCleanup && typeof cleanup === "function") hasCleanup = true;
					return cleanup;
				});
				if (hasCleanup) return () => {
					for (let i = 0; i < cleanups.length; i++) {
						const cleanup = cleanups[i];
						if (typeof cleanup === "function") cleanup();
						else setRef(currentRefs[i], null);
					}
				};
			}, []);
		}
		__name$5(useStableComposedRefs, "useStableComposedRefs");
		function getAnimationName(styles) {
			return styles?.animationName || "none";
		}
		__name$5(getAnimationName, "getAnimationName");
		function getElementRef(element) {
			let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
			let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
			if (mayWarn) return element.ref;
			getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
			mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
			if (mayWarn) return element.props.ref;
			return element.props.ref || element.ref;
		}
		__name$5(getElementRef, "getElementRef");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-use-effect-event@0.0.5_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs
		var __defProp$4 = Object.defineProperty;
		var __name$4 = (target, value) => __defProp$4(target, "name", {
			value,
			configurable: true
		});
		var useReactEffectEvent = react$1[" useEffectEvent ".trim().toString()];
		var useReactInsertionEffect = react$1[" useInsertionEffect ".trim().toString()];
		function useEffectEvent(callback) {
			if (typeof useReactEffectEvent === "function") return useReactEffectEvent(callback);
			const ref = react$1.useRef(() => {
				throw new Error("Cannot call an event handler while rendering.");
			});
			if (typeof useReactInsertionEffect === "function") useReactInsertionEffect(() => {
				ref.current = callback;
			});
			else useLayoutEffect2(() => {
				ref.current = callback;
			});
			return react$1.useMemo(() => ((...args) => ref.current?.(...args)), []);
		}
		__name$4(useEffectEvent, "useEffectEvent");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-use-controllable-state@1.2.6_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
		var __defProp$3 = Object.defineProperty;
		var __name$3 = (target, value) => __defProp$3(target, "name", {
			value,
			configurable: true
		});
		var useInsertionEffect = react$1[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
		function useControllableState({ prop, defaultProp, onChange = /* @__PURE__ */ __name$3(() => {}, "onChange"), caller }) {
			const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
				defaultProp,
				onChange
			});
			const isControlled = prop !== void 0;
			return [isControlled ? prop : uncontrolledProp, react$1.useCallback((nextValue) => {
				if (isControlled) {
					const value2 = isFunction$1(nextValue) ? nextValue(prop) : nextValue;
					if (value2 !== prop) onChangeRef.current?.(value2);
				} else setUncontrolledProp(nextValue);
			}, [
				isControlled,
				prop,
				setUncontrolledProp,
				onChangeRef
			])];
		}
		__name$3(useControllableState, "useControllableState");
		function useUncontrolledState({ defaultProp, onChange }) {
			const [value, setValue] = react$1.useState(defaultProp);
			const prevValueRef = react$1.useRef(value);
			const onChangeRef = react$1.useRef(onChange);
			useInsertionEffect(() => {
				onChangeRef.current = onChange;
			}, [onChange]);
			react$1.useEffect(() => {
				if (prevValueRef.current !== value) {
					onChangeRef.current?.(value);
					prevValueRef.current = value;
				}
			}, [value, prevValueRef]);
			return [
				value,
				setValue,
				onChangeRef
			];
		}
		__name$3(useUncontrolledState, "useUncontrolledState");
		function isFunction$1(value) {
			return typeof value === "function";
		}
		__name$3(isFunction$1, "isFunction");
		var SYNC_STATE = Symbol("RADIX:SYNC_STATE");
		function useControllableStateReducer(reducer, userArgs, initialArg, init) {
			const { prop: controlledState, defaultProp, onChange: onChangeProp, caller } = userArgs;
			const isControlled = controlledState !== void 0;
			const onChange = useEffectEvent(onChangeProp);
			const args = [{
				...initialArg,
				state: defaultProp
			}];
			if (init) args.push(init);
			const [internalState, dispatch] = react$1.useReducer((state2, action) => {
				if (action.type === SYNC_STATE) return {
					...state2,
					state: action.state
				};
				const next = reducer(state2, action);
				if (isControlled && !Object.is(next.state, state2.state)) onChange(next.state);
				return next;
			}, ...args);
			const uncontrolledState = internalState.state;
			const prevValueRef = react$1.useRef(uncontrolledState);
			react$1.useEffect(() => {
				if (prevValueRef.current !== uncontrolledState) {
					prevValueRef.current = uncontrolledState;
					if (!isControlled) onChange(uncontrolledState);
				}
			}, [
				uncontrolledState,
				prevValueRef,
				isControlled
			]);
			const state = react$1.useMemo(() => {
				if (controlledState !== void 0) return {
					...internalState,
					state: controlledState
				};
				return internalState;
			}, [internalState, controlledState]);
			react$1.useEffect(() => {
				if (isControlled && !Object.is(controlledState, internalState.state)) dispatch({
					type: SYNC_STATE,
					state: controlledState
				});
			}, [
				controlledState,
				internalState.state,
				isControlled
			]);
			return [state, dispatch];
		}
		__name$3(useControllableStateReducer, "useControllableStateReducer");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-use-previous@1.1.4_@types+react@18.3.31_react@18.3.1/node_modules/@radix-ui/react-use-previous/dist/index.mjs
		var __defProp$2 = Object.defineProperty;
		var __name$2 = (target, value) => __defProp$2(target, "name", {
			value,
			configurable: true
		});
		function usePrevious(value) {
			const ref = react$1.useRef({
				value,
				previous: value
			});
			return react$1.useMemo(() => {
				if (ref.current.value !== value) {
					ref.current.previous = ref.current.value;
					ref.current.value = value;
				}
				return ref.current.previous;
			}, [value]);
		}
		__name$2(usePrevious, "usePrevious");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-visually-hidden@1.2.11_@types+react-dom@18.3.7_@types+react@18.3.31__@t_7c49f74ef488018f6e65a8c7521a3580/node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
		var VISUALLY_HIDDEN_STYLES = Object.freeze({
			position: "absolute",
			border: 0,
			width: 1,
			height: 1,
			padding: 0,
			margin: -1,
			overflow: "hidden",
			clip: "rect(0, 0, 0, 0)",
			whiteSpace: "nowrap",
			wordWrap: "normal"
		});
		//#endregion
		//#region node_modules/.pnpm/aria-hidden@1.2.6/node_modules/aria-hidden/dist/es2015/index.js
		var getDefaultParent = function(originalTarget) {
			if (typeof document === "undefined") return null;
			return (Array.isArray(originalTarget) ? originalTarget[0] : originalTarget).ownerDocument.body;
		};
		var counterMap = /* @__PURE__ */ new WeakMap();
		var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
		var markerMap = {};
		var lockCount = 0;
		var unwrapHost = function(node) {
			return node && (node.host || unwrapHost(node.parentNode));
		};
		var correctTargets = function(parent, targets) {
			return targets.map(function(target) {
				if (parent.contains(target)) return target;
				var correctedTarget = unwrapHost(target);
				if (correctedTarget && parent.contains(correctedTarget)) return correctedTarget;
				console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
				return null;
			}).filter(function(x) {
				return Boolean(x);
			});
		};
		/**
		* Marks everything except given node(or nodes) as aria-hidden
		* @param {Element | Element[]} originalTarget - elements to keep on the page
		* @param [parentNode] - top element, defaults to document.body
		* @param {String} [markerName] - a special attribute to mark every node
		* @param {String} [controlAttribute] - html Attribute to control
		* @return {Undo} undo command
		*/
		var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
			var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
			if (!markerMap[markerName]) markerMap[markerName] = /* @__PURE__ */ new WeakMap();
			var markerCounter = markerMap[markerName];
			var hiddenNodes = [];
			var elementsToKeep = /* @__PURE__ */ new Set();
			var elementsToStop = new Set(targets);
			var keep = function(el) {
				if (!el || elementsToKeep.has(el)) return;
				elementsToKeep.add(el);
				keep(el.parentNode);
			};
			targets.forEach(keep);
			var deep = function(parent) {
				if (!parent || elementsToStop.has(parent)) return;
				Array.prototype.forEach.call(parent.children, function(node) {
					if (elementsToKeep.has(node)) deep(node);
					else try {
						var attr = node.getAttribute(controlAttribute);
						var alreadyHidden = attr !== null && attr !== "false";
						var counterValue = (counterMap.get(node) || 0) + 1;
						var markerValue = (markerCounter.get(node) || 0) + 1;
						counterMap.set(node, counterValue);
						markerCounter.set(node, markerValue);
						hiddenNodes.push(node);
						if (counterValue === 1 && alreadyHidden) uncontrolledNodes.set(node, true);
						if (markerValue === 1) node.setAttribute(markerName, "true");
						if (!alreadyHidden) node.setAttribute(controlAttribute, "true");
					} catch (e) {
						console.error("aria-hidden: cannot operate on ", node, e);
					}
				});
			};
			deep(parentNode);
			elementsToKeep.clear();
			lockCount++;
			return function() {
				hiddenNodes.forEach(function(node) {
					var counterValue = counterMap.get(node) - 1;
					var markerValue = markerCounter.get(node) - 1;
					counterMap.set(node, counterValue);
					markerCounter.set(node, markerValue);
					if (!counterValue) {
						if (!uncontrolledNodes.has(node)) node.removeAttribute(controlAttribute);
						uncontrolledNodes.delete(node);
					}
					if (!markerValue) node.removeAttribute(markerName);
				});
				lockCount--;
				if (!lockCount) {
					counterMap = /* @__PURE__ */ new WeakMap();
					counterMap = /* @__PURE__ */ new WeakMap();
					uncontrolledNodes = /* @__PURE__ */ new WeakMap();
					markerMap = {};
				}
			};
		};
		/**
		* Marks everything except given node(or nodes) as aria-hidden
		* @param {Element | Element[]} originalTarget - elements to keep on the page
		* @param [parentNode] - top element, defaults to document.body
		* @param {String} [markerName] - a special attribute to mark every node
		* @return {Undo} undo command
		*/
		var hideOthers = function(originalTarget, parentNode, markerName) {
			if (markerName === void 0) markerName = "data-aria-hidden";
			var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
			var activeParentNode = parentNode || getDefaultParent(originalTarget);
			if (!activeParentNode) return function() {
				return null;
			};
			targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
			return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
		};
		const { __extends, __assign, __rest, __decorate, __param, __esDecorate, __runInitializers, __propKey, __setFunctionName, __metadata, __awaiter, __generator, __exportStar, __createBinding, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet, __classPrivateFieldIn, __addDisposableResource, __disposeResources, __rewriteRelativeImportExtension } = (/* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
			/******************************************************************************
			Copyright (c) Microsoft Corporation.
			
			Permission to use, copy, modify, and/or distribute this software for any
			purpose with or without fee is hereby granted.
			
			THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
			REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
			AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
			INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
			LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
			OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
			PERFORMANCE OF THIS SOFTWARE.
			***************************************************************************** */
			var __extends;
			var __assign;
			var __rest;
			var __decorate;
			var __param;
			var __esDecorate;
			var __runInitializers;
			var __propKey;
			var __setFunctionName;
			var __metadata;
			var __awaiter;
			var __generator;
			var __exportStar;
			var __values;
			var __read;
			var __spread;
			var __spreadArrays;
			var __spreadArray;
			var __await;
			var __asyncGenerator;
			var __asyncDelegator;
			var __asyncValues;
			var __makeTemplateObject;
			var __importStar;
			var __importDefault;
			var __classPrivateFieldGet;
			var __classPrivateFieldSet;
			var __classPrivateFieldIn;
			var __createBinding;
			var __addDisposableResource;
			var __disposeResources;
			var __rewriteRelativeImportExtension;
			(function(factory) {
				var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
				if (typeof define === "function" && define.amd) define("tslib", ["exports"], function(exports$1) {
					factory(createExporter(root, createExporter(exports$1)));
				});
				else if (typeof module === "object" && typeof module.exports === "object") factory(createExporter(root, createExporter(module.exports)));
				else factory(createExporter(root));
				function createExporter(exports$2, previous) {
					if (exports$2 !== root) {
						if (typeof Object.create === "function") Object.defineProperty(exports$2, "__esModule", { value: true });
						else exports$2.__esModule = true;
					}
					return function(id, v) {
						return exports$2[id] = previous ? previous(id, v) : v;
					};
				}
			})(function(exporter) {
				var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
					d.__proto__ = b;
				} || function(d, b) {
					for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
				};
				__extends = function(d, b) {
					if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
					extendStatics(d, b);
					function __() {
						this.constructor = d;
					}
					d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
				};
				__assign = Object.assign || function(t) {
					for (var s, i = 1, n = arguments.length; i < n; i++) {
						s = arguments[i];
						for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
					}
					return t;
				};
				__rest = function(s, e) {
					var t = {};
					for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
					if (s != null && typeof Object.getOwnPropertySymbols === "function") {
						for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
					}
					return t;
				};
				__decorate = function(decorators, target, key, desc) {
					var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
					if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
					else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
					return c > 3 && r && Object.defineProperty(target, key, r), r;
				};
				__param = function(paramIndex, decorator) {
					return function(target, key) {
						decorator(target, key, paramIndex);
					};
				};
				__esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
					function accept(f) {
						if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
						return f;
					}
					var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
					var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
					var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
					var _, done = false;
					for (var i = decorators.length - 1; i >= 0; i--) {
						var context = {};
						for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
						for (var p in contextIn.access) context.access[p] = contextIn.access[p];
						context.addInitializer = function(f) {
							if (done) throw new TypeError("Cannot add initializers after decoration has completed");
							extraInitializers.push(accept(f || null));
						};
						var result = (0, decorators[i])(kind === "accessor" ? {
							get: descriptor.get,
							set: descriptor.set
						} : descriptor[key], context);
						if (kind === "accessor") {
							if (result === void 0) continue;
							if (result === null || typeof result !== "object") throw new TypeError("Object expected");
							if (_ = accept(result.get)) descriptor.get = _;
							if (_ = accept(result.set)) descriptor.set = _;
							if (_ = accept(result.init)) initializers.unshift(_);
						} else if (_ = accept(result)) {
							if (kind === "field") initializers.unshift(_);
							else descriptor[key] = _;
						}
					}
					if (target) Object.defineProperty(target, contextIn.name, descriptor);
					done = true;
				};
				__runInitializers = function(thisArg, initializers, value) {
					var useValue = arguments.length > 2;
					for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
					return useValue ? value : void 0;
				};
				__propKey = function(x) {
					return typeof x === "symbol" ? x : "".concat(x);
				};
				__setFunctionName = function(f, name, prefix) {
					if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
					return Object.defineProperty(f, "name", {
						configurable: true,
						value: prefix ? "".concat(prefix, " ", name) : name
					});
				};
				__metadata = function(metadataKey, metadataValue) {
					if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
				};
				__awaiter = function(thisArg, _arguments, P, generator) {
					function adopt(value) {
						return value instanceof P ? value : new P(function(resolve) {
							resolve(value);
						});
					}
					return new (P || (P = Promise))(function(resolve, reject) {
						function fulfilled(value) {
							try {
								step(generator.next(value));
							} catch (e) {
								reject(e);
							}
						}
						function rejected(value) {
							try {
								step(generator["throw"](value));
							} catch (e) {
								reject(e);
							}
						}
						function step(result) {
							result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
						}
						step((generator = generator.apply(thisArg, _arguments || [])).next());
					});
				};
				__generator = function(thisArg, body) {
					var _ = {
						label: 0,
						sent: function() {
							if (t[0] & 1) throw t[1];
							return t[1];
						},
						trys: [],
						ops: []
					}, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
					return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
						return this;
					}), g;
					function verb(n) {
						return function(v) {
							return step([n, v]);
						};
					}
					function step(op) {
						if (f) throw new TypeError("Generator is already executing.");
						while (g && (g = 0, op[0] && (_ = 0)), _) try {
							if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
							if (y = 0, t) op = [op[0] & 2, t.value];
							switch (op[0]) {
								case 0:
								case 1:
									t = op;
									break;
								case 4:
									_.label++;
									return {
										value: op[1],
										done: false
									};
								case 5:
									_.label++;
									y = op[1];
									op = [0];
									continue;
								case 7:
									op = _.ops.pop();
									_.trys.pop();
									continue;
								default:
									if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
										_ = 0;
										continue;
									}
									if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
										_.label = op[1];
										break;
									}
									if (op[0] === 6 && _.label < t[1]) {
										_.label = t[1];
										t = op;
										break;
									}
									if (t && _.label < t[2]) {
										_.label = t[2];
										_.ops.push(op);
										break;
									}
									if (t[2]) _.ops.pop();
									_.trys.pop();
									continue;
							}
							op = body.call(thisArg, _);
						} catch (e) {
							op = [6, e];
							y = 0;
						} finally {
							f = t = 0;
						}
						if (op[0] & 5) throw op[1];
						return {
							value: op[0] ? op[1] : void 0,
							done: true
						};
					}
				};
				__exportStar = function(m, o) {
					for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
				};
				__createBinding = Object.create ? (function(o, m, k, k2) {
					if (k2 === void 0) k2 = k;
					var desc = Object.getOwnPropertyDescriptor(m, k);
					if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
						enumerable: true,
						get: function() {
							return m[k];
						}
					};
					Object.defineProperty(o, k2, desc);
				}) : (function(o, m, k, k2) {
					if (k2 === void 0) k2 = k;
					o[k2] = m[k];
				});
				__values = function(o) {
					var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
					if (m) return m.call(o);
					if (o && typeof o.length === "number") return { next: function() {
						if (o && i >= o.length) o = void 0;
						return {
							value: o && o[i++],
							done: !o
						};
					} };
					throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
				};
				__read = function(o, n) {
					var m = typeof Symbol === "function" && o[Symbol.iterator];
					if (!m) return o;
					var i = m.call(o), r, ar = [], e;
					try {
						while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
					} catch (error) {
						e = { error };
					} finally {
						try {
							if (r && !r.done && (m = i["return"])) m.call(i);
						} finally {
							if (e) throw e.error;
						}
					}
					return ar;
				};
				/** @deprecated */
				__spread = function() {
					for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
					return ar;
				};
				/** @deprecated */
				__spreadArrays = function() {
					for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
					for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
					return r;
				};
				__spreadArray = function(to, from, pack) {
					if (pack || arguments.length === 2) {
						for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
							if (!ar) ar = Array.prototype.slice.call(from, 0, i);
							ar[i] = from[i];
						}
					}
					return to.concat(ar || Array.prototype.slice.call(from));
				};
				__await = function(v) {
					return this instanceof __await ? (this.v = v, this) : new __await(v);
				};
				__asyncGenerator = function(thisArg, _arguments, generator) {
					if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
					var g = generator.apply(thisArg, _arguments || []), i, q = [];
					return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
						return this;
					}, i;
					function awaitReturn(f) {
						return function(v) {
							return Promise.resolve(v).then(f, reject);
						};
					}
					function verb(n, f) {
						if (g[n]) {
							i[n] = function(v) {
								return new Promise(function(a, b) {
									q.push([
										n,
										v,
										a,
										b
									]) > 1 || resume(n, v);
								});
							};
							if (f) i[n] = f(i[n]);
						}
					}
					function resume(n, v) {
						try {
							step(g[n](v));
						} catch (e) {
							settle(q[0][3], e);
						}
					}
					function step(r) {
						r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
					}
					function fulfill(value) {
						resume("next", value);
					}
					function reject(value) {
						resume("throw", value);
					}
					function settle(f, v) {
						if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
					}
				};
				__asyncDelegator = function(o) {
					var i, p;
					return i = {}, verb("next"), verb("throw", function(e) {
						throw e;
					}), verb("return"), i[Symbol.iterator] = function() {
						return this;
					}, i;
					function verb(n, f) {
						i[n] = o[n] ? function(v) {
							return (p = !p) ? {
								value: __await(o[n](v)),
								done: false
							} : f ? f(v) : v;
						} : f;
					}
				};
				__asyncValues = function(o) {
					if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
					var m = o[Symbol.asyncIterator], i;
					return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
						return this;
					}, i);
					function verb(n) {
						i[n] = o[n] && function(v) {
							return new Promise(function(resolve, reject) {
								v = o[n](v), settle(resolve, reject, v.done, v.value);
							});
						};
					}
					function settle(resolve, reject, d, v) {
						Promise.resolve(v).then(function(v) {
							resolve({
								value: v,
								done: d
							});
						}, reject);
					}
				};
				__makeTemplateObject = function(cooked, raw) {
					if (Object.defineProperty) Object.defineProperty(cooked, "raw", { value: raw });
					else cooked.raw = raw;
					return cooked;
				};
				var __setModuleDefault = Object.create ? (function(o, v) {
					Object.defineProperty(o, "default", {
						enumerable: true,
						value: v
					});
				}) : function(o, v) {
					o["default"] = v;
				};
				var ownKeys = function(o) {
					ownKeys = Object.getOwnPropertyNames || function(o) {
						var ar = [];
						for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
						return ar;
					};
					return ownKeys(o);
				};
				__importStar = function(mod) {
					if (mod && mod.__esModule) return mod;
					var result = {};
					if (mod != null) {
						for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
					}
					__setModuleDefault(result, mod);
					return result;
				};
				__importDefault = function(mod) {
					return mod && mod.__esModule ? mod : { "default": mod };
				};
				__classPrivateFieldGet = function(receiver, state, kind, f) {
					if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
					if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
					return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
				};
				__classPrivateFieldSet = function(receiver, state, value, kind, f) {
					if (kind === "m") throw new TypeError("Private method is not writable");
					if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
					if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
					return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
				};
				__classPrivateFieldIn = function(state, receiver) {
					if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
					return typeof state === "function" ? receiver === state : state.has(receiver);
				};
				__addDisposableResource = function(env, value, async) {
					if (value !== null && value !== void 0) {
						if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
						var dispose, inner;
						if (async) {
							if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
							dispose = value[Symbol.asyncDispose];
						}
						if (dispose === void 0) {
							if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
							dispose = value[Symbol.dispose];
							if (async) inner = dispose;
						}
						if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
						if (inner) dispose = function() {
							try {
								inner.call(this);
							} catch (e) {
								return Promise.reject(e);
							}
						};
						env.stack.push({
							value,
							dispose,
							async
						});
					} else if (async) env.stack.push({ async: true });
					return value;
				};
				var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
					var e = new Error(message);
					return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
				};
				__disposeResources = function(env) {
					function fail(e) {
						env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
						env.hasError = true;
					}
					var r, s = 0;
					function next() {
						while (r = env.stack.pop()) try {
							if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
							if (r.dispose) {
								var result = r.dispose.call(r.value);
								if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
									fail(e);
									return next();
								});
							} else s |= 1;
						} catch (e) {
							fail(e);
						}
						if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
						if (env.hasError) throw env.error;
					}
					return next();
				};
				__rewriteRelativeImportExtension = function(path, preserveJsx) {
					if (typeof path === "string" && /^\.\.?\//.test(path)) return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
						return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
					});
					return path;
				};
				exporter("__extends", __extends);
				exporter("__assign", __assign);
				exporter("__rest", __rest);
				exporter("__decorate", __decorate);
				exporter("__param", __param);
				exporter("__esDecorate", __esDecorate);
				exporter("__runInitializers", __runInitializers);
				exporter("__propKey", __propKey);
				exporter("__setFunctionName", __setFunctionName);
				exporter("__metadata", __metadata);
				exporter("__awaiter", __awaiter);
				exporter("__generator", __generator);
				exporter("__exportStar", __exportStar);
				exporter("__createBinding", __createBinding);
				exporter("__values", __values);
				exporter("__read", __read);
				exporter("__spread", __spread);
				exporter("__spreadArrays", __spreadArrays);
				exporter("__spreadArray", __spreadArray);
				exporter("__await", __await);
				exporter("__asyncGenerator", __asyncGenerator);
				exporter("__asyncDelegator", __asyncDelegator);
				exporter("__asyncValues", __asyncValues);
				exporter("__makeTemplateObject", __makeTemplateObject);
				exporter("__importStar", __importStar);
				exporter("__importDefault", __importDefault);
				exporter("__classPrivateFieldGet", __classPrivateFieldGet);
				exporter("__classPrivateFieldSet", __classPrivateFieldSet);
				exporter("__classPrivateFieldIn", __classPrivateFieldIn);
				exporter("__addDisposableResource", __addDisposableResource);
				exporter("__disposeResources", __disposeResources);
				exporter("__rewriteRelativeImportExtension", __rewriteRelativeImportExtension);
			});
			0 && (module.exports = {
				__extends,
				__assign,
				__rest,
				__decorate,
				__param,
				__esDecorate,
				__runInitializers,
				__propKey,
				__setFunctionName,
				__metadata,
				__awaiter,
				__generator,
				__exportStar,
				__createBinding,
				__values,
				__read,
				__spread,
				__spreadArrays,
				__spreadArray,
				__await,
				__asyncGenerator,
				__asyncDelegator,
				__asyncValues,
				__makeTemplateObject,
				__importStar,
				__importDefault,
				__classPrivateFieldGet,
				__classPrivateFieldSet,
				__classPrivateFieldIn,
				__addDisposableResource,
				__disposeResources,
				__rewriteRelativeImportExtension
			});
		})))())).default;
		//#endregion
		//#region node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@18.3.31_react@18.3.1/node_modules/react-remove-scroll-bar/dist/es2015/constants.js
		var zeroRightClassName = "right-scroll-bar-position";
		var fullWidthClassName = "width-before-scroll-bar";
		var noScrollbarsClassName = "with-scroll-bars-hidden";
		/**
		* Name of a CSS variable containing the amount of "hidden" scrollbar
		* ! might be undefined ! use will fallback!
		*/
		var removedBarSizeVariable = "--removed-body-scroll-bar-size";
		//#endregion
		//#region node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@18.3.31_react@18.3.1/node_modules/use-callback-ref/dist/es2015/assignRef.js
		/**
		* Assigns a value for a given ref, no matter of the ref format
		* @param {RefObject} ref - a callback function or ref object
		* @param value - a new value
		*
		* @see https://github.com/theKashey/use-callback-ref#assignref
		* @example
		* const refObject = useRef();
		* const refFn = (ref) => {....}
		*
		* assignRef(refObject, "refValue");
		* assignRef(refFn, "refValue");
		*/
		function assignRef(ref, value) {
			if (typeof ref === "function") ref(value);
			else if (ref) ref.current = value;
			return ref;
		}
		//#endregion
		//#region node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@18.3.31_react@18.3.1/node_modules/use-callback-ref/dist/es2015/useRef.js
		/**
		* creates a MutableRef with ref change callback
		* @param initialValue - initial ref value
		* @param {Function} callback - a callback to run when value changes
		*
		* @example
		* const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
		* ref.current = 1;
		* // prints 0 -> 1
		*
		* @see https://reactjs.org/docs/hooks-reference.html#useref
		* @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
		* @returns {MutableRefObject}
		*/
		function useCallbackRef(initialValue, callback) {
			var ref = (0, react.useState)(function() {
				return {
					value: initialValue,
					callback,
					facade: {
						get current() {
							return ref.value;
						},
						set current(value) {
							var last = ref.value;
							if (last !== value) {
								ref.value = value;
								ref.callback(value, last);
							}
						}
					}
				};
			})[0];
			ref.callback = callback;
			return ref.facade;
		}
		//#endregion
		//#region node_modules/.pnpm/use-callback-ref@1.3.3_@types+react@18.3.31_react@18.3.1/node_modules/use-callback-ref/dist/es2015/useMergeRef.js
		var useIsomorphicLayoutEffect = typeof window !== "undefined" ? react.useLayoutEffect : react.useEffect;
		var currentValues = /* @__PURE__ */ new WeakMap();
		/**
		* Merges two or more refs together providing a single interface to set their value
		* @param {RefObject|Ref} refs
		* @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
		*
		* @see {@link mergeRefs} a version without buit-in memoization
		* @see https://github.com/theKashey/use-callback-ref#usemergerefs
		* @example
		* const Component = React.forwardRef((props, ref) => {
		*   const ownRef = useRef();
		*   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
		*   return <div ref={domRef}>...</div>
		* }
		*/
		function useMergeRefs(refs, defaultValue) {
			var callbackRef = useCallbackRef(defaultValue || null, function(newValue) {
				return refs.forEach(function(ref) {
					return assignRef(ref, newValue);
				});
			});
			useIsomorphicLayoutEffect(function() {
				var oldValue = currentValues.get(callbackRef);
				if (oldValue) {
					var prevRefs_1 = new Set(oldValue);
					var nextRefs_1 = new Set(refs);
					var current_1 = callbackRef.current;
					prevRefs_1.forEach(function(ref) {
						if (!nextRefs_1.has(ref)) assignRef(ref, null);
					});
					nextRefs_1.forEach(function(ref) {
						if (!prevRefs_1.has(ref)) assignRef(ref, current_1);
					});
				}
				currentValues.set(callbackRef, refs);
			}, [refs]);
			return callbackRef;
		}
		//#endregion
		//#region node_modules/.pnpm/use-sidecar@1.1.3_@types+react@18.3.31_react@18.3.1/node_modules/use-sidecar/dist/es2015/medium.js
		function ItoI(a) {
			return a;
		}
		function innerCreateMedium(defaults, middleware) {
			if (middleware === void 0) middleware = ItoI;
			var buffer = [];
			var assigned = false;
			return {
				read: function() {
					if (assigned) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
					if (buffer.length) return buffer[buffer.length - 1];
					return defaults;
				},
				useMedium: function(data) {
					var item = middleware(data, assigned);
					buffer.push(item);
					return function() {
						buffer = buffer.filter(function(x) {
							return x !== item;
						});
					};
				},
				assignSyncMedium: function(cb) {
					assigned = true;
					while (buffer.length) {
						var cbs = buffer;
						buffer = [];
						cbs.forEach(cb);
					}
					buffer = {
						push: function(x) {
							return cb(x);
						},
						filter: function() {
							return buffer;
						}
					};
				},
				assignMedium: function(cb) {
					assigned = true;
					var pendingQueue = [];
					if (buffer.length) {
						var cbs = buffer;
						buffer = [];
						cbs.forEach(cb);
						pendingQueue = buffer;
					}
					var executeQueue = function() {
						var cbs = pendingQueue;
						pendingQueue = [];
						cbs.forEach(cb);
					};
					var cycle = function() {
						return Promise.resolve().then(executeQueue);
					};
					cycle();
					buffer = {
						push: function(x) {
							pendingQueue.push(x);
							cycle();
						},
						filter: function(filter) {
							pendingQueue = pendingQueue.filter(filter);
							return buffer;
						}
					};
				}
			};
		}
		function createSidecarMedium(options) {
			if (options === void 0) options = {};
			var medium = innerCreateMedium(null);
			medium.options = __assign({
				async: true,
				ssr: false
			}, options);
			return medium;
		}
		//#endregion
		//#region node_modules/.pnpm/use-sidecar@1.1.3_@types+react@18.3.31_react@18.3.1/node_modules/use-sidecar/dist/es2015/exports.js
		var SideCar = function(_a) {
			var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
			if (!sideCar) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
			var Target = sideCar.read();
			if (!Target) throw new Error("Sidecar medium not found");
			return react.createElement(Target, __assign({}, rest));
		};
		SideCar.isSideCarExport = true;
		function exportSidecar(medium, exported) {
			medium.useMedium(exported);
			return SideCar;
		}
		//#endregion
		//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@18.3.31_react@18.3.1/node_modules/react-remove-scroll/dist/es2015/medium.js
		var effectCar = createSidecarMedium();
		//#endregion
		//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@18.3.31_react@18.3.1/node_modules/react-remove-scroll/dist/es2015/UI.js
		var nothing = function() {};
		/**
		* Removes scrollbar from the page and contain the scroll within the Lock
		*/
		var RemoveScroll = react.forwardRef(function(props, parentRef) {
			var ref = react.useRef(null);
			var _a = react.useState({
				onScrollCapture: nothing,
				onWheelCapture: nothing,
				onTouchMoveCapture: nothing
			}), callbacks = _a[0], setCallbacks = _a[1];
			var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, [
				"forwardProps",
				"children",
				"className",
				"removeScrollBar",
				"enabled",
				"shards",
				"sideCar",
				"noRelative",
				"noIsolation",
				"inert",
				"allowPinchZoom",
				"as",
				"gapMode"
			]);
			var SideCar = sideCar;
			var containerRef = useMergeRefs([ref, parentRef]);
			var containerProps = __assign(__assign({}, rest), callbacks);
			return react.createElement(react.Fragment, null, enabled && react.createElement(SideCar, {
				sideCar: effectCar,
				removeScrollBar,
				shards,
				noRelative,
				noIsolation,
				inert,
				setCallbacks,
				allowPinchZoom: !!allowPinchZoom,
				lockRef: ref,
				gapMode
			}), forwardProps ? react.cloneElement(react.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : react.createElement(Container, __assign({}, containerProps, {
				className,
				ref: containerRef
			}), children));
		});
		RemoveScroll.defaultProps = {
			enabled: true,
			removeScrollBar: true,
			inert: false
		};
		RemoveScroll.classNames = {
			fullWidth: fullWidthClassName,
			zeroRight: zeroRightClassName
		};
		//#endregion
		//#region node_modules/.pnpm/get-nonce@1.0.1/node_modules/get-nonce/dist/es2015/index.js
		var currentNonce;
		var getNonce = function() {
			if (currentNonce) return currentNonce;
			if (typeof __webpack_nonce__ !== "undefined") return __webpack_nonce__;
		};
		//#endregion
		//#region node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@18.3.31_react@18.3.1/node_modules/react-style-singleton/dist/es2015/singleton.js
		function makeStyleTag() {
			if (!document) return null;
			var tag = document.createElement("style");
			tag.type = "text/css";
			var nonce = getNonce();
			if (nonce) tag.setAttribute("nonce", nonce);
			return tag;
		}
		function injectStyles(tag, css) {
			if (tag.styleSheet) tag.styleSheet.cssText = css;
			else tag.appendChild(document.createTextNode(css));
		}
		function insertStyleTag(tag) {
			(document.head || document.getElementsByTagName("head")[0]).appendChild(tag);
		}
		var stylesheetSingleton = function() {
			var counter = 0;
			var stylesheet = null;
			return {
				add: function(style) {
					if (counter == 0) {
						if (stylesheet = makeStyleTag()) {
							injectStyles(stylesheet, style);
							insertStyleTag(stylesheet);
						}
					}
					counter++;
				},
				remove: function() {
					counter--;
					if (!counter && stylesheet) {
						stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
						stylesheet = null;
					}
				}
			};
		};
		//#endregion
		//#region node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@18.3.31_react@18.3.1/node_modules/react-style-singleton/dist/es2015/hook.js
		/**
		* creates a hook to control style singleton
		* @see {@link styleSingleton} for a safer component version
		* @example
		* ```tsx
		* const useStyle = styleHookSingleton();
		* ///
		* useStyle('body { overflow: hidden}');
		*/
		var styleHookSingleton = function() {
			var sheet = stylesheetSingleton();
			return function(styles, isDynamic) {
				react.useEffect(function() {
					sheet.add(styles);
					return function() {
						sheet.remove();
					};
				}, [styles && isDynamic]);
			};
		};
		//#endregion
		//#region node_modules/.pnpm/react-style-singleton@2.2.3_@types+react@18.3.31_react@18.3.1/node_modules/react-style-singleton/dist/es2015/component.js
		/**
		* create a Component to add styles on demand
		* - styles are added when first instance is mounted
		* - styles are removed when the last instance is unmounted
		* - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
		*/
		var styleSingleton = function() {
			var useStyle = styleHookSingleton();
			var Sheet = function(_a) {
				var styles = _a.styles, dynamic = _a.dynamic;
				useStyle(styles, dynamic);
				return null;
			};
			return Sheet;
		};
		//#endregion
		//#region node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@18.3.31_react@18.3.1/node_modules/react-remove-scroll-bar/dist/es2015/utils.js
		var zeroGap = {
			left: 0,
			top: 0,
			right: 0,
			gap: 0
		};
		var parse = function(x) {
			return parseInt(x || "", 10) || 0;
		};
		var getOffset = function(gapMode) {
			var cs = window.getComputedStyle(document.body);
			var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
			var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
			var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
			return [
				parse(left),
				parse(top),
				parse(right)
			];
		};
		var getGapWidth = function(gapMode) {
			if (gapMode === void 0) gapMode = "margin";
			if (typeof window === "undefined") return zeroGap;
			var offsets = getOffset(gapMode);
			var documentWidth = document.documentElement.clientWidth;
			var windowWidth = window.innerWidth;
			return {
				left: offsets[0],
				top: offsets[1],
				right: offsets[2],
				gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
			};
		};
		//#endregion
		//#region node_modules/.pnpm/react-remove-scroll-bar@2.3.8_@types+react@18.3.31_react@18.3.1/node_modules/react-remove-scroll-bar/dist/es2015/component.js
		var Style = styleSingleton();
		var lockAttribute = "data-scroll-locked";
		var getStyles = function(_a, allowRelative, gapMode, important) {
			var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
			if (gapMode === void 0) gapMode = "margin";
			return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
				allowRelative && "position: relative ".concat(important, ";"),
				gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
				gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
			].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
		};
		var getCurrentUseCounter = function() {
			var counter = parseInt(document.body.getAttribute("data-scroll-locked") || "0", 10);
			return isFinite(counter) ? counter : 0;
		};
		var useLockAttribute = function() {
			react.useEffect(function() {
				document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
				return function() {
					var newCounter = getCurrentUseCounter() - 1;
					if (newCounter <= 0) document.body.removeAttribute(lockAttribute);
					else document.body.setAttribute(lockAttribute, newCounter.toString());
				};
			}, []);
		};
		/**
		* Removes page scrollbar and blocks page scroll when mounted
		*/
		var RemoveScrollBar = function(_a) {
			var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
			useLockAttribute();
			var gap = react.useMemo(function() {
				return getGapWidth(gapMode);
			}, [gapMode]);
			return react.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
		};
		//#endregion
		//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@18.3.31_react@18.3.1/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
		var passiveSupported = false;
		if (typeof window !== "undefined") try {
			var options = Object.defineProperty({}, "passive", { get: function() {
				passiveSupported = true;
				return true;
			} });
			window.addEventListener("test", options, options);
			window.removeEventListener("test", options, options);
		} catch (err) {
			passiveSupported = false;
		}
		var nonPassive = passiveSupported ? { passive: false } : false;
		//#endregion
		//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@18.3.31_react@18.3.1/node_modules/react-remove-scroll/dist/es2015/handleScroll.js
		var alwaysContainsScroll = function(node) {
			return node.tagName === "TEXTAREA";
		};
		var elementCanBeScrolled = function(node, overflow) {
			if (!(node instanceof Element)) return false;
			var styles = window.getComputedStyle(node);
			return styles[overflow] !== "hidden" && !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible");
		};
		var elementCouldBeVScrolled = function(node) {
			return elementCanBeScrolled(node, "overflowY");
		};
		var elementCouldBeHScrolled = function(node) {
			return elementCanBeScrolled(node, "overflowX");
		};
		var locationCouldBeScrolled = function(axis, node) {
			var ownerDocument = node.ownerDocument;
			var current = node;
			do {
				if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) current = current.host;
				if (elementCouldBeScrolled(axis, current)) {
					var _a = getScrollVariables(axis, current);
					if (_a[1] > _a[2]) return true;
				}
				current = current.parentNode;
			} while (current && current !== ownerDocument.body);
			return false;
		};
		var getVScrollVariables = function(_a) {
			return [
				_a.scrollTop,
				_a.scrollHeight,
				_a.clientHeight
			];
		};
		var getHScrollVariables = function(_a) {
			return [
				_a.scrollLeft,
				_a.scrollWidth,
				_a.clientWidth
			];
		};
		var elementCouldBeScrolled = function(axis, node) {
			return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
		};
		var getScrollVariables = function(axis, node) {
			return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
		};
		var getDirectionFactor = function(axis, direction) {
			/**
			* If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
			* and then increasingly negative as you scroll towards the end of the content.
			* @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
			*/
			return axis === "h" && direction === "rtl" ? -1 : 1;
		};
		var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
			var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
			var delta = directionFactor * sourceDelta;
			var target = event.target;
			var targetInLock = endTarget.contains(target);
			var shouldCancelScroll = false;
			var isDeltaPositive = delta > 0;
			var availableScroll = 0;
			var availableScrollTop = 0;
			do {
				if (!target) break;
				var _a = getScrollVariables(axis, target), position = _a[0];
				var elementScroll = _a[1] - _a[2] - directionFactor * position;
				if (position || elementScroll) {
					if (elementCouldBeScrolled(axis, target)) {
						availableScroll += elementScroll;
						availableScrollTop += position;
					}
				}
				var parent_1 = target.parentNode;
				target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
			} while (!targetInLock && target !== document.body || targetInLock && (endTarget.contains(target) || endTarget === target));
			if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) shouldCancelScroll = true;
			else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) shouldCancelScroll = true;
			return shouldCancelScroll;
		};
		//#endregion
		//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@18.3.31_react@18.3.1/node_modules/react-remove-scroll/dist/es2015/SideEffect.js
		var getTouchXY = function(event) {
			return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
		};
		var getDeltaXY = function(event) {
			return [event.deltaX, event.deltaY];
		};
		var extractRef = function(ref) {
			return ref && "current" in ref ? ref.current : ref;
		};
		var deltaCompare = function(x, y) {
			return x[0] === y[0] && x[1] === y[1];
		};
		var generateStyle = function(id) {
			return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
		};
		var idCounter$1 = 0;
		var lockStack = [];
		function RemoveScrollSideCar(props) {
			var shouldPreventQueue = react.useRef([]);
			var touchStartRef = react.useRef([0, 0]);
			var activeAxis = react.useRef();
			var id = react.useState(idCounter$1++)[0];
			var Style = react.useState(styleSingleton)[0];
			var lastProps = react.useRef(props);
			react.useEffect(function() {
				lastProps.current = props;
			}, [props]);
			react.useEffect(function() {
				if (props.inert) {
					document.body.classList.add("block-interactivity-".concat(id));
					var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
					allow_1.forEach(function(el) {
						return el.classList.add("allow-interactivity-".concat(id));
					});
					return function() {
						document.body.classList.remove("block-interactivity-".concat(id));
						allow_1.forEach(function(el) {
							return el.classList.remove("allow-interactivity-".concat(id));
						});
					};
				}
			}, [
				props.inert,
				props.lockRef.current,
				props.shards
			]);
			var shouldCancelEvent = react.useCallback(function(event, parent) {
				if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) return !lastProps.current.allowPinchZoom;
				var touch = getTouchXY(event);
				var touchStart = touchStartRef.current;
				var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
				var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
				var currentAxis;
				var target = event.target;
				var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
				if ("touches" in event && moveDirection === "h" && target.type === "range") return false;
				var selection = window.getSelection();
				var anchorNode = selection && selection.anchorNode;
				if (anchorNode ? anchorNode === target || anchorNode.contains(target) : false) return false;
				var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
				if (!canBeScrolledInMainDirection) return true;
				if (canBeScrolledInMainDirection) currentAxis = moveDirection;
				else {
					currentAxis = moveDirection === "v" ? "h" : "v";
					canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
				}
				if (!canBeScrolledInMainDirection) return false;
				if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) activeAxis.current = currentAxis;
				if (!currentAxis) return true;
				var cancelingAxis = activeAxis.current || currentAxis;
				return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
			}, []);
			var shouldPrevent = react.useCallback(function(_event) {
				var event = _event;
				if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) return;
				var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
				var sourceEvent = shouldPreventQueue.current.filter(function(e) {
					return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
				})[0];
				if (sourceEvent && sourceEvent.should) {
					if (event.cancelable) event.preventDefault();
					return;
				}
				if (!sourceEvent) {
					var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
						return node.contains(event.target);
					});
					if (shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation) {
						if (event.cancelable) event.preventDefault();
					}
				}
			}, []);
			var shouldCancel = react.useCallback(function(name, delta, target, should) {
				var event = {
					name,
					delta,
					target,
					should,
					shadowParent: getOutermostShadowParent(target)
				};
				shouldPreventQueue.current.push(event);
				setTimeout(function() {
					shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
						return e !== event;
					});
				}, 1);
			}, []);
			var scrollTouchStart = react.useCallback(function(event) {
				touchStartRef.current = getTouchXY(event);
				activeAxis.current = void 0;
			}, []);
			var scrollWheel = react.useCallback(function(event) {
				shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
			}, []);
			var scrollTouchMove = react.useCallback(function(event) {
				shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
			}, []);
			react.useEffect(function() {
				lockStack.push(Style);
				props.setCallbacks({
					onScrollCapture: scrollWheel,
					onWheelCapture: scrollWheel,
					onTouchMoveCapture: scrollTouchMove
				});
				document.addEventListener("wheel", shouldPrevent, nonPassive);
				document.addEventListener("touchmove", shouldPrevent, nonPassive);
				document.addEventListener("touchstart", scrollTouchStart, nonPassive);
				return function() {
					lockStack = lockStack.filter(function(inst) {
						return inst !== Style;
					});
					document.removeEventListener("wheel", shouldPrevent, nonPassive);
					document.removeEventListener("touchmove", shouldPrevent, nonPassive);
					document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
				};
			}, []);
			var removeScrollBar = props.removeScrollBar, inert = props.inert;
			return react.createElement(react.Fragment, null, inert ? react.createElement(Style, { styles: generateStyle(id) }) : null, removeScrollBar ? react.createElement(RemoveScrollBar, {
				noRelative: props.noRelative,
				gapMode: props.gapMode
			}) : null);
		}
		function getOutermostShadowParent(node) {
			var shadowParent = null;
			while (node !== null) {
				if (node instanceof ShadowRoot) {
					shadowParent = node.host;
					node = node.host;
				}
				node = node.parentNode;
			}
			return shadowParent;
		}
		//#endregion
		//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@18.3.31_react@18.3.1/node_modules/react-remove-scroll/dist/es2015/sidecar.js
		var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);
		//#endregion
		//#region node_modules/.pnpm/react-remove-scroll@2.7.2_@types+react@18.3.31_react@18.3.1/node_modules/react-remove-scroll/dist/es2015/Combination.js
		var ReactRemoveScroll = react.forwardRef(function(props, ref) {
			return react.createElement(RemoveScroll, __assign({}, props, {
				ref,
				sideCar: sidecar_default
			}));
		});
		ReactRemoveScroll.classNames = RemoveScroll.classNames;
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-select@2.3.7_@types+react-dom@18.3.7_@types+react@18.3.31__@types+react_d415eef66f2559d31571d944c9538c09/node_modules/@radix-ui/react-select/dist/index.mjs
		var __defProp$1 = Object.defineProperty;
		var __name$1 = (target, value) => __defProp$1(target, "name", {
			value,
			configurable: true
		});
		var OPEN_KEYS = [
			" ",
			"Enter",
			"ArrowUp",
			"ArrowDown"
		];
		var SELECTION_KEYS = [" ", "Enter"];
		var SELECT_NAME = "Select";
		var [Collection, useCollection, createCollectionScope] = /* @__PURE__ */ createCollection(SELECT_NAME);
		var [createSelectContext, createSelectScope] = /* @__PURE__ */ createContextScope(SELECT_NAME, [createCollectionScope, createPopperScope]);
		var usePopperScope = createPopperScope();
		var [SelectProviderImpl, useSelectContext] = createSelectContext(SELECT_NAME);
		var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
		function SelectProvider(props) {
			const { __scopeSelect, children, open: openProp, defaultOpen, onOpenChange, value: valueProp, defaultValue, onValueChange, dir, name, autoComplete, disabled, required, form, internal_do_not_use_render } = props;
			const popperScope = usePopperScope(__scopeSelect);
			const [trigger, setTrigger] = react$1.useState(null);
			const [valueNode, setValueNode] = react$1.useState(null);
			const [valueNodeHasChildren, setValueNodeHasChildren] = react$1.useState(false);
			const direction = useDirection(dir);
			const [open, setOpen] = useControllableState({
				prop: openProp,
				defaultProp: defaultOpen ?? false,
				onChange: onOpenChange,
				caller: SELECT_NAME
			});
			const [value, setValue] = useControllableState({
				prop: valueProp,
				defaultProp: defaultValue,
				onChange: onValueChange,
				caller: SELECT_NAME
			});
			const triggerPointerDownPosRef = react$1.useRef(null);
			const initialValueRef = react$1.useRef(value);
			react$1.useEffect(() => {
				const associatedForm = form ? trigger?.ownerDocument.getElementById(form) : trigger?.form;
				if (associatedForm instanceof HTMLFormElement) {
					const reset = /* @__PURE__ */ __name$1(() => setValue(initialValueRef.current), "reset");
					associatedForm.addEventListener("reset", reset);
					return () => associatedForm.removeEventListener("reset", reset);
				}
			}, [
				form,
				trigger,
				setValue
			]);
			const isFormControl = trigger ? !!form || !!trigger.closest("form") : true;
			const [nativeOptionsSet, setNativeOptionsSet] = react$1.useState(/* @__PURE__ */ new Set());
			const contentId = useId();
			const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
			const handleNativeOptionAdd = react$1.useCallback((option) => {
				setNativeOptionsSet((prev) => new Set(prev).add(option));
			}, []);
			const handleNativeOptionRemove = react$1.useCallback((option) => {
				setNativeOptionsSet((prev) => {
					const optionsSet = new Set(prev);
					optionsSet.delete(option);
					return optionsSet;
				});
			}, []);
			const context = {
				required,
				trigger,
				onTriggerChange: setTrigger,
				valueNode,
				onValueNodeChange: setValueNode,
				valueNodeHasChildren,
				onValueNodeHasChildrenChange: setValueNodeHasChildren,
				contentId,
				value,
				onValueChange: setValue,
				open,
				onOpenChange: setOpen,
				dir: direction,
				triggerPointerDownPosRef,
				disabled,
				name,
				autoComplete,
				form,
				nativeOptions: nativeOptionsSet,
				nativeSelectKey,
				isFormControl
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Root2, {
				...popperScope,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectProviderImpl, {
					scope: __scopeSelect,
					...context,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Collection.Provider, {
						scope: __scopeSelect,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectNativeOptionsProvider, {
							scope: __scopeSelect,
							onNativeOptionAdd: handleNativeOptionAdd,
							onNativeOptionRemove: handleNativeOptionRemove,
							children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
						})
					})
				})
			});
		}
		__name$1(SelectProvider, "SelectProvider");
		var Select = /* @__PURE__ */ __name$1((props) => {
			const { __scopeSelect, children, ...providerProps } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectProvider, {
				__scopeSelect,
				...providerProps,
				internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [children, isFormControl ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectBubbleInput, { __scopeSelect }) : null] })
			});
		}, "Select");
		var TRIGGER_NAME = "SelectTrigger";
		var SelectTrigger = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectTrigger2(props, forwardedRef) {
			const { __scopeSelect, disabled = false, ...triggerProps } = props;
			const popperScope = usePopperScope(__scopeSelect);
			const context = useSelectContext(TRIGGER_NAME, __scopeSelect);
			const isDisabled = context.disabled || disabled;
			const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
			const getItems = useCollection(__scopeSelect);
			const pointerTypeRef = react$1.useRef("touch");
			const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
				const enabledItems = getItems().filter((item) => !item.disabled);
				const nextItem = findNextItem(enabledItems, search, enabledItems.find((item) => item.value === context.value));
				if (nextItem !== void 0) context.onValueChange(nextItem.value);
			});
			const handleOpen = /* @__PURE__ */ __name$1((pointerEvent) => {
				if (!isDisabled) {
					context.onOpenChange(true);
					resetTypeahead();
				}
				if (pointerEvent) context.triggerPointerDownPosRef.current = {
					x: Math.round(pointerEvent.pageX),
					y: Math.round(pointerEvent.pageY)
				};
			}, "handleOpen");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Anchor, {
				asChild: true,
				...popperScope,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.button, {
					type: "button",
					role: "combobox",
					"aria-controls": context.open ? context.contentId : void 0,
					"aria-expanded": context.open,
					"aria-required": context.required,
					"aria-autocomplete": "none",
					dir: context.dir,
					"data-state": context.open ? "open" : "closed",
					disabled: isDisabled,
					"data-disabled": isDisabled ? "" : void 0,
					"data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
					...triggerProps,
					ref: composedRefs,
					onClick: composeEventHandlers(triggerProps.onClick, (event) => {
						event.currentTarget.focus();
						if (pointerTypeRef.current !== "mouse") handleOpen(event);
					}),
					onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
						pointerTypeRef.current = event.pointerType;
						const target = event.target;
						if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
						if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
							handleOpen(event);
							event.preventDefault();
						}
					}),
					onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
						const isTypingAhead = searchRef.current !== "";
						if (!(event.ctrlKey || event.altKey || event.metaKey) && event.key.length === 1) handleTypeaheadSearch(event.key);
						if (isTypingAhead && event.key === " ") return;
						if (OPEN_KEYS.includes(event.key)) {
							handleOpen();
							event.preventDefault();
						}
					})
				})
			});
		}, "SelectTrigger"));
		var VALUE_NAME = "SelectValue";
		var SelectValue = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectValue2(props, forwardedRef) {
			const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
			const context = useSelectContext(VALUE_NAME, __scopeSelect);
			const { onValueNodeHasChildrenChange } = context;
			const hasChildren = children !== void 0;
			const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
			useLayoutEffect2(() => {
				onValueNodeHasChildrenChange(hasChildren);
			}, [onValueNodeHasChildrenChange, hasChildren]);
			const showPlaceholder = shouldShowPlaceholder(context.value);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.span, {
				...valueProps,
				asChild: showPlaceholder ? false : valueProps.asChild,
				ref: composedRefs,
				style: { pointerEvents: "none" },
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react$1.Fragment, { children: showPlaceholder ? placeholder : children }, showPlaceholder ? "placeholder" : "value")
			});
		}, "SelectValue"));
		var SelectIcon = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectIcon2(props, forwardedRef) {
			const { __scopeSelect, children, ...iconProps } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.span, {
				"aria-hidden": true,
				...iconProps,
				ref: forwardedRef,
				children: children || "▼"
			});
		}, "SelectIcon"));
		var [PortalProvider, usePortalContext] = createSelectContext("SelectPortal", { forceMount: void 0 });
		var SelectPortal = /* @__PURE__ */ __name$1((props) => {
			const { __scopeSelect, forceMount, ...portalProps } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PortalProvider, {
				scope: props.__scopeSelect,
				forceMount,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Portal, {
					asChild: true,
					...portalProps
				})
			});
		}, "SelectPortal");
		var CONTENT_NAME = "SelectContent";
		var SelectContent = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectContent2(props, forwardedRef) {
			const portalContext = usePortalContext(CONTENT_NAME, props.__scopeSelect);
			const { forceMount = portalContext.forceMount, ...contentProps } = props;
			const context = useSelectContext(CONTENT_NAME, props.__scopeSelect);
			const [fragment, setFragment] = react$1.useState();
			useLayoutEffect2(() => {
				setFragment(new DocumentFragment());
			}, []);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Presence, {
				present: forceMount || context.open,
				children: ({ present }) => present ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectContentImpl, {
					...contentProps,
					ref: forwardedRef
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectContentFragment, {
					...contentProps,
					fragment
				})
			});
		}, "SelectContent"));
		var SelectContentFragment = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectContentFragment2(props, forwardedRef) {
			const { __scopeSelect, children, fragment } = props;
			if (!fragment) return null;
			return react_dom.createPortal(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectContentProvider, {
				scope: __scopeSelect,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Collection.Slot, {
					scope: __scopeSelect,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						ref: forwardedRef,
						children
					})
				})
			}), fragment);
		}, "SelectContentFragment"));
		var CONTENT_MARGIN = 10;
		var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME);
		var Slot = /* @__PURE__ */ createSlot("SelectContent.RemoveScroll");
		var SelectContentImpl = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectContentImpl2(props, forwardedRef) {
			const { __scopeSelect } = props;
			const { position = "item-aligned", onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, side, sideOffset, align, alignOffset, arrowPadding, collisionBoundary, collisionPadding, sticky, hideWhenDetached, avoidCollisions, ...contentProps } = props;
			const context = useSelectContext(CONTENT_NAME, __scopeSelect);
			const [content, setContent] = react$1.useState(null);
			const [viewport, setViewport] = react$1.useState(null);
			const composedRefs = useComposedRefs(forwardedRef, setContent);
			const [selectedItem, setSelectedItem] = react$1.useState(null);
			const [selectedItemText, setSelectedItemText] = react$1.useState(null);
			const getItems = useCollection(__scopeSelect);
			const [isPositioned, setIsPositioned] = react$1.useState(false);
			const firstValidItemFoundRef = react$1.useRef(false);
			react$1.useEffect(() => {
				if (content) return hideOthers(content);
			}, [content]);
			useFocusGuards();
			const focusFirst = react$1.useCallback((candidates) => {
				const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
				const [lastItem] = restItems.slice(-1);
				const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
				for (const candidate of candidates) {
					if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
					candidate?.scrollIntoView({ block: "nearest" });
					if (candidate === firstItem && viewport) viewport.scrollTop = 0;
					if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
					candidate?.focus();
					if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
				}
			}, [getItems, viewport]);
			const focusSelectedItem = react$1.useCallback(() => focusFirst([selectedItem, content]), [
				focusFirst,
				selectedItem,
				content
			]);
			react$1.useEffect(() => {
				if (isPositioned) focusSelectedItem();
			}, [isPositioned, focusSelectedItem]);
			const { onOpenChange, triggerPointerDownPosRef } = context;
			react$1.useEffect(() => {
				if (content) {
					let pointerMoveDelta = {
						x: 0,
						y: 0
					};
					const handlePointerMove = /* @__PURE__ */ __name$1((event) => {
						pointerMoveDelta = {
							x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.current?.x ?? 0)),
							y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.current?.y ?? 0))
						};
					}, "handlePointerMove");
					const handlePointerUp = /* @__PURE__ */ __name$1((event) => {
						if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault();
						else if (!event.composedPath().includes(content)) onOpenChange(false);
						document.removeEventListener("pointermove", handlePointerMove);
						triggerPointerDownPosRef.current = null;
					}, "handlePointerUp");
					if (triggerPointerDownPosRef.current !== null) {
						document.addEventListener("pointermove", handlePointerMove);
						document.addEventListener("pointerup", handlePointerUp, {
							capture: true,
							once: true
						});
					}
					return () => {
						document.removeEventListener("pointermove", handlePointerMove);
						document.removeEventListener("pointerup", handlePointerUp, { capture: true });
					};
				}
			}, [
				content,
				onOpenChange,
				triggerPointerDownPosRef
			]);
			react$1.useEffect(() => {
				const close = /* @__PURE__ */ __name$1(() => onOpenChange(false), "close");
				window.addEventListener("blur", close);
				window.addEventListener("resize", close);
				return () => {
					window.removeEventListener("blur", close);
					window.removeEventListener("resize", close);
				};
			}, [onOpenChange]);
			const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
				const enabledItems = getItems().filter((item) => !item.disabled);
				const nextItem = findNextItem(enabledItems, search, enabledItems.find((item) => item.ref.current === document.activeElement));
				if (nextItem) setTimeout(() => nextItem.ref.current?.focus());
			});
			const itemRefCallback = react$1.useCallback((node, value, disabled) => {
				const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
				if (context.value !== void 0 && context.value === value || isFirstValidItem) {
					setSelectedItem(node);
					if (isFirstValidItem) firstValidItemFoundRef.current = true;
				}
			}, [context.value]);
			const handleItemLeave = react$1.useCallback(() => content?.focus(), [content]);
			const itemTextRefCallback = react$1.useCallback((node, value, disabled) => {
				const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
				if (context.value !== void 0 && context.value === value || isFirstValidItem) setSelectedItemText(node);
			}, [context.value]);
			const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
			const popperContentProps = SelectPosition === SelectPopperPosition ? {
				side,
				sideOffset,
				align,
				alignOffset,
				arrowPadding,
				collisionBoundary,
				collisionPadding,
				sticky,
				hideWhenDetached,
				avoidCollisions
			} : {};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectContentProvider, {
				scope: __scopeSelect,
				content,
				viewport,
				onViewportChange: setViewport,
				itemRefCallback,
				selectedItem,
				onItemLeave: handleItemLeave,
				itemTextRefCallback,
				focusSelectedItem,
				selectedItemText,
				position,
				isPositioned,
				searchRef,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReactRemoveScroll, {
					as: Slot,
					allowPinchZoom: true,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FocusScope, {
						asChild: true,
						trapped: context.open,
						onMountAutoFocus: (event) => {
							event.preventDefault();
						},
						onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
							context.trigger?.focus({ preventScroll: true });
							event.preventDefault();
						}),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DismissableLayer, {
							asChild: true,
							disableOutsidePointerEvents: true,
							onEscapeKeyDown,
							onPointerDownOutside,
							onFocusOutside: (event) => event.preventDefault(),
							onDismiss: () => context.onOpenChange(false),
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectPosition, {
								role: "listbox",
								id: context.contentId,
								"data-state": context.open ? "open" : "closed",
								dir: context.dir,
								onContextMenu: (event) => event.preventDefault(),
								...contentProps,
								...popperContentProps,
								onPlaced: () => setIsPositioned(true),
								ref: composedRefs,
								style: {
									display: "flex",
									flexDirection: "column",
									outline: "none",
									...contentProps.style
								},
								onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
									const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
									if (event.key === "Tab") event.preventDefault();
									if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
									if ([
										"ArrowUp",
										"ArrowDown",
										"Home",
										"End"
									].includes(event.key)) {
										let candidateNodes = getItems().filter((item) => !item.disabled).map((item) => item.ref.current);
										if (["ArrowUp", "End"].includes(event.key)) candidateNodes = candidateNodes.slice().reverse();
										if (["ArrowUp", "ArrowDown"].includes(event.key)) {
											const currentElement = event.target;
											const currentIndex = candidateNodes.indexOf(currentElement);
											candidateNodes = candidateNodes.slice(currentIndex + 1);
										}
										setTimeout(() => focusFirst(candidateNodes));
										event.preventDefault();
									}
								})
							})
						})
					})
				})
			});
		}, "SelectContentImpl"));
		var SelectItemAlignedPosition = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectItemAlignedPosition2(props, forwardedRef) {
			const { __scopeSelect, onPlaced, ...popperProps } = props;
			const context = useSelectContext(CONTENT_NAME, __scopeSelect);
			const contentContext = useSelectContentContext(CONTENT_NAME, __scopeSelect);
			const [contentWrapper, setContentWrapper] = react$1.useState(null);
			const [content, setContent] = react$1.useState(null);
			const composedRefs = useComposedRefs(forwardedRef, setContent);
			const getItems = useCollection(__scopeSelect);
			const shouldExpandOnScrollRef = react$1.useRef(false);
			const shouldRepositionRef = react$1.useRef(true);
			const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
			const position = react$1.useCallback(() => {
				if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
					const triggerRect = context.trigger.getBoundingClientRect();
					const contentRect = content.getBoundingClientRect();
					const valueNodeRect = context.valueNode.getBoundingClientRect();
					const itemTextRect = selectedItemText.getBoundingClientRect();
					if (context.dir !== "rtl") {
						const itemTextOffset = itemTextRect.left - contentRect.left;
						const left = valueNodeRect.left - itemTextOffset;
						const leftDelta = triggerRect.left - left;
						const minContentWidth = triggerRect.width + leftDelta;
						const contentWidth = Math.max(minContentWidth, contentRect.width);
						const rightEdge = window.innerWidth - CONTENT_MARGIN;
						const clampedLeft = clamp$1(left, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, rightEdge - contentWidth)]);
						contentWrapper.style.minWidth = minContentWidth + "px";
						contentWrapper.style.left = clampedLeft + "px";
					} else {
						const itemTextOffset = contentRect.right - itemTextRect.right;
						const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
						const rightDelta = window.innerWidth - triggerRect.right - right;
						const minContentWidth = triggerRect.width + rightDelta;
						const contentWidth = Math.max(minContentWidth, contentRect.width);
						const leftEdge = window.innerWidth - CONTENT_MARGIN;
						const clampedRight = clamp$1(right, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, leftEdge - contentWidth)]);
						contentWrapper.style.minWidth = minContentWidth + "px";
						contentWrapper.style.right = clampedRight + "px";
					}
					const items = getItems();
					const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
					const itemsHeight = viewport.scrollHeight;
					const contentStyles = window.getComputedStyle(content);
					const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
					const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
					const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
					const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
					const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
					const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
					const viewportStyles = window.getComputedStyle(viewport);
					const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
					const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
					const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
					const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
					const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
					const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
					const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
					const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
					if (contentTopToItemMiddle <= topEdgeToTriggerMiddle) {
						const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
						contentWrapper.style.bottom = "0px";
						const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
						const height = contentTopToItemMiddle + Math.max(triggerMiddleToBottomEdge, selectedItemHalfHeight + (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth);
						contentWrapper.style.height = height + "px";
					} else {
						const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
						contentWrapper.style.top = "0px";
						const height = Math.max(topEdgeToTriggerMiddle, contentBorderTopWidth + viewport.offsetTop + (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight) + itemMiddleToContentBottom;
						contentWrapper.style.height = height + "px";
						viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
					}
					contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
					contentWrapper.style.minHeight = minContentHeight + "px";
					contentWrapper.style.maxHeight = availableHeight + "px";
					onPlaced?.();
					requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
				}
			}, [
				getItems,
				context.trigger,
				context.valueNode,
				contentWrapper,
				content,
				viewport,
				selectedItem,
				selectedItemText,
				context.dir,
				onPlaced
			]);
			useLayoutEffect2(() => position(), [position]);
			const [contentZIndex, setContentZIndex] = react$1.useState();
			useLayoutEffect2(() => {
				if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
			}, [content]);
			const handleScrollButtonChange = react$1.useCallback((node) => {
				if (node && shouldRepositionRef.current === true) {
					position();
					focusSelectedItem?.();
					shouldRepositionRef.current = false;
				}
			}, [position, focusSelectedItem]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectViewportProvider, {
				scope: __scopeSelect,
				contentWrapper,
				shouldExpandOnScrollRef,
				onScrollButtonChange: handleScrollButtonChange,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					ref: setContentWrapper,
					style: {
						display: "flex",
						flexDirection: "column",
						position: "fixed",
						zIndex: contentZIndex
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.div, {
						...popperProps,
						ref: composedRefs,
						style: {
							boxSizing: "border-box",
							maxHeight: "100%",
							...popperProps.style
						}
					})
				})
			});
		}, "SelectItemAlignedPosition"));
		var SelectPopperPosition = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectPopperPosition2(props, forwardedRef) {
			const { __scopeSelect, align = "start", collisionPadding = CONTENT_MARGIN, ...popperProps } = props;
			const popperScope = usePopperScope(__scopeSelect);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Content, {
				...popperScope,
				...popperProps,
				ref: forwardedRef,
				align,
				collisionPadding,
				style: {
					boxSizing: "border-box",
					...popperProps.style,
					"--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
					"--radix-select-content-available-width": "var(--radix-popper-available-width)",
					"--radix-select-content-available-height": "var(--radix-popper-available-height)",
					"--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
					"--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
				}
			});
		}, "SelectPopperPosition"));
		var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME, {});
		var VIEWPORT_NAME = "SelectViewport";
		var SelectViewport = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectViewport2(props, forwardedRef) {
			const { __scopeSelect, nonce, ...viewportProps } = props;
			const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect);
			const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect);
			const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
			const prevScrollTopRef = react$1.useRef(0);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", {
				dangerouslySetInnerHTML: { __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}` },
				nonce
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Collection.Slot, {
				scope: __scopeSelect,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.div, {
					"data-radix-select-viewport": "",
					role: "presentation",
					...viewportProps,
					ref: composedRefs,
					style: {
						position: "relative",
						flex: 1,
						overflow: "hidden auto",
						...viewportProps.style
					},
					onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
						const viewport = event.currentTarget;
						const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
						if (shouldExpandOnScrollRef?.current && contentWrapper) {
							const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
							if (scrolledBy > 0) {
								const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
								const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
								const cssHeight = parseFloat(contentWrapper.style.height);
								const prevHeight = Math.max(cssMinHeight, cssHeight);
								if (prevHeight < availableHeight) {
									const nextHeight = prevHeight + scrolledBy;
									const clampedNextHeight = Math.min(availableHeight, nextHeight);
									const heightDiff = nextHeight - clampedNextHeight;
									contentWrapper.style.height = clampedNextHeight + "px";
									if (contentWrapper.style.bottom === "0px") {
										viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
										contentWrapper.style.justifyContent = "flex-end";
									}
								}
							}
						}
						prevScrollTopRef.current = viewport.scrollTop;
					})
				})
			})] });
		}, "SelectViewport"));
		var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext("SelectGroup");
		var ITEM_NAME = "SelectItem";
		var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME);
		var SelectItem = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectItem2(props, forwardedRef) {
			const { __scopeSelect, value, disabled = false, textValue: textValueProp, ...itemProps } = props;
			const context = useSelectContext(ITEM_NAME, __scopeSelect);
			const contentContext = useSelectContentContext(ITEM_NAME, __scopeSelect);
			const isSelected = context.value === value;
			const [textValue, setTextValue] = react$1.useState(textValueProp ?? "");
			const [isFocused, setIsFocused] = react$1.useState(false);
			const composedRefs = useComposedRefs(forwardedRef, useCallbackRef$1((node) => contentContext.itemRefCallback?.(node, value, disabled)));
			const textId = useId();
			const pointerTypeRef = react$1.useRef("touch");
			const handleSelect = /* @__PURE__ */ __name$1(() => {
				if (!disabled) {
					context.onValueChange(value);
					context.onOpenChange(false);
				}
			}, "handleSelect");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectItemContextProvider, {
				scope: __scopeSelect,
				value,
				disabled,
				textId,
				isSelected,
				onItemTextChange: react$1.useCallback((node) => {
					setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? "").trim());
				}, []),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Collection.ItemSlot, {
					scope: __scopeSelect,
					value,
					disabled,
					textValue,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.div, {
						role: "option",
						"aria-labelledby": textId,
						"data-highlighted": isFocused ? "" : void 0,
						"aria-selected": isSelected && isFocused,
						"data-state": isSelected ? "checked" : "unchecked",
						"aria-disabled": disabled || void 0,
						"data-disabled": disabled ? "" : void 0,
						tabIndex: disabled ? void 0 : -1,
						...itemProps,
						ref: composedRefs,
						onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
						onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
						onClick: composeEventHandlers(itemProps.onClick, () => {
							if (pointerTypeRef.current !== "mouse") handleSelect();
						}),
						onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
							if (pointerTypeRef.current === "mouse") handleSelect();
						}),
						onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
							pointerTypeRef.current = event.pointerType;
						}),
						onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
							pointerTypeRef.current = event.pointerType;
							if (disabled) contentContext.onItemLeave?.();
							else if (pointerTypeRef.current === "mouse") event.currentTarget.focus({ preventScroll: true });
						}),
						onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
							if (event.currentTarget === document.activeElement) contentContext.onItemLeave?.();
						}),
						onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
							if (disabled || event.target !== event.currentTarget) return;
							if (contentContext.searchRef?.current !== "" && event.key === " ") return;
							if (SELECTION_KEYS.includes(event.key)) handleSelect();
							if (event.key === " ") event.preventDefault();
						})
					})
				})
			});
		}, "SelectItem"));
		var ITEM_TEXT_NAME = "SelectItemText";
		var SelectItemText = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectItemText2(props, forwardedRef) {
			const { __scopeSelect, className, style, ...itemTextProps } = props;
			const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
			const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
			const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
			const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
			const [itemTextNode, setItemTextNode] = react$1.useState(null);
			const handleItemTextRefCallback = useCallbackRef$1((node) => contentContext.itemTextRefCallback?.(node, itemContext.value, itemContext.disabled));
			const composedRefs = useComposedRefs(forwardedRef, setItemTextNode, itemContext.onItemTextChange, handleItemTextRefCallback);
			const textContent = itemTextNode?.textContent;
			const nativeOption = react$1.useMemo(() => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
				value: itemContext.value,
				disabled: itemContext.disabled,
				children: textContent
			}, itemContext.value), [
				itemContext.disabled,
				itemContext.value,
				textContent
			]);
			const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
			useLayoutEffect2(() => {
				onNativeOptionAdd(nativeOption);
				return () => onNativeOptionRemove(nativeOption);
			}, [
				onNativeOptionAdd,
				onNativeOptionRemove,
				nativeOption
			]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.span, {
				id: itemContext.textId,
				...itemTextProps,
				ref: composedRefs
			}), itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren && !shouldShowPlaceholder(context.value) ? react_dom.createPortal(itemTextProps.children, context.valueNode) : null] });
		}, "SelectItemText"));
		var ITEM_INDICATOR_NAME = "SelectItemIndicator";
		var SelectItemIndicator = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectItemIndicator2(props, forwardedRef) {
			const { __scopeSelect, ...itemIndicatorProps } = props;
			return useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect).isSelected ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.span, {
				"aria-hidden": true,
				...itemIndicatorProps,
				ref: forwardedRef
			}) : null;
		}, "SelectItemIndicator"));
		var BUBBLE_INPUT_NAME = "SelectBubbleInput";
		var SelectBubbleInput = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name$1(function SelectBubbleInput2({ __scopeSelect, ...props }, forwardedRef) {
			const context = useSelectContext(BUBBLE_INPUT_NAME, __scopeSelect);
			const { value, onValueChange, required, disabled, name, autoComplete, form } = context;
			const { nativeOptions, nativeSelectKey } = context;
			const ref = react$1.useRef(null);
			const composedRefs = useComposedRefs(forwardedRef, ref);
			const selectValue = value ?? "";
			const prevValue = usePrevious(selectValue);
			const hasEmptyValueOption = Array.from(nativeOptions).some((option) => (option.props.value ?? "") === "");
			react$1.useEffect(() => {
				const select = ref.current;
				if (!select) return;
				const selectProto = window.HTMLSelectElement.prototype;
				const setValue = Object.getOwnPropertyDescriptor(selectProto, "value").set;
				if (prevValue !== selectValue && setValue) {
					const event = new Event("change", { bubbles: true });
					setValue.call(select, selectValue);
					select.dispatchEvent(event);
				}
			}, [prevValue, selectValue]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Primitive.select, {
				"aria-hidden": true,
				required,
				tabIndex: -1,
				name,
				autoComplete,
				disabled,
				form,
				onChange: (event) => onValueChange(event.target.value),
				...props,
				style: {
					...VISUALLY_HIDDEN_STYLES,
					...props.style
				},
				ref: composedRefs,
				defaultValue: selectValue,
				children: [shouldShowPlaceholder(value) && !hasEmptyValueOption ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", { value: "" }) : null, Array.from(nativeOptions)]
			}, nativeSelectKey);
		}, "SelectBubbleInput"));
		function isFunction(value) {
			return typeof value === "function";
		}
		__name$1(isFunction, "isFunction");
		function shouldShowPlaceholder(value) {
			return value === "" || value === void 0;
		}
		__name$1(shouldShowPlaceholder, "shouldShowPlaceholder");
		function useTypeaheadSearch(onSearchChange) {
			const handleSearchChange = useCallbackRef$1(onSearchChange);
			const searchRef = react$1.useRef("");
			const timerRef = react$1.useRef(0);
			const handleTypeaheadSearch = react$1.useCallback((key) => {
				const search = searchRef.current + key;
				handleSearchChange(search);
				(/* @__PURE__ */ __name$1((function updateSearch(value) {
					searchRef.current = value;
					window.clearTimeout(timerRef.current);
					if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
				}), "updateSearch"))(search);
			}, [handleSearchChange]);
			const resetTypeahead = react$1.useCallback(() => {
				searchRef.current = "";
				window.clearTimeout(timerRef.current);
			}, []);
			react$1.useEffect(() => {
				return () => window.clearTimeout(timerRef.current);
			}, []);
			return [
				searchRef,
				handleTypeaheadSearch,
				resetTypeahead
			];
		}
		__name$1(useTypeaheadSearch, "useTypeaheadSearch");
		function findNextItem(items, search, currentItem) {
			const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
			const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
			let wrappedItems = wrapArray(items, Math.max(currentItemIndex, 0));
			if (normalizedSearch.length === 1) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
			const nextItem = wrappedItems.find((item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
			return nextItem !== currentItem ? nextItem : void 0;
		}
		__name$1(findNextItem, "findNextItem");
		function wrapArray(array, startIndex) {
			return array.map((_, index) => array[(startIndex + index) % array.length]);
		}
		__name$1(wrapArray, "wrapArray");
		//#endregion
		//#region node_modules/.pnpm/@radix-ui+react-label@2.1.15_@types+react-dom@18.3.7_@types+react@18.3.31__@types+react_8f7b19a112f65396d2a9b03c1b79222f/node_modules/@radix-ui/react-label/dist/index.mjs
		var __defProp = Object.defineProperty;
		var __name = (target, value) => __defProp(target, "name", {
			value,
			configurable: true
		});
		var Root = /* @__PURE__ */ react$1.forwardRef(/* @__PURE__ */ __name(function Label2(props, forwardedRef) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Primitive.label, {
				...props,
				ref: forwardedRef,
				onMouseDown: (event) => {
					if (event.target.closest("button, input, select, textarea")) return;
					props.onMouseDown?.(event);
					if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
				}
			});
		}, "Label"));
		//#endregion
		//#region src/client/terminal-theme.ts
		/**
		* The curated theme list shown by default in the appearance panel. Order is
		* the display order. `auto` (follow scheme) is first; the user-named presets
		* (`tokyo-night`, `dracula`, `high-contrast`) come early.
		*/
		const TERMINAL_THEME_PRESETS = [
			{
				id: "auto",
				builtin: void 0
			},
			{
				id: "tokyo-night",
				builtin: "TokyoNight"
			},
			{
				id: "tokyo-night-storm",
				builtin: "TokyoNight Storm"
			},
			{
				id: "tokyo-night-moon",
				builtin: "TokyoNight Moon"
			},
			{
				id: "dracula",
				builtin: "Dracula"
			},
			{
				id: "dracula-plus",
				builtin: "Dracula+"
			},
			{
				id: "high-contrast",
				builtin: "Xcode Dark hc"
			},
			{
				id: "nord",
				builtin: "Nord"
			},
			{
				id: "gruvbox",
				builtin: "Gruvbox Dark"
			},
			{
				id: "catppuccin-mocha",
				builtin: "Catppuccin Mocha"
			},
			{
				id: "github-dark",
				builtin: "GitHub Dark"
			},
			{
				id: "one-dark",
				builtin: "One Half Dark"
			},
			{
				id: "solarized-dark",
				builtin: "Solarized Dark Patched"
			},
			{
				id: "rose-pine",
				builtin: "Rose Pine"
			}
		];
		new Map(TERMINAL_THEME_PRESETS.map((p) => [p.id, p]));
		/**
		* The locale key for a curated theme preset's display label.
		*
		* Converts a preset id (`auto`, `tokyo-night`, `tokyo-night-storm`,
		* `dracula-plus`, `high-contrast`, …) to the matching `theme*` locale key
		* (`themeAuto`, `themeTokyoNight`, `themeTokyoNightStorm`, `themeDraculaPlus`,
		* `themeHighContrast`, …) by title-casing each hyphen-separated part. The
		* matching keys are defined in {@link ./locales.ts}; an unknown id falls back
		* to the raw id so the dropdown still shows something.
		*/
		function themePresetLabelKey(id) {
			if (id === "") return "themeAuto";
			return `theme${id.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`;
		}
		//#endregion
		//#region src/client/TerminalAppearancePanel.tsx
		/**
		* The Terminal appearance block of the Powerdesk Side card: font family
		* (system font picker), font weight, font size, and terminal theme. Lives
		* ONLY here — never on the terminal page — so terminal tabs stay focused on
		* output and all appearance controls share one home.
		*
		* All interactive controls are built on Radix UI Select primitives so they
		* match the shell's accessible component vocabulary and read consistently
		* (family / weight / theme are the same dropdown shape). Two native controls
		* remain: the manual font-name text entry and the font-size number input
		* (Radix ships no text-input or number primitive); both are styled to match
		* input primitive); it's a styled fallback for browsers without the Local
		* Font Access API and is kept visually consistent with the Radix controls.
		*
		* Source of truth: the global `dsh-powerdesk:prefs` localStorage key (one
		* terminal appearance for every conversation). Reads reactively through
		* {@link ./useTerminalPrefs.ts} (`useSyncExternalStore`); writes through
		* {@link ./prefs.ts}'s `writePrefsToLocalStorage`, which notifies subscribers
		* so any mounted terminal re-renders (font family/weight/size recreate the
		* restty instance; theme re-applies live).
		*
		* Font picker: `navigator.queryLocalFonts()` (the Local Font Access API,
		* Chromium-only + a permission prompt) enumerates the user's installed
		* families — including their Nerd Fonts. On Firefox/Safari (no API) or if the
		* permission is denied, the field falls back to a manual text input. An empty
		* value ("System default") lets the app theme's code font apply, then restty's
		* built-in fallback chain (see {@link ./terminal-font.ts}).
		*
		* Font size: a labeled number input (not a slider or dropdown). A slider over
		* a discrete integer range is finicky — hard to land on an exact px — and a
		* dropdown adds a click for no benefit; a number input lets the user type or
		* step to an exact px directly. min/max mirror the clamp bounds so the
		* browser's own validation matches {@link clampResttyFontSize}, which
		* re-clamps on write (an empty/NaN field reverts to the default).
		*
		* Theme picker: a short curated list (auto / tokyo-night / dracula /
		* high-contrast / …). The full restty catalog is NOT exposed here (kept the
		* dropdown readable); a curated preset covers the well-known themes.
		*/
		/** The curated preset ids as a set, for "is the current value a preset?" */
		const PRESET_IDS = new Set(TERMINAL_THEME_PRESETS.map((p) => p.id));
		/** Font-weight display labels (restty accepts the numeric value). */
		const WEIGHT_LABELS = {
			400: "Regular",
			500: "Medium",
			600: "Semibold",
			700: "Bold"
		};
		/** A small caret glyph for the Select trigger. */
		function SelectCaret() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectIcon, {
				className: sidebar_module_css_default.appearanceSelectCaret,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					width: "10",
					height: "10",
					viewBox: "0 0 10 10",
					fill: "none",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M2.5 3.75 5 6.25 7.5 3.75",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					})
				})
			});
		}
		/** A check glyph shown beside the selected item in a Radix Select dropdown. */
		function ItemCheck() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectItemIndicator, {
				className: sidebar_module_css_default.appearanceSelectIndicator,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					width: "12",
					height: "12",
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
				})
			});
		}
		/**
		* A labeled Radix Select wrapper used for the family/weight/theme dropdowns.
		* Reduces the verbose Root/Trigger/Content/Viewport/Item boilerplate to one
		* component per field. The label is a Radix `Label.Root` wired to the trigger
		* for accessible association.
		*/
		function LabeledSelect(props) {
			const { labelKey, value, onValueChange, disabled, full, children } = props;
			const id = `powerdesk-appearance-${labelKey}`;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `${sidebar_module_css_default.appearanceField} ${full ? sidebar_module_css_default.appearanceFieldFull : ""}`,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Root, {
					htmlFor: id,
					className: sidebar_module_css_default.appearanceFieldLabel,
					children: t(labelKey)
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Select, {
					value,
					onValueChange,
					disabled,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(SelectTrigger, {
						id,
						className: sidebar_module_css_default.appearanceSelectTrigger,
						"aria-label": t(labelKey),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectValue, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectCaret, {})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectContent, {
						className: sidebar_module_css_default.appearanceSelectContent,
						position: "popper",
						sideOffset: 4,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectViewport, {
							className: sidebar_module_css_default.appearanceSelectViewport,
							children
						})
					}) })]
				})]
			});
		}
		/** One Radix Select item with the check indicator + label. */
		function SelectOption(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(SelectItem, {
				value: props.value,
				className: sidebar_module_css_default.appearanceSelectItem,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ItemCheck, {}) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectItemText, { children: props.label })]
			});
		}
		function getQueryLocalFonts() {
			if (typeof navigator === "undefined") return void 0;
			const q = navigator.queryLocalFonts;
			return typeof q === "function" ? q : void 0;
		}
		/** Dedupe + sort a list of family names. */
		function uniqueSorted(families) {
			return Array.from(new Set(families.filter((f) => f !== "")).values()).sort((a, b) => a.localeCompare(b));
		}
		/**
		* The theme `<select>` value: '' and 'auto' both mean follow-scheme; normalize
		* to 'auto' for the option lookup.
		*/
		function themeSelectValue(prefs) {
			const v = prefs.themeName.trim();
			return v === "" ? "auto" : v;
		}
		/** The terminal appearance panel. */
		function TerminalAppearancePanel() {
			const prefs = useTerminalPrefs();
			const query = getQueryLocalFonts();
			const [families, setFamilies] = (0, react$1.useState)(null);
			const [fontsLoading, setFontsLoading] = (0, react$1.useState)(query !== void 0);
			const [fontsDenied, setFontsDenied] = (0, react$1.useState)(false);
			const [manualFont, setManualFont] = (0, react$1.useState)(query === void 0);
			const [sizeInput, setSizeInput] = (0, react$1.useState)(String(prefs.fontSize));
			(0, react$1.useEffect)(() => {
				setSizeInput(String(prefs.fontSize));
			}, [prefs.fontSize]);
			(0, react$1.useEffect)(() => {
				if (query === void 0) return;
				let cancelled = false;
				setFontsLoading(true);
				query().then((list) => {
					if (cancelled) return;
					setFamilies(uniqueSorted(list.map((f) => f.family)));
					setFontsLoading(false);
				}).catch(() => {
					if (cancelled) return;
					setFontsDenied(true);
					setManualFont(true);
					setFontsLoading(false);
				});
				return () => {
					cancelled = true;
				};
			}, [query]);
			const setFontFamily = (0, react$1.useCallback)((value) => {
				writePrefsToLocalStorage({ fontFamily: value });
			}, []);
			const setFontWeight = (0, react$1.useCallback)((value) => {
				writePrefsToLocalStorage({ fontWeight: Number(value) });
			}, []);
			const setFontSize = (0, react$1.useCallback)((value) => {
				writePrefsToLocalStorage({ fontSize: value });
			}, []);
			const commitFontSize = (0, react$1.useCallback)(() => {
				const trimmed = sizeInput.trim();
				if (trimmed === "") {
					setFontSize(16);
					return;
				}
				const n = Number(trimmed);
				setFontSize(Number.isFinite(n) ? n : 16);
			}, [sizeInput, setFontSize]);
			const setTheme = (0, react$1.useCallback)((value) => {
				writePrefsToLocalStorage({ themeName: value === "auto" ? "" : value });
			}, []);
			const themeValue = themeSelectValue(prefs);
			const themeIsPreset = PRESET_IDS.has(themeValue);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.appearanceSection,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
						className: sidebar_module_css_default.appearanceHeading,
						children: t("appearanceHeading")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: sidebar_module_css_default.settingsIntro,
						children: t("appearanceIntro")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: sidebar_module_css_default.appearanceGrid,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: `${sidebar_module_css_default.appearanceField} ${sidebar_module_css_default.appearanceFieldFull}`,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Root, {
										htmlFor: "powerdesk-appearance-font",
										className: sidebar_module_css_default.appearanceFieldLabel,
										children: t("appearanceFontFamily")
									}),
									manualFont ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										id: "powerdesk-appearance-font",
										type: "text",
										className: sidebar_module_css_default.appearanceControl,
										value: prefs.fontFamily,
										placeholder: t("appearanceFontFamilyManual"),
										onChange: (e) => {
											setFontFamily(e.target.value);
										}
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Select, {
										value: prefs.fontFamily,
										onValueChange: setFontFamily,
										disabled: fontsLoading,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(SelectTrigger, {
											id: "powerdesk-appearance-font",
											className: sidebar_module_css_default.appearanceSelectTrigger,
											"aria-label": t("appearanceFontFamily"),
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectValue, { placeholder: fontsLoading ? t("appearanceFontsLoading") : t("appearanceFontFamilyAuto") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectCaret, {})]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectContent, {
											className: sidebar_module_css_default.appearanceSelectContent,
											position: "popper",
											sideOffset: 4,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(SelectViewport, {
												className: sidebar_module_css_default.appearanceSelectViewport,
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(SelectItem, {
													value: "",
													className: sidebar_module_css_default.appearanceSelectItem,
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ItemCheck, {}) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectItemText, { children: t("appearanceFontFamilyAuto") })]
												}), families !== null && families.map((f) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectOption, {
													value: f,
													label: f
												}, f))]
											})
										}) })]
									}),
									query !== void 0 && !fontsDenied && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: sidebar_module_css_default.appearanceInlineToggle,
										onClick: () => {
											setManualFont((m) => !m);
										},
										children: manualFont ? t("appearanceFontFamilyAuto") : t("appearanceFontFamilyManual")
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(LabeledSelect, {
								labelKey: "appearanceFontWeight",
								value: String(prefs.fontWeight),
								onValueChange: setFontWeight,
								children: TERMINAL_FONT_WEIGHTS.map((w) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectOption, {
									value: String(w),
									label: WEIGHT_LABELS[w] ?? String(w)
								}, w))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: sidebar_module_css_default.appearanceField,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Root, {
									htmlFor: "powerdesk-appearance-size",
									className: sidebar_module_css_default.appearanceFieldLabel,
									children: t("appearanceFontSize")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									id: "powerdesk-appearance-size",
									type: "number",
									className: sidebar_module_css_default.appearanceControl,
									value: sizeInput,
									min: 12,
									max: 30,
									step: 1,
									"aria-label": t("appearanceFontSize"),
									onChange: (e) => {
										setSizeInput(e.target.value);
									},
									onBlur: commitFontSize,
									onKeyDown: (e) => {
										if (e.key === "Enter") e.currentTarget.blur();
									}
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(LabeledSelect, {
								labelKey: "appearanceTheme",
								value: themeValue,
								onValueChange: setTheme,
								full: true,
								children: [TERMINAL_THEME_PRESETS.map((p) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectOption, {
									value: p.id,
									label: t(themePresetLabelKey(p.id))
								}, p.id)), !themeIsPreset && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectOption, {
									value: themeValue,
									label: themeValue
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: sidebar_module_css_default.appearanceHint,
						children: t("appearanceFontHint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: sidebar_module_css_default.appearanceReopenHint,
						children: t("appearanceReopenHint")
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
			const [hint, setHint] = (0, react$1.useState)(null);
			const [, forceUpdate] = (0, react$1.useState)(0);
			(0, react$1.useEffect)(() => sidebar?.subscribe(() => {
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
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TerminalAppearancePanel, {}),
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
		const LucideContext = (0, react$1.createContext)({});
		const useLucideContext = () => (0, react$1.useContext)(LucideContext);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.31.0_react@18.3.1/node_modules/lucide-react/dist/esm/Icon.mjs
		/**
		* @license lucide-react v1.31.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const Icon = (0, react$1.forwardRef)(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
			const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = useLucideContext() ?? {};
			const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
			return (0, react$1.createElement)("svg", {
				ref,
				...defaultAttributes,
				width: size ?? contextSize ?? defaultAttributes.width,
				height: size ?? contextSize ?? defaultAttributes.height,
				stroke: color ?? contextColor,
				strokeWidth: calculatedStrokeWidth,
				className: mergeClasses("lucide", contextClass, className),
				...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
				...rest
			}, [...iconNode.map(([tag, attrs]) => (0, react$1.createElement)(tag, attrs)), ...Array.isArray(children) ? children : [children]]);
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
			const Component = (0, react$1.forwardRef)(({ className, ...props }, ref) => (0, react$1.createElement)(Icon, {
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
			const [path, setPath] = (0, react$1.useState)(null);
			const [dirs, setDirs] = (0, react$1.useState)(null);
			const [error, setError] = (0, react$1.useState)("");
			(0, react$1.useEffect)(() => {
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
			(0, react$1.useEffect)(() => {
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
			const [copied, setCopied] = (0, react$1.useState)(null);
			(0, react$1.useEffect)(() => {
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
			(0, react$1.useEffect)(() => {
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
			const [prefs, setPrefs] = (0, react$1.useState)(() => readExplorerPrefs());
			const [menuOpen, setMenuOpen] = (0, react$1.useState)(false);
			const [picking, setPicking] = (0, react$1.useState)(false);
			const [dirs, setDirs] = (0, react$1.useState)(/* @__PURE__ */ new Map());
			const active = prefs.bookmarks.find((b) => b.id === prefs.activeId);
			const root = active?.path ?? cwd ?? ".";
			const persist = (0, react$1.useCallback)((next) => {
				setPrefs(next);
				writeExplorerPrefs(next);
			}, []);
			const load = (0, react$1.useCallback)((path) => {
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
			(0, react$1.useEffect)(() => {
				load(root);
			}, [root, load]);
			const bookmarkOptions = (0, react$1.useMemo)(() => prefs.bookmarks.map((b) => ({
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
			const { scope, tab, visible } = props;
			const prefs = useTerminalPrefs();
			return (0, react$1.createElement)(TerminalView, {
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
			return (0, react$1.createElement)(BrowserViewLazy, {
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
				icon: (size) => (0, react$1.createElement)(IconTerminal, { size }),
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
				component: (props) => (0, react$1.createElement)(ResttyTabView, props)
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
				icon: (size) => (0, react$1.createElement)(IconGlobe, { size }),
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
				component: (props) => (0, react$1.createElement)(BrowserTabView, props)
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
			return (0, react$1.createElement)(FileExplorer, {
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
			return (0, react$1.createElement)(CodeEditorLazy, {
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
				icon: (size) => (0, react$1.createElement)(IconFolder, { size }),
				order: 40,
				single: true,
				createTab: () => ({ tab: {
					id: POWERDESK_EXPLORER_TAB_ID,
					type: POWERDESK_EXPLORER_TAB_ID,
					title: t("explorerTabTitle")
				} }),
				component: (props) => (0, react$1.createElement)(ExplorerTabView, props)
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
				icon: (size) => (0, react$1.createElement)(IconFile, { size }),
				hidden: true,
				dedupeKey: (tab) => tab.path,
				component: (props) => (0, react$1.createElement)(EditorTabView, props)
			};
		}
		/** The sidebar Notes tab view: mounts the lazy Notes surface (tree + inline
		*  editor over one bound markdown folder — see NotesView.tsx). */
		function NotesTabView(props) {
			const { visible } = props;
			return (0, react$1.createElement)(NotesViewLazy, { visible: visible ?? true });
		}
		/** Build the Notes tab descriptor. `single: true` — one Notes tab per
		*  session; opening it again focuses the existing one instead of duplicating. */
		function buildNotesTabDescriptor() {
			return {
				id: POWERDESK_NOTES_TAB_ID,
				title: () => t("notesTabTitle"),
				icon: (size) => (0, react$1.createElement)(IconNotes, { size }),
				order: 42,
				single: true,
				createTab: () => ({ tab: {
					id: POWERDESK_NOTES_TAB_ID,
					type: POWERDESK_NOTES_TAB_ID,
					title: t("notesTabTitle")
				} }),
				component: (props) => (0, react$1.createElement)(NotesTabView, props)
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
			root.render((0, react$1.createElement)(RenderBoundary, { className: sidebar_module_css_default.boundaryError }, (0, react$1.createElement)(SidebarShell, {
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
		exports.POWERDESK_EXPLORER_TAB_ID = POWERDESK_EXPLORER_TAB_ID;
		exports.POWERDESK_NOTES_TAB_ID = POWERDESK_NOTES_TAB_ID;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map