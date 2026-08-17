# dsh-powerdesk

<a href="README.md">English</a> | <strong>简体中文</strong>

一个 [DSH](https://github.com/deepseek-ai/dsh) Web 插件，为 DSH 的 Web 界面加上一个
小型 IDE 工作台：GPU 加速的**终端**、**文件浏览器**、**笔记**、**代码编辑器**，以及
一个沙箱化的**浏览器** —— 全部自包含，置于一个可停靠的右侧面板 *和* 一个可停靠的
底部面板中（VSCode 风格的双工作台，支持拖拽分屏与跨面板拖拽）。

- **终端** —— 用 [restty](https://github.com/restty-dev/restty) 渲染
  （WebGPU/WebGL2 + WASM VT，Ghostty 血统），后端是 **Rust PTY**
  （[napi-rs](https://napi.rs) + [portable-pty](https://github.com/wez/portable-pty)），
  而非原生终端使用的 C++ `node-pty`。
- **浏览器** —— 在任意本地文件夹（通过内置文件夹浏览弹窗选取，而非文本输入框）之上
  呈现的目录树。点击文件即在编辑器中打开；每个文件行都有快捷的「复制相对路径」（便于
  在聊天中 @ 提及）和「复制绝对路径」操作。
- **笔记** —— 绑定一个本地文件夹，以递归树浏览/编辑其下的 `.md` 文件，支持笔记与
  文件夹的内联新建 / 重命名 / 删除。编辑器内嵌于同一标签页（左侧树、右侧编辑器）。
- **编辑器** —— [CodeMirror 6](https://codemirror.net/)，支持
  TS/JS/Python/JSON/CSS/HTML/Markdown/Rust/YAML 语法高亮、Dracula 主题、软换行、
  Cmd/Ctrl+S 保存。在浏览器或笔记中点击文件时自动打开。
- **浏览器** —— 地址栏背后的沙箱 iframe，带有可嵌入性探测，能解释
  `X-Frame-Options` / `frame-ancestors` 拒绝原因，而不是显示空白的「拒绝连接」框。

这五个功能都以标签页形式出现在插件自有的侧边栏中 —— 一个**右侧面板**（宽度自由
拖拽、无上限）和一个**底部面板**（高度可拖拽，横向铺满整个窗口宽度，包括右侧面板
下方）。把任意标签页拖到某面板的边缘即可分屏，或在右/底面板之间整体拖动 —— 它们
不过是共享同一套拖拽系统的两棵不同的分屏树。

---

## 鸣谢

本插件受 [DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)
启发 —— 衷心感谢其作者提供的面板 / 停靠布局，以及 Powerdesk 所依托的侧边栏外壳
基础。

在那一平台之上，Powerdesk 成长为自有的插件架构，并围绕性能优先的终端重新设计了
工作台：渲染器是 [restty](https://github.com/restty-dev/restty)
（WebGPU/WebGL2 + WASM VT，Ghostty 血统），PTY 后端是 **Rust** 原生插件
（[napi-rs](https://napi.rs) +
[portable-pty](https://github.com/wez/portable-pty)），而非原生的 C++ `node-pty`，
令终端 I/O 显著更快、更轻量。分屏树状态机、文件 / 笔记 / 编辑器 / 浏览器各功能面，
以及扩展系统，都在这一基础之上从零重新设计。

---

## 环境要求

- **DSH** `>=0.0.1` 已安装，且 `dsh` CLI 在你的 `PATH` 中（`dsh --version`）。插件
  加载进某个 DSH profile（默认 `web`）。
- **Node.js 20+** 和 **pnpm 9+**（若从源码安装）。
- **Rust 工具链**（`rustup`）—— 仅当你的平台还没有已提交的预编译二进制时才需要
  （见下文）；macOS 用户永远不需要 Rust。

PTY 插件按平台三元组查找（`src/rust-pty-deps.ts`）；目前三个三元组已有已提交到
仓库的二进制（`prebuilt/<triple>/`），随每次安装一起分发：

| 操作系统 | 架构 | 三元组 | 预编译？ |
| --- | --- | --- | --- |
| macOS | Apple Silicon | `darwin-arm64` | ✅ 已提交 |
| macOS | Intel | `darwin-x64` | ✅ 已提交 |
| Linux | x86_64 (glibc) | `linux-x64-gnu` | ✅ 已提交 |
| Linux | aarch64 (glibc) | `linux-arm64-gnu` | 从源码构建 |
| Windows | x86_64 | `win32-x64-msvc` | 从源码构建 |
| Windows | ARM64 | `win32-arm64-msvc` | 从源码构建 |

其他平台在安装后会显示终端的修复横幅，直到有人在对应平台运行 `pnpm build:rust`
并提交产生的 `prebuilt/<triple>/dsh_powerdesk_pty.node`（见下方「安装」）。

---

## 安装

有两种安装方式。**只选一种** —— 不要同时启用两个通道（会让 host 半边双重挂载并
渲染出两个侧边栏）。目前没有发布 npm 包，两个通道都直接从 GitHub 仓库安装。

### 方式 A —— 从 GitHub（推荐）

`dsh plugin` 会转发到 profile 目录*内*的 pnpm，因此这一步把仓库作为 git 托管包拉取
（没有本地 clone、没有构建步骤、没有额外配置）。仓库是公开的，因此普通 HTTPS URL
即可匿名安装：

```bash
dsh plugin --profile web add https://github.com/FleetingEcho/dsh-powerdesk.git
```

pnpm 会从仓库里读出包名，因此不需要 `dsh-powerdesk@` 前缀 —— 不过
`dsh-powerdesk@<url>` 也可用，并且正是你想锁定分支或标签时所要的形式
（`...git#my-branch`）。

偏好 SSH？`git+ssh://git@github.com/FleetingEcho/dsh-powerdesk.git` 也可以 ——
需要 GitHub 上已注册 SSH key（用 `ssh -T git@github.com` 验证）。

就这些。`lib/`（构建好的 client/host JS）已提交到仓库，所以 pnpm 没有
`prepare`/生命周期脚本要跑 —— 也不需要 `allowBuilds` 条目。

macOS（两个架构）和 Linux x86_64 的 Rust PTY 二进制同样已提交在
`prebuilt/<triple>/` 下，因此终端在这些平台上开箱即用 —— 不需要 Rust 工具链。

<details>
<summary>Windows 或 Linux ARM64：尚无已提交二进制，需构建一次</summary>

这些平台在安装后会显示修复横幅，直到你在已安装的包内构建一次插件：

```bash
cd ~/.dsh/profiles/web/node_modules/dsh-powerdesk
pnpm build:rust       # 需要 Rust 工具链（rustup）；cargo build --release
```

</details>

### 方式 B —— 从源码（用于开发）

Clone 仓库，构建，再把 DSH 指向本地 checkout：

```bash
git clone https://github.com/FleetingEcho/dsh-powerdesk.git
cd dsh-powerdesk

pnpm install
pnpm build            # tsc (lib/types) + tsdown (lib/*.js + 懒加载 chunk)
pnpm build:rust       # cargo build --release → prebuilt/<triple>/dsh_powerdesk_pty.node
pnpm test             # vitest（可选的自检）

# 把本地 checkout 注册到你的 DSH profile。
# 注意：`link:.` 相对于 profile 目录（~/.dsh/profiles/web）解析，
# 会得到一个自指的损坏符号链接（插件随后以普通依赖挂载，没有 bundle row，不会
# 加载）。请用指向你 checkout 的绝对路径 —— 例如从 clone 出的目录：
dsh plugin --profile web add "dsh-powerdesk@link:$PWD"
#   或在 profile 中加一条 `link:<绝对路径>` 依赖，再 `pnpm install`。
```

任一方式之后：**硬刷新浏览器**（Cmd/Ctrl+Shift+R）。客户端半边的改动无需重启 DSH
即可热重载；host 半边的改动（`src/*.ts`，包括 `fs-api.ts` 和 Rust PTY 层）需要
重启 DSH（`pm2 restart dsh-web`，或 `dsh web`）。

---

## 使用

### 工作台：右面板 + 底面板

点击窗口右上角的切换按钮簇 —— 一个按钮打开/折叠**右面板**，另一个控制**底面板**。
两者都是独立的分屏树：把标签页拖到某面板边缘（25% 带）即可分屏，拖到中心则合并
/重排；把标签页从一个面板拖到另一个则整体迁移。每个打开的标签页在非活动时都保持
挂载（隐藏而非拆除），因此切换标签页不会丢掉终端的连接或编辑器的撤销历史。

- **右面板** —— 宽度自由拖拽（左边缘），无上限（仅受窗口宽度约束）。
- **底面板** —— 高度自由拖拽（上边缘）；横向跨度是整个窗口宽度，包括右侧面板
  下方（右侧面板更高的层叠顺序会在那里覆盖它）—— 并非被挤进右面板剩下的空间，
  不同于一般的「挤中间列」布局。

两个面板都通过在 host 应用自身的根元素上预留尺寸作为 margin 来停靠，因此 host 自身
的布局会重排让出空间 —— 面板绝不只是浮在 host 内容之上。

### 终端

打开**终端**标签页。它会在当前会话的工作目录打开；每个会话可开多个终端，直到配置
的配额上限（标签页标题显示序号：`Terminal 1`、`Terminal 2`、…）。

终端工具栏有**复制**按钮。字体家族 / 字重 / 大小 / 主题是持久化的偏好
（`localStorage` 中的 `dsh-powerdesk:prefs`），带有合理的默认值（字体大小默认
16px）—— 可在「设置 → Powerdesk」卡片里直接编辑，该卡片以 Radix-UI 控件暴露
家族、字重、大小与主题。

如果原生 PTY 二进制缺失或加载失败，终端会显示带确切修复命令的修复横幅，而不是
让插件崩溃。见下方**修复**。

### 浏览器

打开**浏览器**标签页。点击头部的文件夹名按钮打开文件夹浏览弹窗（逐级点入
子目录，「选择此文件夹」）—— 浏览器不会把真正的文件系统路径交给网页，所以这是
在同一个 `fs.list` 路由之上自建的，而非手动输入路径。可添加多个文件夹书签并从
同一按钮切换；也可从头部移除当前书签。

点击目录行展开，点击文件行即在编辑器中打开（从浏览器打开文件会自动把浏览器分到
独立面板，避免编辑器叠在它上面 —— 分屏只发生一次；后续文件复用同一编辑器面板）。
悬停文件行会显示两个操作：**@** 复制相对于当前书签根的路径（便于在聊天中
@ 提及），另一个复制图标复制绝对路径。

### 笔记

打开**笔记**标签页。首次使用会提示绑定一个文件夹（与浏览器相同的文件夹浏览弹窗，
但笔记只绑定单个文件夹，随时可点击文件夹名重新绑定）。笔记会递归列出该文件夹下
所有 `.md` / `.markdown` 文件 —— 子树中不含任何 markdown 的目录会被整枝剪掉 ——
并在树（左）旁呈现一个内联编辑器（右，可经中间分隔条自由调节），两者同处一个
标签页。

头部操作：新建笔记、新建文件夹。每个文件的操作（悬停显示）：重命名、删除
（带确认弹窗 —— 删除文件夹是递归的）。新文件以独占方式创建（绝不静默覆盖同名文件）。

### 编辑器

不直接打开 —— 它是浏览器和笔记打开文件的目标（`service.openFile`）。基于
CodeMirror 6，支持 TypeScript/JavaScript、Python、JSON、CSS、HTML、Markdown、Rust
和 YAML 语法高亮；手写的 Dracula 主题（已发布的 `@uiw/codemirror-theme-dracula`
包会拉入在这个打包器的浏览器构建里无法解析的 `@babel/runtime` helper，所以调色板
直接以 `HighlightStyle` + `EditorView.theme` 应用）；软换行（长行无需横向滚动条）；
Cmd/Ctrl+S 或保存按钮写回。有未保存编辑时头部显示一个脏点。

它住在自己的懒加载 chunk 里（与笔记共享，因为笔记内嵌同一编辑器）——
CodeMirror 只在真正打开文件时才下载。

### 浏览器页

打开**浏览器**标签页。在地址栏输入 URL 回车。地址栏上有后退 / 前进 / 刷新 /
在浏览器中打开按钮。

- **沙箱** —— iframe 不带 `allow-same-origin` 运行（不透明源：被访问页面无法读取
  GUI 的存储或访问其 API），也不带 `allow-top-navigation`。一个临时、非持久化的
  **解锁**按钮会为可信站点放下沙箱；沙箱关闭时红色状态条会告警。
- **地址栏** —— 只接受 `http`/`https`。`javascript:`、`data:`、`file:` 等危险
  scheme 会被拒绝。回环地址（`localhost`、`127.0.0.0/8`、`::1`、`0.0.0.0`）会被
  拒绝，以免被浏览的页面探测你的本地服务。GUI 自身的 origin 被允许（沙箱使其
  不透明）。
- **嵌入拒绝** —— 当站点设置 `X-Frame-Options: DENY/SAMEORIGIN` 或不允许 `*`
  的 `frame-ancestors` CSP 指令时（例如 `www.google.com`），插件会先探测目标
  header，并显示带**「在浏览器中打开」**和**「强制加载」**的原因面板 —— 而非
  浏览器那个令人费解的空白「拒绝连接」框。这是浏览器层面强制的、按站点的限制
  （反点击劫持）—— 没有任何客户端技巧能绕过；「在浏览器中打开」是从这里查看此类
  站点的唯一方式。
- **外链** —— 浏览器标签页会认领 `http://` 外链点击，因此聊天中点击 http 链接会
  在侧边栏打开。`https://` 留给系统浏览器（多数 HTTPS 站点拒绝嵌入）。

### 设置

「Powerdesk」侧边卡片（设置 → Powerdesk）为每种标签类型显示一张卡片
（图标、标题、作为副标题的原始 type id），带勾选开关：关闭某标签类型会把它从
每个面板的 `+` 菜单隐藏，并使 `openTab` 对它空操作（持久化在 `localStorage`，
与任何会话无关）。点击卡片主体即在工作台打开该功能面。

---

## 更新

### 方式 A（GitHub 通道）

pnpm 会把 git 依赖固定到它首次解析的确切 commit，因此用同一 spec 再次运行 `add`
是空操作（「Already up to date」），即使有新 commit 落地。要强制重新解析到最新
commit，先移除再添加，然后硬刷新：

```bash
dsh plugin --profile web remove dsh-powerdesk
dsh plugin --profile web add https://github.com/FleetingEcho/dsh-powerdesk.git
```

确认新 commit 确实落地 —— 解析出的 sha 记录在 profile lockfile 里：

```bash
grep 'dsh-powerdesk.git#' ~/.dsh/profiles/web/pnpm-lock.yaml
```

host 半边的改动需要重启 DSH；客户端半边只需硬刷新。

### 方式 B（源码 / git 通道）

拉取、重建，仅在改了 host 半边时重启：

```bash
git pull
pnpm install            # 仅当依赖变化时
pnpm build
# 原生插件变了？也重建它：
pnpm build:rust
# 硬刷新浏览器。仅当改了 host 半边才重启 DSH。
```

---

## 卸载

### 方式 A（GitHub 通道）

从 profile 移除该包：

```bash
dsh plugin --profile web remove dsh-powerdesk
# 硬刷新浏览器（或重启 DSH）让挂载行消失。
```

### 方式 B（源码 / git 通道）

移除 `link:` 依赖并恢复 profile 原状：

```bash
dsh plugin --profile web remove dsh-powerdesk
# 然后回退你加到 profile 的任何 link: 依赖条目，
# 并在 profile 里 `pnpm install` 恢复先前状态。
```

无论哪种方式，`cordis.patch.yml` 的 bundle-patch 挂载行会在下次 DSH 启动时由
`dsh plugin remove` 步骤移除；硬刷新（或重启 DSH）清除内存中的副本。

---

## 安装排错

### 插件安装但未加载

检查 bundle 行是否已添加 —— `dsh.profile.bundles` 必须在依赖旁列出
`dsh-powerdesk`：

```bash
cat ~/.dsh/profiles/web/package.json
```

如果依赖在但 bundle 行不在，插件就以普通依赖挂载，永不加载。这是损坏的 `link:`
安装的症状（见方式 B 的注释）—— 用绝对路径或「安装 → 方式 A」的 git URL 重新添加。

host 半边的改动只在 DSH 重启后生效；运行中的服务器即便替换了 `node_modules`
也保留内存中的旧代码。

---

## 修复（终端显示 "Rust PTY loading failed"）

如果原生 PTY 二进制缺失、损坏或为错误平台构建，终端会显示修复横幅。无需重装整个
插件即可就地重建：

```bash
# GitHub 通道：
cd ~/.dsh/profiles/web/node_modules/dsh-powerdesk
# 源码通道：
cd /path/to/your/dsh-powerdesk/checkout

pnpm build:rust                              # 需要 Rust 工具链（rustup）
```

然后硬刷新浏览器并重启 DSH，因为 host 半边在启动时重新读取二进制。

---

## 配置

### 插件配置（在 `dsh.profile.bundles` 中）

```yaml
dsh-powerdesk:
  terminalsPerSession: 3      # 每个会话的最大活动终端数
  reconnectGraceMs: 30000     # 掉线的 pty 保持这么久以便重连
  shell: ''                    # 覆盖交互式 shell（'' 则自动探测）
  extensionsEnabled: false    # 允许用户安装扩展（见「扩展」）
  extensionsDir: ''            # 扩展存放位置（'' = ~/.dsh/powerdesk/extensions）
```

### 用户偏好（`localStorage`，无 host 往返）

| 偏好 | 存储 key | 说明 |
| --- | --- | --- |
| 终端字体家族 / 大小 / 主题 | `dsh-powerdesk:prefs` | 默认值；可在设置卡片里编辑。 |
| 浏览器文件夹书签 | `dsh-powerdesk:explorer-bookmarks` | 多个书签及当前活动项。 |
| 笔记绑定文件夹 | `dsh-powerdesk:notes-folder` | 单个文件夹，可重绑。 |
| 笔记树列宽 | `dsh-powerdesk:notes-tree-width` | 经分隔条拖拽。 |
| 每种标签类型的开关 | `dsh-powerdesk:tabs-enabled` | 从设置侧卡片设置。 |

### 环境变量

| 变量 | 用途 |
| --- | --- |
| `DSH_POWERDESK_PTY_PATH` | 指向 `.node` 插件的绝对路径；优先级高于一切解析。 |
| `DSH_POWERDESK_PTY_TRIPLE` | 覆盖探测到的平台三元组（如 `linux-x64-musl`）。 |
| `DSH_RESTTY_SHELL` | 覆盖 Windows shell 探测（默认：PATH / 已知安装目录中第一个 `pwsh.exe`，否则 `powershell.exe`）。 |
| `PREBUILT_BASE` | 覆盖预编译二进制下载基 URL（默认：GitHub releases）。 |
| `DSH_HOME` | 覆盖 DSH home（默认 `~/.dsh`）。 |
| `DSH_CMD` | 覆盖 `install.sh` 使用的 `dsh` CLI（默认：`dsh`，然后 `npx`）。 |

---

## 扩展

Powerdesk 可以把**你自己的 React 组件**挂载为侧边栏标签页。一个扩展就是一个打包脚本
加一份 `powerdesk.json` 清单，以 `.tgz` 从设置卡片上传。

### 安全 —— 先读这一段

扩展运行在 **DSH 页面自身的 origin** 内，对 DOM、你的会话和网络有完全访问权。它与
Powerdesk 自身特权相同。没有沙箱，且在扩展渲染进标签栏、共享 host 的 React 实例的
前提下也不可能存在沙箱。

这是一个**可信本地扩展**功能，不是市场。只安装你读过代码或信任作者的代码。

因此该功能**默认关闭**。有意开启：

```yaml
dsh-powerdesk:
  extensionsEnabled: true
```

关闭时，`ext.install` / `ext.remove` 返回 403，`/powerdesk/bundle/ext/*` 对每个 id
都 404 —— 从更早会话残留在磁盘上的扩展无法加载。

### 安装

**设置 → Powerdesk → 扩展 → 上传扩展…**

按字节而非文件名判定的接受上传：

| 上传 | 处理 |
| --- | --- |
| `.tgz` / `.tar.gz` | 解压；根目录必须含 `powerdesk.json`（`npm pack` 风格的 `package/` 包裹会被剥离）。 |
| `.tar` | 同上，无压缩。 |
| `.js.gz` / `.js` | 无清单的裸 bundle —— 卡片会询问一个 id 和显示名。 |

每个扩展安装到 `<extensionsDir>/<id>/`，替换任何先前同 id 安装。安装是原子的：
上传先暂存到临时目录，只有在清单和入口文件都校验通过后才移入，因此被拒的上传不会
影响工作中的安装。

设置卡片显示每个扩展的磁盘路径和来源归档的 sha256，便于你审计实际在执行什么。

### 移除

**设置 → Powerdesk → 扩展 → 移除** 删除该目录。想不卸载就禁用某扩展，用上方标签
网格里其卡片上的开关 —— 扩展标签页获得与内置项相同的开关。

### 编写

从模板开始：

```bash
cp -r templates/extension ~/my-extension
cd ~/my-extension && pnpm install
$EDITOR powerdesk.json          # 选一个 id 和标题
pnpm build && pnpm pack         # -> my-extension-0.0.0.tgz
```

组件契约与清单参考见 `templates/extension/README.md`。值得再提的一条规则：
**不要打包 React** —— 它是外部的，host 把它自己的实例传给你。第二份 React 有自己的
hook dispatcher，你调用的每个 hook 都会抛错。

### 工作原理

扩展复用 Powerdesk 既有的懒加载 chunk 机制，原样不变：

1. 构建把你的代码包进一个注册到插件私有注册表的工厂，键为 `ext:<id>`：
   `globalThis.__dshPowerdeskChunks__["ext:<id>"] = (require) => {…}`。
2. 首次打开时，客户端注入
   `<script src="/powerdesk/bundle/ext/<id>.js">`。host 通过清单解析该 id
   —— 绝非把 URL 拼到路径上 —— 并以与内置 chunk 相同的信任围栏和 ETag/304 处理
   提供入口文件。
3. 工厂以一个 `require` 调用，该 `require` 从 host 的模块表解析 `react`、
   `react/jsx-runtime` 及 DSH 客户端包，因此你的组件共享 host 的 React。
4. 解析出的组件经普通 `service.registerTab` 契约注册，由此免费获得加载占位、
   重试控件、错误边界和设置开关。

### 限制

| 边界 | 值 |
| --- | --- |
| 上传大小 | 16 MiB |
| 解压后归档 | 32 MiB（由 zlib 的 `maxOutputLength` 强制） |
| 归档内文件数 | 64 |
| 单文件大小 | 8 MiB |

包含符号链接、硬链接、设备节点、绝对路径或任何 `..` 段的归档在解析时即被拒。

---

## 开发

```bash
pnpm install
pnpm build            # tsc (lib/types) + tsdown (lib/*.js + 懒加载 chunk)
pnpm build:rust       # cargo build --release → prebuilt/<triple>/dsh_powerdesk_pty.node
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run
pnpm test:watch       # vitest watch
pnpm watch            # tsdown --watch（保存时重建 bundle）
```

Rust crate（`rust/`）使用 `napi-rs` + `portable-pty`。用 `pnpm build:rust` 构建；
产物落在 `prebuilt/<triple>/dsh_powerdesk_pty.node`。客户端 bundle 从不直接导入
restty 或 CodeMirror —— 它们住在懒加载 chunk（`lib/client-terminal.js`、
`lib/client-editor.js`）里，首次使用时经 `/powerdesk/bundle/<name>.js` 拉取，保持
初始 bundle 较小（约 196 KB）。

**`lib/` 与 `prebuilt/` 是提交进仓库的**，而非 gitignore —— GitHub 安装通道
（见安装 → 方式 A）是纯文件拷贝、无构建步骤，所以 git 里是什么，安装的就是什么。
任何源码改动后，运行 `pnpm build`（Rust 层改了则加 `pnpm build:rust`）并提交结果
再 push，否则 GitHub 安装会静默发布陈旧代码。这包括 tsdown 发射到 `lib/` 的任何
代码分割 chunk —— `package.json` 的 `files` 用 `lib/*.js`，因此带哈希的共享 chunk
也会发布；把它收窄回手工列表会丢掉它们，并发布一个带悬空 import 的包。
Sourcemap（`lib/**/*.map`）保持 gitignore —— 仅开发用，安装时不需要。

---

## 许可证

MIT.
