declare global {}

export interface Word {
  type: 'word'
  name: string
  args: (Apply | Value)[]
}
export type Classes = 'function' | 'string' | 'number'
export interface Value {
  type: 'value'
  value: unknown
  class: Classes
}
export interface Apply {
  operator: Word
  type: 'apply'
  args: Expression[]
}
export type Expression = Apply | Value | Word
export type Interpration = (args: Expression[], env: Expression) => unknown
export interface Parsed {
  expr: Expression
  rest: string
}
