/** @type {Detox.DetoxConfig} */
// Native dirs are CNG output (gitignored) — Android instrumentation is wired by
// @config-plugins/detox during `expo prebuild`, so re-prebuild after cloning.
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/opticorenewsdemo.app',
      build:
        'xcodebuild -workspace ios/opticorenewsdemo.xcworkspace -scheme opticorenewsdemo -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      testBinaryPath:
        'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
      reversePorts: [8081],
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 17' },
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_9_Pro_XL' },
    },
  },
  configurations: {
    'ios.sim.debug': { device: 'simulator', app: 'ios.debug' },
    'android.emu.debug': { device: 'emulator', app: 'android.debug' },
  },
};
