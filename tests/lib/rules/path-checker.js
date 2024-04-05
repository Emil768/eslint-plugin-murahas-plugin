/**
 * @fileoverview fsd checker path
 * @author emil
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/path-checker'),
	RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester({
	parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run('path-checker', rule, {
	valid: [
		{
			filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\Article',
			code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
			errors: [],
		},
	],

	invalid: [
		{
			filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\Article',
			code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
			errors: [{ message: 'Пути в рамках одного слайса должны быть относительными' }],
			options: [
				{
					alias: '@',
				},
			],
		},
		{
			filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\Article',
			code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
			errors: [{ message: 'Пути в рамках одного слайса должны быть относительными' }],
		},
	],
});
