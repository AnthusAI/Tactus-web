---
title: Standard Library
description: Built-in Tactus modules for classification, extraction, generation, and more.
type: page
---
::band{size="hero" eyebrow="Standard Library"}
# Built-in Modules for Common Tasks

Tactus includes a standard library of reusable modules for classification, extraction, generation, and more. Each module is written in Tactus itself with comprehensive BDD specifications.

::band{tone="muted"}
## Available Modules

The standard library provides high-quality, tested implementations for common AI workflow tasks. Each module follows the same patterns and can be extended for custom use cases.

{{stdlib-modules}}

::band
## Design Philosophy

### Written in Tactus

The stdlib is dogfooding - it's written in Tactus itself. This ensures the language is expressive enough for real-world use and surfaces any pain points.

### BDD Specifications

Every module has comprehensive Gherkin specifications that serve as tests, documentation, and contract. If the specs pass, the module works correctly.

### Extensible Classes

All modules use a class hierarchy. Extend BaseClassifier, BaseExtractor, or BaseGenerator to create your own implementations with the same interface.

::band{columns="cta"}
## Want to contribute?

The standard library is open source. Improve existing modules or add new ones.

::button{href="https://github.com/AnthusAI/Tactus/tree/main/tactus/stdlib" label="View on GitHub" size="lg"}
