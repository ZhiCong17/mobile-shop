# H5 Mall Saas

### 技术要求
- react, react-router, zustand + immer 及其他 react 相关生态工具
- shadcn/ui (建议)，stylus/less
- vite、eslint
- code split/lazy load

### 业务简介
一个简版、通用在线商城，包含登录、商品浏览/搜索、购物车、下单/售后、支付等必须场景。
![UI 示意](https://sfs-public.shangdejigou.cn/fe-report/h5-mall-saas.png "仅做参考")

### key features
- 主流用户登录、授权流程（苹果，谷歌登录等）
- 支付（PayPal 等）
- 订单状态管理（未支付、售后、退款等状态，及状态间流转）
- 购物车商品管理（充分利用 zustand 对商品添加状态进行管理）

### suggestions
- 用 vite mock 模拟后端 api
- 专注流程的通用性、可扩展性，而非 ui 细节，比如首页商品卡片不值得花时间，直接用最朴素的 div 占位就行，而商品列表分页加载就值得好好设计一下
- 可以考虑实现一些通用的 hook（如useTimeout等） 和 组件（Toast，Modal 等）
