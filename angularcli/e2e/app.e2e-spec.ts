import { AngularcliPage } from './app.po';

describe('angularcli App', () => {
  let page: AngularcliPage;

  beforeEach(() => {
    page = new AngularcliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
