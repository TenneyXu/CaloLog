# CaloLog 开发环境与部署指南

> 面向开发者本人的操作手册。目标读者：第一次接触 git / GitHub 的新手。

---

## 一、环境要求

| 工具 | 用途 | 当前状态 |
|---|---|---|
| Node.js ≥ 20 | 运行开发服务器、构建 | ✅ 已装（v24） |
| **git** | 版本管理 + 上传 GitHub | ❌ **未安装（需要先装）** |

---

## 二、安装 git（Windows）

**方式 A（推荐，最简单）**：打开命令提示符/PowerShell，运行：

```powershell
winget install Git.Git
```

**方式 B**：浏览器访问 https://git-scm.com/download/win 下载安装，一路"Next"即可（默认选项即可）。

安装后**关闭并重新打开**终端，验证：

```powershell
git --version
```

出现 `git version 2.x.x` 即成功。

---

## 三、配置 git 身份（只需一次）

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的GitHub注册邮箱"
```

> 这两行会在每次提交时记录"谁改的"，不配置就无法提交。

---

## 四、把项目同步到 GitHub

### 第 1 步：在 GitHub 建一个空仓库

1. 登录 https://github.com ，点右上角 **+** → **New repository**；
2. Repository name 填 `CaloLog`（可选填描述）；
3. **不要**勾选 "Add a README" / ".gitignore" / "license"（我们本地已有）；
4. 点 **Create repository**，会进入一个带命令的页面，先保留它。

### 第 2 步：本地初始化并提交（在项目目录执行）

```powershell
cd D:\Dev_Project\codewhale_repo\CaloLog
git init
git add .
git commit -m "M0: 热量日志 + 体重日志 + 一拳估算原型"
```

### 第 3 步：关联远程仓库并推送

用第 1 步页面里显示的地址替换下面命令（两种格式二选一）：

```powershell
git branch -M main
git remote add origin https://github.com/你的用户名/CaloLog.git
git push -u origin main
```

> 首次推送 GitHub 会弹窗要求登录授权（浏览器里登录一次即可）。

### 以后每次改完代码的常规流程（记这个三连）

```powershell
git add .
git commit -m "描述这次改了什么"
git push
```

---

## 五、预览：部署到 Cloudflare Pages（下一阶段）

1. 注册/登录 https://dash.cloudflare.com ；
2. 左侧菜单 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**；
3. 授权 GitHub 并选择 `CaloLog` 仓库；
4. 构建配置：Framework preset 选 **Vite**，或手动填：
   - Build command：`npm run build`
   - Build output directory：`dist`
5. 点 **Save and Deploy**，约 1 分钟后得到一个 `xxx.pages.dev` 网址——**手机打开就能用**。

> 部署后每次 `git push`，Cloudflare 会自动重新构建并发布新版本（更新零成本，这正是网页优先的红利）。

---

## 六、本地常用命令速查

```powershell
npm run dev      # 启动开发服务器（http://localhost:5173）
npm run build    # 构建生产版本（输出到 dist/）
```
