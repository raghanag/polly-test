import { WebDriver, Builder, Capabilities, By} from 'selenium-webdriver';
import { should } from 'chai';
should();
require('chromedriver');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');

const { Polly, setupMocha: setupPolly } = require('@pollyjs/core');
const FSPersister = require('@pollyjs/persister-fs');
const path = require('path');
Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);
describe('Selenium Demo Test Suite', () => {
  setupPolly({
    /* default configuration options */
    recordIfMissing: true,
    mode: 'record',
    persister: 'fs',
    adapters: ['node-http'],
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '../recordings')
      }
    }
  });
    let driver:WebDriver;
    // time out for test execution
    const TIMEOUT = 1200000;
    beforeEach(async () => {
      // initializing chrome driver
      driver = await new Builder()
          .withCapabilities(Capabilities.chrome())
          .build();
      await driver.manage().setTimeouts( { implicit: TIMEOUT, pageLoad: 
        TIMEOUT, script: TIMEOUT } );
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