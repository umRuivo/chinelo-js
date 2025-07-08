
import config from '../../chinelo.config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates a complete route string, automatically including parameters and substituting values.
 *
 * @param {string} controllerName - The controller name (e.g., 'user').
 * @param {string} methodName - The action name (e.g., 'ola').
 * @param {Array<string|number>} [paramValues] - Optional array of values to substitute for route parameters.
 * @returns {Promise<string>} The complete route string or 'rota inexistente'.
 */
async function getRota(controllerName, methodName, paramValues = []) {
  const controllerPath = path.join(__dirname, '../../src/controllers', `${controllerName}.js`);

  if (!fs.existsSync(controllerPath)) {
    return 'rota inexistente';
  }

  try {
    const controllerModule = await import(`file://${controllerPath}`);

    if (typeof controllerModule[methodName] !== 'function') {
        return 'rota inexistente';
    }

    const mainPrefix = controllerModule.mainPrefix || '';
    const routePrefix = findInMetadata(methodName, controllerModule.routePrefixes) || '';
    const routeParams = findInMetadata(methodName, controllerModule.routeParams) || [];

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
        let paramsString;
        if(paramValues.length > 0) {
            paramsString = paramValues.join('/');
        } else {
            paramsString = routeParams.map(param => `:${param}`).join('/');
        }
        
        if (methodName === 'index') {
            routePath = `/${config.globalRoutePrefix}${finalControllerName}${config.routeSufix}/${paramsString}`;
        } else {
            routePath = `/${config.globalRoutePrefix}${finalControllerName}/${methodName}${config.routeSufix}/${paramsString}`;
        }
    }

    return routePath.replace(/\/\//g, '/'); // Clean up double slashes

  } catch (error) {
    // This catch block might still be useful for other import-related errors.
    return 'rota inexistente';
  }
}

function findInMetadata(methodName, metadataArray) {
    if (!Array.isArray(metadataArray)) {
        return undefined;
    }
    const entry = metadataArray.find(item => item[0] === methodName);
    return entry ? entry[1] : undefined;
}

export { getRota };
