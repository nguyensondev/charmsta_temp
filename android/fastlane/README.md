fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android beta

```sh
[bundle exec] fastlane android beta
```

Submit a new Beta Build to Crashlytics Beta

### android buildReleaseAPK

```sh
[bundle exec] fastlane android buildReleaseAPK
```

Archive build Ad Hoc

### android slackNotify

```sh
[bundle exec] fastlane android slackNotify
```

Notifi SLack

### android Release_all

```sh
[bundle exec] fastlane android Release_all
```

abc

### android uploadFirebaseDev

```sh
[bundle exec] fastlane android uploadFirebaseDev
```

upload to Beta by FireBase

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
