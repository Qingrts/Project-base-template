// app.ts
import { checkVersionUpdate } from "./utils/system";

App<IAppOption>({
  globalData: {},
  onLaunch() {
    // 检查新版本
    checkVersionUpdate();

    // 主题
    // getMiniprogramTheme();
  },
})