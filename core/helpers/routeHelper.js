
import config from '../../chinelo.config.js';

// Placeholders for prefixes that are not defined in chinelo.config.js
const mainPrefix = '/demo'; // Example, please replace with your actual prefix
const routePrefix = ''; // Example, please replace with your actual prefix

/**
 * Generates a complete route string.
 *
 * @param {string} controller - The controller name (e.g., 'user').
 * @param {string} action - The action name (e.g., 'ola').
 * @param {Object.<string, string>} [params] - Optional route parameters (e.g., { name: ':name', coisa: ':coisa' }).
 * @returns {string} The complete route string.
 */
function getRota(controller, action, params = {}) {
  const globalPrefix = config.globalRoutePrefix || '';
  const sufix = config.routeSufix || '';

  const paramString = Object.values(params).join('/');

  const route = [globalPrefix, mainPrefix, routePrefix, controller, action]
    .filter(Boolean) // Remove empty parts
    .join('/');

  return `/${route}${sufix}${paramString ? `/${paramString}` : ''}`;
}

export { getRota };
