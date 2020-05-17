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
    mode: 'replay',
    persister: 'fs',
    adapters: ['node-http'],
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '../recordings')
      }
    },
    matchRequestsBy: {
      headers(headers:Record<string, string>) {
        // `host` is unstable since the port changes between every run
        // probably configurable with Selenium to make it stable?
        delete headers.host;
        
        return headers;
      },
      url: {
        // same reason as above
        port: false,
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

    it('should search for hello at localhost', async () => {
        let Url:string = 'http://localhost:3000';
        await driver.get(Url);
        let p = await driver.findElement(By.id('naga'));
        console.log(p);
        let value = await  p.getText();
        value.should.equal('Hello From Express');
    });
});