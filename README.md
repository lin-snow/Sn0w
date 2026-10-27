# Sn0w

L1nSn0w 的个人站点。

## 开发

需要 Node.js 22.12+ 与 [bun](https://bun.sh/)。

```bash
bun install
bun run dev
```

检查、格式化与构建：

```bash
bun run check         # astro check
bun run format        # prettier --write .
bun run test          # 内容发布规则测试
bun run build         # astro build → dist/
bun run preview       # 预览 dist/
```

## 内容

- `src/config.ts`：站点名称、描述、导航、社交链接。
- `src/content/posts/<slug>/index.md`：文章。目录名即 slug（小写 kebab-case）；
  frontmatter 需要非空 `title` 与引号包围的 `YYYY-MM-DD` 日期；
  `draft: true` 会从首页、正文和 RSS 中排除。正文从 `##` 开始。
- `src/content/pages/home.md`、`about.md`、`projects.md`：页面文案。
- 文章图片与 `index.md` 放在同一目录，用 `./file.webp` 引用；多图段落可以写成
  `:::gallery` 网格（见现有文章）。Astro 会统一处理尺寸、懒加载和哈希文件名。

## 部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会安装依赖、运行检查与测试、
构建 `dist/`，再用 Wrangler 发布到 Cloudflare Workers Static Assets。
仓库需要在 GitHub 配置两个 secret：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

生产构建通过 `SITE_URL=https://sn0w.fyi/` 输出 canonical、Open Graph 与 RSS
绝对地址；本地构建不设置该变量。Cloudflare 配置在 `wrangler.jsonc`：
`./dist` 作为静态资源目录，未知路径返回 `dist/404.html`。
