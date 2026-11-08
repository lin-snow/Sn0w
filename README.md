# Sn0w

L1nSn0w 的个人站点。

## 开发


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


## 部署

构建默认用 `https://sn0w.fyi/` 生成 canonical、Open Graph 与 RSS 绝对地址，
需要换域名或部署预览版时用 `SITE_URL` 覆盖。Cloudflare 配置在 `wrangler.jsonc`：
`./dist` 作为静态资源目录，未知路径返回 `dist/404.html`。
