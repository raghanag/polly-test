import { WebDriver, Builder, Capabilities, By} from 'selenium-webdriver';
import { should } from 'chai';
should();
require('chromedriver');

describe('Selenium Demo Test Suite', () => {
    let driver:WebDriver;
    // time out for test execution
    
    beforeEach(async () => {
      // initializing chrome driver
      driver = await new Builder()
          .withCapabilities(Capabilities.chrome())
          .build();
      await driver.manage().window().maximize();
    });

    afterEach(async () => {
      await driver.quit();
    });

    it('should search for hello at google.com', async () => {
        let Url:string = 'http://www.google.com';
        await driver.get(Url);
        let searchBox = await driver.findElement(By.name('q'));
        await searchBox.sendKeys('hello');
        let value = await  searchBox.getAttribute('value');
        value.should.equal('hello');
    });
});