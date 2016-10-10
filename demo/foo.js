'use strict'

class Foo {
  constructor () {
    console.log('bar')
  }

  bar () {
    return 'bar'
  }
}

let f = new Foo()
f.bar()
