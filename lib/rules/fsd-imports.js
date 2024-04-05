/**
 * @fileoverview fsd eslintt rule
 * @author fsd-imports
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */

const micromatch = require('micromatch');

const path = require('path');

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'fsd eslintt rule',
			recommended: false,
			url: null,
		},
		fixable: null,
		schema: [
			{
				type: 'object',
				properties: {
					alias: {
						type: 'string',
					},
					ignoreImportPatterns: {
						type: 'array',
					},
				},
			},
		],
	},

	create(context) {
		const layers = {
			app: ['pages', 'widgets', 'features', 'shared', 'entities'],
			pages: ['widgets', 'features', 'shared', 'entities'],
			widgets: ['features', 'shared', 'entities'],
			features: ['shared', 'entities'],
			entities: ['shared', 'entities'],
			shared: ['shared'],
		};

		const availableLayers = {
			app: 'app',
			entities: 'entities',
			features: 'features',
			shared: 'shared',
			pages: 'pages',
			widgets: 'widgets',
		};

		const { alias = '', ignoreImportPatterns = [] } = context.options[0] ?? {};

		const getCurrentFileLayer = () => {
			const currentFilePath = context.getFilename();

			const normalizedPath = path.toNamespacedPath(currentFilePath);
			const projectPath = normalizedPath?.split('src')[1];
			const segments = projectPath?.split('\\');

			return segments?.[1];
		};

		const getImportLayer = (value) => {
			const importPath = alias ? value.replace(`${alias}/`, '') : value;
			const segments = importPath?.split('/');

			return segments?.[0];
		};

		function isPathRelative(path) {
			return path === '.' || path.startsWith('./') || path.startsWith('../');
		}

		return {
			ImportDeclaration(node) {
				const importPath = node.source.value;
				const currentFileLayer = getCurrentFileLayer();
				const importLayer = getImportLayer(importPath);

				if (isPathRelative(importPath)) {
					return;
				}

				if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
					return;
				}

				const isIgnored = ignoreImportPatterns.some((pattern) => {
					return micromatch.isMatch(importPath, pattern);
				});

				if (isIgnored) {
					return;
				}

				if (!layers[currentFileLayer]?.includes(importLayer)) {
					context.report(
						node,
						'Слой может импортировать в себя только нижележащие слои ( app, pages, widgets, features, entities, shared )',
					);
				}
			},
		};
	},
};
