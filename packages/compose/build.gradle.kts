plugins {
    kotlin("multiplatform") version "2.0.0"
}

group = "com.example"
version = "1.0.0"

kotlin {
    jvm()
    sourceSets {
        commonMain.dependencies {}
    }
}
