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
  { slug: 'necklaces',       name: 'Necklaces',       group: 'Neck',            image: 'assets/products/necklaces/Traditional Turkish Design Gold Necklace with Floral Drop Pendant.jpg' },
  { slug: 'chokers',         name: 'Chokers',         group: 'Neck',            image: 'assets/products/neck-chokeres/Stories in Jewellery – Where Every Piece Tells a Tale.jpg' },
  { slug: 'rani-haar',       name: 'Rani Haar',       group: 'Neck',            image: 'assets/products/neck-ranihaar/download (3).jpg' },
  { slug: 'mangalsutra',     name: 'Mangalsutra',     group: 'Neck',            image: 'assets/products/neck-mangalsutra/Telugu mangalsutra.jpg' },

  // Ears
  { slug: 'studs',           name: 'Studs',           group: 'Ears',            image: 'assets/products/ear-studs/Delicate Butterfly Earrings for Daily & Party Looks.jpg' },
  { slug: 'jhumkas',         name: 'Jhumkas',         group: 'Ears',            image: 'assets/products/ear-jhumkas/download (12).jpg' },

  // Fingers & Wrists
  { slug: 'rings',           name: 'Rings',           group: 'Fingers & Wrists',image: 'assets/products/rings/download (4).jpg' },
  { slug: 'bracelets',       name: 'Bracelets',       group: 'Fingers & Wrists',image: 'assets/products/bracelets/good as gold.jpg' },
  { slug: 'bangles',         name: 'Bangles',         group: 'Fingers & Wrists',image: 'assets/products/bangles/Boho Vacation Style Gold Bracelet Set for Women 🌿.jpg' },

  // Head & Hair
  { slug: 'maang-tikka',     name: 'Maang Tikka',     group: 'Head & Hair',     image: 'assets/products/head-maangTikka/Drashti Collection Gold-Plated Maang Tikka Head Jewellery (1).jpg' },
  { slug: 'passa',           name: 'Passa',           group: 'Head & Hair',     image: 'assets/products/head-passa/Elegant Gold Hair Chain for Women.jpg' },

  // Body
  { slug: 'belly-chains',    name: 'Belly Chains',    group: 'Body',            image: 'assets/products/body-vadanam/Perfect for weddings, festivals and traditional occasions.jpg' },
  { slug: 'nose-pins',       name: 'Nose Pins',       group: 'Body',            image: 'assets/products/nose-pins/Palak Natural Beauty Close-Up _ Minimal Makeup Portrait Inspiration.jpg' },

  // Feet & Ankles
  { slug: 'anklets',         name: 'Anklets',         group: 'Feet & Ankles',   image: 'assets/products/feet-anklet/Slim Golden Brass Cuban Braided Chain Minimalist Slim Foot Payal Anklet.jpg' },
  { slug: 'toe-rings',       name: 'Toe Rings',       group: 'Feet & Ankles',   image: 'assets/products/feet-toering/14k Solid Yellow Gold Over 0_08 Ct D_VVS1 Diamond Adjustable Toe Ring Band  _ eBay.jpg' },
];

/* -------------------------------------------------------------------------
 * PRODUCTS — goldWeight in grams (silverWeight optional).
 * Add unlimited items; the gallery paginates automatically.
 * ------------------------------------------------------------------------- */
const PRODUCTS = [
  // Rings
  { id: 1,  category: 'rings',      name: 'Aurora Solitaire',   description: '18k gold solitaire with a brilliant round cut.',        goldWeight: 5.2,  image: 'assets/products/rings/download (4).jpg' },
  { id: 2,  category: 'rings',      name: 'Eternity Band',      description: 'Full-circle diamond band in yellow gold.',              goldWeight: 8.9,  image: 'assets/products/rings/Beautiful Wedding Rings On White Background PNG Images _ PSD Free Download - Pikbest.jpg' },
  { id: 3,  category: 'rings',      name: 'Vintage Halo',       description: 'Rose-cut center stone with milgrain halo.',             goldWeight: 6.9,  image: 'assets/products/rings/Couple ring.jpg' },

  // Neck
  { id: 10, category: 'necklaces',  name: 'Layla Chain',                  description: 'Delicate 22k gold chain, 18-inch length.',              goldWeight: 3.8,  image: 'assets/products/necklaces/download (11).jpg' },
  { id: 11, category: 'necklaces',  name: 'Traditional Pendant Set',      description: 'Temple-inspired pendant with matching studs.',          goldWeight: 10.3, image: 'assets/products/necklaces/Traditional Turkish Design Gold Necklace with Floral Drop Pendant.jpg' },
  { id: 12, category: 'necklaces',  name: 'Temple Inspired Pendant Set',  description: 'Temple-inspired pendant with matching studs.',          goldWeight: 10.3, image: 'assets/products/necklaces/Temple jewellery Available at Ankh jewels  For booking WhatsApp on +91 9619291911____.jpg' },
  { id: 13, category: 'necklaces',  name: 'Simple Gold Pendant Set',      description: 'Temple-inspired pendant with matching studs.',          goldWeight: 10.3, image: 'assets/products/necklaces/Simple gold necklace.jpg' },

  { id: 14, category: 'chokers',    name: 'Stories in Jewellery',         description: 'Intricate gold choker with gemstone accents.',        goldWeight: 12.5, image: 'assets/products/neck-chokeres/Stories in Jewellery – Where Every Piece Tells a Tale.jpg' },
  { id: 15, category: 'chokers',   name: 'Traditional Temple Necklace',   description: 'Traditional temple necklace with matching earrings.',   goldWeight: 18.2, image: 'assets/products/neck-chokeres/Ecklace Jewellery Set Png Image - Gold Jewellery Set PNG Transparent With Clear Background ID 173036 _ TopPNG.jpg' },


  { id: 16, category: 'rani-haar',   name: 'Rani Haar',                   description: 'Traditional temple necklace with matching earrings.',   goldWeight: 18.2, image: 'assets/products/neck-ranihaar/download (3).jpg' },
  { id: 17, category: 'rani-haar',   name: 'Rani Haar',                   description: 'Traditional temple necklace with matching earrings.',   goldWeight: 18.2, image: 'assets/products/neck-ranihaar/24k gold plated luxurious rani haar set.jpg' },
  { id: 18, category: 'rani-haar',   name: 'Rani Haar',                   description: 'Traditional temple necklace with matching earrings.',   goldWeight: 18.2, image: 'assets/products/neck-ranihaar/download (2).jpg' },
  { id: 19, category: 'rani-haar',   name: 'Rani Haar',                   description: 'Traditional temple necklace with matching earrings.',   goldWeight: 18.2, image: 'assets/products/neck-ranihaar/download (4).jpg' }, 
  { id: 20, category: 'rani-haar',   name: 'Rani Haar',                   description: 'Traditional temple necklace with matching earrings.',   goldWeight: 18.2, image: 'assets/products/neck-ranihaar/Lakshmi Coin Heritage Gold Long Necklace (Temple Style).jpg' }, 
  { id: 21, category: 'rani-haar',   name: 'Rani Haar',                   description: 'Traditional temple necklace with matching earrings.',   goldWeight: 18.2, image: 'assets/products/neck-ranihaar/Necklace.jpg' },

  { id: 23, category: 'mangalsutra',name: 'Long Mangalsutra',   description: 'Elegant long mangalsutra with black beads.',            goldWeight: 9.6,  image: 'assets/products/neck-mangalsutra/download (2).jpg' },
  { id: 24, category: 'mangalsutra',name: 'Short Mangalsutra',  description: 'Delicate short mangalsutra with gold pendant.',         goldWeight: 6.4,  image: 'assets/products/neck-mangalsutra/long mangalsutra _ Gold jewellery _ 22 karat.jpg' }, 
  { id: 25, category: 'mangalsutra',name: 'Mangalsutra Set',    description: 'Matching mangalsutra set with earrings.',              goldWeight: 12.8, image: 'assets/products/neck-mangalsutra/download (3).jpg' }, 


  // Earrings
  { id: 30, category: 'studs',      name: 'ButterFly Studs',    description: 'Classic prong-set studs in white gold.',                goldWeight: 3.3,  image: 'assets/products/ear-studs/Delicate Butterfly Earrings for Daily & Party Looks.jpg' },
  { id: 31, category: 'studs',      name: 'Floral Studs',       description: 'Floral motif studs with diamond accents.',              goldWeight: 4.1,  image: 'assets/products/ear-studs/download (6).jpg' },
  { id: 32, category: 'studs',      name: 'Pearl Studs',        description: 'Classic pearl studs with gold backing.',                goldWeight: 2.7,  image: 'assets/products/ear-studs/Earing Design.jpg' },
  { id: 33, category: 'studs',      name: 'Precious Studs',     description: 'Traditional temple jhumkas with intricate detailing.',  goldWeight: 7.5,  image: 'assets/products/ear-studs/perciousjewels.jpg' },

  { id: 34, category: 'jhumkas',    name: 'Laxmi Jhumkas',      description: 'Handcrafted temple jhumkas with pearl drops.',          goldWeight: 5.8,  image: 'assets/products/ear-jhumkas/Antique temple electroforming jumki.jpg' },
  { id: 35, category: 'jhumkas',    name: 'Temple Jhumkas',     description: 'Traditional temple jhumkas with intricate detailing.',  goldWeight: 7.5,  image: 'assets/products/ear-jhumkas/Classic Lotus Motif Temple Jhumkas with Ruby Studs & Pearl Drops.jpg' },
  { id: 36, category: 'jhumkas',    name: 'Rajwada Jhumkas',    description: 'Handcrafted temple jhumkas with pearl drops.',          goldWeight: 5.8,  image: 'assets/products/ear-jhumkas/download (12).jpg' },
  { id: 37, category: 'jhumkas',    name: 'Butta Jhumkas',      description: 'Antique-style jhumkas with oxidized finish.',           goldWeight: 6.2,  image: 'assets/products/ear-jhumkas/download (6).jpg' },

  // Bracelets
  { id: 40, category: 'bracelets',  name: 'Aria Cuff',          description: 'Sculpted gold cuff with brushed finish.',               goldWeight: 6.4,  image: 'assets/products/bracelets/good as gold.jpg' },
  { id: 41, category: 'bracelets',  name: 'Aurelia Tennis',     description: 'Bezel-set diamonds on a delicate chain.',              goldWeight: 16.6, image: 'assets/products/bracelets/download (3).jpg' },
  { id: 42, category: 'bracelets',  name: 'Delicate Chain Bracelet',  description: 'Minimalist gold chain bracelet with lobster clasp.',    goldWeight: 4.2,    image: 'assets/products/bracelets/Premium Gold Bracelet for a Refined Look_ (1).jpg' },
  { id: 43, category: 'bracelets',  name: 'Charm Bracelet',     description: 'Gold bracelet with dangling charms.',                  goldWeight: 7.1,  image: 'assets/products/bracelets/Premium Gold Bracelet for a Refined Look_.jpg' },
  { id: 44, category: 'bracelets',  name: 'Bangle Bracelet',    description: 'Stackable gold bangle with engraved patterns.',        goldWeight: 5.9,  image: 'assets/products/bracelets/Roupas Femininas & Masculinas, Loja de Moda Online.jpg' },
 
  // Bangles
  { id: 50, category: 'bangles',    name: 'Kanchi Bangles',     description: 'Set of two textured 22k bangles.',                      goldWeight: 11.6, image: 'assets/products/bangles/Boho Vacation Style Gold Bracelet Set for Women 🌿.jpg' },
  { id: 51, category: 'bangles',    name: 'Temple Bangles',     description: 'Intricately carved temple bangles.',                    goldWeight: 14.2, image: 'assets/products/bangles/download (2).jpg' },
  { id: 52, category: 'bangles',    name: 'Meenakari Bangles',  description: 'Colorful enamel bangles with gold accents.',            goldWeight: 9.8,  image: 'assets/products/bangles/Yupsk 3Pcs_Set 316L Stainless Steel Bracelet With Buling Zircon Inlaid Versatile Non-fading.jpg' },
  { id: 53, category: 'bangles',    name: 'Kundan Bangles',     description: 'Traditional kundan bangles with gemstone inlays.',      goldWeight: 12.5, image: 'assets/products/bangles/Pure 22k Gold Bangles Indian Handmade Light Weight, Traditional Rajasthan India , Bangle Bracelet Pair Wedding Jewelry - Etsy.jpg' },

  // Head & Hair
  { id: 60, category: 'maang-tikka',name: 'Maang Tikka',        description: 'Gold maang tikka with pearl drops.',                    goldWeight: 4.3,  image: 'assets/products/head-maangTikka/Drashti Collection Gold-Plated Maang Tikka Head Jewellery (1).jpg' },
  { id: 61, category: 'maang-tikka',name: 'Maang Tikka',        description: 'Gold maang tikka with pearl drops.',                    goldWeight: 4.3,  image: 'assets/products/head-maangTikka/download (7).jpg' },
  { id: 62, category: 'maang-tikka',name: 'Maang Tikka',        description: 'Gold maang tikka with pearl drops.',                    goldWeight: 4.3,  image: 'assets/products/head-maangTikka/download (8).jpg' },

  { id: 63, category: 'passa',      name: 'Passa',              description: 'Gold passa with intricate filigree design.',                 goldWeight: 5.6,  image: 'assets/products/head-passa/Elegant Gold Hair Chain for Women.jpg' }, 
  { id: 64, category: 'passa',      name: 'Passa',              description: 'Gold passa with intricate filigree design.',                 goldWeight: 5.6,  image: 'assets/products/head-passa/Silver Passa.jpg' },
  { id: 65, category: 'passa',      name: 'Passa',              description: 'Gold passa with intricate filigree design.',                 goldWeight: 5.6,  image: 'assets/products/head-passa/Traditional Jada Billa Bridal Hair Accessory with Temple Motifs.jpg' },


  //Body
  { id: 70, category: 'belly-chains',name: 'Belly Chain',       description: 'Gold belly chain with adjustable links.',               goldWeight: 7.4,  image: 'assets/products/body-vadanam/Perfect for weddings, festivals and traditional occasions.jpg' },
  { id: 71, category: 'belly-chains',name: 'Belly Chain',       description: 'Gold belly chain with adjustable links.',               goldWeight: 7.4,  image: 'assets/products/body-vadanam/download (2).jpg' },
  { id: 72, category: 'belly-chains',name: 'Belly Chain',       description: 'Gold belly chain with adjustable links.',               goldWeight: 7.4,  image: 'assets/products/body-vadanam/download (3).jpg' }, 

  { id: 73, category: 'nose-pins',   name: 'Nose Pin',          description: 'Delicate gold nose pin with floral motif.',             goldWeight: 1.8,  image: 'assets/products/nose-pins/Palak Natural Beauty Close-Up _ Minimal Makeup Portrait Inspiration.jpg' }, 
  { id: 74, category: 'nose-pins',   name: 'Nose Pin',          description: 'Delicate gold nose pin with floral motif.',             goldWeight: 1.8,  image: 'assets/products/nose-pins/download (3).jpg' }, 
  { id: 75, category: 'nose-pins',   name: 'Nose Pin',          description: 'Delicate gold nose pin with floral motif.',             goldWeight: 1.8,  image: 'assets/products/nose-pins/download (4).jpg' },
  { id: 76, category: 'nose-pins',   name: 'Nose Pin',          description: 'Delicate gold nose pin with floral motif.',             goldWeight: 1.8,  image: 'assets/products/nose-pins/download (6).jpg' },
  { id: 77, category: 'nose-pins',   name: 'Nose Pin',          description: 'Delicate gold nose pin with floral motif.',             goldWeight: 1.8,  image: 'assets/products/nose-pins/download (9).jpg' },
  { id: 78, category: 'nose-pins',   name: 'Nose Pin',          description: 'Delicate gold nose pin with floral motif.',             goldWeight: 1.8,  image: 'assets/products/nose-pins/download (10).jpg' },
  { id: 79, category: 'nose-pins',   name: 'Nose Pin',          description: 'Delicate gold nose pin with floral motif.',             goldWeight: 1.8,  image: 'assets/products/nose-pins/Mahi Cubic Zirconia Gold Plated Daisy Bloom Floral Nose Ring for Womens.jpg' },
  { id: 87, category: 'nose-pins',   name: 'Nose Pin',          description: 'Delicate gold nose pin with floral motif.',             goldWeight: 1.8,  image: 'assets/products/nose-pins/Traditional Pearl & Kundan Nose Pin _ Elegant Indian Nath Design for Festive & Bridal Wear.jpg' },

  // Anklets — silver piece
  { id: 80, category: 'anklets',    name: 'Payal Delight',      description: 'Silver ghungroo anklet with gold plating.',             goldWeight: 18.4, silverWeight: 0, image: 'assets/products/feet-anklet/Slim Golden Brass Cuban Braided Chain Minimalist Slim Foot Payal Anklet.jpg' },
  { id: 81, category: 'anklets',    name: 'Silver Anklet',      description: 'Delicate silver anklet with adjustable chain.',         goldWeight: 0, silverWeight: 45, image: 'assets/products/feet-anklet/Premium Designer Heart Charm Silver Payal_.jpg' },
  { id: 82, category: 'anklets',    name: 'Gold Anklet',        description: 'Gold anklet with intricate filigree design.',           goldWeight: 2.1, silverWeight: 0, image: 'assets/products/feet-anklet/Traditional Indian Silver Anklet Pair, Dainty Boho Ankle Bracelet Mother\'s day Gift For Her.jpg' },
  { id: 83, category: 'anklets',    name: 'Beaded Anklet',      description: 'Silver anklet with colorful beads and charms.',         goldWeight: 11.2, silverWeight: 0, image: 'assets/products/feet-anklet/download (3).jpg' },

  { id: 84, category: 'toe-rings',  name: 'Toe Ring',           description: 'Gold toe ring with intricate detailing.',               goldWeight: 1.2, silverWeight: 0, image: 'assets/products/feet-toering/14k Solid Yellow Gold Over 0_08 Ct D_VVS1 Diamond Adjustable Toe Ring Band  _ eBay.jpg' },
  { id: 85, category: 'toe-rings',  name: 'Silver Toe Ring',    description: 'Adjustable silver toe ring with floral motif.',         goldWeight: 0, silverWeight: 3.5, image: 'assets/products/feet-toering/Buy 925 Pure Silver Toe Rings Online At Best Prices – Meera Jaipur.jpg' },
  { id: 86, category: 'toe-rings',  name: 'Gold Toe Ring',      description: 'Delicate gold toe ring with twisted design.',           goldWeight: 1.8, silverWeight: 0, image: 'assets/products/feet-toering/download (2).jpg' }, 

];

/* Featured curation (by id) */
const FEATURED_IDS = [1, 11, 14, 16, 21, 31, 34, 40, 50, 60, 63, 70, 73, 80, 84];
