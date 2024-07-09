import formatCurrency from "../script/Utils/money.js";

export function getProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}

export class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  //this is converting a object into class
  //we do this since classes have xtra features ,same object but an enhanced version
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }
  getPrice() {
    //used it in amazon.js and orderSummary.js
    return `$${formatCurrency(this.priceCents)}`;
  }
  extraInfoHTML() {
    //added this here also since if the product is not a clothing product it may have thrown error in the amazon.js where this method was called (line:57(may change))and the method should be present here too for non clothing product
    return "";
  }
}

//Inheritance - class have a property where a child class  inherit all the properties from its parent class and have addon properties
//like here we made a class clothing to group all the similar products to have addon specific properties
export class Clothing extends Product {
  //clothing can have size chart  - size chartlink is already added to object
  sizeChartLink;
  //if we dont create the constructor it will automatically run the parent constructor
  constructor(productDetails) {
    super(productDetails); //calls the constructor of parent class,which will set the rest details
    this.sizeChartLink = productDetails.sizeChartLink;
  }
  //method overriding of parent method
  extraInfoHTML() {
    // super.extraInfoHTML();//calls out parent method
    return `
    <a class="external-link" href = "${this.sizeChartLink}" target = "_blank">
    Size chart
    </a>
    `;
  }
}
export class Appliance extends Product {
  instructionsLink;
  warrantyLink;
  constructor(productDetails) {
    super(productDetails);
    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
  }
  extraInfoHTML() {
    return `
    <a class="external-link" href = "${this.instructionsLink}" target = "_blank">
    Instructions
    </a>
    <a class="external-link" href = "${this.warrantyLink}" target = "_blank">
    Warranty
    </a>
    `;
  }
}

//eg.
// const tshirt = new Clothing({
//   id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
//   image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
//   name: "Adults Plain Cotton T-Shirt - 2 Pack",
//   rating: {
//     stars: 4.5,
//     count: 56
//   },
//   priceCents: 799,
//   keywords: [
//     "tshirts",
//     "apparel",
//     "mens"
//   ],
//   type: "clothing",//discriminator property
//   sizeChartLink: "images/clothing-size-chart.png"
// });
//so we can se that it inherited all the properties from Product class , since it taking the product object and converting it into class
// console.log(tshirt);
// console.log(tshirt.getPrice());

// const product1 = new Product( {
//   id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
//   image: "images/products/athletic-cotton-socks-6-pairs.jpg",
//   name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
//   rating: {
//     stars: 4.5,
//     count: 87
//   },
//   priceCents: 1090,
//   keywords: [
//     "socks",
//     "sports",
//     "apparel"
//   ]
// });
//this creates new object named product1
//one way to set the property of each element is by accesing each element and changing the value , but we have to create for many products so we will use constructor which will run whenver we run an object
// console.log(product1);

//now to add every product we need to create for every product ,but that will take a lot of work to do , so we will loop throught the array with map which changes the array and saves it new array

//minimise to see built in classes at last

//generating products from backend
//due to this appliances will not works in this lesson since we didnt now cant update manually the details 
export let products = [];

export function loadProductsFetch(){
  //response is fed into then function
  const promise = fetch('backend/products.json').then((response) => {
    console.log(response);
    //this gives the json or data that is attached to the response
    return response.json();//response.json() is asynchronouse, it returns a promise, so we need to wait for this promise to finish to go to next step 
    //so we will return a promise inside then
    //this makes a GET http request directly without creating object
    //instead of callback fetch uses promise
  }).then((productData) => {//andar promise return krega response , jo kee products k details hai 
    console.log('loaded product');
    console.log(productData);//it did convert the json data into array , meaning it did json.parse for us
    products = productData//converting in JS class from object
    .map((productDetails) => {
      if (productDetails.type === "clothing") {
        return new Clothing(productDetails);
      } else if (productDetails.type === "appliance") {
        return new Appliance(productDetails);
      }
      return new Product(productDetails);
    });
    //error handling in promises
  })/*.catch((error) => {//jsut like callback it gets a parameter error which have info about error 
    console.log('Unexpected error. Please try again later.');
    console.log(error);
  });*/
  return promise;//return this promise outside this function so we can add even more steps after this promise 
}
// so we can return a promise out the function then we can keep attaching more steps to that promise 
/*
loadProductsFetch() //this gives promise
.then(() => {
  console.log('next step')
})
*/
 export function loadProducts(fun){
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load',() => {
    products = JSON.parse(xhr.response)//converting in JS class from object
    .map((productDetails) => {
      if (productDetails.type === "clothing") {
        return new Clothing(productDetails);
      } else if (productDetails.type === "appliance") {
        return new Appliance(productDetails);
      }
      return new Product(productDetails);
    });

    console.log('loads products');
    fun();//this will generate the products html after the response have been laoded 
    //this callback a function to run in the future eg.callback
  })
  //for callback we set up a seperate callback just for errors
  xhr.addEventListener('error', (error) => {
    console.log('Unexpected error. Please try again later.')
  })

  xhr.open('GET', 'backend/products.json');
  // xhr.open('GET', 'https://error.supersimplebackend.dev/products');//just for practice
//Http requests are asynchronous
  xhr.send();
 }

/*
export const products = [
  {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    rating: {
      stars: 4.5,
      count: 87,
    },
    priceCents: 1090,
    keywords: ["socks", "sports", "apparel"],
  },
  {
    id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    image: "images/products/intermediate-composite-basketball.jpg",
    name: "Intermediate Size Basketball",
    rating: {
      stars: 4,
      count: 127,
    },
    priceCents: 2095,
    keywords: ["sports", "basketballs"],
  },
  {
    id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
    image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    rating: {
      stars: 4.5,
      count: 56,
    },
    priceCents: 799,
    keywords: ["tshirts", "apparel", "mens"],
    type: "clothing",
    sizeChartLink: "images/clothing-size-chart.png",
  },
  {
    id: "54e0eccd-8f36-462b-b68a-8182611d9add",
    image: "images/products/black-2-slot-toaster.jpg",
    name: "2 Slot Toaster - Black",
    rating: {
      stars: 5,
      count: 2197,
    },
    priceCents: 1899,
    keywords: ["toaster", "kitchen", "appliances"],
    type: "appliance",
    instructionsLink: "images/appliance-instructions.png",
    warrantyLink: "images/appliance-warranty.png",
  },
  {
    id: "3ebe75dc-64d2-4137-8860-1f5a963e534b",
    image: "images/products/6-piece-white-dinner-plate-set.jpg",
    name: "6 Piece White Dinner Plate Set",
    rating: {
      stars: 4,
      count: 37,
    },
    priceCents: 2067,
    keywords: ["plates", "kitchen", "dining"],
  },
  {
    id: "8c9c52b5-5a19-4bcb-a5d1-158a74287c53",
    image: "images/products/6-piece-non-stick-baking-set.webp",
    name: "6-Piece Nonstick, Carbon Steel Oven Bakeware Baking Set",
    rating: {
      stars: 4.5,
      count: 175,
    },
    priceCents: 3499,
    keywords: ["kitchen", "cookware"],
  },
  {
    id: "dd82ca78-a18b-4e2a-9250-31e67412f98d",
    image: "images/products/plain-hooded-fleece-sweatshirt-yellow.jpg",
    name: "Plain Hooded Fleece Sweatshirt",
    rating: {
      stars: 4.5,
      count: 317,
    },
    priceCents: 2400,
    keywords: ["hoodies", "sweaters", "apparel"],
    type: "clothing",
    sizeChartLink: "images/clothing-size-chart.png",
  },
  {
    id: "77919bbe-0e56-475b-adde-4f24dfed3a04",
    image: "images/products/luxury-tower-set-6-piece.jpg",
    name: "Luxury Towel Set - Graphite Gray",
    rating: {
      stars: 4.5,
      count: 144,
    },
    priceCents: 3599,
    keywords: ["bathroom", "washroom", "restroom", "towels", "bath towels"],
  },
  {
    id: "3fdfe8d6-9a15-4979-b459-585b0d0545b9",
    image: "images/products/liquid-laundry-detergent-plain.jpg",
    name: "Liquid Laundry Detergent, 110 Loads, 82.5 Fl Oz",
    rating: {
      stars: 4.5,
      count: 305,
    },
    priceCents: 2899,
    keywords: ["bathroom", "cleaning"],
  },
  {
    id: "58b4fc92-e98c-42aa-8c55-b6b79996769a",
    image: "images/products/knit-athletic-sneakers-gray.jpg",
    name: "Waterproof Knit Athletic Sneakers - Gray",
    rating: {
      stars: 4,
      count: 89,
    },
    priceCents: 3390,
    keywords: ["shoes", "running shoes", "footwear"],
  },
  {
    id: "5968897c-4d27-4872-89f6-5bcb052746d7",
    image: "images/products/women-chiffon-beachwear-coverup-black.jpg",
    name: "Women's Chiffon Beachwear Cover Up - Black",
    rating: {
      stars: 4.5,
      count: 235,
    },
    priceCents: 2070,
    keywords: ["robe", "swimsuit", "swimming", "bathing", "apparel"],
    type: "clothing",
    sizeChartLink: "images/clothing-size-chart.png",
  },
  {
    id: "aad29d11-ea98-41ee-9285-b916638cac4a",
    image: "images/products/round-sunglasses-black.jpg",
    name: "Round Sunglasses",
    rating: {
      stars: 4.5,
      count: 30,
    },
    priceCents: 1560,
    keywords: ["accessories", "shades"],
  },
  {
    id: "04701903-bc79-49c6-bc11-1af7e3651358",
    image: "images/products/women-beach-sandals.jpg",
    name: "Women's Two Strap Buckle Sandals - Tan",
    rating: {
      stars: 4.5,
      count: 562,
    },
    priceCents: 2499,
    keywords: ["footwear", "sandals", "womens", "beach", "summer"],
  },
  {
    id: "901eb2ca-386d-432e-82f0-6fb1ee7bf969",
    image: "images/products/blackout-curtain-set-beige.webp",
    name: "Blackout Curtains Set 4-Pack - Beige",
    rating: {
      stars: 4.5,
      count: 232,
    },
    priceCents: 4599,
    keywords: ["bedroom", "curtains", "home"],
  },
  {
    id: "82bb68d7-ebc9-476a-989c-c78a40ee5cd9",
    image: "images/products/men-slim-fit-summer-shorts-gray.jpg",
    name: "Men's Slim-Fit Summer Shorts",
    rating: {
      stars: 4,
      count: 160,
    },
    priceCents: 1699,
    keywords: ["shorts", "apparel", "mens"],
  },
  {
    id: "c2a82c5e-aff4-435f-9975-517cfaba2ece",
    image: "images/products/electric-glass-and-steel-hot-water-kettle.webp",
    name: "Electric Glass and Steel Hot Tea Water Kettle - 1.7-Liter",
    rating: {
      stars: 5,
      count: 846,
    },
    priceCents: 3074,
    keywords: ["water boiler", "appliances", "kitchen"],
    type: "appliance",
    instructionsLink: "images/appliance-instructions.png",
    warrantyLink: "images/appliance-warranty.png",
  },
  {
    id: "6b07d4e7-f540-454e-8a1e-363f25dbae7d",
    image: "images/products/facial-tissue-2-ply-18-boxes.jpg",
    name: "Ultra Soft Tissue 2-Ply - 18 Box",
    rating: {
      stars: 4,
      count: 99,
    },
    priceCents: 2374,
    keywords: ["kleenex", "tissues", "kitchen", "tissues box", "napkins"],
  },
  {
    id: "a82c6bac-3067-4e68-a5ba-d827ac0be010",
    image: "images/products/straw-sunhat.webp",
    name: "Straw Lifeguard Sun Hat",
    rating: {
      stars: 4,
      count: 215,
    },
    priceCents: 2200,
    keywords: ["hats", "straw hats", "summer", "apparel"],
  },
  {
    id: "e4f64a65-1377-42bc-89a5-e572d19252e2",
    image: "images/products/sky-flower-stud-earrings.webp",
    name: "Sterling Silver Sky Flower Stud Earrings",
    rating: {
      stars: 4.5,
      count: 52,
    },
    priceCents: 1799,
    keywords: ["jewelry", "accessories", "womens"],
  },
  {
    id: "b0f17cc5-8b40-4ca5-9142-b61fe3d98c85",
    image: "images/products/women-stretch-popover-hoodie-black.jpg",
    name: "Women's Stretch Popover Hoodie",
    rating: {
      stars: 4.5,
      count: 2465,
    },
    priceCents: 1374,
    keywords: ["hooded", "hoodies", "sweaters", "womens", "apparel"],
    type: "clothing",
    sizeChartLink: "images/clothing-size-chart.png",
  },
  {
    id: "a93a101d-79ef-4cf3-a6cf-6dbe532a1b4a",
    image: "images/products/bathroom-rug.jpg",
    name: "Bathroom Bath Rug Mat 20 x 31 Inch - Grey",
    rating: {
      stars: 4.5,
      count: 119,
    },
    priceCents: 1250,
    keywords: ["bathmat", "bathroom", "home"],
  },
  {
    id: "4f4fbcc2-4e72-45cc-935c-9e13d79cc57f",
    image: "images/products/women-knit-ballet-flat-black.jpg",
    name: "Women's Knit Ballet Flat",
    rating: {
      stars: 4,
      count: 326,
    },
    priceCents: 2640,
    keywords: ["shoes", "flats", "womens", "footwear"],
  },
  {
    id: "8b5a2ee1-6055-422a-a666-b34ba28b76d4",
    image: "images/products/men-golf-polo-t-shirt-blue.jpg",
    name: "Men's Regular-Fit Quick-Dry Golf Polo Shirt",
    rating: {
      stars: 4.5,
      count: 2556,
    },
    priceCents: 1599,
    keywords: ["tshirts", "shirts", "apparel", "mens"],
    type: "clothing",
    sizeChartLink: "images/clothing-size-chart.png",
  },
  {
    id: "b86ddc8b-3501-4b17-9889-a3bad6fb585f",
    image: "images/products/trash-can-with-foot-pedal-50-liter.jpg",
    name: "Trash Can with Foot Pedal - Brushed Stainless Steel",
    rating: {
      stars: 4.5,
      count: 2286,
    },
    priceCents: 8300,
    keywords: ["garbage", "bins", "cans", "kitchen"],
  },
  {
    id: "19c6a64a-5463-4d45-9af8-e41140a4100c",
    image: "images/products/duvet-cover-set-blue-twin.jpg",
    name: "Duvet Cover Set with Zipper Closure",
    rating: {
      stars: 4,
      count: 456,
    },
    priceCents: 2399,
    keywords: ["bedroom", "bed sheets", "sheets", "covers", "home"],
  },
  {
    id: "d2785924-743d-49b3-8f03-ec258e640503",
    image: "images/products/women-chunky-beanie-gray.webp",
    name: "Women's Chunky Cable Beanie - Gray",
    rating: {
      stars: 5,
      count: 83,
    },
    priceCents: 1250,
    keywords: ["hats", "winter hats", "beanies", "tuques", "apparel", "womens"],
  },
  {
    id: "ee1f7c56-f977-40a4-9642-12ba5072e2b0",
    image: "images/products/men-chino-pants-beige.jpg",
    name: "Men's Classic-fit Pleated Chino Pants",
    rating: {
      stars: 4.5,
      count: 9017,
    },
    priceCents: 2290,
    keywords: ["pants", "apparel", "mens"],
  },
  {
    id: "1c079479-8586-494f-ab53-219325432536",
    image: "images/products/men-athletic-shoes-green.jpg",
    name: "Men's Athletic Sneaker",
    rating: {
      stars: 4,
      count: 229,
    },
    priceCents: 3890,
    keywords: ["shoes", "running shoes", "footwear", "mens"],
  },
  {
    id: "4df68c27-fd59-4a6a-bbd1-e754ddb6d53c",
    image: "images/products/men-navigator-sunglasses-brown.jpg",
    name: "Men's Navigator Sunglasses Pilot",
    rating: {
      stars: 3.5,
      count: 42,
    },
    priceCents: 1690,
    keywords: ["sunglasses", "glasses", "accessories", "shades"],
  },
  {
    id: "4e37dd03-3b23-4bc6-9ff8-44e112a92c64",
    image: "images/products/non-stick-cooking-set-15-pieces.webp",
    name: "Non-Stick Cookware Set, Pots, Pans and Utensils - 15 Pieces",
    rating: {
      stars: 4.5,
      count: 511,
    },
    priceCents: 6797,
    keywords: ["cooking set", "kitchen"],
  },
  {
    id: "a434b69f-1bc1-482d-9ce7-cd7f4a66ce8d",
    image: "images/products/vanity-mirror-silver.jpg",
    name: "Vanity Mirror with Heavy Base - Chrome",
    rating: {
      stars: 4.5,
      count: 130,
    },
    priceCents: 1649,
    keywords: ["bathroom", "washroom", "mirrors", "home"],
  },
  {
    id: "a45cfa0a-66d6-4dc7-9475-e2b01595f7d7",
    image: "images/products/women-french-terry-fleece-jogger-camo.jpg",
    name: "Women's Fleece Jogger Sweatpant",
    rating: {
      stars: 4.5,
      count: 248,
    },
    priceCents: 2400,
    keywords: ["pants", "sweatpants", "jogging", "apparel", "womens"],
  },
  {
    id: "d339adf3-e004-4c20-a120-40e8874c66cb",
    image: "images/products/double-elongated-twist-french-wire-earrings.webp",
    name: "Double Oval Twist French Wire Earrings - Gold",
    rating: {
      stars: 4.5,
      count: 117,
    },
    priceCents: 2400,
    keywords: ["accessories", "womens"],
  },
  {
    id: "d37a651a-d501-483b-aae6-a9659b0757a0",
    image: "images/products/round-airtight-food-storage-containers.jpg",
    name: "Round Airtight Food Storage Containers - 5 Piece",
    rating: {
      stars: 4,
      count: 126,
    },
    priceCents: 2899,
    keywords: ["boxes", "food containers", "kitchen"],
  },
  {
    id: "0d7f9afa-2efe-4fd9-b0fd-ba5663e0a524",
    image: "images/products/coffeemaker-with-glass-carafe-black.jpg",
    name: "Coffeemaker with Glass Carafe and Reusable Filter - 25 Oz, Black",
    rating: {
      stars: 4.5,
      count: 1211,
    },
    priceCents: 2250,
    keywords: ["coffeemakers", "kitchen", "appliances"],
    type: "appliance",
    instructionsLink: "images/appliance-instructions.png",
    warrantyLink: "images/appliance-warranty.png",
  },
  {
    id: "02e3a47e-dd68-467e-9f71-8bf6f723fdae",
    image: "images/products/blackout-curtains-black.jpg",
    name: "Blackout Curtains Set 42 x 84-Inch - Black, 2 Panels",
    rating: {
      stars: 4.5,
      count: 363,
    },
    priceCents: 3099,
    keywords: ["bedroom", "home"],
  },
  {
    id: "8a53b080-6d40-4a65-ab26-b24ecf700bce",
    image: "images/products/cotton-bath-towels-teal.webp",
    name: "100% Cotton Bath Towels - 2 Pack, Light Teal",
    rating: {
      stars: 4.5,
      count: 93,
    },
    priceCents: 2110,
    keywords: ["bathroom", "home", "towels"],
  },
  {
    id: "10ed8504-57db-433c-b0a3-fc71a35c88a1",
    image: "images/products/knit-athletic-sneakers-pink.webp",
    name: "Waterproof Knit Athletic Sneakers - Pink",
    rating: {
      stars: 4,
      count: 89,
    },
    priceCents: 3390,
    keywords: ["shoes", "running shoes", "footwear", "womens"],
  },
  {
    id: "77a845b1-16ed-4eac-bdf9-5b591882113d",
    image: "images/products/countertop-blender-64-oz.jpg",
    name: "Countertop Blender - 64oz, 1400 Watts",
    rating: {
      stars: 4,
      count: 3,
    },
    priceCents: 10747,
    keywords: ["food blenders", "kitchen", "appliances"],
    type: "appliance",
    instructionsLink: "images/appliance-instructions.png",
    warrantyLink: "images/appliance-warranty.png",
  },
  {
    id: "36c64692-677f-4f58-b5ec-0dc2cf109e27",
    image: "images/products/floral-mixing-bowl-set.jpg",
    name: "10-Piece Mixing Bowl Set with Lids - Floral",
    rating: {
      stars: 5,
      count: 679,
    },
    priceCents: 3899,
    keywords: ["mixing bowls", "baking", "cookware", "kitchen"],
  },
  {
    id: "aaa65ef3-8d6f-4eb3-bc9b-a6ea49047d8f",
    image: "images/products/kitchen-paper-towels-30-pack.jpg",
    name: "2-Ply Kitchen Paper Towels - 30 Pack",
    rating: {
      stars: 4.5,
      count: 1045,
    },
    priceCents: 5799,
    keywords: ["kitchen", "kitchen towels", "tissues"],
  },
  {
    id: "bc2847e9-5323-403f-b7cf-57fde044a955",
    image: "images/products/men-cozy-fleece-zip-up-hoodie-red.jpg",
    name: "Men's Full-Zip Hooded Fleece Sweatshirt",
    rating: {
      stars: 4.5,
      count: 3157,
    },
    priceCents: 2400,
    keywords: ["sweaters", "hoodies", "apparel", "mens"],
    type: "clothing",
    sizeChartLink: "images/clothing-size-chart.png",
  },
  {
    id: "id1",
    image: "images/products/backpack.jpg",
    name: "1L backpack",
    rating: {
      stars: 3.5,
      count: 2571,
    },
    priceCents: 2200,
    keywords: ["bag", "backpack", "school bag", "laptop bag"],
  },
  {
    id: "id2",
    image: "images/products/umbrella.jpg",
    name: "Rainy Umbrella black",
    rating: {
      stars: 2.5,
      count: 271,
    },
    priceCents: 200,
    keywords: ["umbrella", "rainy umbrella", "chata", "ceiling"],
  },
].map((productDetails) => {
  if (productDetails.type === "clothing") {
    return new Clothing(productDetails);
  } else if (productDetails.type === "appliance") {
    return new Appliance(productDetails);
  }
  return new Product(productDetails);
  //the transformed result goes into a new array
});
*/
// console.log(products);
//so here products becomes a new array of the new classes formed
//each of the product is a class instead of object with some extra features

//built-in-classes

// const date = new Date();
// console.log(date);
// //it has method
// console.log(date.toLocaleTimeString());
// //dayjs uses this Date class behind the scenes
// //dayjs gives us a lot of extra features
// //so we use dayjs instead od Date directly

// this can be used anywhere in js
//console.log(this);//there is no object for this to point as we are outside the object , so it will give undefined

//const object2 = {
//  a: 2,
//  b: this.a//this is undefined since object2 isnt created yet , so this points to undefined,
// previously this was used inside a method or constructor , which is deployed after the object is created so this can point to an object
// };
// function logThis() {
//   console.log(this); //undefined
// }
// logThis();
// logThis.call("hello");
// // it runs the function as usual but we cant set the value of this
// //if there are are parameters then we have to give this value before the parameters

// //arrow function do not change the value of this
// this;
// const object3 = {
//   method: () => {
//     console.log(this);
//     //here 'this' will have same value as outside the arrow function ,which is undefined , it keeps the value of this that is outside the arrow function
//   },
// };
// object3.method(); //undefined
// //why are arrow function designed this way ?
// //common problem
// //eg
// const object4 = {
//   method() {
//     console.log(this); //here this points to the object

//     [1, 2, 3].forEach(() => {
//       console.log(this);
//       //the problem was that if it was a regular function it would have given undefined since regular function change the value of this and inside there is no object to point which in turn gives undefined as there is no longer access to outer object
//       //so to overcome that the working of arrow function was change to point to outside object
//       //here this will point outside since its a arrow function , so it wont change the value of this that is outside , so it will point to the object
//     });
//   },
// };
//summary of 'this'
//1.inside a method 'this' points to the outer object
// 2.Inside a function, this = undefined , but we can change it
//3.Arrow functions, do no change the value of 'this'
