// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "MyDesignSystem",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "MyDesignSystem", targets: ["MyDesignSystem"])
    ],
    targets: [
        .target(name: "MyDesignSystem")
    ]
)
