import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Text } from 'react-native';

const ExampleComponent = () => <Text>Hello Tests!</Text>;

describe('ExampleComponent', () => {
  it('renders correctly', () => {
    const tree = TestRenderer.create(<ExampleComponent />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
