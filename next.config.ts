import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // ── Group A: CPT archive → listing ──────────────────────────────────
      { source: '/case-study',  destination: '/case-studies', permanent: true },
      { source: '/case-study/', destination: '/case-studies/', permanent: true },
      { source: '/career',      destination: '/careers',      permanent: true },
      { source: '/career/',     destination: '/careers/',      permanent: true },

      // ── Group B: WordPress-only pages without React equivalent ───────────
      { source: '/resources',  destination: '/case-studies', permanent: true },
      { source: '/resources/', destination: '/case-studies/', permanent: true },

      // ── Group C: Yoast Premium redirects ported from WordPress ───────────

      // Old case study slugs → current slugs
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-2',
        destination: '/case-study/migration-from-fivetran-to-airbyte-for-ga4-and-magento',
        permanent: true,
      },
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-2/',
        destination: '/case-study/migration-from-fivetran-to-airbyte-for-ga4-and-magento/',
        permanent: true,
      },
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-3',
        destination: '/case-study/seamless-data-flow-optimizing-ingestion-modeling-and-consolidation',
        permanent: true,
      },
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-3/',
        destination: '/case-study/seamless-data-flow-optimizing-ingestion-modeling-and-consolidation/',
        permanent: true,
      },

      // Removed case study variants — redirect to listing (were 410 in WP)
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-4',
        destination: '/case-studies',
        permanent: true,
      },
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-4/',
        destination: '/case-studies/',
        permanent: true,
      },
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-5',
        destination: '/case-studies',
        permanent: true,
      },
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-5/',
        destination: '/case-studies/',
        permanent: true,
      },
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-6',
        destination: '/case-studies',
        permanent: true,
      },
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-6/',
        destination: '/case-studies/',
        permanent: true,
      },
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-7',
        destination: '/case-studies',
        permanent: true,
      },
      {
        source: '/case-study/unified-financial-and-sales-insights-from-raw-data-to-executive-dashboards-7/',
        destination: '/case-studies/',
        permanent: true,
      },

      // Malformed concatenated slug (WordPress save artifact)
      {
        source: '/case-study/migration-from-fivetran-to-airbyte-for-ga4-and-magentomigration-from-fivetran-to-airbyte-for-ga4-and-magento',
        destination: '/case-study/migration-from-fivetran-to-airbyte-for-ga4-and-magento',
        permanent: true,
      },
      {
        source: '/case-study/migration-from-fivetran-to-airbyte-for-ga4-and-magentomigration-from-fivetran-to-airbyte-for-ga4-and-magento/',
        destination: '/case-study/migration-from-fivetran-to-airbyte-for-ga4-and-magento/',
        permanent: true,
      },

      // Blog post slug change
      {
        source: '/harness-the-power-of-predictive-analytics-with-dsc-transforming-customer-churn-into-customer',
        destination: '/harness-the-power-of-predictive-analytics-with-dsc',
        permanent: true,
      },
      {
        source: '/harness-the-power-of-predictive-analytics-with-dsc-transforming-customer-churn-into-customer/',
        destination: '/harness-the-power-of-predictive-analytics-with-dsc/',
        permanent: true,
      },

      // Duplicate draft careers page
      { source: '/careers-2',  destination: '/careers',  permanent: true },
      { source: '/careers-2/', destination: '/careers/', permanent: true },

      // Work-page-dashboard placeholder slugs → real slugs
      {
        source: '/work-page-dashboard/dashboard-title-2',
        destination: '/work-page-dashboard/executive-overview-revenue-customer-impact',
        permanent: true,
      },
      {
        source: '/work-page-dashboard/dashboard-title-2/',
        destination: '/work-page-dashboard/executive-overview-revenue-customer-impact/',
        permanent: true,
      },
      {
        source: '/work-page-dashboard/dashboard-title-3',
        destination: '/work-page-dashboard/cfo-overview-distribution-covenants',
        permanent: true,
      },
      {
        source: '/work-page-dashboard/dashboard-title-3/',
        destination: '/work-page-dashboard/cfo-overview-distribution-covenants/',
        permanent: true,
      },
      {
        source: '/work-page-dashboard/dashboard-title-4',
        destination: '/work-page-dashboard/cfo-overview-commercialization-backlog-runway',
        permanent: true,
      },
      {
        source: '/work-page-dashboard/dashboard-title-4/',
        destination: '/work-page-dashboard/cfo-overview-commercialization-backlog-runway/',
        permanent: true,
      },

      // Old dashboard slug
      {
        source: '/dashboard/global-marketing-performance-dashboard-2',
        destination: '/dashboard/financial-health-runaway',
        permanent: true,
      },
      {
        source: '/dashboard/global-marketing-performance-dashboard-2/',
        destination: '/dashboard/financial-health-runaway/',
        permanent: true,
      },

      // Capitalization fix (Next.js redirects are case-sensitive by default)
      { source: '/Accessibility',  destination: '/accessibility',  permanent: true },
      { source: '/Accessibility/', destination: '/accessibility/', permanent: true },

      // WordPress placeholder work-page-dashboard slug (empty page, never had real content)
      { source: '/work-page-dashboard/dashboard-title',  destination: '/work', permanent: true },
      { source: '/work-page-dashboard/dashboard-title/', destination: '/work/', permanent: true },
    ]
  },
}

export default nextConfig
