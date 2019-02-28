import { EventEmitter } from 'events';
import { createInterface, emitKeypressEvents, Interface, Key } from 'readline';
import color = require('kleur')
import { beep, cursor } from 'sisteransi'


type ValidInputType = string | number
type Result = {
  [key: string]: string
}

type Options = {
  name: string | Function
  message: string | Function
  initial?: string | Function
  in?: NodeJS.ReadStream,
  out?: NodeJS.WriteStream
}


const getAction = (key: Key) => {
  if (key.ctrl) {
    if (key.name === 'a') return 'first';
    if (key.name === 'c') return 'abort';
    if (key.name === 'd') return 'abort';
    if (key.name === 'e') return 'last';
    if (key.name === 'g') return 'reset';
  }
  if (key.name === 'return') return 'submit';
  if (key.name === 'enter') return 'submit'; // ctrl + J
  if (key.name === 'backspace') return 'delete';
  if (key.name === 'delete') return 'deleteForward';
  if (key.name === 'abort') return 'abort';
  if (key.name === 'escape') return 'abort';
  if (key.name === 'tab') return 'next';

  if (key.name === 'up') return 'up';
  if (key.name === 'down') return 'down';
  if (key.name === 'right') return 'right';
  if (key.name === 'left') return 'left';

  return false;
};



export interface Prompt {
  first?(): void
  last?(): void
  next?(): void
  submit?(): void
  abort?(): void
  reset?(): void
  delete?(): void
  deleteForward?(): void
  up?(): void
  down?(): void
  right?(): void
  left?(): void
}


export abstract class Prompt extends EventEmitter {
  public name: string | Function
  public message: string | Function
  public initial?: ValidInputType | Function

  protected in: NodeJS.ReadStream = process.stdin
  protected out: NodeJS.WriteStream = process.stdout

  private readline: Interface
  protected initialRender = true
  private aborted = false
  private closed = false


  constructor(options: Options) {
    super()

    this.name = options.name
    this.message= options.message

    // TODO: Update optional options

    this.readline = createInterface(this.in);
    emitKeypressEvents(this.in, this.readline);

    if (this.in.isTTY && this.in.setRawMode) this.in.setRawMode(true);

    this.in.on('keypress', this.keypress);
  }

  private keypress(chunk: string, key: Key): void {
    const action = getAction(key);
    if (action === false && typeof this._keypress === 'function') {
      // Unknown action
      this._keypress(chunk, key);
    } else if (action !== false && typeof this[action] === 'function') {
      this[action]!(key);
    } else {
      this.beep();
    }
  }

  protected close(): void {
    if (!this.readline) return

    this.out.write(cursor.show);
    this.in.removeListener('keypress', this.keypress);

    if (this.in.isTTY && this.in.setRawMode) this.in.setRawMode(false);

    this.readline.close();

    // QUESTION: Where is value coming from?
    this.emit(this.aborted ? 'abort' : 'submit', this.value)
    this.closed = true;
  }

  protected beep() {
    this.out.write(beep)
  }

  protected render(input: string): string | Promise<string> {
    if (this.closed) return
    this.emit('render', {
      color,
    })
    if (this.initialRender) this.initialRender = false

    return String(input) // QUESTION: How can I remove this?
  }

  protected format(input: string | undefined, key: string, values: Result): string | undefined {
    return input
  }

  protected validate(input: string | undefined, key: string, values: Result): boolean | string {
    return true
  }
}






// abstract class Prompt extends EventEmitter {
//   abstract name: string | Function
//   abstract message: string | Function
//   abstract initial?: unknown | Function

//   constructor(options: Options = {}) {
//     super();

//     // TODO: Assign options
//   }

//   render(input: ValidInputType): string {
//     return String(input)
//   }

//   /**
//    *
//    * @param input
//    * @param key
//    * @param values
//    */
//   format(input: ValidInputType | undefined, key: string, values: Result): ValidInputType | null | undefined {
//     return input
//   }

//   /**
//    * Validate the user input
//    * @param input - The user input
//    * @param key - The key of the prompt
//    * @param values - All inputs so far
//    * @return - Should return `true` if the value is valid, and an error message `string` otherwise. If `false` is returned, a default error message is shown.
//    */
//   validate(input: ValidInputType | undefined, key: string, values: Result): boolean | string {
//     return true
//   }
// }
