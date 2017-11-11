import { TestSet, TestRunner } from "alsatian";
import { TapBark } from "tap-bark";

const testSet = TestSet.create();

// Note that the extension _must_ be `.js` to match the compiled result.
testSet.addTestsFromFiles("./**/*.spec.js");

const testRunner = new TestRunner();

testRunner.outputStream
          // this will use alsatian's default output if you remove this
          // you'll get TAP or you can add your favourite TAP reporter in it's place
          .pipe(TapBark.create().getPipeable()) 
          // pipe to the console
          .pipe(process.stdout);

// run the test set
testRunner.run(testSet)
          // this will be called after all tests have been run
          .then(console.log)
          // this will be called if there was a problem
          .catch(console.error);