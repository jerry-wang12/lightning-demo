export type CustomPropertiesResolution =
  | {
      type: 'native';
    }
  | {
      type: 'module';
      name: string;
    };
export interface CustomPropertiesConfig {
  allowDefinition?: boolean;
  resolution?: CustomPropertiesResolution;
}
export interface StylesheetConfig {
  customProperties?: CustomPropertiesConfig;
}
export interface OutputConfig {
  compat?: boolean;
  minify?: boolean;
  sourcemap?: boolean;
  env?: {
    NODE_ENV?: string;
  };
}
export interface BundleFiles {
  [filename: string]: string;
}
export interface CompilerOptions {
  name: string;
  namespace: string;
  files: BundleFiles;
  /**
   * An optional directory prefix that contains the specified components
   * files. Only used when the component that is the compiler's entry point.
   */
  baseDir?: string;
  stylesheetConfig?: StylesheetConfig;
  outputConfig?: OutputConfig;
  isExplicitImport?: boolean;
}
export interface NormalizedCompilerOptions extends CompilerOptions {
  outputConfig: NormalizedOutputConfig;
  stylesheetConfig: NormalizedStylesheetConfig;
  isExplicitImport: boolean;
}
export interface NormalizedStylesheetConfig extends StylesheetConfig {
  customProperties: {
    allowDefinition: boolean;
    resolution: CustomPropertiesResolution;
  };
}
export interface NormalizedOutputConfig extends OutputConfig {
  compat: boolean;
  minify: boolean;
  sourcemap: boolean;
  env: {
    NODE_ENV?: string;
  };
}
