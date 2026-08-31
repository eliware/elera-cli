import { readFile } from 'node:fs/promises';
import { validateBundle } from '@eliware/elera-lib';

const fixture = JSON.parse(await readFile(new URL('../contracts/routing-bundle.fixture.json', import.meta.url)));
validateBundle(fixture);
console.log('Canonical routing bundle fixture verified');
