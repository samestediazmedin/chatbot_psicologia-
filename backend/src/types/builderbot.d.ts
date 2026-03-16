declare module "@builderbot/bot" {
  export const EVENTS: Record<string, string>;
  export const utils: Record<string, unknown> & {
    setEvent: (name: string) => string;
  };
  export function addKeyword(...args: unknown[]): any;
  export function createFlow(...args: unknown[]): any;
  export function createProvider(...args: unknown[]): any;
  export function createBot(...args: unknown[]): Promise<any>;
}

declare module "@builderbot/database-mysql" {
  export class MysqlAdapter {
    constructor(config: Record<string, unknown>);
  }
}

declare module "@builderbot/provider-baileys" {
  export class BaileysProvider {}
}
