#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class DesktopTestRunner {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Simple, direct paths - relative to current directory (apps/remixdesktop)
    this.sourceTestDir = 'test/tests/app';
    this.testDir = 'build-e2e/remixdesktop/test/tests/app';
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async checkBuildExists() {
    if (!fs.existsSync(this.testDir)) {
      this.log('\n❌ Build directory not found!', 'red');
      this.log('Please run: yarn build:e2e', 'yellow');
      this.log('This will compile TypeScript tests to JavaScript\n', 'cyan');
      return false;
    }
    return true;
  }

  getAvailableTests() {
    const tests = [];
    
    if (!fs.existsSync(this.sourceTestDir)) {
      this.log('❌ Source test directory not found!', 'red');
      return tests;
    }

    const files = fs.readdirSync(this.sourceTestDir)
      .filter(file => file.endsWith('.test.ts'))
      .sort();

    files.forEach((file, index) => {
      const testName = file.replace('.test.ts', '');
      const builtPath = path.join(this.testDir, file.replace('.ts', '.js'));
      const exists = fs.existsSync(builtPath);
    
      
      tests.push({
        index: index + 1,
        name: testName,
        file: file,
        builtPath: `build-e2e/remixdesktop/test/tests/app/${file.replace('.ts', '.js')}`, // Correct path for yarn command
        exists: exists
      });
    });

    return tests;
  }

  displayTestList(tests) {
    this.log('\n📋 Available Desktop Tests:', 'bright');
    this.log('=' .repeat(50), 'cyan');
    
    tests.forEach(test => {
      const status = test.exists ? '✅' : '❌';
      const statusText = test.exists ? 'Built' : 'Not built';
      this.log(`${test.index.toString().padStart(2)}. ${test.name.padEnd(25)} ${status} ${statusText}`, 
               test.exists ? 'green' : 'red');
    });
    
    this.log('\n💡 Commands available:', 'bright');
    this.log('  [number] - Run specific test', 'cyan');
    this.log('  all      - Run all built tests', 'cyan');
    this.log('  build    - Run yarn build:e2e', 'cyan');
    this.log('  env      - Check environment variables', 'cyan');
    this.log('  refresh  - Refresh test list', 'cyan');
    this.log('  quit     - Exit', 'cyan');
    this.log('');
  }

  checkEnvironment() {
    this.log('\n🔍 Environment Variables Check:', 'bright');
    this.log('=' .repeat(40), 'cyan');
    
    const dgitToken = process.env.DGIT_TOKEN;
    if (dgitToken) {
      this.log(`✅ DGIT_TOKEN: Set (${dgitToken.substring(0, 4)}...)`, 'green');
    } else {
      this.log('❌ DGIT_TOKEN: Not set', 'red');
      this.log('   Required for GitHub tests', 'yellow');
      this.log('   Set with: export DGIT_TOKEN=your_github_token', 'cyan');
    }
    
    this.log('');
  }

  async runTest(testPath) {
    // Check if this is a GitHub test and DGIT_TOKEN is required
    if (testPath.includes('github') && !process.env.DGIT_TOKEN) {
      this.log('\n⚠️  WARNING: DGIT_TOKEN environment variable not set!', 'yellow');
      this.log('GitHub tests require a valid GitHub token.', 'yellow');
      this.log('Set it with: export DGIT_TOKEN=your_github_token\n', 'cyan');
    }

    this.log(`\n� Building tests first...`, 'yellow');
    
    // First build the tests
    const buildCode = await this.buildTests();
    if (buildCode !== 0) {
      this.log('❌ Build failed, cannot run test', 'red');
      return buildCode;
    }

    this.log(`\n�🚀 Running test: ${testPath}`, 'yellow');
    this.log('Command: yarn test --test ' + testPath, 'cyan');
    this.log('-'.repeat(60), 'cyan');

    return new Promise((resolve) => {
      const child = spawn('yarn', ['test', '--test', testPath], {
        stdio: 'inherit',
        env: process.env
      });

      child.on('close', (code) => {
        this.log('\n' + '-'.repeat(60), 'cyan');
        if (code === 0) {
          this.log('✅ Test completed successfully!', 'green');
        } else {
          this.log(`❌ Test failed with exit code: ${code}`, 'red');
        }
        this.log('');
        resolve(code);
      });

      child.on('error', (error) => {
        this.log(`❌ Error running test: ${error.message}`, 'red');
        resolve(1);
      });
    });
  }

  async runAllTests(tests) {
    const builtTests = tests.filter(test => test.exists);
    
    if (builtTests.length === 0) {
      this.log('❌ No built tests found!', 'red');
      return;
    }

    this.log(`\n🚀 Running ${builtTests.length} tests...`, 'yellow');
    
    for (const test of builtTests) {
      await this.runTest(test.builtPath);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.log('🎉 All tests completed!', 'green');
  }

  async buildTests() {
    this.log('\n🔨 Building tests with yarn build:e2e...', 'yellow');
    
    return new Promise((resolve) => {
      const child = spawn('yarn', ['build:e2e'], {
        stdio: 'inherit',
        env: process.env
      });

      child.on('close', (code) => {
        if (code === 0) {
          this.log('✅ Build completed successfully!', 'green');
        } else {
          this.log(`❌ Build failed with exit code: ${code}`, 'red');
        }
        resolve(code);
      });
    });
  }

  async promptUser() {
    return new Promise((resolve) => {
      this.rl.question('Enter command: ', (answer) => {
        resolve(answer.trim().toLowerCase());
      });
    });
  }

  async run() {
    this.log('🧪 Forge Desktop Test Runner', 'bright');
    this.log('Welcome to the interactive test runner!', 'cyan');

    while (true) {
      const buildExists = await this.checkBuildExists();
      const tests = this.getAvailableTests();
      
      this.displayTestList(tests);
      
      if (!buildExists) {
        this.log('⚠️  Build required before running tests', 'yellow');
      }

      const userInput = await this.promptUser();

      if (userInput === 'quit' || userInput === 'q' || userInput === 'exit') {
        this.log('👋 Goodbye!', 'cyan');
        break;
      }

      if (userInput === 'build' || userInput === 'b') {
        await this.buildTests();
        continue;
      }

      if (userInput === 'env' || userInput === 'e') {
        this.checkEnvironment();
        continue;
      }

      if (userInput === 'refresh' || userInput === 'r') {
        this.log('🔄 Refreshing...', 'yellow');
        continue;
      }

      if (userInput === 'all' || userInput === 'a') {
        if (!buildExists) {
          this.log('❌ Please build tests first with "build" command', 'red');
          continue;
        }
        await this.runAllTests(tests);
        continue;
      }

      // Check if input is a number
      const testIndex = parseInt(userInput);
      if (!isNaN(testIndex) && testIndex >= 1 && testIndex <= tests.length) {
        const selectedTest = tests[testIndex - 1];
        
        if (!selectedTest.exists) {
          this.log('❌ Test not built yet. Run "build" first.', 'red');
          continue;
        }
        
        await this.runTest(selectedTest.builtPath);
        continue;
      }

      this.log('❌ Invalid command. Try a number, "all", "build", "refresh", or "quit"', 'red');
    }

    this.rl.close();
  }
}

// Run the test runner
if (require.main === module) {
  const runner = new DesktopTestRunner();
  runner.run().catch(console.error);
}

module.exports = DesktopTestRunner;