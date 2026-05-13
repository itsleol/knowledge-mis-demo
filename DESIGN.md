---
version: alpha
name: Knowledge Management MIS
description: Knowledge Management MIS presents itself as a calm, structured enterprise knowledge workspace. It combines a Notion-inspired document-centered workspace, Airtable-inspired structured data management, and a MongoDB-inspired green accent system. The interface is designed for a course demo of a management information system, covering knowledge submission, review, publishing, search, feedback, analytics, and role-based administration.

colors:
  primary: "#00684A"
  primary-hover: "#00533B"
  primary-pressed: "#00412E"
  primary-bright: "#00A35C"
  primary-soft: "#E3FCEF"
  primary-softer: "#F0FBF6"
  on-primary: "#FFFFFF"

  canvas: "#FAFAF7"
  surface: "#FFFFFF"
  surface-soft: "#F4F7F6"
  surface-muted: "#F6F5F2"
  surface-raised: "#FFFFFF"
  surface-selected: "#EEF8F2"

  hairline: "#E5E3DF"
  hairline-soft: "#EFEDE8"
  hairline-strong: "#CBC7C0"

  ink-deep: "#001E2B"
  ink: "#1F2933"
  charcoal: "#37352F"
  slate: "#5D6673"
  steel: "#787671"
  stone: "#A4A097"
  muted: "#B8B5AD"

  success: "#0E7C4F"
  success-soft: "#E3FCEF"
  warning: "#B7791F"
  warning-soft: "#FFF8E0"
  danger: "#B91C1C"
  danger-soft: "#FEE2E2"
  info: "#2563EB"
  info-soft: "#DBEAFE"

  tag-green: "#D9F3E1"
  tag-blue: "#DCEBFA"
  tag-yellow: "#FEF7D6"
  tag-orange: "#FFE8D4"
  tag-rose: "#FDE0EC"
  tag-lavender: "#E6E0F5"

typography:
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
  display-lg:
    fontFamily: "{typography.fontFamily}"
    fontSize: 32px
    fontWeight: 650
    lineHeight: 1.22
    letterSpacing: 0
  heading-1:
    fontFamily: "{typography.fontFamily}"
    fontSize: 28px
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: 0
  heading-2:
    fontFamily: "{typography.fontFamily}"
    fontSize: 22px
    fontWeight: 650
    lineHeight: 1.32
    letterSpacing: 0
  heading-3:
    fontFamily: "{typography.fontFamily}"
    fontSize: 18px
    fontWeight: 650
    lineHeight: 1.38
    letterSpacing: 0
  heading-4:
    fontFamily: "{typography.fontFamily}"
    fontSize: 16px
    fontWeight: 650
    lineHeight: 1.42
    letterSpacing: 0
  body-md:
    fontFamily: "{typography.fontFamily}"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: 0
  body-md-medium:
    fontFamily: "{typography.fontFamily}"
    fontSize: 15px
    fontWeight: 550
    lineHeight: 1.62
    letterSpacing: 0
  body-sm:
    fontFamily: "{typography.fontFamily}"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  body-sm-medium:
    fontFamily: "{typography.fontFamily}"
    fontSize: 14px
    fontWeight: 550
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontFamily: "{typography.fontFamily}"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.42
    letterSpacing: 0
  caption-bold:
    fontFamily: "{typography.fontFamily}"
    fontSize: 13px
    fontWeight: 650
    lineHeight: 1.42
    letterSpacing: 0
  micro:
    fontFamily: "{typography.fontFamily}"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0
  button-md:
    fontFamily: "{typography.fontFamily}"
    fontSize: 14px
    fontWeight: 650
    lineHeight: 1.30
    letterSpacing: 0
  table-cell:
    fontFamily: "{typography.fontFamily}"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  table-header:
    fontFamily: "{typography.fontFamily}"
    fontSize: 12px
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: 0.02em

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 20px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px

layout:
  sidebar-width: 248px
  topbar-height: 64px
  content-max: 1280px
  detail-max: 960px

shadows:
  flat: "none"
  card: "rgba(15, 15, 15, 0.04) 0px 1px 2px 0px"
  raised: "rgba(15, 15, 15, 0.08) 0px 4px 12px 0px"
  popover: "rgba(15, 15, 15, 0.12) 0px 8px 24px -4px"
  modal: "rgba(15, 15, 15, 0.16) 0px 16px 48px -8px"

components:
  app-shell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    minHeight: "100vh"
    layout: "grid"
    gridTemplateColumns: "{layout.sidebar-width} 1fr"
  sidebar:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.charcoal}"
    border: "0 1px 0 0 solid {colors.hairline}"
    width: "{layout.sidebar-width}"
    padding: "{spacing.lg} {spacing.md}"
  sidebar-item:
    backgroundColor: "transparent"
    textColor: "{colors.slate}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.md}"
    padding: "9px 10px"
    height: 38px
  sidebar-item-active:
    backgroundColor: "{colors.primary-softer}"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm-medium}"
    border: "1px solid {colors.primary-soft}"
  topbar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "0 0 1px 0 solid {colors.hairline}"
    height: "{layout.topbar-height}"
    padding: "0 {spacing.xl}"
  page-header:
    backgroundColor: "transparent"
    textColor: "{colors.ink-deep}"
    typography: "{typography.heading-1}"
    padding: "{spacing.xl} 0 {spacing.lg}"
  content-area:
    backgroundColor: "{colors.canvas}"
    maxWidth: "{layout.content-max}"
    padding: "{spacing.xl}"

  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    minHeight: 40px
    border: "1px solid {colors.primary}"
    shadow: "{shadows.flat}"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline-soft}"
    textColor: "{colors.stone}"
    border: "1px solid {colors.hairline}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    minHeight: 40px
    border: "1px solid {colors.hairline-strong}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.slate}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "9px 12px"
    minHeight: 38px
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "#FFFFFF"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    minHeight: 40px
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm-medium}"
    padding: "0"

  card-base:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
    shadow: "{shadows.card}"
  knowledge-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline}"
    shadow: "{shadows.card}"
  stat-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline}"
    shadow: "{shadows.card}"
  review-task-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.warning-soft}"
    shadow: "{shadows.card}"
  empty-state-card:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.steel}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px dashed {colors.hairline-strong}"
    shadow: "{shadows.flat}"
  metadata-card:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.slate}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline}"

  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "9px 12px"
    height: 40px
    border: "1px solid {colors.hairline-strong}"
  text-input-focused:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.primary}"
    shadow: "0 0 0 3px {colors.primary-soft}"
  textarea:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    minHeight: 132px
    border: "1px solid {colors.hairline-strong}"
  select-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "9px 12px"
    height: 40px
    border: "1px solid {colors.hairline-strong}"
  form-label:
    textColor: "{colors.charcoal}"
    typography: "{typography.caption-bold}"
    marginBottom: "{spacing.xs}"
  form-helper:
    textColor: "{colors.steel}"
    typography: "{typography.caption}"
  form-error:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  upload-dropzone:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.slate}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px dashed {colors.hairline-strong}"

  search-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm}"
    border: "1px solid {colors.hairline}"
    shadow: "{shadows.card}"
  filter-pill:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.slate}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "6px 10px"
    border: "1px solid {colors.hairline}"
  filter-pill-active:
    backgroundColor: "{colors.primary-softer}"
    textColor: "{colors.primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "6px 10px"
    border: "1px solid {colors.primary-soft}"
  segmented-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  segmented-tab-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    shadow: "{shadows.card}"

  data-table:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
    shadow: "{shadows.card}"
  table-header:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.steel}"
    typography: "{typography.table-header}"
    padding: "10px 12px"
    border: "0 0 1px 0 solid {colors.hairline}"
  table-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.table-cell}"
    minHeight: 46px
    border: "0 0 1px 0 solid {colors.hairline-soft}"
  table-row-hover:
    backgroundColor: "{colors.surface-soft}"
  table-cell:
    typography: "{typography.table-cell}"
    padding: "11px 12px"
  table-action-cell:
    typography: "{typography.body-sm-medium}"
    padding: "9px 12px"
    textAlign: "right"

  status-chip-draft:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.steel}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 9px"
  status-chip-pending:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 9px"
  status-chip-approved:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 9px"
  status-chip-rejected:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 9px"
  status-chip-archived:
    backgroundColor: "{colors.tag-lavender}"
    textColor: "{colors.slate}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 9px"

  role-chip-employee:
    backgroundColor: "{colors.tag-blue}"
    textColor: "{colors.info}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 9px"
  role-chip-knowledge-manager:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 9px"
  role-chip-system-admin:
    backgroundColor: "{colors.tag-orange}"
    textColor: "{colors.warning}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 9px"
  role-chip-decision-maker:
    backgroundColor: "{colors.tag-lavender}"
    textColor: "{colors.slate}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 9px"

  knowledge-editor:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
    maxWidth: "{layout.detail-max}"
  knowledge-title-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink-deep}"
    typography: "{typography.heading-1}"
    border: "0"
    padding: "0"
  knowledge-content-area:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    lineHeight: 1.72
    border: "0"
  metadata-panel:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.slate}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline}"
  version-timeline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.slate}"
    typography: "{typography.caption}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
  feedback-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline-soft}"
  similar-knowledge-card:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline}"

  dashboard-grid:
    display: "grid"
    gap: "{spacing.lg}"
    gridTemplateColumns: "repeat(12, minmax(0, 1fr))"
  dashboard-widget:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline}"
    shadow: "{shadows.card}"
  metric-number:
    textColor: "{colors.ink-deep}"
    typography: "{typography.display-lg}"
  ranking-list:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
  chart-container:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline-soft}"
---

# Overview

Knowledge Management MIS should feel like a real enterprise knowledge workspace: calm enough for long-form reading, structured enough for management workflows, and polished enough for a Management Information Systems course demo. The primary grammar is Notion-inspired: warm white canvas, document-centered pages, subtle borders, readable content, and quiet interaction states. Airtable contributes the structured database layer: filter bars, compact tables, status chips, metadata fields, and management pages. MongoDB contributes the technical accent: a restrained green system that signals document database credibility without turning the UI into a MongoDB brand imitation.

The interface is role-aware, document-centered, and dashboard-ready. Employees submit and maintain knowledge, department knowledge managers review their department's knowledge, system administrators manage users and operational settings, and decision makers read analytics. Every page should look like part of the same workspace rather than a generic admin template or a marketing landing page.

## Key Characteristics

- Warm off-white application canvas using `{colors.canvas}`.
- Fixed left `sidebar` and persistent `topbar`.
- Document-centered knowledge pages for reading, editing, attachments, comments, and review history.
- Structured tables for management tasks, inspired by Airtable but softened by Notion-like surfaces.
- Green primary accent using `{colors.primary}` for main actions, active navigation, success cues, and selected filters.
- Soft borders and low shadows; use `{colors.hairline}` before reaching for elevation.
- Status chips for workflow clarity across draft, pending, approved, rejected, and archived states.
- Role-aware navigation that makes permissions visible without overexplaining them.
- Demo-ready dashboard polish with restrained charts, ranking lists, and stat cards.

# Colors

Use `{colors.primary}` as the main action and selection color. It should appear on primary buttons, active sidebar items, selected filter pills, success-adjacent states, and small technical cues. Use `{colors.primary-hover}` and `{colors.primary-pressed}` for interactive states. `{colors.primary-soft}` and `{colors.primary-softer}` are preferred for active backgrounds and selected metadata chips.

The application canvas should stay warm and quiet. Use `{colors.canvas}` for the main app background, `{colors.surface}` for cards and panels, `{colors.surface-soft}` for grouped controls, and `{colors.surface-muted}` for sidebars, table headers, and secondary bands. Most page depth should come from `{colors.hairline}` and `{colors.hairline-soft}`, not from strong shadows.

Text hierarchy should be clear: `{colors.ink-deep}` for page titles and important numbers, `{colors.ink}` for body content, `{colors.charcoal}` for labels and headings, `{colors.slate}` for secondary metadata, and `{colors.steel}` or `{colors.stone}` for low-priority helper text.

Semantic colors must remain functional. Use `{colors.success}` for approved and completion states, `{colors.warning}` for pending review, `{colors.danger}` for rejected/error/destructive states, and `{colors.info}` for neutral system information. Tag colors such as `{colors.tag-blue}`, `{colors.tag-yellow}`, and `{colors.tag-lavender}` should support classification, not decoration.

Do not use green for large background surfaces. Do not overuse bright colors. Pastel tags should help users scan category and status information, not make the interface playful or noisy.

# Typography

Use the shared Chinese-English font stack in `{typography.fontFamily}`. The stack prioritizes Inter-like Latin readability and system Chinese fonts such as PingFang SC and Microsoft YaHei. This is important because the UI contains English role values, API-like terms, Chinese labels, and long Chinese knowledge content.

Headings should be application-scale, not marketing-scale. Use `{typography.heading-1}` for page titles, `{typography.heading-2}` for major panel titles, `{typography.heading-3}` for card groups, and `{typography.heading-4}` for compact sections. Avoid oversized hero typography.

Long knowledge content should use `{typography.body-md}` with generous line-height. Tables should use `{typography.table-cell}` and `{typography.table-header}` to maintain compact but readable row density. Buttons use `{typography.button-md}`; status chips and role chips use `{typography.micro}`.

# Layout

The `app-shell` is a persistent workspace frame with a fixed-width `sidebar`, a `topbar`, and a scrollable `content-area`. The default desktop shell uses `{layout.sidebar-width}` and `{layout.topbar-height}`. The main content should be constrained to `{layout.content-max}` for dashboard and table pages, while reading and editing views should prefer `{layout.detail-max}` for better long-form readability.

The `sidebar` contains role-aware navigation items. It should be calm and workspace-like, using `{colors.surface-muted}` rather than a heavy dark navigation treatment. The active item uses `{components.sidebar-item-active}` with green text and a soft green surface.

The `topbar` holds user identity, role, department, and logout. It should not compete with page content. It uses `{colors.surface}`, a bottom `{colors.hairline}` border, and compact typography.

The `page-header` should include a clear title, one sentence of context, and optional actions aligned to the right. Avoid hero banners. Pages should start with work, not marketing copy.

Dashboard pages use `dashboard-grid`, `stat-card`, `dashboard-widget`, `ranking-list`, and `chart-container`. Management pages use `search-filter-bar` followed by `data-table`. Knowledge detail pages use a document-first layout: main content first, metadata and review information nearby, feedback and similar knowledge below. Editor pages use `knowledge-editor` plus `metadata-panel`, keeping the writing surface prominent.

# Elevation & Depth

Most surfaces should use a 1px border and `{shadows.card}` at most. `{shadows.raised}` is reserved for hover cards, sticky panels, or active draggable-like surfaces. `{shadows.popover}` belongs to dropdowns, command menus, and preview panels. `{shadows.modal}` belongs only to modal dialogs and attachment previews.

Avoid heavy SaaS landing-page depth, dramatic floating panels, large dark backgrounds, and layered decorative cards. This system should feel like an operating workspace for real knowledge records.

# Shapes

Buttons use `{rounded.md}`. Cards use `{rounded.lg}` or `{rounded.xl}` depending on size. Inputs use `{rounded.md}`. Status chips, role chips, and compact filters use `{rounded.full}`. Table containers use `{rounded.lg}` while rows remain rectangular for grid clarity.

Do not make every button pill-shaped. Reserve full pills for chips and compact filter tokens. Avoid excessive rounding that makes the system look playful rather than professional.

# Components

## Navigation

Use `app-shell`, `sidebar`, `sidebar-item`, `sidebar-item-active`, `topbar`, `page-header`, and `content-area` consistently. Navigation should expose the user's role permissions by showing only relevant items. Do not add explanatory in-app text about permissions unless it resolves a real workflow ambiguity.

## Buttons

`button-primary` is for committing important actions: login, submit review, publish, save, and search. `button-secondary` is for neutral alternatives. `button-ghost` is for low-emphasis toolbar actions. `button-danger` is for reject, archive, disable, and destructive operations. `button-link` is for inline table actions. Use icon + text for clear commands, and icon-only buttons only where the icon is familiar and has a tooltip.

## Cards

Use `card-base` for generic panels, `knowledge-card` for knowledge search/list results, `stat-card` for top-level metrics, `review-task-card` for pending review items, `empty-state-card` for missing data states, and `metadata-card` for compact properties. Do not nest cards inside cards unless the inner element is a repeated item or a true framed tool.

## Data Tables

`data-table` should feel Airtable-inspired: structured, readable, compact, and scan-friendly. Use `table-header`, `table-row`, `table-row-hover`, `table-cell`, and `table-action-cell`. Keep row heights around 44-48px where possible. Use status chips and role chips instead of plain status text. Do not use default browser tables without tokenized borders, padding, and hover states.

## Status Chips

Use workflow chips everywhere knowledge state appears. Draft is quiet, pending is warm, approved is green, rejected is red, and archived is lavender/gray. Role chips should make permission context visible on user management and audit records.

## Forms

Forms use `form-label`, `text-input`, `textarea`, `select-input`, `form-helper`, `form-error`, and `upload-dropzone`. Keep labels close to controls. Validation errors should appear near the affected form or at the top of the form panel. Knowledge submission can allow partial drafts, but submit-to-review forms must clearly show missing required fields.

## Knowledge Editor

The `knowledge-editor` should feel like a document workspace. The title uses `knowledge-title-input`; the body uses `knowledge-content-area`; category, tags, access level, and attachments live in `metadata-panel`. The editor should reduce visual noise so employees can focus on writing and submitting useful knowledge.

## Knowledge Detail

Knowledge detail pages should prioritize reading. Put title, status, metadata, summary, content, attachments, review history, comments, and similar knowledge in a predictable order. Use readable line length, generous line-height, and quiet metadata. Attachments should appear as structured file cards with preview/download actions.

## Dashboard Widgets

Use `dashboard-widget`, `stat-card`, `metric-number`, `ranking-list`, and `chart-container`. The dashboard should show management information clearly: total knowledge, published count, pending count, archive count, views, ratings, department contribution, hot knowledge, search keywords, and status distribution. Avoid decorative charts that do not explain a management decision.

## Empty States

Use `empty-state-card` for no search results, no pending reviews, no favorites, and empty feedback. Empty states should state the condition and offer a real next action when available.

## Toasts and Modals

Toasts use semantic backgrounds and concise messages. Modals use `{shadows.modal}`, `{rounded.xl}`, and focused content. Use modals for attachment preview, confirmation of destructive actions, and compact editing dialogs. Do not use modals for every routine task.

# Page Templates

## 1. Login Page

Layout: centered login card on `{colors.canvas}` with a calm warm-white feel. Use `card-base`, `text-input`, and `button-primary`. Visual emphasis should be on the system name and demo account selection. Avoid marketing hero copy, background illustrations, testimonials, or brand-like slogans.

## 2. Main Dashboard

Layout: `page-header`, quick action cards, `stat-card` row, and a small hot knowledge panel. Visual emphasis should reflect the current role. Employees see submission/search entry points; managers see review tasks; decision makers see analytics. Avoid oversized charts on the first screen.

## 3. Knowledge List Page

Layout: `page-header`, `search-bar`, `filter-pill` group, then `knowledge-card` grid or table/list hybrid. Visual emphasis is fast scanning: title, summary, tags, status, category, view count, rating. Avoid decorative cards that hide core metadata.

## 4. Knowledge Detail Page

Layout: document-centered reading column with metadata and action controls. Use readable long-form typography, `metadata-card`, attachment cards, review history, feedback cards, and similar knowledge. Avoid cramped admin-table presentation on the reading page.

## 5. Create / Edit Knowledge Page

Layout: large `knowledge-editor` area with a right or upper `metadata-panel` for category, tags, access level, status, and attachments. Visual emphasis is writing and submission. Draft save and submit review should be clearly separate. Avoid too many controls above the title.

## 6. My Knowledge Page

Layout: `data-table` with title, status, category, updated time, latest review comment, and actions. Rejected items should make the manager's comment visible. Avoid making employees open many pages just to understand what to fix.

## 7. Pending Review Page

Layout: manager-only `data-table` or `review-task-card` list filtered to the manager's department. Visual emphasis is workflow triage: submitter, category, updated time, attachments, and status. Avoid showing other departments' pending knowledge.

## 8. Review Detail Page

Layout: content preview first, attachments next, then review decision controls. Use `metadata-panel`, attachment cards, and clear approve/reject buttons. The reject comment field must be visible and meaningful. Avoid reviewing without enough context.

## 9. Category and Tag Management Page

Layout: split management page with form panel and `data-table`. Use compact field-like metadata and clear hierarchy. Avoid making category management look like a marketing settings page.

## 10. User Management Page

Layout: `data-table` for users plus compact forms for user and department creation. Use role chips, status chips, and table action cells. Avoid hiding role and department data behind detail pages.

## 11. Analytics Dashboard

Layout: `dashboard-grid` with top metrics, department ranking, hot knowledge, search keywords, and status distribution. Use green for emphasis but keep chart colors semantic and restrained. Avoid chart clutter, 3D charts, and decorative visuals.

## 12. System Settings / Backup Simulation Page

Layout: operational action cards and a log-like activity panel. Use calm system language and clear simulated maintenance actions. Avoid implying production-grade backup automation beyond the demo's intended scope.

# Do's and Don'ts

## Do

- Use `{colors.primary}` as the main action color.
- Use warm white backgrounds and quiet document surfaces.
- Use structured tables for management pages.
- Make status and role visible with chips.
- Keep knowledge pages readable and document-centered.
- Maintain consistent tokens across pages.
- Keep the interface calm, professional, and course-demo ready.
- Preserve visible workflow: draft, pending, approved, rejected, archived.
- Keep manager review department-scoped.
- Use real buttons connected to real API flows.

## Don't

- Do not copy Notion, Airtable, or MongoDB logos.
- Do not copy brand names, product claims, or marketing copy.
- Do not make the app look like a product landing page.
- Do not use dark cyber style.
- Do not overuse gradients.
- Do not create fake buttons.
- Do not break existing business logic.
- Do not remove existing features for aesthetics.
- Do not make every button pill-shaped.
- Do not use default browser tables.
- Do not turn MongoDB green into a large background theme.
- Do not make the interface an Airtable clone.

# Responsive Behavior

Breakpoints:

- mobile: `< 640px`
- tablet: `640-1023px`
- desktop: `1024-1279px`
- wide desktop: `>= 1280px`

On mobile, the sidebar collapses into a compact navigation pattern and the topbar remains accessible. Tables become horizontally scrollable rather than losing columns. Knowledge detail metadata moves below the content. Editor metadata stacks below the title and content controls. Dashboard grids collapse to one column on mobile and two columns on tablet. Touch targets should remain 40-44px tall.

On desktop and wide desktop, preserve the left sidebar, topbar, and constrained content widths. Do not stretch long-form knowledge content across the full screen; use `{layout.detail-max}`.

# Implementation Guide

When Codex or another coding agent refactors the UI, place design tokens in `client/src/styles` or a shared CSS token layer before changing individual pages. Create reusable components in `client/src/components` rather than duplicating styles page by page.

Preferred reusable components:

- `Button`
- `Card`
- `Badge`
- `StatusChip`
- `RoleChip`
- `DataTable`
- `FormField`
- `SearchFilterBar`
- `KnowledgeCard`
- `MetadataPanel`
- `DashboardWidget`
- `EmptyState`

Preserve existing API calls, routing, authentication, role-based navigation, MongoDB schema, seed data, upload behavior, and review workflow. UI refactors should not alter business logic unless the user explicitly requests a behavior change.

Use token references such as `{colors.primary}`, `{colors.surface}`, `{typography.body-md}`, `{rounded.md}`, `{spacing.lg}`, and `{shadows.card}` when creating new styles. Avoid hard-coded one-off colors and spacing values.

Only refactor UI when asked to do so. This `DESIGN.md` is a design system source of truth, not permission to change the current frontend by itself.

# Known Gaps

- The final chart library may depend on project dependencies and course presentation needs.
- Exact mobile menu behavior may need implementation decisions during a future responsive refactor.
- Chart colors may be refined after seeing real seeded and user-generated data.
- Dark mode is not required for this course demo.
- Attachment preview behavior depends on browser support for PDF, image, and text rendering.
- The current design system describes target UI quality; individual React components may still need future refactoring to fully match it.
