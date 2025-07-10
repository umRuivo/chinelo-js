import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../../chinelo.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const controllersPath = path.join(__dirname, '../../src/controllers');
const middlewaresPath = path.join(__dirname, '../../src/middlewares');
const outputPath = path.join(__dirname, '../../export.routes.js');

async function generateRoutesFile() {
    const controllerFiles = fs.readdirSync(controllersPath).filter(file => file.endsWith('.js'));
    const middlewareFiles = fs.readdirSync(middlewaresPath).filter(file => file.endsWith('.js'));

    const middlewareMap = new Map();
    for (const file of middlewareFiles) {
        const middlewarePath = path.join(middlewaresPath, file);
        const middlewareModule = await import(`file://${middlewarePath}`);
        for (const key in middlewareModule) {
            middlewareMap.set(key, `./src/middlewares/${file}`);
        }
    }

    let imports = new Set();
    let routes = [];
    let middlewareImports = new Map();

    for (const file of controllerFiles) {
        const controllerName = path.basename(file, '.js');
        const controllerPath = path.join(controllersPath, file);
        const controllerModule = await import(`file://${controllerPath}?v=${Date.now()}`);

        const mainPrefix = controllerModule.mainPrefix || '';

        

        for (const methodName in controllerModule) {
            if (methodName === 'default' && typeof controllerModule.default === 'function') {
                const handlerName = `${controllerName}Default`;
                imports.add(`import ${handlerName} from './src/controllers/${file}';`);
                routes.push({
                    httpMethod: 'get',
                    routePath: '/',
                    handler: handlerName,
                    middlewares: []
                });
                continue;
            }


            if (typeof controllerModule[methodName] === 'function') {
                const httpMethod = extractHttpMethod(methodName, controllerModule.httpMethods);
                const routePrefix = extractRoutePrefix(methodName, controllerModule.routePrefixes);
                const routeParams = extractRouteParams(methodName, controllerModule.routeParams);
                const middlewares = extractMiddlewares(methodName, controllerModule.middlewares);

                const routePath = buildRoutePath(controllerName, methodName, routePrefix, mainPrefix, routeParams);
                const handlerName = `${controllerName}_${methodName}`;
                imports.add(`import { ${methodName} as ${handlerName} } from './src/controllers/${file}';`);

                

                let middlewareCalls = [];
                if (middlewares.length > 0) {
                    middlewares.forEach(mw => {
                        const mwName = mw.name;
                        if (mwName) {
                            middlewareCalls.push(mwName);
                            if (!middlewareImports.has(mwName)) {
                                const mwPath = middlewareMap.get(mwName);
                                if (mwPath) {
                                    middlewareImports.set(mwName, `import { ${mwName} } from '${mwPath}';`);
                                }
                            }
                        }
                    });
                }

                routes.push({
                    httpMethod: httpMethod.toLowerCase(),
                    routePath,
                    handler: handlerName,
                    middlewares: middlewareCalls
                });
            }
        }
    }

    let fileContent = "import { Router } from 'express';\n";
    fileContent += Array.from(imports).join('\n') + '\n';
    fileContent += Array.from(middlewareImports.values()).join('\n') + '\n';
    fileContent += "const router = Router();\n\n";

    routes.forEach(route => {
        const middlewareStr = route.middlewares.length > 0 ? `${route.middlewares.join(', ')}, ` : '';
        fileContent += `router.${route.httpMethod}('${route.routePath}', ${middlewareStr}${route.handler});\n`;
    });

    fileContent += "\nexport { router };\n";

    fs.writeFileSync(outputPath, fileContent);
    console.log('✅ export.routes.js generated successfully!');
}

function findInMetadata(methodName, metadataArray) {
    if (!Array.isArray(metadataArray)) {
        return undefined;
    }
    const entry = metadataArray.find(item => item[0] === methodName);
    return entry ? entry[1] : undefined;
}

function buildRoutePath(controllerName, methodName, routePrefix, mainPrefix, routeParams) {
    if (controllerName === 'index') return '/';

    let finalControllerName = controllerName;

    if (mainPrefix && !routePrefix) {
        finalControllerName = `${mainPrefix}${controllerName}`;
    }

    if (routePrefix && !mainPrefix) {
        finalControllerName = `${routePrefix}${controllerName}`;
    }

    if (routePrefix && mainPrefix) {
        finalControllerName = `${mainPrefix}${routePrefix}${controllerName}`;
    }

    let routePath;
    if (methodName === 'index') {
        routePath = `/${config.globalRoutePrefix}${finalControllerName}${config.routeSufix}`;
    } else {
        routePath = `/${config.globalRoutePrefix}${finalControllerName}/${methodName}${config.routeSufix}`;
    }

    if (routeParams.length > 0) {
        const paramsString = routeParams.map(param => `:${param}`).join('/');
        if (methodName === 'index') {
            routePath = `/${config.globalRoutePrefix}${finalControllerName}${config.routeSufix}/${paramsString}`;
        } else {
            routePath = `/${config.globalRoutePrefix}${finalControllerName}/${methodName}${config.routeSufix}/${paramsString}`;
        }
    }

    return routePath;
}

function extractHttpMethod(methodName, httpMethods) {
    const method = findInMetadata(methodName, httpMethods);
    if (method) return method;

    const methodLower = methodName.toLowerCase();
    if (methodLower.includes('create') || methodLower.includes('store') || methodLower.startsWith('post')) {
        return 'POST';
    } else if (methodLower.includes('update') || methodLower.includes('edit') || methodLower.startsWith('put')) {
        return 'PUT';
    } else if (methodLower.includes('delete') || methodLower.includes('remove') || methodLower.startsWith('delete')) {
        return 'DELETE';
    } else if (methodLower.includes('patch') || methodLower.startsWith('patch')) {
        return 'PATCH';
    } else {
        return 'GET';
    }
}

function extractRoutePrefix(methodName, routePrefixes) {
    return findInMetadata(methodName, routePrefixes) || '';
}

function extractRouteParams(methodName, routeParams) {
    return findInMetadata(methodName, routeParams) || [];
}

function extractMiddlewares(methodName, middlewares) {
    return findInMetadata(methodName, middlewares) || [];
}

generateRoutesFile().catch(console.error);