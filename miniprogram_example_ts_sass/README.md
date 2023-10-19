# 架构 TS + SASS + Vant Weapp

# 目录结构
├── README.md 					
├── miniprogram
│   ├── app.json
│   ├── app.scss
│   ├── app.ts
│   ├── miniprogram_npm				npm构建
│   ├── packageA					分包A
│   ├── packageB					分包B
│   ├── packageC					分包C
│   ├── packageD					分包D
│   ├── pages						主包    (只存公共组件，公共函数, tabbar 页面)
│   ├── sitemap.json				
│   ├── components					公共组件				
│   └── utils						工具函数
├── node_modules
│   └── @vant						Vant weapp UI框架
├── package.json					
├── project.config.json				
├── project.private.config.json
├── tsconfig.json
├── typings
│   ├── index.d.ts
│   └── types
└── yarn.lock
