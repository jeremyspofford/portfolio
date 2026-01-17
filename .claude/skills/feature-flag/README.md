# Feature Flag Skill

Safety-first feature scaffolding with infrastructure-as-code feature flags.

## Description

This skill guides the process of creating new features with proper feature flag protection. It ensures infrastructure is in place before any application logic is written, following a "safety first" approach.

## When to Use

- Creating new features that should be toggleable
- Adding experimental functionality
- Implementing features that need gradual rollout
- Building infrastructure that varies by environment

## Activation Triggers

- "Create a new feature for [description]"
- "Scaffold feature: [name]"
- "Add feature flag for [functionality]"
- "/feature [name]"

## Key Concepts

1. **Safety Layer** - Feature flags in infrastructure config
2. **CDK Implementation** - Conditional resource creation
3. **Application Handoff** - Environment variable configuration
4. **TDD Loop** - Red-Green-Verify development after scaffold

## Files

- `SKILL.md` - Complete feature flag scaffold guide
