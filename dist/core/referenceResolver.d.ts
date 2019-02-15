import 'cross-fetch/polyfill';
import { Schema } from './jsonSchema';
export default class ReferenceResolver {
    private readonly schemaCache;
    private readonly referenceCache;
    dereference(refId: string): Schema;
    getAllRegisteredSchema(): IterableIterator<Schema>;
    resolve(): Promise<void>;
    registerRemoteSchema(url: string): Promise<void>;
    registerSchema(schema: Schema): void;
    private addSchema;
    private addReference;
    clear(): void;
}
