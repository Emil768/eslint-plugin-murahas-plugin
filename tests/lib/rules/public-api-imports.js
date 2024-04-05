/**
 * @fileoverview control public api imports
 * @author public-api imports
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/public-api-imports'),
	RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const aliasOptions = [
	{
		alias: '@',
	},
];

const ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run('public-api-imports', rule, {
	valid: [
		{
			code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
			errors: [],
		},
		{
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
			errors: [],
			options: aliasOptions,
		},
	],

	invalid: [
		{
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
			errors: [{ message: 'Пути должны импортироваться из publick API' }],
			options: aliasOptions,
		},
	],
});
