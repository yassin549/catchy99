interface Adapter<T> {
  read(): Promise<T | null>
  write(data: T): Promise<void>
}

declare module 'lowdb' {
  export class Low<T> {
    data: T | null
    constructor(adapter: Adapter<T>, defaultData: T)
    read(): Promise<void>
    write(): Promise<void>
  }
}

declare module 'lowdb/node' {
  export class JSONFile<T> {
    constructor(filename: string)
    read(): Promise<T | null>
    write(data: T): Promise<void>
  }
}
