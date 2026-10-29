export const productCategories = [
  { id: "food", name: "Food & spices" },
  { id: "coffee", name: "Coffee & ceremony" },
  { id: "kitchen", name: "Kitchen & home" },
  { id: "culture", name: "Culture & learning" },
] as const;

export type ProductCategory = typeof productCategories[number]["id"];

export interface Product {
  slug: string;
  name: string;
  shortDescription: string;
  weight: string;
  description: string;
  image: string;
  images: string[];
  features: string[];
  category: ProductCategory;
  availability: "in-stock" | "out-of-stock" | "coming-soon";
  priceEur: number | null;
  compareAtPriceEur?: number;
  weightKg: number | null;
  catalogItem?: number;
  legacyNames?: string[];
  specifications?: { label: string; value: string }[];
}

// Pack / piece / set labels are stored in `weight` to retain existing cart compatibility.
export const products: Product[] = [
  {
    "slug": "white-teff-flour",
    "priceEur": 25,
    "weightKg": 5,
    "availability": "in-stock",
    "name": "White Teff Flour (Magna)",
    "weight": "5 kg bag",
    "description": "Premium Ethiopian white teff flour (Magna Teff) for baking authentic injera. Finely milled and imported directly from Ethiopia. Known for its delicate flavor, light color, and premium quality.",
    "image": "/images/white_teff_bag_transparent_enhanced.png",
    "features": [
      "100% Ethiopian white magna teff",
      "Perfect for authentic light injera",
      "Fresh stock available in Helsinki",
      "Fast, reliable delivery all over Finland"
    ],
    "category": "food",
    "shortDescription": "Premium Ethiopian white teff flour (Magna Teff) for baking authentic injera. Finely milled and imported directly from Ethiopia. Known for its delicate flavor, light color, and premium quality.",
    "images": [
      "/images/white_teff_bag_transparent_enhanced.png"
    ]
  },
  {
    "slug": "red-teff-flour",
    "priceEur": 25,
    "weightKg": 5,
    "availability": "in-stock",
    "name": "Red Teff Flour",
    "weight": "5 kg bag",
    "description": "Rich, nutty Ethiopian red teff flour for dark injera. Full-bodied flavor with excellent nutritional value.",
    "image": "/images/red_teff_flour_enhanced_transparent.png",
    "features": [
      "100% Ethiopian red teff",
      "High in iron and fiber",
      "Perfect for dark injera"
    ],
    "category": "food",
    "shortDescription": "Rich, nutty Ethiopian red teff flour for dark injera. Full-bodied flavor with excellent nutritional value.",
    "images": [
      "/images/red_teff_flour_enhanced_transparent.png"
    ]
  },
  {
    "slug": "berbere",
    "priceEur": 30,
    "weightKg": 1,
    "availability": "in-stock",
    "name": "Berbere",
    "weight": "1 kg pack",
    "description": "Authentic Ethiopian Berbere spice blend. Rich, flavorful, and perfect for wot (stews).",
    "image": "/images/berbere_enhanced_transparent.png",
    "features": [
      "Authentic Ethiopian spice",
      "Rich flavor",
      "Perfect for wot"
    ],
    "category": "food",
    "shortDescription": "Authentic Ethiopian Berbere spice blend. Rich, flavorful, and perfect for wot (stews).",
    "images": [
      "/images/berbere_enhanced_transparent.png"
    ]
  },
  {
    "slug": "shiro",
    "priceEur": 30,
    "weightKg": 1,
    "availability": "in-stock",
    "name": "Shiro",
    "weight": "1 kg pack",
    "description": "Traditional Ethiopian Shiro powder. Easy to prepare and makes a delicious, savory stew.",
    "image": "/images/shiro_enhanced_transparent.png",
    "features": [
      "Traditional shiro powder",
      "Easy to prepare",
      "Delicious flavor"
    ],
    "category": "food",
    "shortDescription": "Traditional Ethiopian Shiro powder. Easy to prepare and makes a delicious, savory stew.",
    "images": [
      "/images/shiro_enhanced_transparent.png"
    ]
  },
  {
    "slug": "mashila-sorghum",
    "priceEur": 15,
    "weightKg": 5,
    "availability": "out-of-stock",
    "name": "Ethiopian Sorghum Flour (Mashila) – 5 kg",
    "legacyNames": ["Mashila (Sorghum)"],
    "weight": "5 kg bag",
    "description": "Mashila is a grain used in Ethiopian and Eritrean cuisine. This finely milled sorghum flour has a mild flavour and works well in porridge, flatbreads and a variety of home-cooked recipes. The 5 kg bag is a practical size for households that cook with sorghum regularly.",
    "image": "/images/mashila.png",
    "features": [
      "Finely milled sorghum flour",
      "Suitable for porridge, flatbreads and baking",
      "5 kg bag"
    ],
    "catalogItem": 1,
    "shortDescription": "Traditional Ethiopian sorghum flour for porridge, flatbreads and everyday home cooking.",
    "category": "food",
    "images": [
      "/images/mashila.png"
    ],
    "specifications": [
      {
        "label": "Product",
        "value": "Milled sorghum flour"
      },
      {
        "label": "Net weight",
        "value": "5 kg"
      },
      {
        "label": "Packaging",
        "value": "Bag"
      }
    ]
  },
  {
    "slug": "buna-coffee",
    "priceEur": 18,
    "weightKg": 1,
    "availability": "in-stock",
    "name": "Ethiopian Sidamo Arabica Green Coffee Beans – 1 kg",
    "legacyNames": ["Buna (Coffee)"],
    "weight": "1 kg pack",
    "description": "These green Sidamo coffee beans are intended for customers who enjoy roasting coffee themselves. Roast the beans to your preferred level, then grind and brew them. They are particularly suitable for the Ethiopian coffee ceremony, where coffee is traditionally roasted fresh before serving.",
    "image": "/images/green_coffee_beans_enhanced_transparent.png",
    "features": [
      "Washed Ethiopian Arabica beans",
      "Unroasted for home roasting",
      "Suitable for traditional coffee ceremonies",
      "Roast before grinding and brewing"
    ],
    "catalogItem": 2,
    "shortDescription": "Washed Grade 1 Ethiopian Sidamo Arabica beans, unroasted for fresh home roasting.",
    "category": "coffee",
    "images": [
      "/images/green_coffee_beans_enhanced_transparent.png"
    ],
    "specifications": [
      {
        "label": "Origin",
        "value": "Sidamo, Ethiopia"
      },
      {
        "label": "Coffee",
        "value": "Arabica, Grade 1"
      },
      {
        "label": "Processing",
        "value": "Washed"
      },
      {
        "label": "Roast",
        "value": "Green / unroasted"
      },
      {
        "label": "Net weight",
        "value": "1 kg"
      }
    ]
  },
  {
    "slug": "abish-fenugreek",
    "catalogItem": 3,
    "name": "Ethiopian Abish (Fenugreek Seeds) – 200 g",
    "shortDescription": "Whole fenugreek seeds for Ethiopian spice preparations and traditional cooking.",
    "description": "Abish is used in Ethiopian and Eritrean kitchens for its distinctive aromatic, slightly bitter flavour. The seeds may be ground or used in traditional recipes and spice mixtures. The small container is convenient for keeping the seeds ready for cooking.",
    "category": "food",
    "weight": "200 g container",
    "weightKg": 0.2,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/abish-fenugreek.png",
    "images": [
      "/images/abish-fenugreek.png"
    ],
    "features": [
      "Whole fenugreek seeds",
      "Suitable for grinding and seasoning",
      "Convenient 200 g container"
    ],
    "specifications": [
      {
        "label": "Ingredient",
        "value": "Fenugreek seeds"
      },
      {
        "label": "Botanical name",
        "value": "Trigonella foenum-graecum"
      },
      {
        "label": "Form",
        "value": "Whole seeds"
      },
      {
        "label": "Net weight",
        "value": "200 g"
      },
      {
        "label": "Packaging",
        "value": "Lidded container"
      }
    ]
  },
  {
    "slug": "gaat-porridge",
    "catalogItem": 4,
    "name": "Ethiopian Ga’at Porridge Mix – Barley & Rye, 1 kg",
    "shortDescription": "Barley-and-rye cereal blend for preparing traditional Ga’at porridge.",
    "description": "Ga’at is a warm, thick porridge enjoyed in Ethiopian and Eritrean food traditions. This blend of barley and rye provides a convenient base for preparing Ga’at at home. Serve it with your preferred traditional accompaniments, such as spiced butter or sauces.",
    "category": "food",
    "weight": "1 kg pack",
    "weightKg": 1,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/gaat-porridge.png",
    "images": [
      "/images/gaat-porridge.png"
    ],
    "features": [
      "Traditional porridge blend",
      "Made with barley and rye",
      "1 kg pack"
    ],
    "specifications": [
      {
        "label": "Main grains",
        "value": "Barley and rye"
      },
      {
        "label": "Form",
        "value": "Ground cereal mix"
      },
      {
        "label": "Net weight",
        "value": "1 kg"
      },
      {
        "label": "Allergen",
        "value": "Contains gluten (barley and rye)"
      }
    ]
  },
  {
    "slug": "mekelesha-spice",
    "catalogItem": 5,
    "name": "Ethiopian Mekelesha Spice Mix – 100 g",
    "shortDescription": "Aromatic Ethiopian finishing spice blend for stews and savoury dishes.",
    "description": "Mekelesha is commonly added near the end of cooking to give Ethiopian stews and sauces their finishing aroma. Use it in dishes such as doro wat and other richly seasoned recipes, adjusting the amount to taste.",
    "category": "food",
    "weight": "100 g packet",
    "weightKg": 0.1,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/mekelesha-spice.png",
    "images": [
      "/images/mekelesha-spice.png"
    ],
    "features": [
      "Traditional Ethiopian finishing spice",
      "Suitable for stews and sauces",
      "Easy-to-use 100 g pack"
    ],
    "specifications": [
      {
        "label": "Product",
        "value": "Mekelesha spice blend"
      },
      {
        "label": "Form",
        "value": "Ground mixed spices"
      },
      {
        "label": "Net weight",
        "value": "100 g"
      },
      {
        "label": "Packaging",
        "value": "Sealed packet"
      },
      {
        "label": "Exact ingredients",
        "value": "Check pack label"
      }
    ]
  },
  {
    "slug": "zemen-injera-maker-40cm",
    "catalogItem": 6,
    "name": "Zemen Electric Injera Maker (Mogogo / Mitad) – 40 cm",
    "shortDescription": "Electric injera maker with a 40 cm round cooking surface for homemade injera.",
    "description": "Prepare Ethiopian and Eritrean injera at home with this 40 cm electric Mogogo. The round cooking plate provides a surface for spreading injera batter, while the lid covers it during cooking. This size is convenient for home kitchens and smaller batches.",
    "category": "kitchen",
    "weight": "40 cm",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/zemen-injera-40cm-box.png",
    "images": [
      "/images/zemen-injera-40cm-box.png",
      "/images/injera-maker.png"
    ],
    "features": [
      "40 cm round cooking surface",
      "Designed for injera preparation",
      "Lid included as shown by supplier",
      "Compact alternative to the 46 cm model"
    ],
    "specifications": [
      {
        "label": "Brand",
        "value": "Zemen"
      },
      {
        "label": "Type",
        "value": "Electric injera maker"
      },
      {
        "label": "Cooking surface diameter",
        "value": "40 cm"
      },
      {
        "label": "Design",
        "value": "Round plate with lid"
      }
    ]
  },
  {
    "slug": "coffee-roasting-pan",
    "catalogItem": 7,
    "name": "Traditional Ethiopian Coffee Roasting Pan – Black",
    "shortDescription": "Traditional pan for roasting green coffee beans during the Ethiopian coffee ceremony.",
    "description": "Fresh roasting is a central part of the Ethiopian coffee ceremony. This black roasting pan is used to heat green coffee beans before they are ground and brewed, allowing the aroma of fresh coffee to accompany the ceremony.",
    "category": "coffee",
    "weight": "1 pan",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/coffee-roasting-pan.png",
    "images": [
      "/images/coffee-roasting-pan.png"
    ],
    "features": [
      "Traditional coffee preparation accessory",
      "Designed for green coffee beans",
      "Black finish"
    ],
    "specifications": [
      {
        "label": "Product",
        "value": "Coffee roasting pan"
      },
      {
        "label": "Colour",
        "value": "Black"
      },
      {
        "label": "Purpose",
        "value": "Roasting green coffee beans"
      }
    ]
  },
  {
    "slug": "mogogo-temperature-controller",
    "catalogItem": 8,
    "name": "Digital Temperature Controller for Mogogo Injera Maker",
    "shortDescription": "Replacement digital temperature controller for compatible electric Mogogo appliances.",
    "description": "This controller provides digital temperature controls for compatible electric injera makers. Its display and buttons make it possible to adjust the heat during cooking. It is intended as a replacement accessory, not a universal controller for all appliances.",
    "category": "kitchen",
    "weight": "1 controller",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/mogogo-controller.png",
    "images": [
      "/images/mogogo-controller.png"
    ],
    "features": [
      "Digital display",
      "Temperature adjustment buttons",
      "Replacement part for compatible models"
    ],
    "specifications": [
      {
        "label": "Type",
        "value": "Electrical temperature controller / adapter"
      },
      {
        "label": "Display",
        "value": "Digital"
      },
      {
        "label": "Controls",
        "value": "Adjustment buttons"
      }
    ]
  },
  {
    "slug": "berele-tej-glass",
    "catalogItem": 9,
    "name": "Traditional Ethiopian Berele Glass – Tej Serving Glass",
    "shortDescription": "Traditional Ethiopian glass for serving tej and other beverages.",
    "description": "Berele is a distinctive style of drinking glass associated with serving Ethiopian tej, a traditional honey wine. Its characteristic design makes it a fitting choice for cultural celebrations and traditional dining.",
    "category": "coffee",
    "weight": "1 glass",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/berele-glass-group.png",
    "images": [
      "/images/berele-glass-group.png",
      "/images/berele-glass.png"
    ],
    "features": [
      "Traditional Berele shape",
      "Glass construction",
      "Suitable for special-occasion beverage service"
    ],
    "specifications": [
      {
        "label": "Product",
        "value": "Berele drinking glass"
      },
      {
        "label": "Material",
        "value": "Glass"
      },
      {
        "label": "Style",
        "value": "Traditional Ethiopian drinkware"
      }
    ]
  },
  {
    "slug": "ceramic-incense-burner",
    "catalogItem": 10,
    "name": "Traditional Ethiopian Ceramic Incense Burner",
    "shortDescription": "Decorative ceramic incense burner with colourful Ethiopian-inspired patterns.",
    "description": "This ceramic incense burner adds a traditional touch to Ethiopian and Eritrean coffee ceremonies. Its decorated bowl and pedestal base make it both a practical incense accessory and a display piece. Use only with suitable incense-burning materials.",
    "category": "coffee",
    "weight": "1 burner",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/incense-burner-figures.png",
    "images": [
      "/images/incense-burner-figures.png",
      "/images/incense-burner-geometric.png",
      "/images/incense-burner-box.png"
    ],
    "features": [
      "Decorative ceramic design",
      "Traditional coffee-ceremony accessory",
      "Pedestal form",
      "Use on a heat-resistant surface; never leave burning incense unattended"
    ],
    "specifications": [
      {
        "label": "Material",
        "value": "Ceramic"
      },
      {
        "label": "Colour",
        "value": "White with multicoloured patterning"
      },
      {
        "label": "Design",
        "value": "Raised bowl and pedestal base"
      },
      {
        "label": "Use",
        "value": "Incense burning"
      }
    ]
  },
  {
    "slug": "floral-coffee-cups-12",
    "catalogItem": 11,
    "name": "Ethiopian Floral Coffee Cups – Set of 12, 60 ml",
    "shortDescription": "Set of 12 small floral-patterned cups for serving traditional Ethiopian coffee.",
    "description": "Serve coffee in traditional small portions with this set of 12 floral cups. Their compact size and colourful decoration make them suitable for family coffee ceremonies, entertaining guests and everyday coffee service.",
    "category": "coffee",
    "weight": "Set of 12 · 60 ml cups",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/floral-coffee-cups-12.png",
    "images": [
      "/images/floral-coffee-cups-12.png",
      "/images/floral-coffee-cup.png"
    ],
    "features": [
      "12 matching cups",
      "Small coffee-serving capacity",
      "Decorative floral pattern"
    ],
    "specifications": [
      {
        "label": "Quantity",
        "value": "12 cups"
      },
      {
        "label": "Capacity",
        "value": "Approximately 60 ml per cup"
      },
      {
        "label": "Design",
        "value": "White with floral motifs"
      }
    ]
  },
  {
    "slug": "clay-spice-container",
    "catalogItem": 12,
    "name": "Traditional Ethiopian Clay Spice Container",
    "shortDescription": "Black pottery spice container with several covered compartments and a central handle.",
    "description": "Organise dry spices and present condiments in a traditional-style pottery container. Its separate covered sections help keep ingredients apart, while the central handle makes the piece easy to position on a dining or serving table.",
    "category": "kitchen",
    "weight": "1 container",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/clay-spice-container.png",
    "images": [
      "/images/clay-spice-container.png",
      "/images/clay-spice-container-open.png"
    ],
    "features": [
      "Multiple covered compartments",
      "Central handle",
      "Traditional black pottery style"
    ],
    "specifications": [
      {
        "label": "Material",
        "value": "Clay / pottery"
      },
      {
        "label": "Colour",
        "value": "Black"
      },
      {
        "label": "Design",
        "value": "Multiple lidded compartments"
      },
      {
        "label": "Handle",
        "value": "Central carrying handle"
      }
    ]
  },
  {
    "slug": "electric-coffee-hot-plate",
    "catalogItem": 13,
    "name": "Electric Coffee Hot Plate – 1200 W",
    "shortDescription": "Compact electric hot plate for use with compatible coffee pots and small cooking vessels.",
    "description": "This compact tabletop electric hot plate provides a heating option for compatible coffee-making equipment. Its adjustment knob lets you control the heat while preparing coffee or heating a suitable small vessel.",
    "category": "coffee",
    "weight": "1 hot plate",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/coffee-hot-plate.png",
    "images": [
      "/images/coffee-hot-plate.png",
      "/images/coffee-hot-plate-box.png"
    ],
    "features": [
      "1200 W rating",
      "Adjustable heat control",
      "Compact tabletop design",
      "Use only with compatible cookware"
    ],
    "specifications": [
      {
        "label": "Type",
        "value": "Electric hot plate"
      },
      {
        "label": "Rated power",
        "value": "1200 W"
      },
      {
        "label": "Controls",
        "value": "Manual heat adjustment knob"
      },
      {
        "label": "Indicator",
        "value": "Power light"
      }
    ]
  },
  {
    "slug": "food-warmer-3-dish",
    "catalogItem": 14,
    "name": "Ethiopian Ceramic Food Warmer – 3-Dish Serving Set",
    "shortDescription": "Decorative three-dish serving set with covered ceramic dishes and matching spoons.",
    "description": "Present stews, sauces and side dishes in a coordinated serving set. Three patterned dishes with lids sit in a decorative stand, creating an attractive arrangement for family meals and celebrations.",
    "category": "kitchen",
    "weight": "3-dish set",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/food-warmer-3-dish.png",
    "images": [
      "/images/food-warmer-3-dish.png"
    ],
    "features": [
      "Three covered serving dishes",
      "Coordinated serving stand",
      "Decorative patterned finish",
      "Suitable for presenting several dishes together"
    ],
    "specifications": [
      {
        "label": "Configuration",
        "value": "Three covered dishes"
      },
      {
        "label": "Includes",
        "value": "Serving stand and matching spoons as pictured"
      },
      {
        "label": "Appearance",
        "value": "Multicoloured geometric pattern"
      }
    ]
  },
  {
    "slug": "coffee-set-18-piece",
    "catalogItem": 15,
    "name": "Ethiopian Coffee Cup, Saucer & Spoon Set – 18 Pieces",
    "shortDescription": "Coordinated coffee serving set with six cups, six saucers and six spoons.",
    "description": "Serve six guests with this matching coffee set. The cups, saucers and spoons are designed to look coordinated on the coffee table, making the set suitable for Ethiopian coffee ceremonies, family visits and special occasions.",
    "category": "coffee",
    "weight": "18-piece set",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/coffee-set-18-piece.png",
    "images": [
      "/images/coffee-set-18-piece.png"
    ],
    "features": [
      "18-piece set",
      "Six complete coffee servings",
      "Decorative coordinated design"
    ],
    "specifications": [
      {
        "label": "Total pieces",
        "value": "18"
      },
      {
        "label": "Contents",
        "value": "6 cups, 6 saucers and 6 spoons"
      },
      {
        "label": "Design",
        "value": "Multicoloured geometric pattern"
      }
    ]
  },
  {
    "slug": "food-warmer-2-dish",
    "catalogItem": 16,
    "name": "Ethiopian Ceramic Food Warmer – 2-Dish Serving Set",
    "shortDescription": "Decorative two-dish serving set with lids and matching serving spoons.",
    "description": "Arrange two stews, sauces or side dishes in this compact coordinated serving set. The covered dishes and decorative stand bring a traditional touch to everyday meals and smaller gatherings.",
    "category": "kitchen",
    "weight": "2-dish set",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/food-warmer-2-dish.png",
    "images": [
      "/images/food-warmer-2-dish.png"
    ],
    "features": [
      "Two covered dishes",
      "Matching spoons and stand",
      "Compact tabletop arrangement"
    ],
    "specifications": [
      {
        "label": "Configuration",
        "value": "Two covered ceramic dishes"
      },
      {
        "label": "Includes",
        "value": "Coordinated stand and two serving spoons as pictured"
      },
      {
        "label": "Design",
        "value": "Colourful geometric pattern"
      }
    ]
  },
  {
    "slug": "coffee-ceremony-set-23-piece",
    "catalogItem": 17,
    "name": "Ethiopian Traditional Coffee Ceremony Set – 23 Pieces",
    "shortDescription": "Decorative 23-piece coffee serving collection with coffee pot and coordinated accessories.",
    "description": "Bring together the essential presentation pieces for a traditional Ethiopian coffee serving experience. This coordinated collection pairs a decorative pot with matching tableware for family gatherings, celebrations and gifting.",
    "category": "coffee",
    "weight": "23-piece set",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/coffee-set-23-piece.png",
    "images": [
      "/images/coffee-set-23-piece.png",
      "/images/coffee-set-23-piece-box.png"
    ],
    "features": [
      "23-piece collection",
      "Coordinated coffee pot and tableware",
      "Suitable for traditional coffee service and gifts"
    ],
    "specifications": [
      {
        "label": "Total pieces",
        "value": "23"
      },
      {
        "label": "Components",
        "value": "Coffee pot, cups, saucers, spoons and accessories"
      },
      {
        "label": "Design",
        "value": "Colourful traditional-style pattern"
      }
    ]
  },
  {
    "slug": "amharic-alphabet-chart",
    "catalogItem": 18,
    "name": "Amharic Alphabet Learning Chart for Kids",
    "shortDescription": "Colourful educational chart featuring Amharic letters, numbers and illustrations.",
    "description": "Introduce children to the Amharic writing system with colourful letters, numbers and pictures. The chart offers a visual learning aid for families practising the language at home.",
    "category": "culture",
    "weight": "1 chart",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/amharic-alphabet-chart.png",
    "images": [
      "/images/amharic-alphabet-chart.png"
    ],
    "features": [
      "Amharic alphabet characters",
      "Numbers and illustrations",
      "Child-friendly visual learning resource"
    ],
    "specifications": [
      {
        "label": "Language",
        "value": "Amharic"
      },
      {
        "label": "Contents",
        "value": "Ethiopian alphabet characters, numbers and pictures"
      },
      {
        "label": "Format",
        "value": "Illustrated educational chart"
      }
    ]
  },
  {
    "slug": "snack-stand-3-tier",
    "catalogItem": 19,
    "name": "Ethiopian-Style 3-Tier Cake & Snack Stand",
    "shortDescription": "Three-tier serving stand with patterned melamine plates and gold-coloured details.",
    "description": "Arrange pastries, cakes, snacks and refreshments on three levels with this decorative stand. It keeps treats visible while making efficient use of table space during coffee ceremonies and celebrations.",
    "category": "kitchen",
    "weight": "3 tiers",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/snack-stand-3-tier.png",
    "images": [
      "/images/snack-stand-3-tier.png"
    ],
    "features": [
      "Three-tier arrangement",
      "Patterned serving plates",
      "Attractive for snacks and pastries"
    ],
    "specifications": [
      {
        "label": "Material",
        "value": "Melamine serving plates"
      },
      {
        "label": "Tiers",
        "value": "Three"
      },
      {
        "label": "Design",
        "value": "White plates with colourful decorative borders"
      },
      {
        "label": "Support finish",
        "value": "Gold-coloured"
      }
    ]
  },
  {
    "slug": "ethiopian-frankincense",
    "catalogItem": 20,
    "name": "Ethiopian Frankincense (Etan) – Traditional Incense",
    "shortDescription": "Traditional frankincense resin for Ethiopian coffee ceremonies and cultural gatherings.",
    "description": "Frankincense is traditionally burned alongside Ethiopian and Eritrean coffee preparation. Used with an appropriate incense burner, the resin gives off a characteristic aromatic smoke and helps set the atmosphere for a coffee ceremony.",
    "category": "coffee",
    "weight": "Incense resin",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/frankincense.png",
    "images": [
      "/images/frankincense.png"
    ],
    "features": [
      "Traditional incense resin",
      "For suitable incense burners",
      "Use with ventilation and on a heat-resistant surface",
      "Never leave burning incense unattended"
    ],
    "specifications": [
      {
        "label": "Product",
        "value": "Frankincense incense"
      },
      {
        "label": "Form",
        "value": "Resin pieces"
      },
      {
        "label": "Use",
        "value": "Incense burning"
      }
    ]
  },
  {
    "slug": "ketema-grass",
    "catalogItem": 21,
    "name": "Traditional Ethiopian Ketema Grass – Coffee Ceremony Decoration",
    "shortDescription": "Bundled green grass for decorating traditional Ethiopian coffee ceremony spaces.",
    "description": "Ketema is traditionally arranged around the coffee preparation area to create a welcoming setting. Use it alongside a coffee table, incense burner and other traditional coffee ceremony accessories for family gatherings and cultural occasions.",
    "category": "coffee",
    "weight": "Grass bundle",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/ketema-grass.png",
    "images": [
      "/images/ketema-grass.png"
    ],
    "features": [
      "Traditional coffee ceremony decoration",
      "Bundled green stems",
      "Complements coffee-serving accessories"
    ],
    "specifications": [
      {
        "label": "Product",
        "value": "Ketema ceremonial grass"
      },
      {
        "label": "Form",
        "value": "Bundled grass stems"
      },
      {
        "label": "Colour",
        "value": "Green"
      }
    ]
  },
  {
    "slug": "floral-injera-tray-40cm",
    "catalogItem": 22,
    "name": "Ethiopian Melamine Injera Serving Tray – Floral Design, 40 cm",
    "shortDescription": "Round 40 cm melamine serving tray with a colourful floral pattern.",
    "description": "Serve injera with stews and accompaniments on this generously sized round tray. The floral artwork adds colour to the dining table, while the lightweight design is convenient for family meals and gatherings.",
    "category": "kitchen",
    "weight": "40 cm tray",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/injera-tray-blue.png",
    "images": [
      "/images/injera-tray-blue.png",
      "/images/injera-tray-colors.png"
    ],
    "features": [
      "40 cm diameter",
      "Lightweight serving tray",
      "Decorative floral artwork",
      "Suitable for shared meal presentation"
    ],
    "specifications": [
      {
        "label": "Material",
        "value": "Melamine"
      },
      {
        "label": "Diameter",
        "value": "40 cm"
      },
      {
        "label": "Shape",
        "value": "Round"
      },
      {
        "label": "Design",
        "value": "Floral motif"
      }
    ]
  },
  {
    "slug": "zemen-injera-maker-46cm",
    "catalogItem": 23,
    "name": "Zemen Electric Injera Maker (Mogogo / Mitad) – 46 cm",
    "shortDescription": "Large electric Mogogo with a 46 cm cooking surface for traditional injera.",
    "description": "Prepare wider injera at home with this 46 cm electric Mogogo. The larger round cooking surface offers more room for spreading batter than the 40 cm version. Its lid covers the cooking area during preparation.",
    "category": "kitchen",
    "weight": "46 cm",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/zemen-injera-46cm-box.png",
    "images": [
      "/images/zemen-injera-46cm-box.png",
      "/images/injera-maker.png"
    ],
    "features": [
      "Large 46 cm cooking surface",
      "For Ethiopian and Eritrean injera",
      "Lid included as shown by supplier",
      "Larger alternative to the 40 cm model"
    ],
    "specifications": [
      {
        "label": "Brand",
        "value": "Zemen"
      },
      {
        "label": "Type",
        "value": "Electric injera maker"
      },
      {
        "label": "Cooking surface diameter",
        "value": "46 cm"
      },
      {
        "label": "Design",
        "value": "Round cooking plate with lid"
      }
    ]
  },
  {
    "slug": "meshrefet-basket",
    "catalogItem": 24,
    "name": "Traditional Ethiopian Woven Meshrefet Basket – Medium",
    "shortDescription": "Round woven basket with a natural-coloured centre and a colourful decorative border.",
    "description": "This traditional-style woven basket adds a handcrafted look to a home or cultural display. Its circular woven pattern and colourful border make it an attractive decorative tray or display accessory.",
    "category": "culture",
    "weight": "Medium basket",
    "weightKg": null,
    "priceEur": null,
    "availability": "coming-soon",
    "image": "/images/meshrefet-basket.png",
    "images": [
      "/images/meshrefet-basket.png"
    ],
    "features": [
      "Round woven design",
      "Colourful border",
      "Suitable for decorative display"
    ],
    "specifications": [
      {
        "label": "Product",
        "value": "Meshrefet woven basket / decorative tray"
      },
      {
        "label": "Shape",
        "value": "Round"
      },
      {
        "label": "Appearance",
        "value": "Natural woven centre with multicoloured border"
      }
    ]
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function isProductPurchasable(product: Product): product is Product & { priceEur: number } {
  return product.availability === "in-stock" && product.priceEur !== null &&
    Number.isFinite(product.priceEur) && product.priceEur > 0;
}
