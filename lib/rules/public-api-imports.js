/**
 * @fileoverview control public api imports
 * @author public-api imports
 */
'use strict';

const { isPathRelative } = require('../../helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
	meta: {
		type: null,
		docs: {
			description: 'control public api imports',
			recommended: false,
			url: null,
		},
		fixable: 'code',
		messages: {
			publicPathMessageId: 'Пути должны импортироваться из publick API',
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
		const checkingLayers = {
			entities: 'entities',
			features: 'features',
			pages: 'pages',
			widgets: 'widgets',
		};

		const alias = context.options[0]?.alias || '';
		return {
			ImportDeclaration(node) {
				const value = node.source.value;
				const importTo = alias ? value.replace(`${alias}/`, '') : value;

				const segments = importTo.split('/');

				const layer = segments[0];
				const slice = segments[1];

				if (isPathRelative(importTo)) {
					return;
				}

				if (!checkingLayers[layer]) {
					return;
				}

				if (segments.length > 2) {
					context.report({
						node: node,
						messageId: 'publicPathMessageId',
						fix: function (fixed) {
							return fixed.replaceText(node.source, `'${alias}/${layer}/${slice}'`);
						},
					});
				}
			},
		};
	},
};
