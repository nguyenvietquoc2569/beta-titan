/* eslint-disable */
export default {
  displayName: 'ledger-frontend-edu-course',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../../coverage/libs/ledger/frontend/edu/course',
};
