# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.5.3] - 2026-06-05
- feat: Forward additional fields to PIS Connect meta payload (`psu_phone_prefix`, `custom` for reconciliation data, `target_env`)
- feat: Support flat `customer_address_*` fields in PIS Connect config (auto-assembled into `meta.psu_address` when nested `customer_address` is not provided)
- chore: Expand `IPisSetup` and `IMeta` interfaces to declare newly typed optional fields (including pre-existing `expiry` which was forwarded at runtime but missing from `IPisSetup`)
- chore: Switch CHANGELOG version headings to H2 per Keep-a-Changelog
- test: Add offline unit tests for `Connect._buildPaymentPayload` covering existing and new opt-in fields

## [2.5.2] - 2026-05-06
- feat: Add support for `external_reference` field in PIS Connect payload

## [2.5.1] - 2025-11-07
- Internal fix

## [2.5.0] - 2024-11-12
- feat: Add support for payment_methods to Connect API

## [2.4.0] - 2024-02-02
- update dependencies
- switch from TSLint to ESLint
- prettier formatting
- fix type error on amount field on README.md
