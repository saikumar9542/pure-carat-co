/* -------------------------------------------------------------------------
 * Pure Carat Co — Product & Category data
 *
 * Each product carries the raw metal weight (in grams). The displayed price
 * is computed live from the current market rate set by the admin:
 *     price = goldWeight × goldRate + silverWeight × silverRate + makingCharges
 * See js/pricing.js.
 * ------------------------------------------------------------------------- */

const CATEGORIES = [
  // Neck
  { slug: 'necklaces',       name: 'Necklaces',       group: 'Neck',            image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80' },
  { slug: 'chokers',         name: 'Chokers',         group: 'Neck',            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80' },
  { slug: 'rani-haar',       name: 'Rani Haar',       group: 'Neck',            image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'mangalsutra',     name: 'Mangalsutra',     group: 'Neck',            image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80' },
  { slug: 'pendants',        name: 'Pendants',        group: 'Neck',            image: 'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?auto=format&fit=crop&w=800&q=80' },
  { slug: 'chains',          name: 'Chains',          group: 'Neck',            image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80' },

  // Ears
  { slug: 'studs',           name: 'Studs',           group: 'Ears',            image: 'https://images.unsplash.com/photo-1535632066274-36f0f39b1e29?auto=format&fit=crop&w=800&q=80' },
  { slug: 'jhumkas',         name: 'Jhumkas',         group: 'Ears',            image: 'https://images.unsplash.com/photo-1631160299919-6a56d21a4b7a?auto=format&fit=crop&w=800&q=80' },
  { slug: 'hoops',           name: 'Hoops',           group: 'Ears',            image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80' },
  { slug: 'chandbalis',      name: 'Chandbalis',      group: 'Ears',            image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=800&q=80' },
  { slug: 'drop-earrings',   name: 'Drop Earrings',   group: 'Ears',            image: 'https://images.unsplash.com/photo-1616690710400-a16d146927c5?auto=format&fit=crop&w=800&q=80' },
  { slug: 'ear-cuffs',       name: 'Ear Cuffs',       group: 'Ears',            image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80' },

  // Fingers & Wrists
  { slug: 'rings',           name: 'Rings',           group: 'Fingers & Wrists',image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80' },
  { slug: 'bracelets',       name: 'Bracelets',       group: 'Fingers & Wrists',image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80' },
  { slug: 'tennis-bracelets',name: 'Tennis Bracelets',group: 'Fingers & Wrists',image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80' },
  { slug: 'bangles',         name: 'Bangles',         group: 'Fingers & Wrists',image: 'https://images.unsplash.com/photo-1620656798932-902a5b02b3bc?auto=format&fit=crop&w=800&q=80' },
  { slug: 'kadas',           name: 'Kadas',           group: 'Fingers & Wrists',image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80' },
  { slug: 'hathphool',       name: 'Hathphool',       group: 'Fingers & Wrists',image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80' },

  // Head & Hair
  { slug: 'maang-tikka',     name: 'Maang Tikka',     group: 'Head & Hair',     image: 'https://images.unsplash.com/photo-1583937443351-a3f984e2a5d1?auto=format&fit=crop&w=800&q=80' },
  { slug: 'passa',           name: 'Passa',           group: 'Head & Hair',     image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80' },
  { slug: 'borla',           name: 'Borla',           group: 'Head & Hair',     image: 'https://images.unsplash.com/photo-1544376664-80b17f09d399?auto=format&fit=crop&w=800&q=80' },
  { slug: 'jadanagam',       name: 'Jadanagam',       group: 'Head & Hair',     image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80' },

  // Feet & Ankles
  { slug: 'anklets',         name: 'Anklets',         group: 'Feet & Ankles',   image: 'https://images.unsplash.com/photo-1584967335069-b5c5b03bb6de?auto=format&fit=crop&w=800&q=80' },
  { slug: 'toe-rings',       name: 'Toe Rings',       group: 'Feet & Ankles',   image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80' },

  // Body
  { slug: 'belly-chains',    name: 'Belly Chains',    group: 'Body',            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80' },
  { slug: 'brooches',        name: 'Brooches',        group: 'Body',            image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80' },
  { slug: 'nose-pins',       name: 'Nose Pins',       group: 'Body',            image: 'https://images.unsplash.com/photo-1535632066274-36f0f39b1e29?auto=format&fit=crop&w=800&q=80' },
];

/* -------------------------------------------------------------------------
 * PRODUCTS — goldWeight in grams (silverWeight optional).
 * Add unlimited items; the gallery paginates automatically.
 * ------------------------------------------------------------------------- */
const PRODUCTS = [
  // Rings
  { id: 1,  category: 'rings',      name: 'Aurora Solitaire',   description: '18k gold solitaire with a brilliant round cut.',       goldWeight: 5.2,  image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80' },
  { id: 2,  category: 'rings',      name: 'Eternity Band',      description: 'Full-circle diamond band in yellow gold.',              goldWeight: 8.9,  image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80' },
  { id: 3,  category: 'rings',      name: 'Vintage Halo',       description: 'Rose-cut center stone with milgrain halo.',             goldWeight: 6.9,  image: 'https://images.unsplash.com/photo-1600721391689-2564bb8055de?auto=format&fit=crop&w=600&q=80' },

  // Necklaces
  { id: 10, category: 'necklaces',  name: 'Layla Chain',        description: 'Delicate 22k gold chain, 18-inch length.',              goldWeight: 3.8,  image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80' },
  { id: 11, category: 'necklaces',  name: 'Meera Pendant Set',  description: 'Temple-inspired pendant with matching studs.',          goldWeight: 10.3, image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80' },

  // Earrings
  { id: 20, category: 'studs',      name: 'Solitaire Studs',    description: 'Classic prong-set studs in white gold.',                goldWeight: 3.3,  image: 'https://images.unsplash.com/photo-1535632066274-36f0f39b1e29?auto=format&fit=crop&w=600&q=80' },
  { id: 21, category: 'jhumkas',    name: 'Rajwada Jhumkas',    description: 'Handcrafted temple jhumkas with pearl drops.',          goldWeight: 5.8,  image: 'https://images.unsplash.com/photo-1631160299919-6a56d21a4b7a?auto=format&fit=crop&w=600&q=80' },

  // Bracelets
  { id: 30, category: 'bracelets',  name: 'Aria Cuff',          description: 'Sculpted gold cuff with brushed finish.',               goldWeight: 6.4,  image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=600&q=80' },
  { id: 31, category: 'tennis-bracelets', name: 'Aurelia Tennis', description: 'Bezel-set diamonds on a delicate chain.',             goldWeight: 16.6, image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80' },

  // Bangles
  { id: 40, category: 'bangles',    name: 'Kanchi Bangles',     description: 'Set of two textured 22k bangles.',                      goldWeight: 11.6, image: 'https://images.unsplash.com/photo-1620656798932-902a5b02b3bc?auto=format&fit=crop&w=600&q=80' },

  // Anklets — silver piece
  { id: 50, category: 'anklets',    name: 'Payal Delight',      description: 'Silver ghungroo anklet with gold plating.',             goldWeight: 0.4, silverWeight: 60, image: 'https://images.unsplash.com/photo-1584967335069-b5c5b03bb6de?auto=format&fit=crop&w=600&q=80' },

  // Chains
  { id: 60, category: 'chains',     name: 'Rope Chain 20"',     description: 'Solid yellow gold rope chain.',                         goldWeight: 5.0,  image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80' },
];

/* Featured curation (by id) */
const FEATURED_IDS = [1, 11, 21, 31, 40, 2, 20, 30];
