// a11Yum App Color Palette
// Based on the accessibility-focused logo design

export const Colors = {
  // Primary Brand Colors (from logo)
  primary: {
    orange: '#FF8C42',      // Warm orange from people figures
    lightOrange: '#FFB366', // Lighter orange accent
    green: '#8BC34A',       // Fresh green from accessibility symbol
    darkGreen: '#689F38',   // Deeper green for contrast
    coral: '#FF6B35',       // Coral/red-orange from plate
    teal: '#26A69A',        // Teal from curved elements
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F8F9FA',   // Background
    mediumGray: '#E0E0E0',  // Borders/dividers
    darkGray: '#666666',    // Secondary text
    charcoal: '#333333',    // Primary text
    black: '#000000',
  },

  // Semantic Colors (using brand palette)
  semantic: {
    success: '#8BC34A',     // Green from logo
    warning: '#FF8C42',     // Orange from logo
    error: '#FF6B35',       // Coral from logo
    info: '#26A69A',        // Teal from logo
  },

  // Accessibility Colors (high contrast)
  accessibility: {
    focus: '#FF8C42',       // Orange for focus states
    selection: '#8BC34A33', // Green with transparency for selections
    highlight: '#FFB36620', // Light orange for highlights
  },

  // Background Variations
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    accent: '#FFF8F5',      // Very light orange tint
    overlay: '#00000080',   // Black with transparency
  },

  // Text Colors
  text: {
    primary: '#333333',
    secondary: '#666666',
    accent: '#FF8C42',      // Orange accent text
    inverse: '#FFFFFF',
    success: '#689F38',
    error: '#FF6B35',
  },

  // Button Colors
  button: {
    primary: '#8BC34A',     // Green primary button
    primaryText: '#FFFFFF',
    secondary: '#FF8C42',   // Orange secondary button
    secondaryText: '#FFFFFF',
    disabled: '#E0E0E0',
    disabledText: '#999999',
  },
};

// Export individual color groups for easier imports
export const PrimaryColors = Colors.primary;
export const NeutralColors = Colors.neutral;
export const SemanticColors = Colors.semantic;
export const AccessibilityColors = Colors.accessibility;

export default Colors;
