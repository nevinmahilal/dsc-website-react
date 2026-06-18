// Third level: Tools > DSC Optimizer
export interface SubMenuItem {
  label: string
  href: string
}

// Second level: About > Careers; Resources > Case Studies, Our Blog, Dashboards, Tools
export interface NavDropdownItem {
  label: string
  href: string
  children?: SubMenuItem[]  // Only "Tools" has children
}

// Top level: Home, Work, About, Resources, Get In Touch
export interface NavItem {
  label: string
  href?: string             // Absent for items with dropdowns (About, Resources)
  children?: NavDropdownItem[]
  isCTA?: boolean           // true for "Get In Touch" bordered button
}

// Shape of content/meta/nav.json
export interface NavData {
  items: NavItem[]
}
