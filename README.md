# 远岸博客

这是一个可直接部署到公网的静态博客模板。  
它已经包含基础 SEO 文件和公开站点常用元信息，目标不是只在本地预览，而是让别人能通过浏览器访问，并具备被搜索引擎收录的条件。

## 现在已经有的能力

- 首页和文章页
- 响应式布局
- `robots.txt`
- `sitemap.xml`
- `feed.xml`
- `site.webmanifest`
- Open Graph / Twitter 卡片元信息
- 基础结构化数据

## 你必须手动替换的内容

当前文件已经按 GitHub Pages 项目地址配置为 `https://koe662.github.io/blog/`。  
如果你以后绑定自定义域名，再把这些地址替换成你的真实域名，例如 `https://blog.yourname.com`。

需要替换的位置包括：

- `index.html`
- `posts/get-indexed.html`
- `posts/static-stack.html`
- `posts/reading-experience.html`
- `robots.txt`
- `sitemap.xml`
- `feed.xml`

## 如何真正让别人搜到

1. 把整个目录部署到公开地址。
2. 绑定自己的域名，或者先使用托管平台给你的域名。
3. 确认 `https://你的域名/sitemap.xml` 可以正常访问。
4. 到 Google Search Console 提交站点地图。
5. 到 Bing Webmaster Tools 提交站点地图。
6. 持续发布真实文章内容，等待搜索引擎抓取和收录。

## 部署方式

### 方案 1：GitHub Pages

适合纯静态站。把当前目录上传到 GitHub 仓库后，开启 Pages 即可。

### 方案 2：Netlify

把当前目录拖到 Netlify，或者连接 Git 仓库自动部署。

### 方案 3：Vercel

导入这个目录或对应仓库，按静态站点方式发布。

## 目录结构

- `index.html`：首页
- `posts/`：文章页
- `styles.css`：全站样式
- `script.js`：移动端菜单、年份和入场动画
- `robots.txt`：爬虫访问规则
- `sitemap.xml`：站点地图
- `feed.xml`：RSS 订阅
- `assets/`：图标和分享封面

## 重要说明

本地打开页面不等于“已经有远程博客”。  
只有当这个站点部署到公网，并且被搜索平台抓取后，别人才能通过搜索结果找到你。
