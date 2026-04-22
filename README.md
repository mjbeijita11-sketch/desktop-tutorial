# 智能体广场移动端 Web 仿真 POC

这是一个独立创建的 Vue 3 + TypeScript + Vite 前端项目，用于演示“智能体广场”移动端 Web 仿真体验。

核心特性：

- 登录后进入移动工作台
- 顶部菜单 + 抽屉式侧边栏 + 底部快捷导航
- 智能体广场统一展示 6 个智能体入口
- 三条重点链路可完整演示：
  - `排障智能体`
  - `规则配置智能体`
  - `业务办理智能体`
- `卡信息查询`、`知识问答`、`数据查询` 提供轻量占位页
- 全量使用前端 Mock 驱动，接口层和状态结构可后续平滑替换为真实 API

## 启动方式

```bash
cd /Users/eric/Documents/Playground/agent-plaza-poc
npm install
npm run dev
```

构建产物验证：

```bash
npm run build
```

## 部署到 GitHub Pages

当项目推送到 GitHub 仓库后，可直接使用内置的 GitHub Actions 工作流自动部署：

1. 将仓库默认分支设置为 `main`
2. 在 GitHub 仓库的 `Settings -> Pages` 中将 `Source` 设为 `GitHub Actions`
3. 推送到 `main` 后，工作流会自动构建并发布 `dist`

当前项目的 `vite.config.ts` 已支持在 GitHub Actions 下自动推导 Pages 的 `base` 路径，无需手动改仓库名。

## 项目结构

```text
src/
  components/
    agent/        # 智能体卡片、对话流、决策卡、结果卡
    shell/        # 设备壳、抽屉导航
  layouts/        # 登录壳层、应用壳层
  mock/           # 智能体元数据、流程脚本和 Mock 结果
  router/         # 路由与登录守卫
  stores/         # 本地状态与最近使用记录
  views/          # 登录页、首页、广场页、智能体页面
```

## 当前演示链路

### 排障智能体

- 识别 `订单执行类问题`
- 识别 `卡服务不可用问题`
- 识别 `App 执行报错问题`
- 输出处置建议并生成模拟工单

### 规则配置智能体

- 场景选择
- 模板式参数配置
- 阈值校验
- 规则草案发布确认

### 业务办理智能体

- 事项识别
- 卡片式参数采集
- 材料确认
- 办理结果回执

## 说明

- 当前不接真实后端。
- 当前不做国际化。
- 登录仅用于演示入口，不包含真实鉴权逻辑。
