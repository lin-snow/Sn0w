# Sn0w

L1nSn0w 的个人站点。

## 开发

需要 Node.js 22.22+ 与 [bun](https://bun.sh/)（版本见 `package.json` 的
`packageManager` 字段）。

```bash
bun install
bun run dev
```

```bash
bun run check         # astro check
bun run format        # prettier --write .
bun run format:check  # prettier --check .
bun run test          # 内容发布规则测试
bun run build         # astro build → dist/
bun run preview       # 预览 dist/
```

[just](https://github.com/casey/just) 封装了同一组命令：`just --list` 查看配方，
`just ci` 按 CI 顺序跑格式检查、类型检查、测试与构建。

升级工具链前注意两处：`typescript` 固定在 6.x（`astro check` 不支持 7）；
`overrides` 钉住 `@emnapi/runtime`，否则 bun 会把 rolldown 需要的 beta 提升到根部，
让 Astro 的 Rust 编译器绑定加载失败。

## 部署

推送到 `main` 后，Cloudflare 上该 Worker 的 Git 构建会安装依赖、运行构建并把
`dist/` 发布为 Workers Static Assets，站点随即更新。`.github/workflows/deploy.yml`
同时在 GitHub Actions 里跑检查、测试、格式检查与构建；只有仓库另配了
`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 两个 secret 时，它才会额外执行
`wrangler deploy` 作为兜底。

构建默认用 `https://sn0w.fyi/` 生成 canonical、Open Graph 与 RSS 绝对地址，
需要换域名或部署预览版时用 `SITE_URL` 覆盖。Cloudflare 配置在 `wrangler.jsonc`：
`./dist` 作为静态资源目录，未知路径返回 `dist/404.html`。
