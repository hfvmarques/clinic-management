test('must know main jest asserts', () => {
  let number = null;
  expect(number).toBeNull();

  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

test('must know how to work with objects', () => {
  const obj = {
    name: 'John',
    age: 30,
    isMarried: false,
  };

  expect(obj).toMatchObject({ name: 'John' });
  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('age', 30);
  expect(obj.isMarried).toBe(false);

  const obj2 = {
    name: 'John',
    age: 30,
    isMarried: false,
  };

  expect(obj).not.toBe(obj2);
  expect(obj).toEqual(obj2);
});
