
import { searchClient } from '@algolia/client-search';
// Default version (all methods)
import algoliasearch from 'algoliasearch';
import fs from 'fs';


// Search-only version
// import algoliasearch from 'algoliasearch/lite';

const aClient = algoliasearch('S6ZEXIE5TS', '9f67131599df12752846dda0d6ba3e49');
const client = searchClient('S6ZEXIE5TS', '9f67131599df12752846dda0d6ba3e49');
// Fetch and index objects in Algolia
const processRecords = async () => {
  const categoryRequest = await fetch('https://cdn.inksoft.com/'+process.env.NEXT_PUBLIC_INKSOFT_STORE+'/Api2/GetProductCategories?IncludeAllPublisherCategories=false&BlankProducts=true&StaticProducts=true&ProductType=all')
  const categories = await categoryRequest.json();
  const datasetRequest = await fetch('https://cdn.inksoft.com/'+process.env.NEXT_PUBLIC_INKSOFT_STORE+'/Api2/GetProductBaseList?Format=JSON&Index=0&MaxResults=-1&SortFilters=%5B%7B%22Property%22%3A%22Name%22%2C%22Direction%22%3A%22Ascending%22%7D%5D&IncludePrices=true&IncludeAllStyles=true&IncludeSizes=false&StoreVersion=638659111691800000-58100&IncludeQuantityPacks=true');
   const products = await datasetRequest.json();

  let extractedProducts = products.Data.map(product => ({
    CanEmbroider: product.CanEmbroider,
    CanScreenPrint: product.CanScreenPrint,
    CanDigitalPrint: product.CanDigitalPrint,
    CanPrint: product.CanPrint,
    Active: product.Active,
    ManufacturerId: product.ManufacturerId,
    ID: product.ID,
    Slug: product.Name.replace(/ /g, '-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '').replace(/--/g, '-').replace(/---/g, '-'),
    Keywords: product.Keywords,
    DecoratedProductSides: product.DecoratedProductSides,
    Categories: categories.Data.filter(category => category.ItemIds.includes(product.ID)).map(category => category.Name),
    Styles: product.Styles.map(style => ({
      ImageFilePath_Front:style.ImageFilePath_Front,
      "Name": style.Name,
      Sides:null,
      Color: style.HtmlColor1,
      ID: style.ID,
    })),
    ProductType: product.ProductType,
    SalePrice: product.SalePrice,
    UnitPrice: product.UnitPrice,
    CurrentPrice: product.SalePrice ?? product.UnitPrice,
    UnitCost: product.UnitCost,
    ManufacturerBrandImageUrl: product.ManufacturerBrandImageUrl,
    LongDescription: product.LongDescription,
    SizeUnit: product.SizeUnit,
    Name: product.Name,
    Sku: product.Sku,
    Supplier: product.Supplier,
    ManufacturerSku: product.ManufacturerSku,
    Manufacturer: product.Manufacturer,
    
  }));

  let tooBig = 0;
  extractedProducts = extractedProducts.filter((product, index) => {
    if(index === 0){
      console.log('Product:', JSON.stringify(product,null,2))
    }
     if(JSON.stringify(product).length < 10000){
      return true
     } else{
        // TODO: Break up the product into smaller objects
        tooBig++;
        // console.log('Product too large to index:', JSON.stringify(product.Styles,null,2))
     }
  });  
  


  try{
    const index = aClient.initIndex('products_index');
    const facets = [
      'Name', // Primary searchable attribute
      'Keywords', // Secondary attribute for keyword matching
      'LongDescription', // Additional attribute for deeper search
      'Manufacturer',
      'Sku',
      'ManufacturerSku',
      'ID',
      'CurrentPrice',
      'CanEmbroider',
      'CanScreenPrint',
      'CanDigitalPrint'
    ]
    await index.clearObjects()
    await client.saveObjects({ indexName: 'products_index', objects: extractedProducts });

    await index.setSettings({
      customRanking: [
        'asc(Name)'
      ],
      searchableAttributes: facets,
    });

    const slugIds = extractedProducts.map(product => ({
      slug: product.Slug,
      id: product.ID
    }));

    // save slugIds to a file in the data directory
    fs.writeFileSync('./data/slugIds.json', JSON.stringify(slugIds, null, 2));

    return {count: extractedProducts.length, tooBig};
  } catch (e){
    console.error(e);
  }
};



export default async function handler(req, res) {

  try{
    const results = await processRecords()
    return res.status(200).json({ message: "Indexing complete", results });
  } catch (e){
    console.error(e);
  }

}
