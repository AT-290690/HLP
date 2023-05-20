export interface Word {
  type: 'word'
  name: string
  args: Expression[]
}
export type Classes = 'function' | 'string' | 'number' | 'void'
export interface Value {
  type: 'value'
  value: unknown
  class: Classes
}
export interface Apply {
  operator: Word | Apply
  type: 'apply'
  args: Expression[]
}
export type Expression = Apply | Value | Word
export type Interpretion =
  | ((args: Expression[], env: Expression) => unknown)
  | number
  | string
  | Map<any, any>
  | Set<any>
export interface Parsed {
  expr: Expression
  rest: string
}
