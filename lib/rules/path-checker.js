'use strict';

const path = require('path');

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'feature sliced relative path checker',
			category: 'Fill me in',
			recommended: false,
			url: null,
		},
		fixable: null,
		messages: {
			pathCheckerMessageId: 'Пути в рамках одного слайса должны быть относительными',
		},
		schema: [
			{
				type: 'object',
				properties: {
					alias: {
						type: 'string',
					},
				},
			},
		],
	},

	create(context) {
		const alias = context.options[0]?.alias || '';
		return {
			ImportDeclaration(node) {
				const value = node.source.value;
				const importTo = alias ? value.replace(`${alias}/`, '') : value;

				const importFrom = context.getFilename();

				if (shouldBeRelative(importFrom, importTo)) {
					context.report({
						node: node,
						messageId: 'pathCheckerMessageId',
					});
				}
			},
		};
	},
};

function isPathRelative(path) {
	return path === '.' || path.startsWith('./') || path.startsWith('../');
}

const layers = {
	entities: 'entities',
	features: 'features',
	shared: 'shared',
	pages: 'pages',
	widgets: 'widgets',
};

function shouldBeRelative(from, to) {
	if (isPathRelative(to)) {
		return false;
	}

	// example entities/Article
	const toArray = to.split('/');
	const toLayer = toArray[0]; // entities
	const toSlice = toArray[1]; // Article

	if (!toLayer || !toSlice || !layers[toLayer]) {
		return false;
	}

	const normalizedPath = path.toNamespacedPath(from);
	const projectFrom = normalizedPath.split('src')[1];
	const fromArray = projectFrom.split('\\');

	const fromLayer = fromArray[1];
	const fromSlice = fromArray[2];

	if (!fromLayer || !fromSlice || !layers[fromLayer]) {
		return false;
	}

	return fromSlice === toSlice && toLayer === fromLayer;
}
