
import { searchClient } from '@algolia/client-search';

const client = searchClient(process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID, process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY);

// Fetch and index objects in Algolia
const processRecords = async () => {
  const datasetRequest = await fetch('https://cdn.inksoft.com/philadelphiascreenprinting/Api2/GetProductBaseList?Format=JSON&Index=0&MaxResults=-1&SortFilters=%5B%7B%22Property%22%3A%22Name%22%2C%22Direction%22%3A%22Ascending%22%7D%5D&IncludePrices=true&IncludeAllStyles=true&IncludeSizes=false&StoreVersion=638659111691800000-58100&IncludeQuantityPacks=true');
   const products = await datasetRequest.json();

  let extractedProducts = products.Data.map(product => ({
    CanEmbroider: product.CanEmbroider,
    CanScreenPrint: product.CanScreenPrint,
    CanDigitalPrint: product.CanDigitalPrint,
    CanPrint: product.CanPrint,
    Active: product.Active,
    ManufacturerId: product.ManufacturerId,
    ID: product.ID,
    Keywords: product.Keywords,
    DecoratedProductSides: product.DecoratedProductSides,
    Categories: product.Categories,
    Styles: product.Styles,
    ProductType: product.ProductType,
    SalePrice: product.SalePrice,
    UnitPrice: product.UnitPrice,
    UnitCost: product.UnitCost,
    ManufacturerBrandImageUrl: product.ManufacturerBrandImageUrl,
    LongDescription: product.LongDescription,
    SizeUnit: product.SizeUnit,
    Name: product.Name,
    Sku: product.Sku,
    Supplier: product.Supplier,
    ManufacturerSku: product.ManufacturerSku,
    Manufacturer: product.Manufacturer
  }));
  
  extractedProducts = extractedProducts.filter((product, index) => {
    return JSON.stringify(product).length < 10000;
  });  

  try{
    return await client.saveObjects({ indexName: 'products_index', objects: extractedProducts });
  } catch (e){
    console.error(e);
  }
};



export default function handler(req, res) {

  processRecords()
  .then(() => console.log('Successfully indexed objects!'))
  .catch((err) => console.error(err));
  
  res.status(200).json({ name: "John Doe" });
}
