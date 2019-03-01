# Prompts

## Examples

### Single Prompt

```js
import prompt from '@prompts/core'
import text from '@prompts/text'

const response = await prompt(
  text({
    name: 'meaning',
    prompt: 'What is the meaning of life?'
  })
)

// response == { meaning }
```

### Prompt Chain

```js
import prompt from '@prompts/core'
import text from '@prompts/text'
import number from '@prompts/number'

const questions = [
  text({
    name: 'username',
    prompt: 'What is your GitHub username?'
  }),
  number({
    name: 'age',
    prompt: 'How old are you?'
  }),
  text({
    name: 'about',
    prompt: 'Tell me about yourself',
    default: 'Why should I?'
  })
]

const { username, age, about } = await prompt(...questions)
```

### Dynamic Prompts

Just handle directly

```js
import prompt from '@prompts/core'
import text from '@prompts/text'

const { dish } = await prompt(
  text({
    name: 'dish',
    prompt: 'Do you like pizza?'
  })
)

if (dish !== 'pizza') return

const { topping } = await prompt(
  text({
      name: 'topping',
      prompt: 'Name a topping'
    })
)
```

# API

Pass prompt args

```js
prompt(...prompts)
```

Options event listeners

```js
prompt.on('cancel', prompt => {
  console.log('Never stop prompting!');
  return true;
})

prompt.on('submit', (prompt, response) => console.log(`Thanks I got ${response} from ${prompt.name}`))
```

Injecting args

```js
prompt.inject(require('yargs').argv) // TODO: Finalize naming
```


# Prompt Types

## Base Prompt

Extends `EventEmitter` and provides the base interface that follows

```ts
{
  name: string,
  message: string,
  initial: string,
  format: Function,
  validate: Function,
  // style: string, // Function // QUESTION: What is this for?
}
```

Events

- `'state'`
- `'render'`
- `'submit'`
- `'abort'`

## Text

## Password

## Invisible

## Number

## Confirm

## List

## Toggle

## Select

## Multi-Select

## Autocomplete

## Date

##
