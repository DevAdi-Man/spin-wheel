# Deployment & CI/CD 🚀

## 📦 Overview

React Native apps ko production mein deploy karna ek complex process hai. Is tutorial mein aap seekhenge ki apps kaise build karte hain, app stores mein kaise publish karte hain, aur CI/CD pipelines kaise setup karte hain.

## 🎯 What You'll Learn

- Expo EAS Build configuration
- App Store and Play Store deployment
- CodePush for over-the-air updates
- Fastlane automation
- GitHub Actions CI/CD
- Environment management
- Release management strategies
- App signing and security

## 📚 Core Concepts

### 1. **Expo EAS Build**
```json
// eas.json
{
  "cli": {
    "version": ">= 2.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### 2. **Environment Configuration**
```javascript
// config/environment.js
const ENV = {
  development: {
    API_URL: 'http://localhost:3000/api',
    ANALYTICS_KEY: 'dev-analytics-key',
    SENTRY_DSN: 'dev-sentry-dsn',
    CODEPUSH_KEY: 'dev-codepush-key',
  },
  staging: {
    API_URL: 'https://staging-api.example.com/api',
    ANALYTICS_KEY: 'staging-analytics-key',
    SENTRY_DSN: 'staging-sentry-dsn',
    CODEPUSH_KEY: 'staging-codepush-key',
  },
  production: {
    API_URL: 'https://api.example.com/api',
    ANALYTICS_KEY: 'prod-analytics-key',
    SENTRY_DSN: 'prod-sentry-dsn',
    CODEPUSH_KEY: 'prod-codepush-key',
  },
};

const getEnvironment = () => {
  if (__DEV__) return ENV.development;
  
  // You can use build variants or environment variables
  const buildType = process.env.BUILD_TYPE || 'production';
  return ENV[buildType] || ENV.production;
};

export default getEnvironment();

// Usage in app
import config from './config/environment';

const apiCall = async () => {
  const response = await fetch(`${config.API_URL}/users`);
  return response.json();
};
```

### 3. **CodePush Integration**
```jsx
import CodePush from 'react-native-code-push';
import { Alert } from 'react-native';

const CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: {
    title: 'Update Available',
    mandatoryUpdateMessage: 'An update is required to continue.',
    mandatoryContinueButtonLabel: 'Update',
    optionalUpdateMessage: 'An update is available. Would you like to install it?',
    optionalInstallButtonLabel: 'Install',
    optionalIgnoreButtonLabel: 'Later',
  },
};

class App extends Component {
  componentDidMount() {
    this.checkForUpdates();
  }

  checkForUpdates = () => {
    CodePush.checkForUpdate().then((update) => {
      if (update) {
        Alert.alert(
          'Update Available',
          'A new version is available. Would you like to update?',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Update', onPress: this.downloadUpdate },
          ]
        );
      }
    });
  };

  downloadUpdate = () => {
    CodePush.sync(
      {
        updateDialog: true,
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      (status) => {
        switch (status) {
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            console.log('Downloading update...');
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            console.log('Installing update...');
            break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            console.log('Update installed successfully');
            break;
        }
      }
    );
  };

  render() {
    return <YourAppComponent />;
  }
}

export default CodePush(CodePushOptions)(App);
```

## 🛠️ Essential Tools

### **Build & Deployment**
```bash
# Expo EAS
npm install -g @expo/eas-cli
eas login
eas build:configure

# CodePush
npm install -g appcenter-cli
npm install react-native-code-push

# Fastlane
gem install fastlane
```

### **CI/CD Tools**
```bash
# GitHub Actions (built-in)
# Bitrise CLI
npm install -g @bitrise/cli

# CircleCI CLI
curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/master/install.sh | bash
```

## 💻 Practical Examples

### **Example 1: GitHub Actions CI/CD** ⭐⭐⭐
```yaml
# .github/workflows/build-and-deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage --watchAll=false
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  build-ios:
    needs: test
    runs-on: macos-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build iOS app
        run: eas build --platform ios --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Submit to App Store
        run: eas submit --platform ios --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          EXPO_APPLE_ID: ${{ secrets.EXPO_APPLE_ID }}
          EXPO_APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.EXPO_APPLE_APP_SPECIFIC_PASSWORD }}

  build-android:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Android app
        run: eas build --platform android --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Submit to Play Store
        run: eas submit --platform android --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          GOOGLE_SERVICE_ACCOUNT_KEY: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_KEY }}

  deploy-codepush:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Deploy CodePush update
        run: |
          appcenter codepush release-react -a YourOrg/YourApp-iOS -d Staging
          appcenter codepush release-react -a YourOrg/YourApp-Android -d Staging
        env:
          APPCENTER_ACCESS_TOKEN: ${{ secrets.APPCENTER_ACCESS_TOKEN }}
```

### **Example 2: Fastlane Configuration** ⭐⭐⭐⭐
```ruby
# ios/fastlane/Fastfile
default_platform(:ios)

platform :ios do
  before_all do
    setup_circle_ci
  end

  desc "Build and upload to TestFlight"
  lane :beta do
    # Increment build number
    increment_build_number(xcodeproj: "YourApp.xcodeproj")
    
    # Build the app
    build_app(
      scheme: "YourApp",
      export_method: "app-store",
      output_directory: "./build",
      output_name: "YourApp.ipa"
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      skip_submission: true
    )
    
    # Send notification
    slack(
      message: "Successfully uploaded new build to TestFlight! 🚀",
      channel: "#mobile-releases"
    )
  end

  desc "Deploy to App Store"
  lane :release do
    # Capture screenshots
    capture_screenshots
    
    # Build the app
    build_app(
      scheme: "YourApp",
      export_method: "app-store"
    )
    
    # Upload to App Store
    upload_to_app_store(
      submit_for_review: true,
      automatic_release: false,
      force: true,
      submission_information: {
        add_id_info_uses_idfa: false,
        add_id_info_serves_ads: false,
        add_id_info_tracks_install: false,
        add_id_info_tracks_action: false,
        add_id_info_limits_tracking: false
      }
    )
    
    # Create GitHub release
    github_release = set_github_release(
      repository_name: "YourOrg/YourApp",
      api_token: ENV["GITHUB_TOKEN"],
      name: "v#{get_version_number}",
      tag_name: "v#{get_version_number}",
      description: "Release notes here",
      commitish: "main"
    )
  end

  error do |lane, exception|
    slack(
      message: "Build failed in lane #{lane}: #{exception.message}",
      success: false,
      channel: "#mobile-releases"
    )
  end
end

# android/fastlane/Fastfile
default_platform(:android)

platform :android do
  desc "Build and upload to Play Store Internal Testing"
  lane :beta do
    # Build the app
    gradle(
      task: "bundle",
      build_type: "Release",
      project_dir: "android/"
    )
    
    # Upload to Play Store
    upload_to_play_store(
      track: "internal",
      aab: "android/app/build/outputs/bundle/release/app-release.aab",
      skip_upload_apk: true,
      skip_upload_metadata: true,
      skip_upload_changelogs: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )
  end

  desc "Deploy to Play Store"
  lane :release do
    # Build the app
    gradle(
      task: "bundle",
      build_type: "Release",
      project_dir: "android/"
    )
    
    # Upload to Play Store
    upload_to_play_store(
      track: "production",
      aab: "android/app/build/outputs/bundle/release/app-release.aab",
      skip_upload_apk: true
    )
  end
end
```

### **Example 3: Release Management** ⭐⭐⭐⭐⭐
```javascript
// scripts/release.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ReleaseManager {
  constructor() {
    this.packagePath = path.join(__dirname, '../package.json');
    this.package = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
  }

  getCurrentVersion() {
    return this.package.version;
  }

  updateVersion(type = 'patch') {
    const currentVersion = this.getCurrentVersion();
    const versionParts = currentVersion.split('.').map(Number);
    
    switch (type) {
      case 'major':
        versionParts[0]++;
        versionParts[1] = 0;
        versionParts[2] = 0;
        break;
      case 'minor':
        versionParts[1]++;
        versionParts[2] = 0;
        break;
      case 'patch':
      default:
        versionParts[2]++;
        break;
    }
    
    const newVersion = versionParts.join('.');
    this.package.version = newVersion;
    
    fs.writeFileSync(this.packagePath, JSON.stringify(this.package, null, 2));
    
    return newVersion;
  }

  updateNativeVersions(version) {
    // Update iOS version
    const iosInfoPlistPath = path.join(__dirname, '../ios/YourApp/Info.plist');
    if (fs.existsSync(iosInfoPlistPath)) {
      let iosContent = fs.readFileSync(iosInfoPlistPath, 'utf8');
      iosContent = iosContent.replace(
        /<key>CFBundleShortVersionString<\/key>\s*<string>[\d.]+<\/string>/,
        `<key>CFBundleShortVersionString</key>\n\t<string>${version}</string>`
      );
      fs.writeFileSync(iosInfoPlistPath, iosContent);
    }

    // Update Android version
    const androidBuildGradlePath = path.join(__dirname, '../android/app/build.gradle');
    if (fs.existsSync(androidBuildGradlePath)) {
      let androidContent = fs.readFileSync(androidBuildGradlePath, 'utf8');
      androidContent = androidContent.replace(
        /versionName\s+"[\d.]+"/,
        `versionName "${version}"`
      );
      
      // Increment version code
      const versionCodeMatch = androidContent.match(/versionCode\s+(\d+)/);
      if (versionCodeMatch) {
        const currentVersionCode = parseInt(versionCodeMatch[1]);
        androidContent = androidContent.replace(
          /versionCode\s+\d+/,
          `versionCode ${currentVersionCode + 1}`
        );
      }
      
      fs.writeFileSync(androidBuildGradlePath, androidContent);
    }
  }

  generateChangelog() {
    try {
      const changelog = execSync('git log --oneline --since="1 week ago"', { encoding: 'utf8' });
      const changelogPath = path.join(__dirname, '../CHANGELOG.md');
      const currentDate = new Date().toISOString().split('T')[0];
      const version = this.getCurrentVersion();
      
      let existingChangelog = '';
      if (fs.existsSync(changelogPath)) {
        existingChangelog = fs.readFileSync(changelogPath, 'utf8');
      }
      
      const newEntry = `## [${version}] - ${currentDate}\n\n${changelog}\n\n`;
      const updatedChangelog = newEntry + existingChangelog;
      
      fs.writeFileSync(changelogPath, updatedChangelog);
      
      return changelog;
    } catch (error) {
      console.error('Error generating changelog:', error);
      return '';
    }
  }

  createGitTag(version) {
    try {
      execSync(`git add .`);
      execSync(`git commit -m "Release version ${version}"`);
      execSync(`git tag -a v${version} -m "Release version ${version}"`);
      execSync(`git push origin main --tags`);
    } catch (error) {
      console.error('Error creating git tag:', error);
    }
  }

  deployCodePush(platform = 'both') {
    try {
      if (platform === 'both' || platform === 'ios') {
        execSync('appcenter codepush release-react -a YourOrg/YourApp-iOS -d Production');
      }
      
      if (platform === 'both' || platform === 'android') {
        execSync('appcenter codepush release-react -a YourOrg/YourApp-Android -d Production');
      }
      
      console.log('CodePush deployment successful!');
    } catch (error) {
      console.error('CodePush deployment failed:', error);
    }
  }

  async release(type = 'patch', options = {}) {
    console.log(`Starting ${type} release...`);
    
    // Update version
    const newVersion = this.updateVersion(type);
    console.log(`Updated version to ${newVersion}`);
    
    // Update native versions
    this.updateNativeVersions(newVersion);
    console.log('Updated native versions');
    
    // Generate changelog
    const changelog = this.generateChangelog();
    console.log('Generated changelog');
    
    // Create git tag
    if (options.createTag !== false) {
      this.createGitTag(newVersion);
      console.log('Created git tag');
    }
    
    // Deploy CodePush if requested
    if (options.codePush) {
      this.deployCodePush(options.platform);
    }
    
    console.log(`Release ${newVersion} completed successfully!`);
    return newVersion;
  }
}

// Usage
const releaseManager = new ReleaseManager();

// Command line interface
const args = process.argv.slice(2);
const releaseType = args[0] || 'patch';
const options = {
  createTag: !args.includes('--no-tag'),
  codePush: args.includes('--codepush'),
  platform: args.includes('--ios') ? 'ios' : args.includes('--android') ? 'android' : 'both',
};

releaseManager.release(releaseType, options);
```

## 🎯 Practice Exercises

### **Beginner Level** ⭐
1. **Basic Build Setup** - Configure EAS build for development
2. **Environment Variables** - Setup different environments

### **Intermediate Level** ⭐⭐⭐
3. **CI/CD Pipeline** - Setup GitHub Actions for automated testing
4. **CodePush Integration** - Implement over-the-air updates

### **Advanced Level** ⭐⭐⭐⭐
5. **Fastlane Automation** - Automate build and deployment process
6. **Release Management** - Create automated release scripts

### **Expert Level** ⭐⭐⭐⭐⭐
7. **Multi-Environment Deployment** - Setup staging and production pipelines
8. **Advanced Release Strategies** - Implement blue-green deployments

## 🔧 Configuration Files

### **App Store Connect**
```json
// app-store-connect.json
{
  "app_identifier": "com.yourcompany.yourapp",
  "apple_id": "1234567890",
  "team_id": "ABCD123456",
  "itc_team_id": "123456789"
}
```

### **Google Play Console**
```json
// google-play-console.json
{
  "package_name": "com.yourcompany.yourapp",
  "service_account_key": "./google-service-account.json",
  "track": "production"
}
```

## 📊 Release Strategies

### **Release Types**
1. **Patch Release** - Bug fixes and minor updates
2. **Minor Release** - New features, backward compatible
3. **Major Release** - Breaking changes, major features

### **Deployment Strategies**
1. **Blue-Green Deployment** - Zero downtime deployments
2. **Canary Releases** - Gradual rollout to users
3. **Feature Flags** - Control feature visibility

## 🔗 Resources

- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [CodePush Documentation](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)

Proper deployment aur CI/CD se aap professional-grade apps deliver kar sakte hain! 🚀✨
