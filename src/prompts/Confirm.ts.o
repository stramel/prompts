import { Prompt, erase, cursor } from '../prompt'

export class Confirm extends Prompt {
  constructor(options) {
    super(options)


  }

  reset() {
    this.value = this.initialValue;
    this.fire();
    this.render();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.value = this.value || false;
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  _(c, key) {
    if (c.toLowerCase() === 'y') {
      this.value = true;
      return this.submit();
    }
    if (c.toLowerCase() === 'n') {
      this.value = false;
      return this.submit();
    }
    return this.bell();
  }

  render() {
    if (this.initialRender) this.out.write(cursor.hide)
    super.render();

    this.out.write(
      erase.line +
      cursor.to(0) +
      [
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(this.done),
        this.done
          ? this.value ? this.yesMsg : this.noMsg
          : color.gray(this.initialValue ? this.yesOption : this.noOption)
      ].join(' ')
    );
  }
}

export default (options) => new Confirm(options)
