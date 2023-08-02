import Logs from "../console.ts";
import { IPlugin, IPluginContext } from "./typeDeclaration.ts";
import { getT } from "../i18n/index.ts";

export class PluginManager {
  private plugins: IPlugin[] = [];

  register(plugin: IPlugin | IPlugin[]) {
    this.plugins = [
      ...this.plugins,
      ...(Array.isArray(plugin) ? plugin : [plugin]),
    ];
  }

  async setupAll(context: IPluginContext) {
    for (const plugin of this.plugins) {
      Logs.info(getT("$t(plugin.name)", { name: plugin.name }));

      if (!plugin.setup) {
        Logs.warn(getT("$t(plugin.noSetupMethod)", { name: plugin.name }));
        continue;
      }

      // 执行插件 setup 方法
      await plugin.setup(context.options);

      // 触发插件 onload 事件
      context.onLoad = plugin.onLoad;
      // 触发插件 onDefinition 事件
      context.onDefinition = plugin.onDefinition;
      // 触发插件 onAction 事件
      context.onAction = plugin.onAction;
      // 触发插件 onTransform 事件
      context.onTransform = plugin.onTransform;
      // 触发插件 onEnd 事件
      context.onEnd = plugin.onEnd;
    }
    Logs.info(getT("$t(plugin.allSetupDone)"));
  }
}
