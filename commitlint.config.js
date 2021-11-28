module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Scope can never be empty.
    'scope-empty': [2, 'never'],
    // Subject and type are required alongside scope.
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
};
