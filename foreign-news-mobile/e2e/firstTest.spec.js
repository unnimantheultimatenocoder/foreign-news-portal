describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show home screen', async () => {
    await expect(element(by.id('homeScreen'))).toBeVisible();
  });

  it('should show news items', async () => {
    await expect(element(by.id('newsList'))).toBeVisible();
    await expect(element(by.id('newsItem-0'))).toBeVisible();
  });
});
