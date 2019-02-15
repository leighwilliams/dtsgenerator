import ReferenceResolver from './referenceResolver';
import SchemaConvertor from './schemaConvertor';
export default class DtsGenerator {
    private resolver;
    private convertor;
    private namespaceName?;
    private currentSchema;
    constructor(resolver: ReferenceResolver, convertor: SchemaConvertor, namespaceName?: string | undefined);
    generate(): Promise<string>;
    private walk;
    private walkSchema;
    private normalizeContent;
    private generateDeclareType;
    private generateTypeModel;
    private generateTypeCollection;
    private generateProperties;
    private generateTypeProperty;
    private generateArrayedType;
    private generateArrayTypeProperty;
    private generateType;
    private generateTypeName;
}
