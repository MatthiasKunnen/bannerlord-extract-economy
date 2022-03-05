using System.Collections.Generic;

namespace EconomyExtractor {

    class ItemEconomy {

        public List<SettlementEconomy> Prices { get; } = new List<SettlementEconomy>();

        public string Type { get; set; }
    }

    class SettlementEconomy {

        public int BuyPrice { get; set; }

        public int InStore { get; set; }

        public int InStoreValue { get; set; }

        public int SellPrice { get; set; }

        public float? Demand { get; set; }

        public float? Supply { get; set; }

        public string SettlementName { get; set; }

        public string SettlementType { get; set; }
    }
}
