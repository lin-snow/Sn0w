# Sn0w

L1nSn0w 的个人站点。

## 开发

需要 Node.js 22.22+ 与 [bun](https://bun.sh/)（版本见 `package.json` 的
`packageManager` 字段）。

```bash
bun install
bun run dev
```

检查、格式化与构建：

```bash
bun run check         # astro check
bun run format        # prettier --write .
bun run format:check  # prettier --check .
bun run test          # 内容发布规则测试
bun run build         # astro build → dist/
bun run preview       # 预览 dist/
```

也可以用 [just](https://github.com/casey/just) 跑同一组命令：`just --list` 列出全部
配方（`dev`/`build`/`check`/`test`/`fmt` 等，另有 `d`/`b`/`c`/`t` 别名），
`just ci` 按 GitHub Actions 的顺序执行格式检查、类型检查、测试与构建。

工具链说明：

- `typescript` 固定在 6.x：`astro check` 尚不支持 TypeScript 7，等
  `@astrojs/ts-content-mapper` 稳定后再升级。
- `overrides` 把 `@emnapi/runtime` 钉在 1.11.3，避免 bun 把 rolldown 需要的
  2.0 beta 提升到根部，导致 Astro 的 Rust 编译器绑定加载失败。

## 内容

- `src/config.ts`：站点名称、描述、导航、社交链接。
- `src/content/posts/<slug>/index.md`：文章。目录名即 slug（小写 kebab-case）；
  frontmatter 需要非空 `title` 与引号包围的 `YYYY-MM-DD` 日期；
  `draft: true` 会从首页、正文和 RSS 中排除。正文从 `##` 开始。
- `src/content/pages/about.md`、`projects.md`：关于页与项目页文案；首页文案在
  `src/components/HomeIntro.astro`。
- 文章图片与 `index.md` 放在同一目录，用 `./file.webp` 引用；多图段落可以写成
  `:::gallery` 网格（见现有文章）。构建时 sharp 会为每张图生成
  480/640/960/1280 的 `srcset`，并按 60ch 正文栏给出 `sizes`；点开大图时
  lightbox 取原图，懒加载与哈希文件名由 Astro 统一处理。

## 机器可读输出

- `/sitemap.xml`、`/robots.txt`、`/rss.xml`：页面索引、爬取规则与全文 RSS。
- `/llms.txt`：站点与文章索引；`/llms-full.txt` 汇总全部文章正文。
- `/blog/<slug>.md`：单篇文章的原始 Markdown，图片已改写为线上地址；
  文章页的 `<link rel="alternate" type="text/markdown">` 指向它。
- `public/og.png` 是默认的 1200×630 社交卡片；页面传入 `image` 时改用该图。
- 结构化数据在 `src/layouts/Base.astro`（面包屑）、首页（`Person` +
  `WebSite`）、博客列表（`Blog`）与文章页（`BlogPosting`）中生成。

## 部署

推送到 `main` 后，Cloudflare 上该 Worker 的 Git 构建会安装依赖、运行构建并把
`dist/` 发布为 Workers Static Assets，站点随即更新。`.github/workflows/deploy.yml`
同时在 GitHub Actions 里跑检查、测试与构建；只有仓库另配了
`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 两个 secret 时，它才会额外执行
`wrangler deploy` 作为兜底。

构建默认用 `https://sn0w.fyi/` 生成 canonical、Open Graph 与 RSS 绝对地址，
需要换域名或部署预览版时用 `SITE_URL` 覆盖。Cloudflare 配置在 `wrangler.jsonc`：
`./dist` 作为静态资源目录，未知路径返回 `dist/404.html`。
