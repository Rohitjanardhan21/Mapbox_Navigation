const {
  withGradleProperties,
  withAppBuildGradle,
} = require("@expo/config-plugins");

/**
 * Expo config plugin to ensure the generated android Gradle files use a pinned Kotlin version
 * and explicit Android Gradle plugin classpath. This makes `npx expo prebuild` reproducible
 * across machines without manual edits to the generated `android/` directory.
 */
module.exports = function withKotlinFix(config) {
  // Ensure gradle.properties has android.kotlinVersion set
  config = withGradleProperties(config, (cfg) => {
    const props = cfg.modResults || [];
    const existing = props.find(
      (p) => p.type === "property" && p.key === "android.kotlinVersion"
    );
    if (existing) {
      existing.value = "1.9.25";
    } else {
      props.push({
        type: "property",
        key: "android.kotlinVersion",
        value: "1.9.25",
      });
    }
    cfg.modResults = props;
    return cfg;
  });

  // Patch top-level build.gradle to use explicit plugin classpath versions and the kotlinVersion variable
  config = withAppBuildGradle(config, (cfg) => {
    let contents = cfg.modResults.contents;

    // Replace com.android.tools.build:gradle entry to use a stable version
    contents = contents.replace(
      /classpath\(['"]com.android.tools.build:gradle[^'")]*['"]\)/,
      'classpath("com.android.tools.build:gradle:8.6.0")'
    );

    // Replace kotlin-gradle-plugin entry to reference the kotlinVersion property
    contents = contents.replace(
      /classpath\(['"]org.jetbrains.kotlin:kotlin-gradle-plugin[^'"\)]*['"]\)/,
      'classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")'
    );

    cfg.modResults.contents = contents;
    return cfg;
  });

  return config;
};
