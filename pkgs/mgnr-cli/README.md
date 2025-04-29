
# mgnr-cli

## Start CLI session with log stream

### In Terminal Window 1
```shell
npx mgnr-cli-stream
```
### In Terminal Window 2

```ts
import * as mgnr from 'mgnr-cli'

const scale = new mgnr.Scale()
const generator = new mgnr.SequenceGenerator()
const generator2 = new mgnr.SequenceGenerator()

//...

mgnr.setupLogStream([generator, generator2], [scale])

mgnr.Scheduler.get().start()
```

```shell
ts-node sample.ts
```
