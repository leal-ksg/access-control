type MqttHandler = (
  params: Record<string, string>,
  payload: any,
) => Promise<void>;

interface MqttRoute {
  path: string;
  paramKeys: string[];
  regex: RegExp;
  handler: MqttHandler;
}

export class MqttRouter {
  private subscriptedRoutes: MqttRoute[] = [];

  public on(path: string, handler: MqttHandler): this {
    const paramKeys: string[] = [];

    const regexPattern = path
      .replace(/\+/g, "[^/]+")
      .replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
        paramKeys.push(key);
        return "([^/]+)";
      });

    const regex = new RegExp(`^${regexPattern}$`);

    this.subscriptedRoutes.push({ path, paramKeys, regex, handler });
    return this;
  }

  public async handle(topic: string, message: Buffer): Promise<void> {
    this.subscriptedRoutes.forEach(async (route) => {
      const match = topic.match(route.regex);

      if (match) {
        const assembledParams: Record<string, string> = {};

        route.paramKeys.forEach((key, index) => {
          const value = match[index + 1];

          if (value !== undefined) {
            assembledParams[key] = value;
          }
        });

        let payload = message.toString();
        try {
          payload = JSON.parse(payload);
        } catch {}

        await route.handler(assembledParams, payload);
        return;
      }
    });
  }

  public getSubscriptions(): string[] {
    return this.subscriptedRoutes.map((route) =>
      route.path.replace(/:([a-zA-Z0-9_]+)/g, "+"),
    );
  }
}
