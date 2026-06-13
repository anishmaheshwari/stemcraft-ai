export type Concept = {
  id: string;
  label: string;
  keywords: string[];
};

export type TemplateConcepts = Record<string, Concept[]>;

// Minimal concept taxonomy for the three approved templates.
export const TEMPLATE_CONCEPTS: TemplateConcepts = {
  binary_search: [
    { id: "mid_calc", label: "Mid calculation", keywords: ["mid", "floor", "(low+high)/2", "middle index"] },
    { id: "elimination", label: "Elimination logic", keywords: ["discard", "left", "right", "eliminate"] },
    { id: "indexing", label: "Array indexing", keywords: ["index", "element", "array", "sortedArray"] },
    { id: "complexity", label: "Time complexity", keywords: ["big o", "complexity", "log n", "O(log"] },
  ],
  dns_resolution: [
    { id: "resolver", label: "Resolver", keywords: ["resolver", "recursive resolver", "recursive"] },
    { id: "root", label: "Root servers", keywords: ["root", "root server"] },
    { id: "tld", label: "TLD servers", keywords: ["tld", "top-level domain"] },
    { id: "authoritative", label: "Authoritative nameserver", keywords: ["authoritative", "authoritative nameserver"] },
    { id: "caching", label: "Caching", keywords: ["cache", "cached", "ttl"] },
  ],
  projectile_motion: [
    { id: "angle", label: "Launch angle", keywords: ["angle", "degrees", "theta"] },
    { id: "velocity", label: "Initial velocity", keywords: ["velocity", "speed", "m/s"] },
    { id: "gravity", label: "Gravity", keywords: ["gravity", "g", "9.8"] },
    { id: "range", label: "Range / distance", keywords: ["range", "distance", "horizontal"] },
  ],
};

export default TEMPLATE_CONCEPTS;
