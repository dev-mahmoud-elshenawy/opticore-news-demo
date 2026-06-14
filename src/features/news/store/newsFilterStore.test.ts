import { useNewsFilterStore } from './newsFilterStore';

describe('newsFilterStore', () => {
  beforeEach(() => useNewsFilterStore.getState().reset());

  it('defaults to the "general" category', () => {
    expect(useNewsFilterStore.getState().category).toBe('general');
  });

  it('updates the selected category', () => {
    useNewsFilterStore.getState().setCategory('sports');
    expect(useNewsFilterStore.getState().category).toBe('sports');
  });

  it('reset returns to the default category', () => {
    useNewsFilterStore.getState().setCategory('health');
    useNewsFilterStore.getState().reset();
    expect(useNewsFilterStore.getState().category).toBe('general');
  });
});
