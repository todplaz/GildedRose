var { Shop, Item } = require('../src/gilded_rose.js');
describe("GildedRose shop manager", function () {
  var listItems;

  beforeEach(function () {
    listItems = [];
  });


  it("Baisser de 1 la qualité et sellIn d'item normaux", function () {
    listItems.push(new Item("+5 Dexterity Vest", 10, 20));
    listItems.push(new Item("Mana Cake", 3, 6));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 9, quality: 19 },
      { sellIn: 2, quality: 5 }
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Augmenter la qualité de 1 pour Aged Brie et Backstage passes", function () {
    listItems.push(new Item("Aged Brie", 20, 30));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 20, 30));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 19, quality: 31 },
      { sellIn: 19, quality: 31 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Devrait retourner le resultat correct", () => {
    
    const storeItems = [
      new Item("+5 Dexterity Vest", 10, 20),
      new Item("Aged Brie", 2, 0),
      new Item("Elixir of the Mongoose", 5, 7),
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20)
    ];
    
    const expectedResult = [
      new Item("+5 Dexterity Vest", 9, 19),
      new Item("Aged Brie", 1, 1),
      new Item("Elixir of the Mongoose", 4, 6),
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      new Item("Backstage passes to a TAFKAL80ETC concert", 14, 21)
    ];
    const gildedRose = new Shop(storeItems);
    const items = gildedRose.updateQuality();
  
    expect(items).toEqual(expectedResult);
  });
  
  it("pour les articles normaux, la qualité ne doit jamais être inférieure à 0", () => {
    const storeItems = [new Item("+5 Dexterity Vest", 10, 0)];
    const expectedResult = [new Item("+5 Dexterity Vest", 9, 0)];
    const gildedRose = new Shop(storeItems);
    const items = gildedRose.updateQuality();
  
    expect(items).toEqual(expectedResult);
  });
  
  it("lorsqu'on dépasse la date de vente, la qualité devrait se dégrader deux fois plus vite", () => {
    const storeItems = [new Item("+5 Dexterity Vest", 0, 4)];
    const expectedResult = [new Item("+5 Dexterity Vest", -1, 2)];
    const gildedRose = new Shop(storeItems);
    const items = gildedRose.updateQuality();
  
    expect(items).toEqual(expectedResult);
  });
  
  it("la qualité d'un article ne peut jamais être supérieure à 50", () => {
    const storeItems = [new Item("Aged Brie", 1, 50)];
    const expectedResult = [new Item("Aged Brie", 0, 50)];
    const gildedRose = new Shop(storeItems);
    const items = gildedRose.updateQuality();
  
    expect(items).toEqual(expectedResult);
  });
  
  it("la qualité d'un vieux brie devrait augmenter de 1", () => {
    const storeItems = [new Item("Aged Brie", 1, 0)];
    const expectedResult = [new Item("Aged Brie", 0, 1)];
    const gildedRose = new Shop(storeItems);
    const items = gildedRose.updateQuality();
  
    expect(items).toEqual(expectedResult);
  });
  
  describe("Backstage passes", () => {
    it("augmente la qualité à mesure que la valeur de SellIn approche", () => {
      const storeItems = [
        new Item("Backstage passes to a TAFKAL80ETC concert", 14, 0)
      ];
      const expectedResult = [
        new Item("Backstage passes to a TAFKAL80ETC concert", 13, 1)
      ];
      const gildedRose = new Shop(storeItems);
      const items = gildedRose.updateQuality();
  
      expect(items).toEqual(expectedResult);
    });
  
    it("La qualité augmente de 2 lorsqu'il reste 10 jours ou moins", () => {
      const storeItems = [
        new Item("Backstage passes to a TAFKAL80ETC concert", 10, 0)
      ];
      const expectedResult = [
        new Item("Backstage passes to a TAFKAL80ETC concert", 9, 2)
      ];
      const gildedRose = new Shop(storeItems);
      const items = gildedRose.updateQuality();
  
      expect(items).toEqual(expectedResult);
    });
  
    it("La qualité augmente de 3 lorsqu'il reste 5 jours ou moins", () => {
      const storeItems = [
        new Item("Backstage passes to a TAFKAL80ETC concert", 5, 0)
      ];
      const expectedResult = [
        new Item("Backstage passes to a TAFKAL80ETC concert", 4, 3)
      ];
      const gildedRose = new Shop(storeItems);
      const items = gildedRose.updateQuality();
  
      expect(items).toEqual(expectedResult);
    });
  
    it("La qualité tombe à 0 après le concert", () => {
      const storeItems = [
        new Item("Backstage passes to a TAFKAL80ETC concert", 0, 30)
      ];
      const expectedResult = [
        new Item("Backstage passes to a TAFKAL80ETC concert", -1, 0)
      ];
      const gildedRose = new Shop(storeItems);
      const items = gildedRose.updateQuality();
  
      expect(items).toEqual(expectedResult);
    });
  });
});