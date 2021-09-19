/// <reference types="vite/client" />

declare module 'alpinejs' {
  export interface AlpineThis {
    $persist<T>(value: T): T
  }

  export function start(): void
  export function data<T>(name: string, value: () => T): void
  export function store<T>(name: string, value: T): void
  export function store<T>(name: string): T
  export function plugin(...args: unknown[]): void
}

declare module '@alpinejs/persist' {}
