import { getRota } from '../../core/helpers/routeHelper.js';

export function hello(req, res) {
    res.send('Hello from Example Controller!');
}

export function index(req, res) {
    res.send('This is the index function!');
}

export function greet(req, res) {
    const {name} = req.params;
    res.send(`Greetings, ${name}!`);
}

export async function showRoute(req, res) {
    const rota = await getRota('index', 'index');
    res.send(`This is the generated route: ${rota}`);
}

export async function showRouteWithParams(req, res) {
    const rota = await getRota('example', 'greet', ['jondoe']);
    res.send(`This is the generated route with params: ${rota}`);
}

export async function showNonExistentRoute(req, res) {
    const rota = await getRota('example', 'nonexistent');
    res.send(`This should be 'rota inexistente': ${rota}`);
}

export async function showRouteWithMismatchedParams(req, res) {
    const rota = await getRota('example', 'greet', ['jondoe', 'extra']); // 'greet' expects 1 param, providing 2
    res.send(`This should also be 'rota inexistente': ${rota}`);
}

export const httpMethods = [
    ['greet', 'GET'], // o metodo GET é opcional, pois ele será atribuido quando nada é atribuido como metodo
    ['showRoute', 'GET'],
    ['showRouteWithParams', 'GET'],
    ['showNonExistentRoute', 'GET'],
    ['showRouteWithMismatchedParams', 'GET']
];

export const routeParams = [
    ['greet', ['name']]
];

export const routePrefixes = [
    ['greet', 'custom/'] // Gera a rota /custom/example/greet/:name
];

