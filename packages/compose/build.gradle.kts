plugins {
    kotlin("multiplatform") version "2.0.0"
}

group = "com.bongjava"
version = "1.0.1"

kotlin {
    jvm()
    sourceSets {
        commonMain.dependencies {}
    }
}
