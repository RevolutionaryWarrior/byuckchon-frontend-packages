#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const ts = require("typescript");

const REPO_ROOT = path.resolve(__dirname, "..");
const DEFAULT_LIBRARY_PATH = "src/consts/Portfolio/Library";
const GENERATOR_PATH = "scripts/generate-library-docs.cjs";
const AUTO_GENERATED_MARKER =
  "<!-- AUTO-GENERATED: byuckchon-frontend-packages/scripts/generate-library-docs.cjs -->";
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_AI_MODEL = "gpt-4o-mini";

const PACKAGES = [
  {
    packageName: "@byuckchon-frontend/basic-ui",
    sourceDir: "src/packages/basic-ui/src",
    targetFolder: "Basic-UI",
  },
  {
    packageName: "@byuckchon-frontend/core",
    sourceDir: "src/packages/core/src",
    targetFolder: "Core",
  },
  {
    packageName: "@byuckchon-frontend/hooks",
    sourceDir: "src/packages/hooks/src",
    targetFolder: "Hooks",
  },
  {
    packageName: "@byuckchon-frontend/utils",
    sourceDir: "src/packages/utils/src",
    targetFolder: "Utils",
  },
];

const TYPE_FORMAT_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
  ts.TypeFormatFlags.WriteArrowStyleSignature |
  ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType;

const SKIPPED_OBJECT_PROPERTIES = new Set([
  "length",
  "name",
  "prototype",
  "arguments",
  "caller",
  "apply",
  "call",
  "bind",
  "toString",
  "toLocaleString",
  "valueOf",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
]);

const SEMANTIC_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["description", "usageExplanation", "notes"],
  properties: {
    description: {
      type: "string",
      description: "모듈의 역할을 설명하는 짧은 한국어 문장입니다.",
    },
    usageExplanation: {
      type: "string",
      description: "AST가 만든 usage skeleton을 어떻게 읽고 적용할지 설명하는 짧은 한국어 문장입니다.",
    },
    notes: {
      type: "string",
      description: "주의 사항 또는 사용 시 확인할 점입니다. 없으면 정해진 기본 문장을 사용합니다.",
    },
  },
};

function parseBoolean(value) {
  return /^(1|true|yes)$/i.test(String(value || ""));
}

function parseArgs(argv) {
  const args = {
    aiModel: process.env.LIBRARY_DOCS_AI_MODEL || process.env.OPENAI_MODEL || DEFAULT_AI_MODEL,
    apiKey: process.env.OPENAI_API_KEY || "",
    baseRef: process.env.LIBRARY_DOCS_BASE_REF || "",
    changedOnly: false,
    dryRun: false,
    headRef: process.env.LIBRARY_DOCS_HEAD_REF || "",
    libraryPath: process.env.INGENSROTA_LIBRARY_PATH || DEFAULT_LIBRARY_PATH,
    prune: !parseBoolean(process.env.LIBRARY_DOCS_NO_PRUNE),
    skipAi: parseBoolean(process.env.LIBRARY_DOCS_SKIP_AI),
    targetRepo: process.env.INGENSROTA_REPO_PATH || "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--target" || arg === "--target-repo") {
      args.targetRepo = argv[index + 1] || "";
      index += 1;
      continue;
    }

    if (arg.startsWith("--target=")) {
      args.targetRepo = arg.slice("--target=".length);
      continue;
    }

    if (arg === "--library-path") {
      args.libraryPath = argv[index + 1] || "";
      index += 1;
      continue;
    }

    if (arg.startsWith("--library-path=")) {
      args.libraryPath = arg.slice("--library-path=".length);
      continue;
    }

    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (arg === "--changed-only") {
      args.changedOnly = true;
      continue;
    }

    if (arg === "--skip-ai") {
      args.skipAi = true;
      continue;
    }

    if (arg === "--no-prune") {
      args.prune = false;
      continue;
    }

    if (arg === "--ai-model") {
      args.aiModel = argv[index + 1] || args.aiModel;
      index += 1;
      continue;
    }

    if (arg.startsWith("--ai-model=")) {
      args.aiModel = arg.slice("--ai-model=".length);
      continue;
    }

    if (arg === "--base") {
      args.baseRef = argv[index + 1] || "";
      index += 1;
      continue;
    }

    if (arg.startsWith("--base=")) {
      args.baseRef = arg.slice("--base=".length);
      continue;
    }

    if (arg === "--head") {
      args.headRef = argv[index + 1] || "";
      index += 1;
      continue;
    }

    if (arg.startsWith("--head=")) {
      args.headRef = arg.slice("--head=".length);
    }
  }

  if (!args.targetRepo) {
    throw new Error("Ingensrota 경로를 --target <path>로 전달해주세요.");
  }

  return {
    ...args,
    targetRepo: path.resolve(process.cwd(), args.targetRepo),
  };
}

function walkFiles(directory, predicate, files = []) {
  if (!fs.existsSync(directory)) {
    return files;
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "dist" || entry.name === "node_modules") {
      continue;
    }

    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walkFiles(entryPath, predicate, files);
      continue;
    }

    if (predicate(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join("/");
}

function getPackageSourceRoot(pkg) {
  return path.join(REPO_ROOT, pkg.sourceDir);
}

function getIndexFile(directory) {
  return ["index.ts", "index.tsx"]
    .map((fileName) => path.join(directory, fileName))
    .find((filePath) => fs.existsSync(filePath));
}

function isSourceFile(filePath) {
  return /\.(ts|tsx)$/.test(filePath) && !/\.stories\.(ts|tsx)$/.test(filePath);
}

function getModuleFiles(moduleDir) {
  return walkFiles(moduleDir, isSourceFile)
    .map((filePath) => normalizePath(path.relative(REPO_ROOT, filePath)))
    .sort();
}

function getModules(pkg) {
  const sourceRoot = getPackageSourceRoot(pkg);

  if (!fs.existsSync(sourceRoot)) {
    return [];
  }

  return fs
    .readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const moduleDir = path.join(sourceRoot, entry.name);
      const indexFile = getIndexFile(moduleDir);

      if (!indexFile) {
        return null;
      }

      return {
        files: getModuleFiles(moduleDir),
        indexFile,
        moduleDir,
        moduleName: entry.name,
        sourcePath: normalizePath(path.relative(REPO_ROOT, indexFile)),
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.moduleName.localeCompare(right.moduleName));
}

function isZeroSha(ref) {
  return /^0+$/.test(ref || "");
}

function moduleKey(pkg, moduleName) {
  return `${pkg.targetFolder}/${moduleName}`;
}

function getTargetFile(args, pkg, moduleName) {
  return path.join(args.targetRepo, args.libraryPath, pkg.targetFolder, `${moduleName}.md`);
}

function fileExistsWithExactCase(filePath) {
  const directory = path.dirname(filePath);

  if (!fs.existsSync(directory)) {
    return false;
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .some((entry) => entry.isFile() && entry.name === path.basename(filePath));
}

function getModuleNameFromSpecifier(specifier) {
  if (!specifier.startsWith(".")) {
    return null;
  }

  return specifier.replace(/^\.\//, "").replace(/\/index$/, "").split("/")[0];
}

function createPublicRecord() {
  return {
    named: new Map(),
    namespace: null,
    star: false,
  };
}

function getPublicRecord(publicExports, moduleName) {
  if (!publicExports.has(moduleName)) {
    publicExports.set(moduleName, createPublicRecord());
  }

  return publicExports.get(moduleName);
}

function addNamedPublicExport(publicExports, moduleName, moduleExportName, publicName) {
  if (!moduleName) {
    return;
  }

  getPublicRecord(publicExports, moduleName).named.set(moduleExportName, publicName);
}

function collectRootImports(sourceFile) {
  const imports = new Map();

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.moduleSpecifier || !statement.importClause) {
      continue;
    }

    const moduleName = getModuleNameFromSpecifier(statement.moduleSpecifier.text);

    if (!moduleName) {
      continue;
    }

    if (statement.importClause.name) {
      imports.set(statement.importClause.name.text, {
        moduleExportName: "default",
        moduleName,
      });
    }

    const namedBindings = statement.importClause.namedBindings;

    if (namedBindings && ts.isNamespaceImport(namedBindings)) {
      imports.set(namedBindings.name.text, {
        moduleExportName: "*",
        moduleName,
        namespace: true,
      });
    }

    if (namedBindings && ts.isNamedImports(namedBindings)) {
      for (const element of namedBindings.elements) {
        imports.set(element.name.text, {
          moduleExportName: element.propertyName?.text || element.name.text,
          moduleName,
        });
      }
    }
  }

  return imports;
}

function parsePublicExportsFromSourceFile(sourceFile) {
  const publicExports = new Map();
  const imports = collectRootImports(sourceFile);

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement)) {
      continue;
    }

    if (statement.moduleSpecifier) {
      const moduleName = getModuleNameFromSpecifier(statement.moduleSpecifier.text);

      if (!moduleName) {
        continue;
      }

      const record = getPublicRecord(publicExports, moduleName);

      if (!statement.exportClause) {
        record.star = true;
        continue;
      }

      if (ts.isNamespaceExport(statement.exportClause)) {
        record.namespace = statement.exportClause.name.text;
        continue;
      }

      if (ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          const moduleExportName = element.propertyName?.text || element.name.text;
          const publicName = element.name.text;
          addNamedPublicExport(publicExports, moduleName, moduleExportName, publicName);
        }
      }

      continue;
    }

    if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) {
        const localName = element.propertyName?.text || element.name.text;
        const publicName = element.name.text;
        const imported = imports.get(localName);

        if (!imported) {
          continue;
        }

        if (imported.namespace) {
          getPublicRecord(publicExports, imported.moduleName).namespace = publicName;
          continue;
        }

        addNamedPublicExport(publicExports, imported.moduleName, imported.moduleExportName, publicName);
      }
    }
  }

  return publicExports;
}

function parsePublicExports(pkg) {
  const indexFile = getIndexFile(getPackageSourceRoot(pkg));

  if (!indexFile) {
    return new Map();
  }

  const sourceFile = program.getSourceFile(indexFile);

  if (!sourceFile) {
    return new Map();
  }

  return parsePublicExportsFromSourceFile(sourceFile);
}

function parsePublicExportsFromText(text, fileName) {
  const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  return parsePublicExportsFromSourceFile(sourceFile);
}

function getGitShowText(treeish, filePath) {
  if (!treeish) {
    return null;
  }

  try {
    return execFileSync("git", ["-C", REPO_ROOT, "show", `${treeish}:${filePath}`], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

function getBaseTreeish(args) {
  if (args.baseRef && !isZeroSha(args.baseRef)) {
    return args.baseRef;
  }

  if (args.headRef) {
    return `${args.headRef}^`;
  }

  return "HEAD";
}

function getBasePublicExports(pkg, args) {
  const treeish = getBaseTreeish(args);
  const indexPath = ["index.ts", "index.tsx"]
    .map((fileName) => normalizePath(path.join(pkg.sourceDir, fileName)))
    .find((filePath) => getGitShowText(treeish, filePath) !== null);

  if (!indexPath) {
    return new Map();
  }

  const baseText = getGitShowText(treeish, indexPath);

  if (!baseText) {
    return new Map();
  }

  return parsePublicExportsFromText(baseText, indexPath);
}

function getPublicName(publicRecord, moduleExportName) {
  if (!publicRecord) {
    return null;
  }

  if (publicRecord.namespace) {
    return moduleExportName;
  }

  if (publicRecord.named.has(moduleExportName)) {
    return publicRecord.named.get(moduleExportName);
  }

  if (publicRecord.star && moduleExportName !== "default") {
    return moduleExportName;
  }

  return null;
}

function getGitChanges(args) {
  const diffArgs = ["-C", REPO_ROOT, "diff", "--name-status", "-M"];

  if (args.baseRef && args.headRef && !isZeroSha(args.baseRef)) {
    diffArgs.push(args.baseRef, args.headRef);
  } else if (args.headRef) {
    diffArgs.push(`${args.headRef}^`, args.headRef);
  } else {
    diffArgs.push("HEAD");
  }

  diffArgs.push("--", GENERATOR_PATH, ...PACKAGES.map((pkg) => pkg.sourceDir));

  const output = execFileSync("git", diffArgs, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [status, ...paths] = line.split(/\t+/);
      return {
        paths: status.startsWith("R") || status.startsWith("C") ? paths.slice(0, 2) : paths.slice(0, 1),
        status,
      };
    });
}

function classifyPackageSourcePath(filePath) {
  const normalized = normalizePath(filePath);

  if (normalized === GENERATOR_PATH) {
    return {
      kind: "generator",
    };
  }

  for (const pkg of PACKAGES) {
    const sourceDir = normalizePath(pkg.sourceDir);
    const sourcePrefix = `${sourceDir}/`;

    if (normalized === `${sourceDir}/index.ts` || normalized === `${sourceDir}/index.tsx`) {
      return {
        kind: "root-index",
        pkg,
      };
    }

    if (!normalized.startsWith(sourcePrefix)) {
      continue;
    }

    const rest = normalized.slice(sourcePrefix.length);
    const [moduleName, ...modulePath] = rest.split("/");

    if (!moduleName || moduleName === "index.ts" || moduleName === "index.tsx" || modulePath.length === 0) {
      return {
        kind: "package-root-file",
        pkg,
      };
    }

    return {
      kind: "module-file",
      moduleName,
      pkg,
    };
  }

  return null;
}

function getAffectedPlan(args, packageStates) {
  if (!args.changedOnly) {
    return {
      regenerateKeys: null,
      requestedKeys: null,
    };
  }

  const regenerateKeys = new Set();
  const requestedKeys = new Set();
  const rootIndexPackages = new Set();
  const changes = getGitChanges(args);

  for (const change of changes) {
    for (const changedPath of change.paths) {
      const classified = classifyPackageSourcePath(changedPath);

      if (!classified) {
        continue;
      }

      if (classified.kind === "generator") {
        for (const pkg of PACKAGES) {
          rootIndexPackages.add(pkg);
        }
        continue;
      }

      if (classified.kind === "root-index" || classified.kind === "package-root-file") {
        rootIndexPackages.add(classified.pkg);
        continue;
      }

      const key = moduleKey(classified.pkg, classified.moduleName);
      regenerateKeys.add(key);
      requestedKeys.add(key);
    }
  }

  for (const pkg of rootIndexPackages) {
    const state = packageStates.get(pkg.targetFolder);
    const currentPublicExports = state?.publicExports || new Map();
    const basePublicExports = getBasePublicExports(pkg, args);

    for (const moduleName of currentPublicExports.keys()) {
      const key = moduleKey(pkg, moduleName);
      regenerateKeys.add(key);
      requestedKeys.add(key);
    }

    for (const moduleName of basePublicExports.keys()) {
      const key = moduleKey(pkg, moduleName);
      requestedKeys.add(key);

      if (!currentPublicExports.has(moduleName)) {
        regenerateKeys.add(key);
      }
    }
  }

  return {
    regenerateKeys,
    requestedKeys,
  };
}

function getDeclaration(symbol) {
  return symbol?.valueDeclaration || symbol?.declarations?.[0] || null;
}

function resolveAlias(symbol) {
  return symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

function getTypeText(type, location) {
  return checker
    .typeToString(type, location, TYPE_FORMAT_FLAGS)
    .replace(/import\("[^"]+"\)\./g, "");
}

function getDocumentationText(symbol) {
  const documentation = ts.displayPartsToString(symbol?.getDocumentationComment(checker) || []).trim();
  const tags =
    symbol
      ?.getJsDocTags(checker)
      .map((tag) => {
        const text = ts.displayPartsToString(tag.text || []).trim();
        return text ? `@${tag.name} ${text}` : `@${tag.name}`;
      })
      .join("\n") || "";

  return [documentation, tags].filter(Boolean).join("\n").trim();
}

function getSignatureText(name, signature, location) {
  const signatureText = checker.signatureToString(signature, location, TYPE_FORMAT_FLAGS);

  if (signatureText.startsWith("<")) {
    return `${name}${signatureText.replace(" => ", ": ")}`;
  }

  if (signatureText.startsWith("(")) {
    return `${name}${signatureText.replace(" => ", ": ")}`;
  }

  return `${name}: ${signatureText}`;
}

function isOptionalDeclaration(declaration) {
  return Boolean(declaration?.questionToken || declaration?.initializer || declaration?.dotDotDotToken);
}

function getDefaultValue(declaration) {
  return declaration?.initializer ? declaration.initializer.getText() : "";
}

function getBindingDefaults(parameterDeclaration) {
  const defaults = new Map();

  if (!parameterDeclaration || !ts.isObjectBindingPattern(parameterDeclaration.name)) {
    return defaults;
  }

  for (const element of parameterDeclaration.name.elements) {
    if (!ts.isIdentifier(element.name) || !element.initializer) {
      continue;
    }

    const propertyName = element.propertyName?.getText() || element.name.text;
    defaults.set(propertyName, element.initializer.getText());
  }

  return defaults;
}

function shouldSkipObjectProperties(type, typeText) {
  if (
    type.flags &
    (ts.TypeFlags.Any |
      ts.TypeFlags.Unknown |
      ts.TypeFlags.StringLike |
      ts.TypeFlags.NumberLike |
      ts.TypeFlags.BooleanLike |
      ts.TypeFlags.BigIntLike |
      ts.TypeFlags.ESSymbolLike |
      ts.TypeFlags.Void |
      ts.TypeFlags.Undefined |
      ts.TypeFlags.Null |
      ts.TypeFlags.Never)
  ) {
    return true;
  }

  return (
    type.isUnion() ||
    checker.isArrayType(type) ||
    checker.isTupleType(type) ||
    type.getCallSignatures().length > 0 ||
    typeText === "Date" ||
    typeText === "File" ||
    typeText === "ReactNode" ||
    typeText.endsWith("Element") ||
    typeText.startsWith("Promise<") ||
    typeText.startsWith("Record<") ||
    typeText.startsWith("Partial<")
  );
}

function getPropertyRows(type, location, defaults = new Map()) {
  const typeText = getTypeText(type, location);

  if (shouldSkipObjectProperties(type, typeText)) {
    return [];
  }

  return type
    .getProperties()
    .filter((property) => {
      const name = property.getName();
      return !/^\d+$/.test(name) && !name.startsWith("__@") && !SKIPPED_OBJECT_PROPERTIES.has(name);
    })
    .map((property) => {
      const declaration = getDeclaration(property);
      const propertyType = checker.getTypeOfSymbolAtLocation(property, declaration || location);
      const defaultValue = defaults.get(property.getName()) || getDefaultValue(declaration);

      return {
        defaultValue,
        documentation: getDocumentationText(property),
        name: property.getName(),
        required:
          !(property.flags & ts.SymbolFlags.Optional) &&
          !isOptionalDeclaration(declaration) &&
          !defaultValue,
        type: getTypeText(propertyType, declaration || location),
      };
    });
}

function getParameterName(parameterDeclaration, fallbackName, typeText) {
  if (!parameterDeclaration) {
    return fallbackName;
  }

  if (ts.isIdentifier(parameterDeclaration.name)) {
    return parameterDeclaration.name.text;
  }

  if (/Props\b/.test(typeText)) return "props";
  if (/Options\b/.test(typeText)) return "options";
  if (/Params\b/.test(typeText)) return "params";

  return "props";
}

function getParameterRows(signature, location) {
  return signature.getParameters().map((parameter) => {
    const declaration = getDeclaration(parameter);
    const parameterType = checker.getTypeOfSymbolAtLocation(parameter, declaration || location);
    const type = getTypeText(parameterType, declaration || location);
    const name = getParameterName(declaration, parameter.getName(), type);
    const defaults = getBindingDefaults(declaration);
    const defaultValue = getDefaultValue(declaration);

    return {
      defaultValue,
      documentation: getDocumentationText(parameter),
      name,
      properties: getPropertyRows(parameterType, declaration || location, defaults),
      required: !isOptionalDeclaration(declaration),
      type,
    };
  });
}

function getReturnInfo(signature, location) {
  const returnType = signature.getReturnType();

  return {
    properties: getPropertyRows(returnType, location),
    type: getTypeText(returnType, location),
  };
}

function getClassPropsRows(declaration) {
  for (const heritage of declaration.heritageClauses || []) {
    for (const typeNode of heritage.types) {
      if (!typeNode.typeArguments?.length) {
        continue;
      }

      const propsType = checker.getTypeFromTypeNode(typeNode.typeArguments[0]);
      return {
        props: getPropertyRows(propsType, declaration),
        type: typeNode.typeArguments[0].getText(),
      };
    }
  }

  return {
    props: [],
    type: "Props",
  };
}

function isReactClassComponent(declaration) {
  return Boolean(
    declaration?.heritageClauses?.some((heritage) =>
      heritage.types.some((typeNode) => /Component|PureComponent/.test(typeNode.expression.getText())),
    ),
  );
}

function isFunctionComponent(publicName, returnTypeText, sourceFile) {
  if (/JSX\.Element|ReactElement/.test(returnTypeText)) {
    return true;
  }

  return sourceFile.fileName.endsWith(".tsx") && /^[A-Z]/.test(publicName);
}

function getCallableMembers(type, location, ownerName) {
  const rows = getPropertyRows(type, location);

  return rows
    .map((row) => {
      const property = type.getProperty(row.name);
      const declaration = getDeclaration(property);
      const propertyType = checker.getTypeOfSymbolAtLocation(property, declaration || location);
      const signature = propertyType.getCallSignatures()[0];

      if (!signature) {
        return null;
      }

      return {
        documentation: row.documentation,
        kind: "function",
        name: row.name,
        parameters: getParameterRows(signature, declaration || location),
        returnInfo: getReturnInfo(signature, declaration || location),
        signature: getSignatureText(`${ownerName}.${row.name}`, signature, declaration || location),
      };
    })
    .filter(Boolean);
}

function describeTypeExport(publicName, symbol, declaration, sourceFile) {
  const type = checker.getTypeAtLocation(declaration);

  return {
    documentation: getDocumentationText(symbol),
    kind: "type",
    name: publicName,
    properties: getPropertyRows(type, declaration),
    source: declaration.getText(sourceFile),
  };
}

function describeObjectExport(publicName, symbol, declaration, ownerName) {
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);

  return {
    callableMembers: getCallableMembers(type, declaration, ownerName),
    documentation: getDocumentationText(symbol),
    kind: "object",
    name: publicName,
    properties: getPropertyRows(type, declaration),
    type: getTypeText(type, declaration),
  };
}

function describeFunctionExport(publicName, symbol, declaration, sourceFile) {
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signature = type.getCallSignatures()[0];

  if (!signature) {
    return describeObjectExport(publicName, symbol, declaration, publicName);
  }

  const returnInfo = getReturnInfo(signature, declaration);
  const kind = /^use[A-Z0-9]/.test(publicName)
    ? "hook"
    : isFunctionComponent(publicName, returnInfo.type, sourceFile)
      ? "component"
      : "function";

  return {
    documentation: getDocumentationText(symbol),
    kind,
    name: publicName,
    parameters: getParameterRows(signature, declaration),
    returnInfo,
    signature: getSignatureText(publicName, signature, declaration),
  };
}

function describeClassExport(publicName, symbol, declaration) {
  const propsInfo = getClassPropsRows(declaration);

  return {
    documentation: getDocumentationText(symbol),
    kind: "component",
    name: publicName,
    parameters: [
      {
        defaultValue: "",
        documentation: "",
        name: "props",
        properties: propsInfo.props,
        required: true,
        type: propsInfo.type,
      },
    ],
    returnInfo: {
      properties: [],
      type: "ReactNode",
    },
    signature: `${publicName}(props): ReactNode`,
  };
}

function describeExport(moduleExportName, publicName, exportedSymbol, sourceFile, accessPrefix) {
  const symbol = resolveAlias(exportedSymbol);
  const declaration = getDeclaration(symbol) || sourceFile;

  if (ts.isTypeAliasDeclaration(declaration) || ts.isInterfaceDeclaration(declaration)) {
    return {
      ...describeTypeExport(publicName, symbol, declaration, sourceFile),
      accessPrefix,
      moduleExportName,
    };
  }

  if (ts.isClassDeclaration(declaration) && isReactClassComponent(declaration)) {
    return {
      ...describeClassExport(publicName, symbol, declaration),
      accessPrefix,
      moduleExportName,
    };
  }

  return {
    ...describeFunctionExport(publicName, symbol, declaration, sourceFile),
    accessPrefix,
    moduleExportName,
  };
}

function getExportDocs(moduleInfo, publicRecord) {
  const sourceFile = program.getSourceFile(moduleInfo.indexFile);
  const sourceSymbol = checker.getSymbolAtLocation(sourceFile);

  if (!sourceSymbol) {
    return [];
  }

  const docs = [];

  for (const exportedSymbol of checker.getExportsOfModule(sourceSymbol)) {
    const moduleExportName = exportedSymbol.getName();
    const publicName = getPublicName(publicRecord, moduleExportName);

    if (!publicName) {
      continue;
    }

    const accessPrefix = publicRecord.namespace ? `${publicRecord.namespace}.${publicName}` : publicName;
    docs.push(describeExport(moduleExportName, publicName, exportedSymbol, sourceFile, accessPrefix));
  }

  return docs.sort((left, right) => {
    if (left.kind === "type" && right.kind !== "type") return 1;
    if (left.kind !== "type" && right.kind === "type") return -1;
    return left.name.localeCompare(right.name);
  });
}

function markdownEscape(value) {
  return String(value || "")
    .replace(/\r?\n/g, "<br />")
    .replace(/\|/g, "\\|");
}

function code(value) {
  return `\`${markdownEscape(value || "-")}\``;
}

function renderTable(headers, rows) {
  if (!rows.length) {
    return "";
  }

  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(markdownEscape).join(" | ")} |`),
    "",
  ].join("\n");
}

function renderImport(pkg, moduleInfo, publicRecord, exportDocs) {
  if (publicRecord.namespace) {
    return `import { ${publicRecord.namespace} } from "${pkg.packageName}";`;
  }

  const typeExports = exportDocs.filter((doc) => doc.kind === "type").map((doc) => doc.name);
  const valueExports = exportDocs.filter((doc) => doc.kind !== "type").map((doc) => doc.name);
  const defaultExport = valueExports.find((name) => name === "default");
  const namedValueExports = valueExports.filter((name) => name !== "default");
  const namedImports = [...namedValueExports, ...typeExports.map((name) => `type ${name}`)];

  if (defaultExport) {
    const localName = /^[A-Za-z_$][\w$]*$/.test(moduleInfo.moduleName) ? moduleInfo.moduleName : "moduleDefault";
    return `import ${localName}${namedImports.length ? `, { ${namedImports.join(", ")} }` : ""} from "${pkg.packageName}";`;
  }

  if (valueExports.length === 0 && typeExports.length > 0) {
    return `import type { ${typeExports.join(", ")} } from "${pkg.packageName}";`;
  }

  return `import { ${namedImports.join(", ")} } from "${pkg.packageName}";`;
}

function renderRows(rows) {
  return renderTable(
    ["Name", "Type", "Required", "Default"],
    rows.map((row) => [
      code(row.name),
      code(row.type),
      row.required ? "필수" : "선택",
      row.defaultValue ? code(row.defaultValue) : "-",
    ]),
  );
}

function renderParameters(parameters, title = "Parameters") {
  if (!parameters?.length) {
    return "";
  }

  const sections = [`### ${title}`, "", renderRows(parameters)];

  for (const parameter of parameters) {
    if (!parameter.properties.length) {
      continue;
    }

    sections.push(`### ${parameter.name === "props" ? "Props" : `Properties: ${parameter.name}`}`);
    sections.push("");
    sections.push(renderRows(parameter.properties));
  }

  return sections.filter(Boolean).join("\n");
}

function renderReturn(returnInfo) {
  const lines = ["### Return", "", code(returnInfo.type), ""];

  if (returnInfo.properties.length) {
    lines.push(renderTable(["Name", "Type"], returnInfo.properties.map((row) => [code(row.name), code(row.type)])));
  }

  return lines.filter(Boolean).join("\n");
}

function renderTypeSection(doc) {
  const lines = [`## ${doc.name}`, "", "### Type", "", "```ts", doc.source, "```", ""];

  if (doc.properties.length) {
    lines.push("### Properties");
    lines.push("");
    lines.push(renderRows(doc.properties));
  }

  return lines.filter(Boolean).join("\n");
}

function renderObjectProperties(rows) {
  return renderTable(["Name", "Type"], rows.map((row) => [code(row.name), code(row.type)]));
}

function getPlaceholderValue(type, name = "") {
  if (/\[\]|Array</.test(type)) return "[]";
  if (/=>|Function/.test(type) || /^on[A-Z]/.test(name) || /callback/i.test(name)) return "() => {}";
  if (/^Record<|^Partial<|^\{/.test(type)) return "{}";
  if (/Date/.test(type)) return "new Date()";
  if (/string/.test(type)) return '""';
  if (/number/.test(type)) return "0";
  if (/boolean/.test(type)) return "false";
  if (/ReactNode|JSX\.Element/.test(type)) return "null";
  return "{}";
}

function getCallArgs(parameters) {
  return (parameters || [])
    .map((parameter) => {
      if (parameter.properties.length) {
        const requiredProperties = parameter.properties.filter((property) => property.required);

        if (!requiredProperties.length) {
          return "{}";
        }

        return `{ ${requiredProperties
          .map((property) => `${property.name}: ${getPlaceholderValue(property.type, property.name)}`)
          .join(", ")} }`;
      }

      return getPlaceholderValue(parameter.type, parameter.name);
    })
    .join(", ");
}

function renderComponentUsage(doc) {
  const props = doc.parameters?.[0]?.properties || [];
  const requiredProps = props.filter((property) => property.required && property.name !== "children");
  const propText = requiredProps
    .map((property) => `${property.name}={${getPlaceholderValue(property.type, property.name)}}`)
    .join(" ");
  const children = props.some((property) => property.name === "children");

  if (children) {
    return `<${doc.accessPrefix}${propText ? ` ${propText}` : ""}>
  {children}
</${doc.accessPrefix}>`;
  }

  return `<${doc.accessPrefix}${propText ? ` ${propText}` : ""} />`;
}

function renderUsage(doc) {
  if (doc.kind === "type") {
    return "";
  }

  if (doc.kind === "hook") {
    return [
      "```tsx",
      "export const Example = () => {",
      `  const result = ${doc.accessPrefix}(${getCallArgs(doc.parameters)});`,
      "",
      "  return null;",
      "};",
      "```",
    ].join("\n");
  }

  if (doc.kind === "component") {
    return ["```tsx", renderComponentUsage(doc), "```"].join("\n");
  }

  if (doc.kind === "object") {
    const callableMember = doc.callableMembers[0];

    if (callableMember) {
      return [
        "```ts",
        `const result = ${doc.accessPrefix}.${callableMember.name}(${getCallArgs(callableMember.parameters)});`,
        "```",
      ].join("\n");
    }

    return ["```ts", `const value = ${doc.accessPrefix};`, "```"].join("\n");
  }

  return ["```ts", `const result = ${doc.accessPrefix}(${getCallArgs(doc.parameters)});`, "```"].join("\n");
}

function renderCallableMember(member) {
  const lines = [
    `### ${member.name}`,
    "",
    "#### Signature",
    "",
    "```ts",
    member.signature,
    "```",
    "",
  ];

  const params = renderParameters(member.parameters, "Parameters");
  if (params) lines.push(params);
  lines.push(renderReturn(member.returnInfo));

  return lines.filter(Boolean).join("\n");
}

function renderRuntimeExportSection(doc) {
  const lines = [
    `## ${doc.name}`,
    "",
    `Kind: ${code(doc.kind)}`,
    "",
    "### Signature",
    "",
    "```ts",
    doc.signature || doc.type,
    "```",
    "",
  ];

  if (doc.kind === "object") {
    if (doc.properties.length) {
      lines.push("### Properties");
      lines.push("");
      lines.push(renderObjectProperties(doc.properties));
    }

    if (doc.callableMembers.length) {
      lines.push("### Callable Members");
      lines.push("");
      lines.push(renderTable(["Name", "Signature"], doc.callableMembers.map((member) => [code(member.name), code(member.signature)])));
      lines.push(...doc.callableMembers.map(renderCallableMember));
    }
  } else if (doc.kind === "component") {
    const props = doc.parameters?.[0]?.properties || [];

    if (props.length) {
      lines.push("### Props");
      lines.push("");
      lines.push(renderRows(props));
    } else {
      const params = renderParameters(doc.parameters, "Props");
      if (params) lines.push(params);
    }

    lines.push(renderReturn(doc.returnInfo));
  } else {
    const params = renderParameters(doc.parameters, doc.kind === "component" ? "Props" : "Parameters");
    if (params) lines.push(params);
    lines.push(renderReturn(doc.returnInfo));
  }

  const usage = renderUsage(doc);
  if (usage) {
    lines.push("### Usage");
    lines.push("");
    lines.push(usage);
  }

  return lines.filter(Boolean).join("\n");
}

function renderExportSection(doc) {
  return doc.kind === "type" ? renderTypeSection(doc) : renderRuntimeExportSection(doc);
}

function renderModuleStructure(moduleInfo) {
  return renderTable(["File"], moduleInfo.files.map((filePath) => [code(filePath)]));
}

function renderMarkdown(pkg, moduleInfo, publicRecord, exportDocs, semantic) {
  return [
    AUTO_GENERATED_MARKER,
    "",
    `# ${moduleInfo.moduleName}`,
    "",
    "## Description",
    "",
    semantic.description,
    "",
    "## Usage Explanation",
    "",
    semantic.usageExplanation,
    "",
    "## Import",
    "",
    "```ts",
    renderImport(pkg, moduleInfo, publicRecord, exportDocs),
    "```",
    "",
    "## Source",
    "",
    code(moduleInfo.sourcePath),
    "",
    "## Module Structure",
    "",
    renderModuleStructure(moduleInfo),
    "## Exports",
    "",
    renderTable(
      ["Name", "Kind", "Public Access"],
      exportDocs.map((doc) => [code(doc.name), code(doc.kind), code(doc.accessPrefix)]),
    ),
    ...exportDocs.map(renderExportSection),
    "## Notes",
    "",
    semantic.notes,
    "",
  ].join("\n");
}

function compactRows(rows) {
  return (rows || []).map((row) => ({
    defaultValue: row.defaultValue || "",
    name: row.name,
    properties: compactRows(row.properties || []),
    required: Boolean(row.required),
    type: row.type,
  }));
}

function getSemanticMetadata(doc) {
  return {
    exports: doc.exportDocs.map((exportDoc) => ({
      callableMembers: (exportDoc.callableMembers || []).map((member) => ({
        documentation: member.documentation || "",
        name: member.name,
        parameters: compactRows(member.parameters || []),
        returnType: member.returnInfo?.type || "",
        signature: member.signature,
      })),
      documentation: exportDoc.documentation || "",
      kind: exportDoc.kind,
      name: exportDoc.name,
      parameters: compactRows(exportDoc.parameters || []),
      properties: compactRows(exportDoc.properties || []),
      publicAccess: exportDoc.accessPrefix,
      returnType: exportDoc.returnInfo?.type || "",
      signature: exportDoc.signature || exportDoc.type || "",
    })),
    files: doc.moduleInfo.files,
    moduleName: doc.moduleInfo.moduleName,
    packageName: doc.pkg.packageName,
    targetFolder: doc.pkg.targetFolder,
  };
}

function createFallbackSemantic(doc) {
  const kinds = [...new Set(doc.exportDocs.map((exportDoc) => exportDoc.kind))];
  const kindText = kinds.length === 1 ? `${kinds[0]}입니다` : `${kinds.join(", ")} export를 제공합니다`;
  const exportNames = doc.exportDocs.map((exportDoc) => exportDoc.name).join(", ");

  return {
    description: `${doc.moduleInfo.moduleName} 모듈은 ${exportNames} public API를 제공하는 ${kindText}.`,
    notes: "특별한 주의 사항은 없습니다.",
    usageExplanation: "아래 예시는 AST metadata를 기준으로 생성된 기본 사용 형태입니다.",
  };
}

function normalizeSemantic(value, fallback) {
  return {
    description: String(value?.description || fallback.description).trim(),
    notes: String(value?.notes || fallback.notes).trim(),
    usageExplanation: String(value?.usageExplanation || fallback.usageExplanation).trim(),
  };
}

function extractOutputText(responseBody) {
  if (typeof responseBody.output_text === "string") {
    return responseBody.output_text;
  }

  const chunks = [];

  for (const output of responseBody.output || []) {
    for (const content of output.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        chunks.push(content.text);
      }

      if (content.type === "refusal") {
        throw new Error(`AI semantic generation refused: ${content.refusal || "unknown refusal"}`);
      }
    }
  }

  return chunks.join("");
}

async function generateAiSemantic(args, doc) {
  if (!args.apiKey) {
    throw new Error("OPENAI_API_KEY가 없어 AI semantic generation을 실행할 수 없습니다.");
  }

  const fallback = createFallbackSemantic(doc);
  const metadata = getSemanticMetadata(doc);
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: [
        {
          role: "system",
          content: [
            "너는 TypeScript API 문서의 semantic assistant입니다.",
            "Markdown 전체를 작성하지 않습니다.",
            "반드시 JSON schema에 맞는 JSON만 반환합니다.",
            "TypeScript AST metadata만 근거로 설명합니다.",
            "import, signature, parameter, return type의 정확한 값은 반복하지 않습니다.",
            "한국어로 짧고 안정적인 문장을 씁니다.",
            "추측, 과장, 마케팅 표현을 사용하지 않습니다.",
            'kind 표현은 hook은 "hook입니다", component는 "component입니다", function은 "function입니다", object는 "object입니다", type은 "type입니다" 스타일을 유지합니다.',
          ].join("\n"),
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              instruction: {
                description: "모듈이 언제 필요한지 1-2문장으로 설명합니다.",
                notes: '주의 사항이 명확하지 않으면 "특별한 주의 사항은 없습니다."라고 씁니다.',
                usageExplanation: "AST가 별도로 생성한 usage skeleton을 읽는 방법을 1-2문장으로 설명합니다.",
              },
              metadata,
            },
            null,
            2,
          ),
        },
      ],
      max_output_tokens: 600,
      model: args.aiModel,
      temperature: 0.2,
      text: {
        format: {
          description: "Semantic fields for a generated TypeScript API markdown document.",
          name: "library_module_semantics",
          schema: SEMANTIC_SCHEMA,
          strict: true,
          type: "json_schema",
        },
      },
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`AI semantic generation failed (${response.status}): ${responseText}`);
  }

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(responseText);
  } catch {
    throw new Error(`OpenAI 응답 JSON 파싱에 실패했습니다: ${responseText}`);
  }

  const outputText = extractOutputText(parsedResponse);

  try {
    return normalizeSemantic(JSON.parse(outputText), fallback);
  } catch {
    throw new Error(`AI semantic JSON 파싱에 실패했습니다: ${outputText}`);
  }
}

async function getSemantic(args, doc) {
  if (args.skipAi || args.dryRun) {
    return createFallbackSemantic(doc);
  }

  return generateAiSemantic(args, doc);
}

function createPackageStates() {
  const states = new Map();

  for (const pkg of PACKAGES) {
    const modules = getModules(pkg);
    states.set(pkg.targetFolder, {
      moduleMap: new Map(modules.map((moduleInfo) => [moduleInfo.moduleName, moduleInfo])),
      modules,
      pkg,
      publicExports: parsePublicExports(pkg),
    });
  }

  return states;
}

function buildDocs(args) {
  const currentDocs = [];
  const docs = [];
  const packageStates = createPackageStates();
  const affectedPlan = getAffectedPlan(args, packageStates);

  for (const state of packageStates.values()) {
    for (const moduleInfo of state.modules) {
      const key = moduleKey(state.pkg, moduleInfo.moduleName);
      const publicRecord = state.publicExports.get(moduleInfo.moduleName);

      if (!publicRecord) {
        continue;
      }

      const exportDocs = getExportDocs(moduleInfo, publicRecord);

      if (!exportDocs.length) {
        continue;
      }

      currentDocs.push({
        key,
        moduleName: moduleInfo.moduleName,
        pkg: state.pkg,
      });

      const targetFileMissing =
        args.prune && !fileExistsWithExactCase(getTargetFile(args, state.pkg, moduleInfo.moduleName));

      if (affectedPlan.regenerateKeys && !affectedPlan.regenerateKeys.has(key) && !targetFileMissing) {
        continue;
      }

      docs.push({
        exportDocs,
        key,
        moduleInfo,
        pkg: state.pkg,
        publicRecord,
      });
    }
  }

  const generatedKeys = new Set(docs.map((doc) => doc.key));
  const deletedDocs = [];

  if (affectedPlan.requestedKeys) {
    for (const key of affectedPlan.requestedKeys) {
      if (generatedKeys.has(key)) {
        continue;
      }

      const [targetFolder, moduleName] = key.split("/");
      const state = packageStates.get(targetFolder);

      if (!state) {
        continue;
      }

      deletedDocs.push({
        key,
        moduleName,
        pkg: state.pkg,
      });
    }
  }

  return {
    currentDocs,
    deletedDocs,
    docs,
  };
}

function recordChangedFile(changedFiles, seenChanges, action, filePath) {
  const key = `${action}:${filePath}`;

  if (seenChanges.has(key)) {
    return;
  }

  seenChanges.add(key);
  changedFiles.push({
    action,
    filePath,
  });
}

function pruneStaleDocs(args, currentDocs, changedFiles, seenChanges) {
  if (!args.prune) {
    return;
  }

  const keepFiles = new Set(currentDocs.map((doc) => getTargetFile(args, doc.pkg, doc.moduleName)));

  for (const pkg of PACKAGES) {
    const targetDirectory = path.join(args.targetRepo, args.libraryPath, pkg.targetFolder);

    if (!fs.existsSync(targetDirectory)) {
      continue;
    }

    for (const entry of fs.readdirSync(targetDirectory, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".md")) {
        continue;
      }

      const targetFile = path.join(targetDirectory, entry.name);

      if (keepFiles.has(targetFile)) {
        continue;
      }

      if (args.dryRun) {
        recordChangedFile(changedFiles, seenChanges, "delete", targetFile);
        continue;
      }

      fs.unlinkSync(targetFile);
      recordChangedFile(changedFiles, seenChanges, "delete", targetFile);
    }
  }
}

async function writeDocs(args, docs, deletedDocs, currentDocs) {
  const changedFiles = [];
  const seenChanges = new Set();
  const docsByKey = new Set(docs.map((doc) => doc.key));

  pruneStaleDocs(args, currentDocs, changedFiles, seenChanges);

  for (const deletedDoc of deletedDocs) {
    if (docsByKey.has(deletedDoc.key)) {
      continue;
    }

    const targetFile = getTargetFile(args, deletedDoc.pkg, deletedDoc.moduleName);

    if (args.dryRun) {
      if (fs.existsSync(targetFile)) {
        recordChangedFile(changedFiles, seenChanges, "delete", targetFile);
      }
      continue;
    }

    if (fs.existsSync(targetFile)) {
      fs.unlinkSync(targetFile);
      recordChangedFile(changedFiles, seenChanges, "delete", targetFile);
    }
  }

  for (const doc of docs) {
    const targetFile = getTargetFile(args, doc.pkg, doc.moduleInfo.moduleName);
    const targetDirectory = path.dirname(targetFile);
    const semantic = await getSemantic(args, doc);
    const content = `${renderMarkdown(doc.pkg, doc.moduleInfo, doc.publicRecord, doc.exportDocs, semantic).trim()}\n`;

    if (args.dryRun) {
      recordChangedFile(changedFiles, seenChanges, "write", targetFile);
      continue;
    }

    fs.mkdirSync(targetDirectory, { recursive: true });
    fs.writeFileSync(targetFile, content);
    recordChangedFile(changedFiles, seenChanges, "write", targetFile);
  }

  return changedFiles;
}

const sourceFiles = PACKAGES.flatMap((pkg) => walkFiles(getPackageSourceRoot(pkg), isSourceFile));

const program = ts.createProgram(sourceFiles, {
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Node10,
  skipLibCheck: true,
  strict: false,
  target: ts.ScriptTarget.ES2022,
});

const checker = program.getTypeChecker();

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { currentDocs, deletedDocs, docs } = buildDocs(args);
  const changedFiles = await writeDocs(args, docs, deletedDocs, currentDocs);

  console.log(`Generated ${changedFiles.length} library doc changes:`);
  for (const change of changedFiles) {
    console.log(`- ${change.action}: ${path.relative(args.targetRepo, change.filePath)}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
