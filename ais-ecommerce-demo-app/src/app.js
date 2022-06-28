import algoliasearch from "algoliasearch";
const {instantsearch, localStorage } = window;

const searchClient = algoliasearch(
  'YDVAIUXU05',
  '7474ab5f616233cae59d89074465fa74'
);	
const index = searchClient.initIndex('product');
const search = instantsearch({
  indexName: 'product',
  searchClient,
});

console.log(Object.getOwnPropertyNames(index))

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
<div class="product">
<img src="https://ktonanovenkogo.ru/image/tovar-chto-takoe-korobka.jpg" align="left" alt="{{name}}" />
<div class="hit-name">
  {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
</div>
<div class="hit-description">{{description}}</div>
<div class="hit-manufacturer">Manufacturer: {{#helpers.highlight}}{ "attribute": "manufacturer" }{{/helpers.highlight}}</div>
<div class="hit-sku">SKU: {{sku}}</div>
<div class="hit-price">{{price}}\$</div>
<a class="btn-add-purchase buttonClass" onclick="addPurschasee('{{objectID}}')">Add</a> 
</div>
`,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.dynamicWidgets({
    container: '#dynamic-widgets',
    fallbackWidget({ container, attribute }) {
      return instantsearch.widgets.panel({ templates: { header: attribute } })(
        instantsearch.widgets.refinementList
      )({
        container,
        attribute,
      });
    },
    widgets: [],
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);
	

// After the `searchBox` widget
search.addWidgets([
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),

  instantsearch.widgets.refinementList({
    container: '#manufacturer-list',
    attribute: 'manufacturer',
  }),

  instantsearch.widgets.configure({
    hitsPerPage: 8
  }),
]);

search.start();

addPurschase = function(id) { 
  index.getObject(id).then(object => {
    cart = localStorage.getItem('cart');
    if (cart == null)
    {
      cart = {};
    }else{
      cart = JSON.parse(cart)
    }
    console.log(cart);
    if(object.sku in cart)
    {
      cart[object.sku].count += 1;
    }
    else
    {
      object.count = 1;
      cart[object.sku] = object;
    }
    localStorage.setItem('cart', JSON.stringify(cart) );
    console.log(object);
  });
}
