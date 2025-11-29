import yaml from 'js-yaml';

export const formatJson = (input: string, indent: number = 2): string => {
    try {
        const parsed = JSON.parse(input);
        return JSON.stringify(parsed, null, indent);
    } catch (e) {
        throw new Error("Invalid JSON");
    }
};

export const validateJson = (input: string): { isValid: boolean; error?: string } => {
    try {
        JSON.parse(input);
        return { isValid: true };
    } catch (e: any) {
        return { isValid: false, error: e.message };
    }
};

export const jsonToYaml = (input: string): string => {
    try {
        const parsed = JSON.parse(input);
        return yaml.dump(parsed);
    } catch (e) {
        throw new Error("Invalid JSON");
    }
};

export const yamlToJson = (input: string): string => {
    try {
        const parsed = yaml.load(input);
        return JSON.stringify(parsed, null, 2);
    } catch (e) {
        throw new Error("Invalid YAML");
    }
};
